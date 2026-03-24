import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/constants/apiConfig";


function getToken() {
  return localStorage.getItem("token");
}

// 1. جلب قائمة السائقين (التي تعطي خطأ 404 الآن)
export function useDrivers() {
  return useQuery({
    queryKey: ["drivers-list"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/user/drivers`, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch drivers");
      }
      
      return res.json(); // سيعيد مصفوفة السائقين [{_id, name, email}]
    },
  });
}

// 2. إنشاء سائق جديد (تسجيل مستخدم برتبة driver)
export function useCreateDriver() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      // هنا نقوم بإرسال البيانات لعمل Register مع تحديد الـ role كـ driver
      const res = await fetch(`${BASE_URL}/user/register`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify({ ...data, role: "driver" }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create driver");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers-list"] });
      toast({ title: "Driver Added", description: "New driver has been registered." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}

// 3. تحديث بيانات السائق أو حذفه (اختياري)
export function useUpdateDriver() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & any) => {
      const res = await fetch(`${BASE_URL}/user/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}` 
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to update driver");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers-list"] });
      toast({ title: "Driver Updated", description: "Driver details saved." });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  });
}