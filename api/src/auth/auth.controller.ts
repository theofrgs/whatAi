import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateLoginDTO } from './dto/login.dto';
import { CreateUserDTO } from '@src/user/dto/create-user.dto';
import { Public } from '@src/services/decorators/controller.decorators';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Login native user' })
  @ApiBody({ type: CreateLoginDTO })
  @HttpCode(HttpStatus.OK)
  @Post('native/login')
  async loginNative(@Body() dto: CreateLoginDTO) {
    return await this.authService.loginNative(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Register native user' })
  @ApiBody({ type: CreateUserDTO })
  @HttpCode(HttpStatus.CREATED)
  @Post('native/register')
  async registerNative(@Body() dto: CreateUserDTO) {
    return await this.authService.registerNative(dto);
  }
}
