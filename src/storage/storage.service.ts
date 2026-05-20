import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class StorageService implements OnModuleInit {
    private readonly snapshotDir = path.join(process.cwd(), "snapshot");
    private readonly logger = new Logger(StorageService.name);

    onModuleInit() {
        this.isSnapshotDir(this.snapshotDir);
    }

    private isSnapshotDir(path: string): void {
        try {
            if (!fs.existsSync(path)) {
                this.logger.log(`Snapshot directory does not exist. Creating it: ${path}`);
                fs.mkdirSync(path, { recursive: true });
            } else {
                this.logger.log(`Snapshot directory created at: ${path}`);
            }
        } catch (error) {
            let errorMessage = "Error during snapshot directory creation";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            this.logger.log(errorMessage);
        }
    }

    saveImage(buffer: Buffer, prefix: string = "snapshot"): string {
        const fileName = `${prefix}_${Date.now()}.jpg`;
        const completeRoute = path.join(this.snapshotDir, fileName);
        
        fs.writeFileSync(completeRoute, buffer);
        return completeRoute;
    }
}
