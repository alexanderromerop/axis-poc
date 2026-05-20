import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { request } from 'urllib';

@Injectable()
export class PingService implements OnModuleInit {
    private readonly logger = new Logger(PingService.name);

    constructor(private configService: ConfigService) {}

    onModuleInit() {
        this.sendPing();
    }

    async sendPing(){
        const cameraIp = this.configService.get<string>('CAMERA_IP') ?? '';
        const user = this.configService.get<string>('CAMERA_USER') || '';
        const password = this.configService.get<string>('CAMERA_PASSWORD') || '';
        const url = `http://${cameraIp}`;

        this.logger.log(`Cheking status for ${cameraIp}...`);
    
        const response = await request(url, {
            digestAuth: `${user}:${password}`,
            timeout: 5000,
            rejectUnauthorized: false
        });
    
        if (response.status !== 200) {
            throw new Error(`\nAxis camera returned status ${response.status}`);
        }

        this.logger.log(`\nCamera connected: ${cameraIp}`);
    }
}
