import {
  Controller,
  Get,
  Query,
  Header,
  BadRequestException,
  StreamableFile
} from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';

@Controller('snapshots')
export class SnapshotsController {
  constructor(private readonly snapshotsService: SnapshotsService) { }

  @Get('snapshot')
  @Header('Content-Type', 'image/jpeg')
  async getSnapshot(
    @Query('id') id: string
  ): Promise<StreamableFile> {

    if (!id) {
      throw new BadRequestException('Valid "id" parameter required');
    }

    const buffer = await this.snapshotsService.getSnapshotBuffer(id);

    return new StreamableFile(buffer);
  }
}