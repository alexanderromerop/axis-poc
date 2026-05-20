import { Injectable, Logger } from '@nestjs/common';
import { MqttContext } from '@nestjs/microservices';
import { SnapshotsService } from '../snapshots/snapshots.service';
import { StorageService } from 'src/storage/storage.service';
import { IMqttEventPayload, SUPPORTED_MANUFACTURERS, SupportedManufacturer } from './interface/event.interface';

@Injectable()
export class MqttService {
    private readonly logger = new Logger(MqttService.name);

    constructor(
        private readonly snapshotsService: SnapshotsService,
        private readonly storageService: StorageService,
    ) { }


    async handleMQTTEvents(data: IMqttEventPayload, context: MqttContext) {
        const topic = context.getTopic();
        const isSupportedManufacturer = (manufacturer: any): manufacturer is SupportedManufacturer => {
            return typeof manufacturer === 'string' && SUPPORTED_MANUFACTURERS.includes(manufacturer as SupportedManufacturer);
        };

        this.logger.log(`\n--- MQTT Event ---\nTopic: ${topic}`);

        try {
            const parsedData: Partial<IMqttEventPayload> = typeof data === 'string' ? JSON.parse(data) : data;
            this.logger.log('Payload:', JSON.stringify(parsedData));

            const { manufacturer, event_type } = parsedData;

            if (!isSupportedManufacturer(manufacturer)) {
                this.logger.warn(`Manufacturer not supported or missing: ${manufacturer}`);
                return;
            }

            const imageBuffer = await this.snapshotsService.fetchSnapshot(manufacturer);

            if (imageBuffer) {
                const eventType = event_type ?? 'unknown_event';
                const savedPath = await this.storageService.saveImage(imageBuffer, eventType);
                this.logger.log(`Snapshot saved at: ${savedPath}`);
            } else {
                this.logger.warn(`No snapshot retrieved from: ${manufacturer}`);
            }
        } catch (error) {
            console.log('Error:', error);
        }
    }
}