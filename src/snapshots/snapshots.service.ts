import { ConfigService } from '@nestjs/config';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import AxiosDigestAuth from '@mhoc/axios-digest-auth';
import * as https from 'https';

@Injectable()
export class SnapshotsService {
  private readonly logger = new Logger(SnapshotsService.name);
  private digestAuth: AxiosDigestAuth;

  constructor(private configService: ConfigService) {
    this.digestAuth = new AxiosDigestAuth({
      username: this.configService.get<string>('CAMERA_USER') || '',
      password: this.configService.get<string>('CAMERA_PASSWORD') || ''
    });
  }

  private urlBuild(manufacturer: string, ip: string): string {
    switch (manufacturer) {
      case 'Hanwha':
        return `http://${ip}/stw-cgi/video.cgi?msubmenu=snapshot&action=view`;
      case 'Axis':
        return `https://${ip}/axis-cgi/jpg/image.cgi`;
      default:
        throw new HttpException('Marca de cámara no soportada', HttpStatus.BAD_REQUEST);
    }
  }

  async getSnapshot(cameraManufacturer: string): Promise<Buffer> {
    const cameraIp = this.configService.get<string>('CAMERA_IP') ?? '';

    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    this.logger.log(`Getting snapshot from ${cameraIp}...`);

    const response = await this.digestAuth.request({
      method: 'GET',
      url: this.urlBuild(cameraManufacturer, cameraIp),
      responseType: 'arraybuffer',
      timeout: 5000,
      httpsAgent: httpsAgent
    });

    return Buffer.from(response.data);
  }
}