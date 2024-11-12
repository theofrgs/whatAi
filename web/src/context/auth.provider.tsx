"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import useAuthStore from "@/stores/authStore";
import LoginPage from "@/app/auth/login/page";

type Props = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: Props) {
  const { user, getMe } = useAuthStore();
  const pathName = usePathname();

  useEffect(() => {
    if (!user) getMe();
  }, [getMe, user]);

  // return !localStorage.getItem("token") && pathName !== "/home" ? <LoginPage /> : children;
  return !user && pathName !== "/home" ? <LoginPage /> : children;
}
