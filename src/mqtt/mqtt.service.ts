import { Injectable, Logger } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { SnapshotsService } from '../snapshots/snapshots.service';
import { IMqttEventPayload } from './interface/event.interface';

@Injectable()
export class MqttService {
    private readonly logger = new Logger(MqttService.name);

    constructor(private readonly snapshotsService: SnapshotsService) { }

    async handleMQTTEvents(data: IMqttEventPayload, context: MqttContext) {
        const topic = context.getTopic();

        this.logger.log(`\n--- MQTT Event ---\nTopic: ${topic}`);

        try {
            const parsedData: Partial<IMqttEventPayload> = typeof data === 'string' ? JSON.parse(data) : data;
            this.logger.log('Payload:', JSON.stringify(parsedData));

            await this.snapshotsService.processSnapshot(parsedData);
        } catch (error) {
            console.log('Error:', error);
        }
    }
}