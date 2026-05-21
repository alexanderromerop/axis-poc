import { Module } from '@nestjs/common';
import { PingService } from './ping.service';
import { PingController } from './ping.controller';
import { CamerasService } from 'src/cameras/cameras.service';

@Module({
  imports: [],
  controllers: [PingController],
  providers: [PingService, CamerasService],
})
export class PingModule {}
