import { Controller, Get, Header } from '@nestjs/common';
import { PingService } from './ping.service';

@Controller('ping')
export class PingController {
  constructor(private readonly pingService: PingService) {}

  @Get('ping')
  @Header('Content-Type', 'application/json')
  ping() {
    return this.pingService.sendPing();
  }
}