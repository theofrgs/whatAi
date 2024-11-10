import { User } from "./user";
import { BaseModel } from "./baseModel";
import { Message } from "./message";

export interface Conversation extends BaseModel {
  title: string;
  messages?: Message[];
  members?: User[];
  creator: User;
}
