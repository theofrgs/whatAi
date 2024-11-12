import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance";
import { User } from "@/models/user";

interface UserState {
  user: User | null;
  users: User[];
  create: (dto: Partial<User>) => Promise<User>;
  update: (id: string, dto: Partial<User>) => Promise<User>;
  delete: (id: string) => Promise<void>;
  getBy: (params?: string) => Promise<User[]>;
  getById: (id: string) => Promise<User | null>;
}

const slug = "user";
const useUserStore = create<UserState>((set) => ({
  user: null,
  users: [],

  create: async (dto: Partial<User>) => {
    const response = await axiosInstance.post(`/${slug}`, dto);
    set((state) => ({
      users: [...state.users, response.data],
    }));
    return response.data;
  },
  update: async (id: string, dto: Partial<User>) => {
    const response = await axiosInstance.put(`/${slug}/${id}`, dto);
    set((state) => ({
      users: state.users.map((conv) =>
        conv.id === id ? response.data : conv
      ),
    }));
    return response.data;
  },
  delete: async (id: string) => {
    await axiosInstance.delete(`/${slug}/${id}`);
    set((state) => ({
      users: state.users.filter((conv) => conv.id !== id),
    }));
  },
  getBy: async (params?: string) => {
    const response = await axiosInstance.get(`/${slug}${params ?? ""}`);
    set({ users: response.data });
    return response.data;
  },
  getById: async (id: string) => {
    const response = await axiosInstance.get(`/${slug}/${id}`);
    set({ user: response.data });
    return response.data;
  },
}));

export default useUserStore;
