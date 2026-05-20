import { Controller } from '@nestjs/common';
import { MqttService } from './mqtt.service';
import { MessagePattern, Payload, Ctx, MqttContext } from '@nestjs/microservices';

@Controller('mqtt')
export class MqttController {

  constructor(private readonly mqttService: MqttService) {}

  @MessagePattern('camera/mqtt-events')
  handleMQTTEvents(@Payload() data: any, @Ctx() context: MqttContext) {
    return this.mqttService.handleMQTTEvents(data, context);
  }
}