import { Controller, Post, Body, Logger, HttpCode, Get, Req } from '@nestjs/common';
import { CamerasService } from './cameras.service';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) { }

  @Get('test')
  @HttpCode(200)
  testRoute() {
    return this.camerasService.testRoute();
  }

  @Post('events/human-detection')
  @HttpCode(200)
  humanDetection(@Req() request: Request, @Body() body: any) {
    return this.camerasService.humanDetection(request, body);
  }

  @Post('events/line-crossing')
  @HttpCode(200)
  lineCrossing(@Req() request: Request, @Body() body: any) {
    return this.camerasService.lineCrossing(request, body);
  }
}
