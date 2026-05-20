import { Injectable, Logger } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { SnapshotsService } from '../snapshots/snapshots.service';
import { StorageService } from 'src/storage/storage.service';

@Injectable()
export class MqttService {
    private readonly logger = new Logger(MqttService.name);
    
    constructor(
        private readonly snapshotsService: SnapshotsService,
        private readonly storageService: StorageService,
    ) {}

    async handleMQTTEvents(data: any, context: MqttContext) {
        const topic = context.getTopic();

        this.logger.log(`\n--- MQTT Event ---\nTopic: ${topic}`);

        try {
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            this.logger.log('Payload:', JSON.stringify(parsedData));

            const manufacturer = parsedData.manufacturer

            let imageBuffer;

            if (manufacturer === 'Axis') {
                imageBuffer = await this.snapshotsService.axisGetSnapshot(); 
            } else if (manufacturer === 'Hanwha') {
                imageBuffer = await this.snapshotsService.hanwhaGetSnapshot();
            } else {
                this.logger.warn(`Manufacturer not supported: ${manufacturer}`);
                return;
            }

            if (imageBuffer) {
                const eventType = parsedData.event_type ?? 'unknown_event';
                const savedPath = await this.storageService.saveImage(imageBuffer, `${eventType}`);
                this.logger.log(`Snapshot saved at: ${savedPath}`);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
}