import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Tenant } from 'src/domain/tenant/tenant.entity';
import { User } from 'src/domain/user/user.entity';
import { AccessLog } from 'src/domain/logs/access-log.entity';

@Injectable()
export class TenantDatabaseService {
    private connections = new Map<string, DataSource>();
    private centralDataSource: DataSource;

    constructor() {
        const url = process.env.DATABASE_URL;

        if (!url) {
            throw new Error(
                'DATABASE_URL não está definida nas variáveis de ambiente',
            );
        }

        this.centralDataSource = new DataSource({
            type: 'postgres',
            url,
            entities: [Tenant],
            synchronize: true,
        });
    }

    async init() {
        if (!this.centralDataSource.isInitialized) {
            await this.centralDataSource.initialize();
        }
    }

    async getConnection(tenantName: string): Promise<DataSource> {
        if (this.connections.has(tenantName)) {
            return this.connections.get(tenantName)!;
        }

        await this.init();

        const tenantRepo = this.centralDataSource.getRepository(Tenant);
        const tenant = await tenantRepo.findOneBy({ name: tenantName });

        if (!tenant) throw new Error(`Tenant ${tenantName} not found`);

        const conn = new DataSource({
            type: 'postgres',
            url: tenant.connection_string,
            entities: [User,AccessLog],
            synchronize: true,
        });

        await conn.initialize();
        this.connections.set(tenantName, conn);
        return conn;
    }

    async closeConnection(tenantName: string): Promise<boolean> {
        const conn = this.connections.get(tenantName);
        if (!conn) return false;
        if (conn.isInitialized) {
            await conn.destroy();
        }
        this.connections.delete(tenantName);
        return true;
    }
}
