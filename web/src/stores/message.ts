import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance";
import { Message } from "@/models/message";

interface MessageState {
  message: Message | null;
  messages: Message[];
  create: (dto: Partial<Message>) => Promise<Message>;
  update: (id: string, dto: Partial<Message>) => Promise<Message>;
  delete: (id: string) => Promise<void>;
  getBy: (params?: string) => Promise<Message[]>;
  getById: (id: string) => Promise<Message | null>;
}

const slug = "message";
const useMessageStore = create<MessageState>((set) => ({
  message: null,
  messages: [],

  create: async (dto: Partial<Message>) => {
    const response = await axiosInstance.post(`/${slug}`, dto);
    set((state) => ({
      messages: [...state.messages, response.data],
    }));
    return response.data;
  },
  update: async (id: string, dto: Partial<Message>) => {
    const response = await axiosInstance.put(`/${slug}/${id}`, dto);
    set((state) => ({
      messages: state.messages.map((conv) =>
        conv.id === id ? response.data : conv
      ),
    }));
    return response.data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/${slug}/${id}`);
    set((state) => ({
      messages: state.messages.filter((conv) => conv.id !== id),
    }));
  },
  getBy: async (params?: string) => {
    const response = await axiosInstance.get(`/${slug}${params ?? ""}`);
    set({ messages: response.data });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/${slug}/${id}`);
    set({ message: response.data });
    return response.data;
  },
}));

export default useMessageStore;
