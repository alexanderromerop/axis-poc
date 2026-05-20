import { ConfigService } from '@nestjs/config';
import { Injectable, Logger } from '@nestjs/common';
import AxiosDigestAuth from '@mhoc/axios-digest-auth';
import * as https from 'https';
import axios from 'axios';
import { request } from 'urllib';

@Injectable()
export class SnapshotsService {
  private readonly logger = new Logger(SnapshotsService.name);
  // private digestAuth: AxiosDigestAuth;
  private httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(private configService: ConfigService) {
    // this.digestAuth = new AxiosDigestAuth({
    //   username: this.configService.get<string>('CAMERA_USER') || '',
    //   password: this.configService.get<string>('CAMERA_PASSWORD') || ''
    // });
  }

  async hanwhaGetSnapshot(): Promise<Buffer> {
    const cameraIp = this.configService.get<string>('CAMERA_IP') ?? '';
    const url = `http://${cameraIp}/stw-cgi/video.cgi?msubmenu=snapshot&action=view`;
    const user = this.configService.get<string>('CAMERA_USER') ?? '';
    const password = this.configService.get<string>('CAMERA_PASSWORD') ?? '';

    this.logger.log(`Getting snapshot from ${cameraIp}...`);

    const response = await axios.get(url, {
      auth: { username: user, password: password },
      httpsAgent: this.httpsAgent,
      responseType: 'arraybuffer'
    });

    return Buffer.from(response.data);
  }

  async axisGetSnapshot(): Promise<Buffer> {
    const cameraIp = this.configService.get<string>('CAMERA_IP') ?? '';
    const url = `http://${cameraIp}/axis-cgi/jpg/image.cgi`;
    const user = this.configService.get<string>('CAMERA_USER') || '';
    const password = this.configService.get<string>('CAMERA_PASSWORD') || '';

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