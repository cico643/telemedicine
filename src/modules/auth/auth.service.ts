import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dtos/create-user.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  public async register(userDto: CreateUserDto) {
    return this.usersService.register(userDto);
  }

  public async signin({ email, password, type }) {
    return this.usersService.signin({ email, password, type });
  }
}
