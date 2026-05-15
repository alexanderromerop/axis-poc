import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SnapshotsService implements OnModuleInit {
  private readonly logger = new Logger(SnapshotsService.name);
  private readonly snapshotDir = path.join(process.cwd(), "snapshot");

  constructor(
    private readonly httpsService: HttpService,
    private configService: ConfigService
  ) {}

  onModuleInit() {
    this.isSnapshotDir(this.snapshotDir);
  }

  private isSnapshotDir(path: string): void {
    try {
      if (!fs.existsSync(path)) {
        this.logger.log(`Snapshot directory does not exist. Creating it: ${path}`);
        fs.mkdirSync(path, { recursive: true });
      } else {
        this.logger.log(`Snapshot directory created at: ${path}`);
      }
    } catch (error) {
      let errorMessage = "Error during snapshot directory creation";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.logger.log(errorMessage);
    }
  }

  async getLastSnapshot(cameraManufacturer: string) {
    const cameraIp = this.configService.get<string>('CAMERA_IP');
    const username = this.configService.get<string>('CAMERA_USER') || '';
    const password = this.configService.get<string>('CAMERA_PASSWORD') || '';

    let url;
    switch (cameraManufacturer) {
      case "Hanwha":
        url = `https://${cameraIp}/stw-cgi/video.cgi?msubmenu=snapshot&action=view`;
        break;

      case "Axis":
        url = `https://${cameraIp}/axis-cgi/jpg/image.cgi`
        break;
    }

    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    try {
      this.logger.log(`Getting snapshot from ${cameraIp}...`);

      const response = await firstValueFrom(
        this.httpsService.get(url, {
          httpsAgent: agent,
          auth: {
            username: username,
            password: password, 
          },
          responseType: 'arraybuffer',
        }),
      );

      const fileName = `snapshot_${Date.now()}.jpg`;
      const completeRoute = path.join(this.snapshotDir, fileName);

      fs.writeFileSync(completeRoute, Buffer.from(response.data));
      this.logger.log(`Snapshot saved: ${fileName}`);

      return { success: true, path: this.snapshotDir };

    } catch (error) {
      let errorMessage = "Error getting snapshot";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      this.logger.log(errorMessage);
    }
  }
}