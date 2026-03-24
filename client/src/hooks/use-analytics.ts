import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/apiConfig";

export interface DashboardResponse {
  success: boolean;
  data: {
    totalRevenue: number;
    totalOrders: number;
    lowStockProducts: number;
    recentOrders: {
      _id: string;
      totalPrice: number;
      status: string;
      createdAt: string;
      assignedDriver?: {
        _id: string;
        name: string;
        email: string;
      };
    }[];
    monthlySales: {
      month: string;
      total: number;
    }[];
  };
}

function getToken() {
  return localStorage.getItem("token");
}

export function useAnalytics() {
  return useQuery<DashboardResponse>({
    queryKey: ["dashboard-analytics"],
    queryFn: async () => {
      const token = getToken();

      const res = await fetch(`${BASE_URL}/dashboard`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Failed to fetch analytics");
      }

      return res.json();
    },
    refetchInterval: 30000,
  });
}

