"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { usePathname } from "next/navigation";
import { Card } from "@/components/ui/card";
import useConversationStore from "@/stores/conversationStore";

export default function Conversation() {
  const pathName = usePathname();

  const [message, setMessage] = useState("");

  const { conversation, getById: getConversationById } = useConversationStore();

  const id = useMemo(
    () => pathName.split("/")[pathName.split("/").length - 1],
    [pathName]
  );

  useEffect(() => {
    getConversationById(id);
  }, [getConversationById, id]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5 backdrop-blur-md bg-black">
        <div className="flex items-center gap-3 ">
          <Avatar className="border-2 border-white/20">
            <AvatarImage src="/api/placeholder/40/40" />
            <AvatarFallback>{}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-white/90">
              {conversation?.title}
            </h2>
            <p className="text-sm text-green-500/60">Online</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {conversation?.messages?.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                ""
                // msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              {/* <Card
                className={`max-w-[70%] p-3 border-none backdrop-blur-sm ${
                  msg.sender === "me"
                    ? "bg-primary/80 text-primary-foreground"
                    : "bg-white/10 text-white/90"
                }`}
              > */}
              <Card className={`max-w-[70%] p-3 border-none backdrop-blur-sm`}>
                <p>{msg.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {msg.created_at.toISOString()}
                </p>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-white/10 border-white/20"
          />
          <Button className="bg-primary/80 hover:bg-primary/90">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
