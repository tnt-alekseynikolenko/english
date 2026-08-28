import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseError } from '../database/types/database-error.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly database: DatabaseService,
  ) {}
}
