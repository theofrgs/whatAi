import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { Conversation } from "@/models/conversation";

type Props = {
  conversations: Conversation[];
};

export default function SidebarConversationComponent({ conversations }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="w-80 border-r border-white/10 h-full bg-background/40 backdrop-blur-md">
      <div className="p-4 border-b border-white/10">
        <div className="relative">
          <Input
            placeholder="Search conversations..."
            className="w-full bg-white/10 border-white/20 pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-2 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <ScrollArea className="h-[calc(100%-73px)]">
        {conversations.map((chat) => {
          const lastMsg = chat.messages![chat.messages!.length - 1];
          return (
            <div
              key={chat.id}
              className="flex items-center gap-3 p-3 hover:bg-white/10 cursor-pointer border-b border-white/10 transition-colors"
            >
              <Avatar className="border-2 border-white/20">
                {/* <AvatarImage src={chat.avatar} /> */}
                <AvatarFallback>{chat.title[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-medium truncate text-white/90">
                    {chat.title}
                  </p>
                  <span className="text-xs text-white/60">
                    {chat.updatedAt.toISOString()}
                  </span>
                </div>
                <p className="text-sm text-white/60 truncate">
                  {lastMsg.content}
                </p>
              </div>
              {/* TODO */}
              {/* {chat.unread > 0 && (
                <div className="bg-primary/90 text-primary-foreground w-5 h-5 rounded-full flex items-center justify-center text-xs">
                  {chat.unread}
                </div>
              )} */}
            </div>
          );
        })}
      </ScrollArea>
    </div>
  );
}
