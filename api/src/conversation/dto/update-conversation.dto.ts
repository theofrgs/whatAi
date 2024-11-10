import {  PartialType } from '@nestjs/swagger';
import { CreateConversationDTO } from './create-conversation.dto';

export class UpdateConversationDTO extends PartialType(CreateConversationDTO) {}
