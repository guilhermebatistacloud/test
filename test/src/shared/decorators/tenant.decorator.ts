import { BadRequestException, createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Tenant = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    const tenant = request.tenantName;

    if (!tenant) {
      throw new BadRequestException('Tenant subdomain is missing');
    }

    return tenant;
  },
);
