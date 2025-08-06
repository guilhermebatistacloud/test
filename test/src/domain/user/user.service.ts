import { Injectable } from "@nestjs/common";
import { TenantDatabaseService } from "src/infra/database/tenant-database.service";
import { User } from "./user.entity";

@Injectable()
export class UserService {
  constructor(private readonly tenantDb: TenantDatabaseService) {}

  async findAll(req: Request): Promise<User[]> {
    const tenantName = req['tenantName'];
    const conn = await this.tenantDb.getConnection(tenantName);
    return conn.getRepository(User).find();
  }
}
