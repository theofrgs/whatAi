import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@src/message/entities/message.entity';
import { User } from '@src/user/entities/user.entity';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';

export class CreateConversationDTO {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ type: [Message] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Message)
  messages?: Message[];

  @ApiProperty({ type: [User] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  members?: User[];

  @ApiProperty()
  @IsOptional()
  @Type(() => User)
  creator: User;
}
