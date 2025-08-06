import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infra/database/database.module';
import { UserModule } from './domain/user/user.module';
import { TenantSubdomainMiddleware } from 'src/infra/middlewares/tenant-subdomain.middleware';
import { AccessLog } from './domain/logs/access-log.entity';
import { AccessLogMiddleware } from './infra/middlewares/access-log.middleware';
import { ProductModule } from './domain/product/product.module';
import { ProductController } from './domain/product/product.controller';

@Module({
  imports: [DatabaseModule, UserModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})


export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantSubdomainMiddleware, AccessLogMiddleware)            
      .forRoutes('*');
  }
}
