import { Controller, Post, Body, Logger, HttpCode, Get, Req } from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) { }

  @Get('test')
  @HttpCode(200)
  testRoute() {
    return this.camerasService.testRoute();
  }

  // @Post('events/human-detection')
  // @HttpCode(200)
  // humanDetection(@Req() request: Request, @Body() body: any) {
  //   return this.camerasService.humanDetection(request, body);
  // }

  // @Post('events/line-crossing')
  // @HttpCode(200)
  // lineCrossing(@Req() request: Request, @Body() body: any) {
  //   return this.camerasService.lineCrossing(request, body);
  // }

  @MessagePattern('camera/VMD')
  handleMQTTEvents(@Payload() data: any, @Ctx() context: MqttContext) {
    return this.camerasService.handleAxisEvents(data, context);
  }
}
