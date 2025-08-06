// src/shared/types/express.d.ts
import { User } from '../../domains/users/entities/user.entity';

declare module 'express' {
  export interface Request {
    tenantName: string;
    user?: User;
  }
}
