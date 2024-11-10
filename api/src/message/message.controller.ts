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
import { UpdateMessageDTO } from './dto/update-message.dto';
import { MessageService } from './message.service';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @ApiOperation({ summary: 'Find all messages' })
  @HttpCode(HttpStatus.FOUND)
  @Get()
  async findAll(@Req() req: any) {
    return this.messageService.findBy({}, [], {}, undefined, req.queryOpt);
  }

  @ApiOperation({ summary: 'Find one message' })
  @HttpCode(HttpStatus.FOUND)
  @Get('me')
  async getMe(@Req() req: any) {
    return req.message;
  }

  @ApiOperation({ summary: 'Find one message' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.messageService.findOneByOrFail({ id });
  }

  @ApiOperation({ summary: 'Patch message' })
  @ApiBody({ type: UpdateMessageDTO })
  @HttpCode(HttpStatus.OK)
  @Patch('me')
  async updateMe(@Body() body: UpdateMessageDTO, @Req() req: any) {
    return this.messageService.update(req.message.id, body);
  }

  @ApiOperation({ summary: 'Patch message' })
  @ApiBody({ type: UpdateMessageDTO })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateMessageDTO,
    @Req() req: any,
  ) {
    if (req.message.id !== id)
      throw new HttpException(
        { message: 'You cannot update an account which is not yours' },
        HttpStatus.FORBIDDEN,
      );
    return this.messageService.update(req.message.id, body);
  }

  @ApiOperation({ summary: 'Delete message' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.message.id !== id)
      throw new HttpException(
        { message: 'You cannot remove an account which is not yours' },
        HttpStatus.FORBIDDEN,
      );
    return this.messageService.remove(id);
  }
}
