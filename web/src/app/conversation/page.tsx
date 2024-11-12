"use client";

import React from "react";
import CreateConversationComponent from "@/components/conversation/CreateConversation.component";

export default function Conversation() {
  return (
    <div className="flex flex-col h-full items-center justify-center">
      <CreateConversationComponent />
    </div>
  );
}
