import { Module } from '@nestjs/common';
import { TenantDatabaseService } from './tenant-database.service';

@Module({
  imports: [],
  providers: [TenantDatabaseService],
  exports: [TenantDatabaseService],
})
export class DatabaseModule {}