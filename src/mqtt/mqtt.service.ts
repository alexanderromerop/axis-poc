import { Injectable } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { SnapshotsService } from '../snapshots/snapshots.service';

@Injectable()
export class MqttService {
    constructor(private readonly snapshotsService: SnapshotsService) {}

    handleMQTTEvents(data: any, context: MqttContext) {
        const topic = context.getTopic();

        console.log(`\n--- MQTT Event ---`);
        console.log(`Topic: ${topic}`);

        try {
            const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
            console.log('Payload:', parsedData);

            this.snapshotsService.getLastSnapshot(parsedData.manufacturer);

        } catch (error) {
            console.log('Error:', error);
        }
    }
}