import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import { request } from 'urllib';

@Injectable()
export class SnapshotsService {
  private readonly logger = new Logger(SnapshotsService.name);

  constructor(private configService: ConfigService) {}

  async fetchSnapshot(manufacturer: string): Promise<Buffer> {
    const cameraIp = this.configService.get<string>('CAMERA_IP') ?? '';
    const user = this.configService.get<string>('CAMERA_USER') || '';
    const password = this.configService.get<string>('CAMERA_PASSWORD') || '';
    
    let url;
    
    if(manufacturer === 'Axis') {
      url = `http://${cameraIp}/axis-cgi/jpg/image.cgi`;
    } else if(manufacturer === 'Hanwha') {
      url = `http://${cameraIp}/stw-cgi/video.cgi?msubmenu=snapshot&action=view`;
    } else {
      this.logger.log(`Manufacturer not supported: ${manufacturer}`);
    }

    this.logger.log(`Getting snapshot from ${cameraIp}...`);

    const response = await request(url, {
      digestAuth: `${user}:${password}`,
      timeout: 5000,
      rejectUnauthorized: false
    });

    if (response.status !== 200) {
      throw new Error(`Axis camera returned status ${response.status}`);
    }

    return response.data;
  }
}