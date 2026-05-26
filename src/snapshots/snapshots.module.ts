import { Module } from '@nestjs/common';
import { SnapshotsService } from './snapshots.service';
import { SnapshotsController } from './snapshots.controller';
import { HttpModule } from '@nestjs/axios';
import { CamerasModule } from 'src/cameras/cameras.module';
import { StorageService } from 'src/storage/storage.service';

@Module({
  imports: [
    HttpModule,
    CamerasModule,
  ],
  controllers: [SnapshotsController],
  providers: [
    SnapshotsService,
    StorageService,
  ],
  exports: [SnapshotsService]
})
export class SnapshotsModule { }
