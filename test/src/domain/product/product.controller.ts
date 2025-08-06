import { Controller, Get, Post, Param, Body, Put, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { Tenant } from 'src/shared/decorators/tenant.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Tenant() tenant: string, @Body('name') name: string) {
    return this.productService.create(tenant, name);
  }

  @Get()
  findAll(@Tenant() tenant: string) {
    return this.productService.findAll(tenant);
  }

  @Get(':id')
  findOne(@Tenant() tenant: string, @Param('id') id: string) {
    return this.productService.findOne(tenant, id);
  }

  @Put(':id')
  update(@Tenant() tenant: string, @Param('id') id: string, @Body('name') name: string) {
    return this.productService.update(tenant, id, name);
  }

  @Delete(':id')
  remove(@Tenant() tenant: string, @Param('id') id: string) {
    return this.productService.remove(tenant, id);
  }
}
