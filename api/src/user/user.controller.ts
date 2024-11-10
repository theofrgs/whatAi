import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Req,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Find all users' })
  @HttpCode(HttpStatus.FOUND)
  @Get()
  async findAll(@Req() req: any) {
    return this.userService.findBy({}, [], {}, undefined, req.queryOpt);
  }

  @ApiOperation({ summary: 'Find one user' })
  @HttpCode(HttpStatus.FOUND)
  @Get('me')
  async getMe(@Req() req: any) {
    return req.user;
  }

  @ApiOperation({ summary: 'Find one user' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOneByOrFail({ id });
  }

  @ApiOperation({ summary: 'Patch user' })
  @ApiBody({ type: UpdateUserDTO })
  @HttpCode(HttpStatus.OK)
  @Patch('me')
  async updateMe(@Body() body: UpdateUserDTO, @Req() req: any) {
    return this.userService.update(req.user.id, body);
  }

  @ApiOperation({ summary: 'Patch user' })
  @ApiBody({ type: UpdateUserDTO })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateUserDTO,
    @Req() req: any,
  ) {
    if (req.user.id !== id)
      throw new HttpException(
        { message: 'You cannot update an account which is not yours' },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.update(req.user.id, body);
  }

  @ApiOperation({ summary: 'Delete user' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.user.id !== id)
      throw new HttpException(
        { message: 'You cannot remove an account which is not yours' },
        HttpStatus.FORBIDDEN,
      );
    return this.userService.remove(id);
  }
}
