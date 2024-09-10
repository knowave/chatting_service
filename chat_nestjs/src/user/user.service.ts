import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SALT_ROUNDS } from 'src/common/env';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(createUserDto: CreateUserDto): Promise<boolean> {
    const { email, username, nickname, password } = createUserDto;

    const existEmail = await this.userRepository.getUserByEmail(email);

    if (existEmail) throw new BadRequestException();

    const hashedPassword = await this.hashPassword(password);

    await this.userRepository.save(
      this.userRepository.create({
        email,
        username,
        nickname,
        password: hashedPassword,
      }),
    );

    return true;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<boolean> {
    const { email, username, nickname, password } = updateUserDto;

    const user = await this.getUserById(id);

    if (email) user.email = email;
    if (username) user.username = username;
    if (nickname) user.nickname = nickname;
    if (password) {
      const hashedPassword = await this.hashPassword(password);
      user.password = hashedPassword;
    }

    await this.userRepository.save(user);
    return true;
  }

  async removeUser(id: number): Promise<void> {
    const user = await this.getUserById(id);
    await this.userRepository.softRemove(user);
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.userRepository.getUserById(id);

    if (!user) throw new NotFoundException();

    return user;
  }

  async getUserIfRefreshTokenMatches(
    userId: number,
    refreshToken: string,
  ): Promise<User> {
    const user = await this.getUserById(userId);

    const isRefreshTokenMatching = await bcrypt.compare(
      refreshToken,
      user.token,
    );

    if (isRefreshTokenMatching) return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }
}
