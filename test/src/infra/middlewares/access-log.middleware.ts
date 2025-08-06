// infrastructure/middleware/access-log.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { TenantDatabaseService } from '../database/tenant-database.service';
import { AccessLog } from 'src/domain/logs/access-log.entity';

@Injectable()
export class AccessLogMiddleware implements NestMiddleware {
  
  constructor(private readonly tenantDbService: TenantDatabaseService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', async () => {
      const duration = Date.now() - start;

      const tenantName = req.tenantName ?? null;
      const userId = req.user?.id ?? null;

      const log = new AccessLog();
      log.method = req.method;
      log.path = req.originalUrl;
      log.statusCode = res.statusCode;
      log.duration = duration;
      log.ip = req.ip || req.headers['x-forwarded-for']?.toString() || '';
      log.userId = userId;
      log.tenantName = tenantName;

      try {
        if (!tenantName) {
          console.warn(`[AccessLogMiddleware] No tenantName found in request`);
          return;
        }
        const dataSource: DataSource = await this.tenantDbService.getConnection(tenantName);
        await dataSource.getRepository(AccessLog).save(log);
      } catch (err) {
        console.error(`[AccessLogMiddleware] Failed to log access:`, err);
      }
    });

    next();
  }
}