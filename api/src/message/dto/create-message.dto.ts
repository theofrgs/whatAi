import { ApiProperty } from '@nestjs/swagger';
import { Conversation } from '@src/conversation/entities/conversation.entity';
import { User } from '@src/user/entities/user.entity';
import { Type } from 'class-transformer';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMessageDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsOptional()
  @Type(() => User)
  author: User;

  @ApiProperty()
  @IsOptional()
  @Type(() => Conversation)
  conversation: Conversation;
}
