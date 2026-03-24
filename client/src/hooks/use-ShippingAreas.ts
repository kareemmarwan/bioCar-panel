import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/constants/apiConfig";

export type ShippingArea = {
  _id: string;
  name: { ar: string; en: string };
  city: string;
  shippingCost: number;
  status: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
};


function getToken() {
  return localStorage.getItem("token");
}

//// ------------------- GET SHIPPING AREAS -------------------

export function useShippingAreas() {
  const token = getToken();

  return useQuery({
    queryKey: ["shipping-areas"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/shipping-areas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch shipping areas");

      return res.json() as Promise<ShippingArea[]>;
    },
  });
}

//// ------------------- CREATE SHIPPING AREA -------------------

export function useCreateShippingArea() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async (data: {
      nameAr: string;
      nameEn: string;
      city: string;
      shippingCost: number;
      status?: string;
    }) => {
      const res = await fetch(`${BASE_URL}/shipping-areas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to create area" }));
        throw new Error(error.message);
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-areas"] });

      toast({
        title: "نجاح",
        description: "تم إضافة منطقة الشحن بنجاح",
      });
    },

    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

//// ------------------- UPDATE SHIPPING AREA -------------------

export function useUpdateShippingArea() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: {
        nameAr?: string;
        nameEn?: string;
        city?: string;
        shippingCost?: number;
        status?: string;
      };
    }) => {
      const res = await fetch(`${BASE_URL}/shipping-areas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to update area" }));
        throw new Error(error.message);
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-areas"] });

      toast({
        title: "تم التحديث",
        description: "تم تعديل منطقة الشحن بنجاح",
      });
    },

    onError: (error: any) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

//// ------------------- DELETE SHIPPING AREA -------------------

export function useDeleteShippingArea() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/shipping-areas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to delete shipping area");
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-areas"] });

      toast({
        title: "تم الحذف",
        description: "تم حذف منطقة الشحن بنجاح",
      });
    },
  });
}