import { create } from "zustand";
import axiosInstance from "@/utils/axiosInstance";
import { User } from "@/models/user";
import { LoginDTO, RegisterDTO } from "@/models/auth";

interface AuthState {
  user: User | null;
  login: (dto: LoginDTO) => Promise<void>;
  register: (dto: RegisterDTO) => Promise<void>;
  confirmEmail: (email: string) => void;
  getMe: () => Promise<void>;
}
const slug = "auth";
const useAuthStore = create<AuthState>((set) => ({
  user: null,
  login: async (dto: LoginDTO) => {
    const response = await axiosInstance.post(`/${slug}/native/login`, dto);
    localStorage.setItem("token", response.data.access_token);
  },
  getMe: async () => {
    const res = await axiosInstance.get("/user/me");
    set({ user: res.data });
  },
  register: async (dto: RegisterDTO) => {
    axiosInstance.post(`/${slug}/native/register`, dto);
  },
  confirmEmail: (email) => {
    console.log(`Email confirmed for: ${email}`);
  },
}));

export default useAuthStore;
