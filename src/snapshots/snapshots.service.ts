import { forwardRef, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { request } from 'urllib';
import { IMqttEventPayload } from '../mqtt/interface/event.interface';
import { CamerasService } from '../cameras/cameras.service';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class SnapshotsService {
  private readonly logger = new Logger(SnapshotsService.name);

  constructor(
    @Inject(forwardRef(() => CamerasService))
    private camerasService: CamerasService,
    private storageService: StorageService,
  ) { }

  async getSnapshotBuffer(id: string): Promise<Buffer> {
    const camera = this.camerasService.findOne(id);

    if (!camera) {
      throw new NotFoundException(`Camera with ID ${id} not found.`);
    }

    this.logger.log(`Getting snapshot from ${camera.ip}...`);

    let url;
    if (camera.manufacturer === 'Axis') {
      url = `http://${camera.ip}/axis-cgi/jpg/image.cgi`;
    } else if (camera.manufacturer === 'Hanwha') {
      url = `http://${camera.ip}/stw-cgi/video.cgi?msubmenu=snapshot&action=view`;
    } else {
      throw new Error(`Manufacturer not supported: ${camera.manufacturer}`);
    }

    const response = await request(url, {
      digestAuth: `${camera.user}:${camera.password}`,
      timeout: 5000,
      rejectUnauthorized: false
    });

    if (response.status !== 200) {
      throw new Error(`Camera returned status ${response.status}`);
    }

    return response.data;
  }

  async processSnapshot(parsedData: Partial<IMqttEventPayload>): Promise<void> {
    const { id, event_type, manufacturer } = parsedData;

    if (!id) {
      this.logger.warn(`Empty ID on a event of type: ${event_type} from ${manufacturer} camera.`);
      return;
    }

    try {
      const imageBuffer = await this.getSnapshotBuffer(id);

      const eventType = event_type ?? 'unknown_event';
      const savedPath = this.storageService.saveImage(imageBuffer, eventType);

      this.logger.log(`Snapshot saved at: ${savedPath}`);
    } catch (error: any) {
      this.logger.error(`Failed to process snapshot for MQTT event: ${error.message}`);
    }
  }
}