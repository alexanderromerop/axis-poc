import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { StorageService } from 'src/storage/storage.service';
import { SnapshotsService } from 'src/snapshots/snapshots.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [MqttController],
  providers: [
    MqttService,
    SnapshotsService,
    StorageService
  ],
})
export class MqttModule {}
