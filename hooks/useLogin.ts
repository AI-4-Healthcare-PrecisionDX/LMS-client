"use client";

import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import api from "@/lib/axios-config";
import { User } from "@/types";

interface LoginFormData {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

const authApi = {
  login: async (credentials: LoginFormData): Promise<LoginResponse> => {
    const params = new URLSearchParams();
    params.append("username", credentials.username);
    params.append("password", credentials.password);

    const { data: authData } = await api.post("/login/access-token", params);
    const { data: userData } = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${authData.access_token}`,
      },
    });

    return {
      token: authData.access_token,
      user: userData,
    };
  },
};

export function useLogin() {
  const { login } = useAuth();

  return useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.token, data.user);
    },
  });
}
