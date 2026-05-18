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

            const imageBuffer = await this.snapshotsService.getSnapshot(parsedData.manufacturer);

            const eventType = parsedData.event_type ?? '';
            const savedPath = this.storageService.saveImage(imageBuffer, `${eventType}`);

            this.logger.log(`Snapshot saved at: ${savedPath}`);
        } catch (error) {
            console.log('Error:', error);
        }
    }
}