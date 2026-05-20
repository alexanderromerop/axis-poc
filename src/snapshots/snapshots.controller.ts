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
  constructor(private readonly snapshotsService: SnapshotsService) {}

  @Get('snapshot')
  @Header('Content-Type', 'image/jpeg')
  async getSnapshot(
    @Query('manufacturer') manufacturer: string
  ): Promise<StreamableFile> {

    if (!manufacturer) {
      throw new BadRequestException('Valid "manufacturer" parameter required');
    }

    const buffer = await this.snapshotsService.fetchSnapshot(manufacturer);

    return new StreamableFile(buffer);
  }
}