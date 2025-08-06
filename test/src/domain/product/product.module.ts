import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { DatabaseModule } from 'src/infra/database/database.module';

@Module({
  providers: [ProductService],
  controllers: [ProductController],
  imports: [DatabaseModule],
})
export class ProductModule {}
