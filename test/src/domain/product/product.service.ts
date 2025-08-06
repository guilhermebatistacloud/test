import { Injectable, NotFoundException } from '@nestjs/common';
import { TenantDatabaseService } from 'src/infra/database/tenant-database.service';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
    
  constructor(private readonly tenantDatabaseService: TenantDatabaseService) {}

  async create(tenant: string, name: string): Promise<Product> {
    const conn = await this.tenantDatabaseService.getConnection(tenant);
    const repo = conn.getRepository(Product);

    const product = repo.create({ name });
    return await repo.save(product);
  }

  async findAll(tenant: string): Promise<Product[]> {
    const conn = await this.tenantDatabaseService.getConnection(tenant);
    return conn.getRepository(Product).find();
  }

  async findOne(tenant: string, id: string): Promise<Product> {
    const conn = await this.tenantDatabaseService.getConnection(tenant);
    const product = await conn.getRepository(Product).findOneBy({ id });

    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    return product;
  }

  async update(tenant: string, id: string, name: string): Promise<Product> {
    const conn = await this.tenantDatabaseService.getConnection(tenant);
    const repo = conn.getRepository(Product);

    const product = await repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    product.name = name;
    return await repo.save(product);
  }

  async remove(tenant: string, id: string): Promise<void> {
    const conn = await this.tenantDatabaseService.getConnection(tenant);
    const repo = conn.getRepository(Product);

    const product = await repo.findOneBy({ id });
    if (!product) {
      throw new NotFoundException(`Product with id "${id}" not found`);
    }

    await repo.remove(product);
  }
}