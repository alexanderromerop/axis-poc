import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsController } from './snapshots.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SnapshotsController],
  providers: [SnapshotsService],
  exports: [SnapshotsService]
})
export class SnapshotsModule {}
