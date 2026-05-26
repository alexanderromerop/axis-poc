import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CamerasService } from 'src/cameras/cameras.service';
import { ICamera } from 'src/cameras/interface/camera.interface';
import { request } from 'urllib';

@Injectable()
export class PingService implements OnModuleInit {
    private readonly logger = new Logger(PingService.name);

    constructor(private camerasService: CamerasService) { }

    onModuleInit() {
        this.sendPing();
    }

    async sendPing() {
        const cameras: ICamera[] = await this.camerasService.findAll();

        for (const camera of cameras) {
            const url = `http://${camera.ip}`;

            this.logger.log(`Cheking status for ${camera.ip}...`);

            try {
                const response = await request(url, {
                    digestAuth: `${camera.user}:${camera.password}`,
                    timeout: 5000,
                    rejectUnauthorized: false
                });

                if (response.status !== 200) {
                    this.logger.warn(`${camera.manufacturer} camera returned status ${response.status}`);
                    continue;
                }

                this.logger.log(`\n----------- Camera connected: ${camera.ip} -----------`);
            } catch (error) {
                if (error instanceof Error) {
                    const nodeError = error as Error & { code?: string };
                    this.logger.error(`Failed to connect to ${camera.ip}: ${nodeError.code || nodeError.message}`);
                } else {
                    this.logger.error(`Failed to connect to ${camera.ip}: ${String(error)}`);
                }
            }
        }
    }
}
