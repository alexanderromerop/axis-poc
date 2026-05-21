import { Controller, Get, Param } from '@nestjs/common';
import { CamerasService } from './cameras.service';

@Controller('cameras')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}
  @Get()
  findAll() {
    return this.camerasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.camerasService.findOne(id);
  }
}