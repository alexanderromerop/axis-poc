import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MqttModule } from './mqtt/mqtt.module';
import { SnapshotsModule } from './snapshots/snapshots.module';
import { ConfigModule } from '@nestjs/config';
import { PingModule } from './ping/ping.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MqttModule,
    SnapshotsModule,
    PingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
