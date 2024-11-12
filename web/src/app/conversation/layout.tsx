"use client";
import React, { useEffect } from "react";
import SidebarConversationComponent from "@/components/conversation/SidebarConversation.component";
import useConversationStore from "@/stores/conversationStore";
import { createQueryParams } from "@/lib/utils";

export default function ConversationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { conversations, getBy } = useConversationStore();

  useEffect(() => {
    getBy(
      createQueryParams({
        relations: "messages",
      })
    );
  }, [getBy]);

  return (
    <div className="min-h-screen w-screen p-4 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="w-full h-[95vh] flex rounded-xl overflow-hidden backdrop-blur-xl bg-background/30 shadow-2xl">
        <SidebarConversationComponent conversations={conversations} />
        <div className="w-full bg-background/40">{children}</div>
      </div>
    </div>
  );
}
