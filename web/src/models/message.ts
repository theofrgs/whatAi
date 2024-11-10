import { BaseModel } from "./baseModel";
import { Conversation } from "./conversation";
import { User } from "./user";

export interface Message extends BaseModel{
  content: string;
  conversation?: Conversation;
  author?: User;
}
