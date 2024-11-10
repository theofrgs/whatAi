import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { UserModule } from '@src/user/user.module';
import { HashService } from '@src/services/hash/hash.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [AuthService, HashService, JwtService],
})
export class AuthModule {}
