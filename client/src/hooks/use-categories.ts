

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/constants/apiConfig";

// 1. تحديث النوع ليدعم اللغتين
export type Category = {
  _id: string;
  name: { ar: string; en: string }; // كائن للغتين
  description?: { ar: string; en: string };
  image?: string;
  status: "active" | "inactive";
  color?: string;
  createdAt?: string;
  updatedAt?: string;
};


function getToken() {
  return localStorage.getItem("token");
}

// ---------------------- Hooks ----------------------

export function useCategories() {
  const token = getToken();
  return useQuery({
    queryKey: ["/categories"],
    queryFn: async () => {
      const res = await fetch(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch categories");
      return res.json() as Promise<Category[]>;
    },
  });
}

// 2. إنشاء فئة (استخدام FormData)
export function useCreateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: { 
          // ملاحظة: لا تضع Content-Type هنا عند استخدام FormData
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to create category" }));
        throw new Error(error.message || "Error");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/categories"] });
      toast({ title: "نجاح", description: "تم إضافة الفئة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

// 3. تحديث فئة (استخدام FormData والـ ID بشكل منفصل)
export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async ({ _id, formData }: { _id: string; formData: FormData }) => {
      const res = await fetch(`${BASE_URL}/categories/${_id}`, {
        method: "PUT",
        headers: { 
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({ message: "Failed to update category" }));
        throw new Error(error.message || "Error");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/categories"] });
      toast({ title: "تم التحديث", description: "تم حفظ تعديلات الفئة بنجاح" });
    },
    onError: (error: any) => {
      toast({ title: "خطأ", description: error.message, variant: "destructive" });
    },
  });
}

// 4. حذف فئة (يبقى كما هو)
export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete category");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/categories"] });
      toast({ title: "تم الحذف", description: "تم إزالة الفئة بنجاح" });
    },
  });
}