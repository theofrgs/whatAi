"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Plus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { User } from "@/models/user";
import useUserStore from "@/stores/user";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import useConversationStore from "@/stores/conversationStore";
import useAuthStore from "@/stores/authStore";

export default function CreateConversationComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState<boolean>(false);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const { users, getBy: getUserBy } = useUserStore();
  const { user } = useAuthStore();
  const { create: createConversation } = useConversationStore();

  useEffect(() => {
    getUserBy();
  }, [getUserBy]);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [searchTerm, users]
  );

  const handleCreateConversatio = useCallback(() => {
    const members = users.filter((u) => selectedUsers.includes(u.id));
    const title = members.map((m) => `${m.firstName} ${m.lastName}`).join(", ");
    createConversation({
      title: title.length > 20 ? `${title.substring(0, 20)}...` : title,
      members,
      creator: user!,
    }).then(() => {
      setOpen(false);
    });
  }, [createConversation, selectedUsers, user, users]);

  const handleOnOpenChange = useCallback((open: boolean) => {
    setOpen(open);
    if (!open) {
      setSelectedUsers([]);
    }
  }, []);

  const handleSelectUser = useCallback(
    (user: User) =>
      setSelectedUsers(
        selectedUsers.find((uStr) => uStr === user.id)
          ? selectedUsers.filter((uStr) => uStr !== user.id)
          : [...selectedUsers, user.id]
      ),
    [selectedUsers]
  );

  return (
    <Dialog onOpenChange={handleOnOpenChange} open={open}>
      <DialogTrigger>
        <Button
          className="bg-primary-500 hover:bg-primary-600 text-white flex gap-4"
          variant={"ghost"}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>

      <DialogContent className="w-auto h-auto">
        <DialogTitle className="text-xl font-semibold">
          Create conversation
        </DialogTitle>

        <Input
          placeholder="Search users..."
          className="w-full mt-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <ScrollArea className="h-80 overflow-auto">
          <div className="mt-4 space-y-2 h-[2/4]">
            {filteredUsers.map((user) => (
              <Button
                variant={"ghost"}
                key={user.id}
                onClick={() => handleSelectUser(user)}
                className={`flex gap-2 justify-between w-full`}
              >
                <p className="font-medium text-lg truncate">{`${user.firstName} ${user.lastName}`}</p>
                {selectedUsers.includes(user.id) && <Check />}
              </Button>
            ))}
          </div>
        </ScrollArea>
        {selectedUsers.length > 0 && (
          <div className="flex gap-2 justify-center items-center">
            <Button onClick={handleCreateConversatio}>
              <p className="font-medium text-lg truncate">Créer</p>
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
