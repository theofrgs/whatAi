import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { HashService } from '../services/hash/hash.service';
import { CreateUserDTO } from '@src/user/dto/create-user.dto';
import { CreateLoginDTO } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly hasService: HashService,
  ) {}

  async loginNative(dto: CreateLoginDTO) {
    const user = await this.userService.findOneByOrFail({
      email: dto.email,
    });
    if (!(await this.hasService.equals(dto.password, user.password)))
      throw new HttpException(
        { message: 'Invalid credentials' },
        HttpStatus.FORBIDDEN,
      );
    return {
      access_token: await this.jwtService.signAsync(
        {
          sub: user.id,
          username: user.email,
        },
        {
          secret: process.env.API_JWT_SECRET,
          expiresIn: '6000h',
        },
      ),
    };
  }

  async registerNative(dto: CreateUserDTO) {
    const user = await this.userService.create(dto);
    const access_token = await this.jwtService.signAsync(
      {
        sub: user.id,
        username: user.email,
      },
      {
        secret: process.env.API_JWT_SECRET,
        expiresIn: '6000h',
      },
    );
    return {
      access_token,
    };
  }
}
