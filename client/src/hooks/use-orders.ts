import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/constants/apiConfig";

// ---------------------- الأنماط (Types) ----------------------
export interface Order {
  dbId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerIdNumber: string;
  // تطابق مع التعديل الأخير في الباك إيند
  assignedDriver?: {
    _id: string;
    name: string;
    email: string;
  };
  products: Array<{
    productId: string | any;
    name: string;
    category: string;
    price: number;
    quantity: number;
    _id: string;
  }>;
  paymentProof: string;
  totalAmount: number;
  status: "pending" | "accepted" | "onDelivery" | "delivered" | "cancelled";

  createdAt: string | { $date: string };
  updatedAt: string | { $date: string };
}

export interface Driver {
  _id: string;
  name: string;
  email: string;
}

// الروابط الأساسية للسيرفر
// const BASE_URL = "http://localhost:3000/api/orders";
const USERS_URL = "http://localhost:3000/api/user";

function getToken() {
  return localStorage.getItem("token");
}

// ---------------------- Hooks ----------------------

/**
 * 1. جلب قائمة الطلبات مع الفلترة
 */
export function useOrders(params?: { status?: string; search?: string }) {
  const queryKey = ["/orders", JSON.stringify(params)];
  const token = getToken();

  return useQuery({
    queryKey,
    queryFn: async () => {
      const url = new URL(BASE_URL);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value && value !== "all") url.searchParams.append(key, value);
        });
      }

      const res = await fetch(`${BASE_URL}/orders`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json() as Promise<Order[]>;
    },
  });
}

/**
 * 2. جلب قائمة السائقين فقط (للأدمن)
 */
export function useDriversList() {
  const token = getToken();
  return useQuery({
    queryKey: ["/drivers"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/user/drivers`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });
      if (!res.ok) throw new Error("Failed to fetch drivers");
      return res.json() as Promise<Driver[]>;
    },
  });
}

/**
 * 3. التحديث الشامل للطلب (تغيير الحالة أو تعيين سائق)
 * متوافق مع دالة updateOrder في السيرفر التي تستقبل req.body
 */
export function useUpdateOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async ({ id, status, assignedDriver }: { id: string; status?: string; assignedDriver?: string }) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, assignedDriver }),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Update failed" }));
        throw new Error(error.message || "Failed to update order");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
      toast({ title: "Success", description: "Order updated successfully." });
    },
    onError: (error: any) => {
      toast({ title: "Update Error", description: error.message, variant: "destructive" });
    }
  });
}

/**
 * 4. جلب طلب واحد بالتفصيل
 */
export function useOrder(id: string) {
  const token = getToken();
  return useQuery({
    queryKey: ["/orders", id],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch order details");
      return res.json() as Promise<Order>;
    },
    enabled: !!id,
  });
}

/**
 * 5. حذف طلب (اختياري للأدمن)
 */
export function useDeleteOrder() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/orders"] });
      toast({ title: "Deleted", description: "Order has been removed." });
    },
  });
}

