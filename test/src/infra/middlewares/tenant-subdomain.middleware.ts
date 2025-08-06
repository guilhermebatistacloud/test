import { Injectable, NestMiddleware, BadRequestException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantSubdomainMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const host = req.headers.host;
    if (!host) throw new BadRequestException('Missing host');

    const [subdomain] = host.split('.');
    if (!subdomain || subdomain === 'www') {
      throw new BadRequestException('Invalid tenant subdomain');
    }

    console.log(`Tenant subdomain: ${subdomain}`);

    req['tenantName'] = subdomain.toLowerCase();
    next();
  }
}