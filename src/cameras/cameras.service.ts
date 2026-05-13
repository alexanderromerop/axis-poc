import { Injectable } from '@nestjs/common';
import { Payload, Ctx, MqttContext } from '@nestjs/microservices';

@Injectable()
export class CamerasService {

  testRoute() {
    console.log('Received GET request to /cameras/events');
  }

  humanDetection(request: Request, body: any) {
    console.log('\n--- MOVEMENT DETECTION ---');
    console.log('Body:', body);
    console.log('-----------------------------------------\n');
  }

  lineCrossing(request: Request, body: any) {
    console.log('\n--- LINE CROSSING ---');
    console.log('Body:', body);
    console.log('-----------------------------------------\n');
  }

    handleAxisEvents(data: any, context: MqttContext) {
      const topic = context.getTopic();
      
      console.log(`\n--- MQTT Event ---`);
      console.log(`Topic: ${topic}`);
      
      try {
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        console.log('Payload:', parsedData);
        
      } catch (error) {
        console.log('Error:', error);
      }
    }
}
