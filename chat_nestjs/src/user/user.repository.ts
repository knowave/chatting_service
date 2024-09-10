import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private readonly dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async getUserById(id: number): Promise<User> {
    return await this.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }
}
