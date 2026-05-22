import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ICamera } from './interface/camera.interface';
import { request } from 'urllib';
import { camerasDb } from './cameras.db';
import { XMLParser } from 'fast-xml-parser'

@Injectable()
export class CamerasService {
  private readonly logger = new Logger(CamerasService.name);

  async findAll(): Promise<ICamera[]> {
    return camerasDb;
  }

  findOne(id: string): ICamera {
    const camera = camerasDb.find(c => c.id === id);

    if (!camera) {
      throw new NotFoundException(`Camera with id: #${id} not found`);
    }

    return camera;
  }

  async fetchSerialNumber(id: string): Promise<string> {
    const camera = this.findOne(id);

    if (!camera) {
      throw new NotFoundException(`Camera with id: #${id} not found`);
    }

    const url = `http://${camera.ip}/axis-cgi/param.cgi?action=list&group=Properties.System.SerialNumber`

    const response = await request(url, {
      digestAuth: `${camera.user}:${camera.password}`,
      timeout: 5000,
      rejectUnauthorized: false
    });

    return response.data.toString('utf-8');
  }

  parseEventRules(response: any) {
    const xmlString = response.data.toString('utf-8');

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
      removeNSPrefix: true
    });

    const parsedData = parser.parse(xmlString);
    const rawConfig = parsedData.Envelope?.Body?.GetActionConfigurationsResponse?.ActionConfigurations?.ActionConfiguration;

    if (!rawConfig) {
      return [];
    }

    // Ensure it's always an array so map() doesn't fail
    const configsArray = Array.isArray(rawConfig) ? rawConfig : [rawConfig];

    return configsArray.map((config: any) => {
      const cleanParameters: Record<string, string> = {};

      const rawParams = config.Parameters?.Parameter;
      const paramsArray = rawParams ? (Array.isArray(rawParams) ? rawParams : [rawParams]) : [];

      paramsArray.forEach((param: any) => {
        if (param?.Name !== undefined && param?.Value !== undefined) {
          cleanParameters[param.Name] = param.Value;
        }
      });

      let eventType = null;
      const internalJsonString = cleanParameters.payload || cleanParameters.body;

      if (internalJsonString) {
        try {
          const sanitizedJson = internalJsonString.replace(/&#x[AD];/g, '\n');
          eventType = JSON.parse(sanitizedJson).event_type;
        } catch (e) { }
      }

      // Adds protocol (HTTP or MQTT), to the object
      const templateToken = config.TemplateToken || "";
      let protocol = "unknown";

      if (templateToken.includes("mqttpublish")) {
        protocol = "mqtt";
      } else if (templateToken.includes("http")) {
        protocol = "http";
      }

      return {
        id: config.ConfigurationID,
        name: config.Name,
        type: config.TemplateToken,
        protocol: protocol,
        eventType: eventType,
        parameters: cleanParameters
      };
    });
  }

  async fetchEventRules(id: string) {
    const camera = this.findOne(id);

    if (!camera) {
      throw new NotFoundException(`Camera with id: #${id} not found`);
    }

    const url = `http://${camera.ip}/vapix/services`;

    const body = `
      <soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:act="http://www.axis.com/vapix/ws/action1">
        <soap:Body>
          <act:GetActionConfigurations/>
        </soap:Body>
      </soap:Envelope>
    `;

    try {
      const response = await request(url, {
        digestAuth: `${camera.user}:${camera.password}`,
        method: 'POST',
        contentType: 'application/soap+xml',
        timeout: 5000,
        rejectUnauthorized: false,
        data: body,
      });

      return this.parseEventRules(response);

    } catch (error: any) {
      this.logger.error(`\nError ${error}`);
    }
  }
}
