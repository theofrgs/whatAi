import { BaseModel } from "./baseModel";
import { Conversation } from "./conversation";
import { Message } from "./message";

export interface User extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  messages?: Message[];
  conversations?: Conversation[];
  createdConversations?: Conversation[];
}
