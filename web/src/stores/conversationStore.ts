import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance";
import { Conversation } from "@/models/conversation";

interface ConversationState {
  conversation: Conversation | null;
  conversations: Conversation[];
  create: (dto: Partial<Conversation>) => Promise<Conversation>;
  update: (id: string, dto: Partial<Conversation>) => Promise<Conversation>;
  delete: (id: string) => Promise<void>;
  getBy: (params?: string) => Promise<Conversation[]>;
  getById: (id: string) => Promise<Conversation | null>;
}

const slug = "conversation";
const useConversationStore = create<ConversationState>((set) => ({
  conversation: null,
  conversations: [],

  create: async (dto: Partial<Conversation>) => {
    const response = await axiosInstance.post(`/${slug}`, dto);
    set((state) => ({
      conversations: [...state.conversations, response.data],
    }));
    return response.data;
  },
  update: async (id: string, dto: Partial<Conversation>) => {
    const response = await axiosInstance.put(`/${slug}/${id}`, dto);
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? response.data : conv
      ),
    }));
    return response.data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/${slug}/${id}`);
    set((state) => ({
      conversations: state.conversations.filter((conv) => conv.id !== id),
    }));
  },
  getBy: async (params?: string) => {
    const response = await axiosInstance.get(`/${slug}${params ?? ""}`);
    set({ conversations: response.data });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/${slug}/${id}`);
    set({ conversation: response.data });
    return response.data;
  },
}));

export default useConversationStore;
