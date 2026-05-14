import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CamerasModule } from './cameras/cameras.module';
import { MqttModule } from './mqtt/mqtt.module';
import { SnapshotsModule } from './snapshots/snapshots.module';

@Module({
  imports: [CamerasModule, MqttModule, SnapshotsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
