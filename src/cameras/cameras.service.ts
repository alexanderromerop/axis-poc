import { Injectable, NotFoundException } from '@nestjs/common';
import { ICamera } from './interface/camera.interface';

export const camerasDb: ICamera[] = [
  {
    manufacturer: "Axis",
    ip: "192.168.88.254",
    user: "admin",
    password: "@Elecnor1!",
    id: "e89b",
  },
  {
    manufacturer: "Hanwha",
    ip: "192.168.88.253",
    user: "admin",
    password: "@Elecnor1",
    id: "a456",
  },
]

@Injectable()
export class CamerasService {
  findAll(): ICamera[] {
    return camerasDb;
  }

  findOne(id: string) {
    const camera = camerasDb.find(c => c.id === id);
    
    if (!camera) {
      throw new NotFoundException(`La cámara con ID #${id} no existe`);
    }

    return camera;
  }
}
