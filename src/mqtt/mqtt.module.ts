import { Module } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MqttController } from './mqtt.controller';
import { SnapshotsModule } from 'src/snapshots/snapshots.module';

@Module({
  imports: [SnapshotsModule],
  controllers: [MqttController],
  providers: [MqttService],
})
export class MqttModule {}
