import { PartialType } from '@nestjs/mapped-types';
import { CreateSnapshotDto } from './create-snapshot.dto';

export class UpdateSnapshotDto extends PartialType(CreateSnapshotDto) {}
