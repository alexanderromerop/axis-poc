import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import AxiosDigestAuth from '@mhoc/axios-digest-auth';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SnapshotsService implements OnModuleInit {
  private readonly logger = new Logger(SnapshotsService.name);
  private readonly snapshotDir = path.join(process.cwd(), "snapshot");
  private digestAuth: AxiosDigestAuth;

  constructor(private configService: ConfigService) {
    this.digestAuth = new AxiosDigestAuth({
      username: this.configService.get<string>('CAMERA_USER') || '',
      password: this.configService.get<string>('CAMERA_PASSWORD') || ''
    });
  }

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

    let url;
    switch (cameraManufacturer) {
      case "Hanwha":
        url = "http://192.168.1.100/stw-cgi/video.cgi?msubmenu=snapshot&action=view";
        break;

      case "Axis":
        url = `http://${cameraIp}/axis-cgi/jpg/image.cgi`
        break;
    }

    try {
      this.logger.log(`Getting snapshot from ${cameraIp}...`);

      const response = await this.digestAuth.request({
        method: 'GET',
        url: url,
        responseType: 'arraybuffer',
        timeout: 5000,
      });

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
