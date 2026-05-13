import { Injectable } from '@nestjs/common';

@Injectable()
export class CamerasService {

  testRoute() {
    console.log('Received GET request to /cameras/events');
  }

  humanDetection(request: Request, body: any) {
    console.log('\n--- MOVEMENT DETECTION ---');
    console.log('Content-Type:', request.headers['content-type']);
    console.log('Body:', body);
    console.log('-----------------------------------------\n');
  }

  lineCrossing(request: Request, body: any) {
    console.log('\n--- LINE CROSSING ---');
    console.log('Content-Type:', request.headers['content-type']);
    console.log('Body:', body);
    console.log('-----------------------------------------\n');
  }
}
