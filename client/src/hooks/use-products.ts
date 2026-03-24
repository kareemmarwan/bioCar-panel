import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { BASE_URL } from "@/constants/apiConfig";

// ---------------------- Data Types ----------------------
export type Product = {
  _id: string;
  name: { ar: string; en: string }; // تعديل لتطابق هيكل السيرفر المترجم
  categoryId: {               // تعديل من category إلى categoryId
    _id: string;
    name: { ar: string; en: string };
  } | string | null;
  price: number;
  discountPrice?: number;
  costPrice?: number;
  stockQuantity: number;
  soldQuantity?: number;
  keywords?: string[];
  productType: "Medical" | "Cosmetic";
  status: "active" | "hidden";
  images?: string[];
  brand?: string;
  dosage?: { ar: string; en: string };
  notes?: { ar: string; en: string };
  // ... بقية الحقول
};

// const BASE_URL = "http://localhost:3000/api";

function getToken() {
  return localStorage.getItem("token");
}

function base64ToFile(base64String: string, filename: string): File {
  const arr = base64String.split(",");
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

// 1. Fetch all products
export function useProducts(params?: any) {
  const token = getToken();
  return useQuery({
    queryKey: ["/products", JSON.stringify(params)],
    queryFn: async () => {
      const url = new URL(`${BASE_URL}/products`);

      // التعديل هنا: تم تغيير "en" إلى "all" لجلب البيانات بكلا اللغتين
      url.searchParams.append("lang", "all"); 

      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          // نتأكد من عدم تكرار إضافة مفتاح lang إذا كان موجوداً في params أصلاً
          if (value && value !== "all" && key !== "lang") {
            url.searchParams.append(key, value as string);
          }
        });
      }

      console.log("Fetching from URL:", url.toString());

      const res = await fetch(url.toString(), {
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });

      

      if (!res.ok) throw new Error("Failed to fetch products");
      return res.json();
    },
  });
}





export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getToken();

  return useMutation({
    mutationFn: async (data: any) => {
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "images" && Array.isArray(data.images)) {
          data.images.forEach((img: any, i: number) => {
            // ✅ الحالة 1: الصورة ملف حقيقي مرفوع من الجهاز (File)
            if (img instanceof File) {
              formData.append("images", img);
            } 
            // ✅ الحالة 2: الصورة بصيغة Base64
            else if (typeof img === "string" && img.startsWith("data:image")) {
              formData.append("images", base64ToFile(img, `prod_${i}.png`));
            } 
            // ✅ الحالة 3: الصورة رابط خارجي كامل قادم من Cloudinary (في حال التعديل مثلاً)
            else if (typeof img === "string" && img.startsWith("http")) {
              formData.append("images", img); 
            }
          });
        } else if (Array.isArray(data[key])) {
          data[key].forEach((v: any) => {
            if (v !== undefined && v !== null) {
              formData.append(key, v);
            }
          });
        } else {
          // التحقق من القيم غير الفارغة لتجنب إرسال [object Object] أو null
          if (data[key] !== undefined && data[key] !== null) {
            formData.append(key, data[key]);
          }
        }
      });

      const res = await fetch(`${BASE_URL}/products`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}` 
          // ⚠️ تنبيه هام جداً: لا تضع 'Content-Type': 'multipart/form-data' هنا يدوياً، المتصفح يضعها تلقائياً مع الـ boundary الصحيح للـ FormData.
        },
        body: formData,
      });

      if (!res.ok) {
        // قراءة رسالة الخطأ الحقيقية القادمة من الباك إند
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Create Failed");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/products"] });
      toast({ title: "Success", description: "Product created" });
    },
    onError: (error: any) => {
      // إظهار رسالة الخطأ الحقيقية في الـ Toast لتسهيل الفحص
      toast({ 
        title: "Error", 
        description: error.message, 
        variant: "destructive" 
      });
    }
  });
}


// 3. Update Product (FormData)
export function useUpdateProduct() {
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const token = getToken();
  
    return useMutation({
      mutationFn: async ({ _id, ...data }: any) => {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === "images") {
            data.images.forEach((img: string) => {
              if (img.startsWith("data:image")) {
                formData.append("images", base64ToFile(img, `update_${Date.now()}.png`));
              } else {
                formData.append("images", img); // إرسال المسار القديم إذا لم يتغير
              }
            });
          } else {
            formData.append(key, data[key]);
          }
        });
  
        const res = await fetch(`${BASE_URL}/products/${_id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        if (!res.ok) throw new Error("Update Failed");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["/products"] });
        toast({ title: "Updated", description: "Product updated successfully" });
      },
    });
  }

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const token = getToken();
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`${BASE_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/products"] }),
  });
}


