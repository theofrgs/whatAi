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
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiBody, ApiTags } from '@nestjs/swagger';
import { UpdateConversationDTO } from './dto/update-conversation.dto';
import { ConversationService } from './conversation.service';
import { CreateConversationDTO } from './dto/create-conversation.dto';

@ApiTags('Conversation')
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @ApiOperation({ summary: 'Create conversation' })
  @HttpCode(HttpStatus.CREATED)
  @ApiBody({ type: CreateConversationDTO })
  @Post('')
  async create(@Body() dto: CreateConversationDTO, @Req() req: any) {
    return this.conversationService.create({ ...dto, creator: req.user });
  }

  @ApiOperation({ summary: 'Find all conversations' })
  @HttpCode(HttpStatus.FOUND)
  @Get()
  async findAll(@Req() req: any) {
    return this.conversationService.findBy({}, [], {}, undefined, req.queryOpt);
  }

  @ApiOperation({ summary: 'Find one conversation' })
  @HttpCode(HttpStatus.FOUND)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.conversationService.findOneByOrFail({ id });
  }

  @ApiOperation({ summary: 'Patch conversation' })
  @ApiBody({ type: UpdateConversationDTO })
  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateConversationDTO,
    @Req() req: any,
  ) {
    if (req.conversation.id !== id)
      throw new HttpException(
        { conversation: 'You cannot update an account which is not yours' },
        HttpStatus.FORBIDDEN,
      );
    return this.conversationService.update(req.conversation.id, body);
  }

  @ApiOperation({ summary: 'Delete conversation' })
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: any) {
    if (req.conversation.id !== id)
      throw new HttpException(
        { conversation: 'You cannot remove an account which is not yours' },
        HttpStatus.FORBIDDEN,
      );
    return this.conversationService.remove(id);
  }
}
