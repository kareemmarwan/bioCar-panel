

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { BASE_URL } from "@/constants/apiConfig";


export function useAuth() {
  const queryClient = useQueryClient();

  // 🔹 جلب المستخدم الحالي
  const { data: user, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) return null;

      const res = await axios.get(`${BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return res.data;
    },
    retry: false,
  });

  // 🔹 تسجيل الدخول
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await axios.post(`${BASE_URL}/user/login`, data);
      return res.data;
    },
    onSuccess: (data) => {
      // خزّن التوكن
      localStorage.setItem("token", data.token);

      // خزّن المستخدم مباشرة في React Query
      queryClient.setQueryData(["authUser"], {
        _id: data._id,
        name: data.name,
        email: data.email,
        role: data.role,
      });
    },
  });

  // 🔹 تسجيل الخروج
  const logoutMutation = useMutation({
    mutationFn: async () => {
      localStorage.removeItem("token");
    },
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null);
    },
  });

   function useDrivers() {
    const token = localStorage.getItem("token");
    return useQuery({
      queryKey: ["/drivers"],
      queryFn: async () => {
        const res = await fetch(`${BASE_URL}/users/drivers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch drivers");
        return res.json() as Promise<{ _id: string; name: string; email: string }[]>;
      },
    });
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    useDrivers
  };
}
