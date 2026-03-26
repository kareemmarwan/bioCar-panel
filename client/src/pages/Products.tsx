import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct, type Product } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Pencil, 
  Trash2,
  Loader2,
  Filter,
  ImagePlus,
  X
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";


export default function Products() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string>("all");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useProducts({ 
    search: debouncedSearch, 
    category: categoryId === "all" ? undefined : categoryId,
  });

  const { data: categories } = useCategories();
  const deleteMutation = useDeleteProduct();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your pharmacy inventory and stock.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm mt-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, brand, or keywords..." 
            className="pl-9 bg-background" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="w-[200px]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <SelectValue placeholder="Category" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {typeof c.name === 'object' ? (c.name.en || c.name.ar) : c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden mt-4">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={8} className="h-24 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></TableCell></TableRow>
            ) : data?.length === 0 ? (
              <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground">No products found.</TableCell></TableRow>
            ) : data?.map((product) => (
              <TableRow key={product.id || (product as any)._id} className="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                    {product.images?.[0] ? (
                      <img 
                        src={product.images[0].startsWith('data:') || product.images[0].startsWith('http') ? product.images[0] : `${product.images[0]}`} 
                        alt={product.name?.en || "Product"} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-5 h-5 bg-gray-200 rounded-full" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium text-foreground">
                  <div className="flex flex-col">
                    <span>{product.name?.en || (product as any).nameEn}</span>
                    <span className="text-xs text-muted-foreground" dir="rtl">{product.name?.ar || (product as any).nameAr}</span>
                  </div>
                </TableCell>
                <TableCell>{product.brand}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {typeof product.category === 'object' 
                      ? ((product.category as any)?.name?.en || (product.category as any)?.name) 
                      : "Uncategorized"}
                  </Badge>
                </TableCell>
                <TableCell>${product.price?.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={product.stockQuantity <= 10 ? "destructive" : "secondary"}>
                    {product.stockQuantity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={product.status === 'active' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                    {product.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingProduct(product)}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => handleDelete(product.id || (product as any)._id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ProductDialog 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        mode="create" 
      />
      
      {editingProduct && (
        <ProductDialog 
          open={!!editingProduct} 
          onOpenChange={(open) => !open && setEditingProduct(null)} 
          mode="edit"
          product={editingProduct}
        />
      )}
    </Layout>
  );
}

// ---------------- Product Dialog Component ----------------
function ProductDialog({ open, onOpenChange, mode, product }: { open: boolean; onOpenChange: (open: boolean) => void; mode: "create" | "edit"; product?: Product }) {
  const { data: categories } = useCategories();
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm({
    defaultValues: {
      nameAr: "", nameEn: "", brand: "", price: 0, costPrice: 0, discountPrice: 0,
      stockQuantity: 0, productType: "Cosmetic", status: "active", categoryId: "",
      images: [] as string[], keywords: "", dosageAr: "", dosageEn: "",
      usageAr: "", usageEn: "", ingredientsAr: "", ingredientsEn: "",
      sideEffectsAr: "", sideEffectsEn: "", notesAr: "", notesEn: "",
    }
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && product) {
        const initialPreviews = product.images?.map(img =>
          img.startsWith('data:') || img.startsWith('http') ? img : `${img}`
        ) || [];
        setPreviews(initialPreviews);
        
        // فك تشفير الكائنات القادمة من السيرفر لتناسب حقول الفورم المسطحة
        form.reset({
          nameAr: product.name?.ar || "",
          nameEn: product.name?.en || "",
          brand: product.brand || "",
          price: product.price || 0,
          costPrice: product.costPrice || 0,
          discountPrice: product.discountPrice || 0,
          stockQuantity: product.stockQuantity || 0,
          productType: product.productType || "Cosmetic",
          status: product.status || "active",
          categoryId: typeof product.category === 'object' ? (product.category as any)?._id : (product.category || ""),
          images: product.images || [],
          keywords: Array.isArray(product.keywords) ? product.keywords.join(", ") : "",
          dosageAr: product.dosage?.ar || "",
          dosageEn: product.dosage?.en || "",
          usageAr: product.usage?.ar || "",
          usageEn: product.usage?.en || "",
          ingredientsAr: product.ingredients?.ar || "",
          ingredientsEn: product.ingredients?.en || "",
          notesAr: product.notes?.ar || "",
          notesEn: product.notes?.en || "",
          sideEffectsAr: product.sideEffects?.ar || "",
          sideEffectsEn: product.sideEffects?.en || "",
        });
      } else {
        setPreviews([]);
        form.reset({
          nameAr: "", nameEn: "", brand: "", price: 0, costPrice: 0, discountPrice: 0,
          stockQuantity: 0, productType: "Cosmetic", status: "active", categoryId: "",
          images: [], keywords: "", dosageAr: "", dosageEn: "", usageAr: "", usageEn: "", 
          ingredientsAr: "", ingredientsEn: "", sideEffectsAr: "", sideEffectsEn: "", notesAr: "", notesEn: ""
        });
      }
    }
  }, [open, mode, product, form]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const base64Results = await Promise.all(
      files.map(file => new Promise<string>(resolve => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      }))
    );
    setPreviews(prev => [...prev, ...base64Results]);
    form.setValue("images", [...form.getValues("images"), ...base64Results]);
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
    const currentImages = form.getValues("images");
    form.setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const onSubmit = async (values: any) => {
    // ✅ إرسال البيانات كحقول مسطحة كما يتوقع السيرفر تماماً
    const payload = {
      ...values,
      price: Number(values.price),
      costPrice: Number(values.costPrice),
      discountPrice: Number(values.discountPrice),
      stockQuantity: Number(values.stockQuantity),
      keywords: values.keywords ? values.keywords.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
    };

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (product) {
        const id = product.id || (product as any)._id;
        await updateMutation.mutateAsync({ _id: id, ...payload });
      }
      onOpenChange(false);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const isPending = createMutation.isLoading || updateMutation.isLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Add New Product" : "Edit Product"}</DialogTitle>
          <DialogDescription>Enter product details below. Required fields are marked.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField control={form.control} name="nameAr" render={({ field }) => (
                  <FormItem><FormLabel>Name (AR) *</FormLabel><FormControl><Input {...field} dir="rtl" /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="nameEn" render={({ field }) => (
                  <FormItem><FormLabel>Name (EN) *</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                )} />

                <FormField control={form.control} name="brand" render={({ field }) => (
                  <FormItem><FormLabel>Brand</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>
                )} />

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="categoryId" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger></FormControl>
                        <SelectContent>
                          {categories?.map(c => (
                            <SelectItem key={c._id} value={c._id}>
                                {typeof c.name === 'object' ? (c.name.en || c.name.ar) : c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="status" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="hidden">Hidden</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <FormField control={form.control} name="price" render={({ field }) => (
                    <FormItem><FormLabel>Price *</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="costPrice" render={({ field }) => (
                    <FormItem><FormLabel>Cost</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="discountPrice" render={({ field }) => (
                    <FormItem><FormLabel>Discount</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="stockQuantity" render={({ field }) => (
                    <FormItem><FormLabel>Stock *</FormLabel><FormControl><Input type="number" {...field} /></FormControl></FormItem>
                  )} />
                  <FormField control={form.control} name="productType" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Medical">Medical</SelectItem>
                          <SelectItem value="Cosmetic">Cosmetic</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )} />
                </div>
              </div>

              <div className="space-y-4">
                <FormLabel>Product Images</FormLabel>
                <div className="border-2 border-dashed rounded-xl p-4 min-h-[150px] flex flex-col items-center justify-center gap-4 bg-muted/20">
                  {previews.length > 0 ? (
                    <div className="grid grid-cols-3 gap-2 w-full">
                      {previews.map((src, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border">
                          <img src={src} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-lg">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <ImagePlus className="w-10 h-10 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">No images uploaded</p>
                    </div>
                  )}
                  <Input type="file" multiple accept="image/*" onChange={handleFileChange} className="cursor-pointer" />
                </div>

                {[
                  { nameAr: "dosageAr", nameEn: "dosageEn", label: "Dosage" },
                  { nameAr: "usageAr", nameEn: "usageEn", label: "Usage" },
                  { nameAr: "ingredientsAr", nameEn: "ingredientsEn", label: "Ingredients" },
                  { nameAr: "notesAr", nameEn: "notesEn", label: "Description" },
                ].map(item => (
                  <div key={item.label} className="grid grid-cols-2 gap-2">
                    <FormField control={form.control} name={item.nameAr as any} render={({ field: f }) => (
                      <FormItem><FormLabel>{item.label} (AR)</FormLabel><FormControl><Textarea {...f} dir="rtl" className="resize-none h-20" /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name={item.nameEn as any} render={({ field: f }) => (
                      <FormItem><FormLabel>{item.label} (EN)</FormLabel><FormControl><Textarea {...f} className="resize-none h-20" /></FormControl></FormItem>
                    )} />
                  </div>
                ))}
              </div>
            </div>

            <FormField control={form.control} name="keywords" render={({ field }) => (
              <FormItem><FormLabel>Keywords (Comma separated)</FormLabel><FormControl><Input placeholder="Antibiotic, Cream..." {...field} /></FormControl></FormItem>
            )} />

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending} className="min-w-[120px]">
                {isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : mode === "create" ? "Add Product" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
