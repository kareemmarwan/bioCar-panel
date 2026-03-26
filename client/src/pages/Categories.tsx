// import { useState, useEffect } from "react";
// import { Layout } from "@/components/Layout";
// import { 
//     useCategories, 
//     useCreateCategory, 
//     useUpdateCategory, 
//     useDeleteCategory, 
//     type Category 
//   } from "@/hooks/use-categories";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Badge } from "@/components/ui/badge";
// import { 
//   Plus, 
//   Search, 
//   MoreHorizontal, 
//   Pencil, 
//   Trash2, 
//   Loader2,
//   Tag
// } from "lucide-react";
// import { useForm } from "react-hook-form";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


// export default function Categories() {
//   const [search, setSearch] = useState("");
//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [editingCategory, setEditingCategory] = useState<Category | null>(null);

//   const { data: categories, isLoading } = useCategories();
//   const deleteMutation = useDeleteCategory();

//   // 1. تحديث منطق البحث ليشمل اللغتين والأجسام المتداخلة
//   const filteredCategories = categories?.filter(cat => {
//     const searchTerm = search.toLowerCase();
//     return (
//       cat.name?.en?.toLowerCase().includes(searchTerm) || 
//       cat.name?.ar?.includes(searchTerm) ||
//       cat.description?.en?.toLowerCase().includes(searchTerm) ||
//       cat.description?.ar?.includes(searchTerm)
//     );
//   });

//   return (
//     <Layout>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-foreground">Categories</h1>
//           <p className="text-muted-foreground">Organize your products into logical groups.</p>
//         </div>
//         <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
//           <Plus className="w-4 h-4 mr-2" />
//           Add Category
//         </Button>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm mt-6">
//         <div className="relative flex-1 w-full">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
//           <Input 
//             placeholder="Search categories (Arabic or English)..." 
//             className="pl-9 bg-background" 
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//           />
//         </div>
//       </div>

//       <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden mt-4">
//         <Table>
//           <TableHeader className="bg-muted/30">
//             <TableRow>
//               <TableHead className="w-[80px]">Image</TableHead>
//               <TableHead>Name</TableHead>
//               <TableHead>Description</TableHead>
//               <TableHead>Status</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {isLoading ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center">
//                   <div className="flex items-center justify-center gap-2 text-muted-foreground">
//                     <Loader2 className="w-4 h-4 animate-spin" />
//                     Loading categories...
//                   </div>
//                 </TableCell>
//               </TableRow>
//             ) : filteredCategories?.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
//                   No categories found.
//                 </TableCell>
//               </TableRow>
//             ) : (
//               filteredCategories?.map((category) => (
//                 <TableRow key={category._id} className="group hover:bg-muted/30 transition-colors">
//                   <TableCell>
//                     <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
//                       {category.image ? (
//                         <img 
//                           src={category.image.startsWith('http') ? category.image : `${category.image}`} 
//                           alt={category.name?.en} 
//                           className="w-full h-full object-cover" 
//                         />
//                       ) : (
//                         <Tag className="w-5 h-5 text-muted-foreground" />
//                       )}
//                     </div>
//                   </TableCell>
                  
//                   {/* عرض الاسم باللغتين */}
//                   <TableCell className="font-medium text-foreground">
//                     <div className="flex flex-col">
//                       <span className="text-sm">{category.name?.en}</span>
//                       <span className="text-xs text-muted-foreground" dir="rtl">{category.name?.ar}</span>
//                     </div>
//                   </TableCell>

//                   <TableCell className="max-w-[300px] truncate text-muted-foreground text-xs">
//                     {category.description?.en || category.description?.ar || "No description provided"}
//                   </TableCell>

//                   <TableCell>
//                     <Badge 
//                         variant="outline" 
//                         className="font-medium"
//                         style={{ borderColor: category.color, color: category.color }}
//                     >
//                       {category.status === 'active' ? "Active" : "Inactive"}
//                     </Badge>
//                   </TableCell>

//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" className="h-8 w-8 p-0">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem onClick={() => setEditingCategory(category)}>
//                           <Pencil className="mr-2 h-4 w-4" /> Edit
//                         </DropdownMenuItem>
//                         <DropdownMenuItem 
//                           className="text-red-600"
//                           onClick={() => {
//                             if(confirm("Are you sure you want to delete this category?")) deleteMutation.mutate(category._id)
//                           }}
//                         >
//                           <Trash2 className="mr-2 h-4 w-4" /> Delete
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       <CategoryDialog 
//         open={isCreateOpen} 
//         onOpenChange={setIsCreateOpen} 
//         mode="create" 
//       />
      
//       {editingCategory && (
//         <CategoryDialog 
//           open={!!editingCategory} 
//           onOpenChange={(open) => !open && setEditingCategory(null)} 
//           mode="edit"
//           category={editingCategory}
//         />
//       )}
//     </Layout>
//   );
// }

// // ---------------- Category Dialog Component ----------------

// function CategoryDialog({ 
//   open, 
//   onOpenChange, 
//   mode, 
//   category 
// }: { 
//   open: boolean; 
//   onOpenChange: (open: boolean) => void; 
//   mode: "create" | "edit";
//   category?: any; 
// }) {
//   const createMutation = useCreateCategory();
//   const updateMutation = useUpdateCategory();
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   // استخدام values لضمان تحديث الحقول فور اختيار فئة للتعديل
//   const form = useForm({
//     values: {
//       nameAr: category?.name?.ar || "",
//       nameEn: category?.name?.en || "",
//       descriptionAr: category?.description?.ar || "",
//       descriptionEn: category?.description?.en || "",
//       status: category?.status || "active",
//       color: category?.color || "#000000",
//     }
//   });

//   useEffect(() => {
//     if (!open) {
//       setSelectedFile(null);
//     }
//   }, [open]);

//   const onSubmit = async (values: any) => {
//     const formData = new FormData();
//     formData.append("nameAr", values.nameAr);
//     formData.append("nameEn", values.nameEn);
//     formData.append("descriptionAr", values.descriptionAr);
//     formData.append("descriptionEn", values.descriptionEn);
//     formData.append("status", values.status);
//     formData.append("color", values.color);
    
//     if (selectedFile) {
//       formData.append("image", selectedFile);
//     }

//     if (mode === "create") {
//       await createMutation.mutateAsync(formData); 
//     } else if (category) {
//       await updateMutation.mutateAsync({ _id: category._id, formData });
//     }
    
//     onOpenChange(false);
//     form.reset();
//   };

//   const isPending = createMutation.isPending || updateMutation.isPending;

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{mode === "create" ? "Create New Category" : "Edit Category"}</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
//             <div className="grid grid-cols-2 gap-4">
//               <FormField control={form.control} name="nameAr" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>الاسم (عربي)</FormLabel>
//                   <FormControl><Input placeholder="مثال: أدوية" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//               <FormField control={form.control} name="nameEn" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name (EN)</FormLabel>
//                   <FormControl><Input placeholder="e.g. Medicines" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )} />
//             </div>

//             <FormField control={form.control} name="descriptionAr" render={({ field }) => (
//               <FormItem>
//                 <FormLabel>الوصف (عربي)</FormLabel>
//                 <FormControl><Textarea {...field} /></FormControl>
//                 <FormMessage />
//               </FormItem>
//             )} />

//             <FormField control={form.control} name="descriptionEn" render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Description (EN)</FormLabel>
//                 <FormControl><Textarea {...field} /></FormControl>
//                 <FormMessage />
//               </FormItem>
//             )} />

//             <FormItem>
//               <FormLabel>Category Image</FormLabel>
//               <FormControl>
//                 <div className="space-y-2">
//                   <Input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
//                   />
//                   {category?.image && !selectedFile && (
//                     <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
//                       <img 
//                         src={`${category.image}`} 
//                         alt="Current" 
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                       <span className="text-xs text-muted-foreground">Current Image</span>
//                     </div>
//                   )}
//                 </div>
//               </FormControl>
//             </FormItem>

//             <div className="grid grid-cols-2 gap-4">
//                <FormField control={form.control} name="status" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Status</FormLabel>
//                   <Select onValueChange={field.onChange} value={field.value}>
//                     <SelectTrigger><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="active">Active</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </FormItem>
//               )} />
              
//               <FormField control={form.control} name="color" render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Color</FormLabel>
//                   <FormControl><Input type="color" {...field} className="h-10 p-1 cursor-pointer" /></FormControl>
//                 </FormItem>
//               )} />
//             </div>

//             <div className="flex justify-end gap-2 pt-4 border-t">
//               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
//               <Button type="submit" disabled={isPending}>
//                 {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//                 {mode === "create" ? "Create Category" : "Save Changes"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }





import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { 
    useCategories, 
    useCreateCategory, 
    useUpdateCategory, 
    useDeleteCategory, 
    type Category 
  } from "@/hooks/use-categories";
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
// تم استبدال الـ Dialog بالـ Sheet
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
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
  Tag
} from "lucide-react";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectValue, SelectTrigger } from "@/components/ui/select";


export default function Categories() {
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const { data: categories, isLoading } = useCategories();
  const deleteMutation = useDeleteCategory();

  const filteredCategories = categories?.filter(cat => {
    const searchTerm = search.toLowerCase();
    return (
      cat.name?.en?.toLowerCase().includes(searchTerm) || 
      cat.name?.ar?.includes(searchTerm) ||
      cat.description?.en?.toLowerCase().includes(searchTerm) ||
      cat.description?.ar?.includes(searchTerm)
    );
  });

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Categories</h1>
          <p className="text-muted-foreground">Organize your products into logical groups.</p>
        </div>
        <Button onClick={() => setIsCreateOpen(true)} className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-card p-4 rounded-xl border border-border/50 shadow-sm mt-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search categories (Arabic or English)..." 
            className="pl-9 bg-background" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border/50 shadow-sm overflow-hidden mt-4">
        <Table>
          <TableHeader className="bg-muted/30">
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading categories...
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredCategories?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories?.map((category) => (
                <TableRow key={category._id} className="group hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border">
                      {category.image ? (
                        <img 
                          src={category.image.startsWith('http') ? category.image : `${category.image}`} 
                          alt={category.name?.en} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <Tag className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell className="font-medium text-foreground">
                    <div className="flex flex-col">
                      <span className="text-sm">{category.name?.en}</span>
                      <span className="text-xs text-muted-foreground" dir="rtl">{category.name?.ar}</span>
                    </div>
                  </TableCell>

                  <TableCell className="max-w-[300px] truncate text-muted-foreground text-xs">
                    {category.description?.en || category.description?.ar || "No description provided"}
                  </TableCell>

                  <TableCell>
                    <Badge 
                        variant="outline" 
                        className="font-medium"
                        style={{ borderColor: category.color, color: category.color }}
                    >
                      {category.status === 'active' ? "Active" : "Inactive"}
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
                        <DropdownMenuItem onClick={() => setEditingCategory(category)}>
                          <Pencil className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => {
                            if(confirm("Are you sure you want to delete this category?")) deleteMutation.mutate(category._id)
                          }}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CategorySheet 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        mode="create" 
      />
      
      {editingCategory && (
        <CategorySheet 
          open={!!editingCategory} 
          onOpenChange={(open) => !open && setEditingCategory(null)} 
          mode="edit"
          category={editingCategory}
        />
      )}
    </Layout>
  );
}

// ---------------- Category Sheet Component ----------------

function CategorySheet({ 
  open, 
  onOpenChange, 
  mode, 
  category 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  mode: "create" | "edit";
  category?: any; 
}) {
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm({
    values: {
      nameAr: category?.name?.ar || "",
      nameEn: category?.name?.en || "",
      descriptionAr: category?.description?.ar || "",
      descriptionEn: category?.description?.en || "",
      status: category?.status || "active",
      color: category?.color || "#000000",
    }
  });

  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
    }
  }, [open]);

  const onSubmit = async (values: any) => {
    const formData = new FormData();
    formData.append("nameAr", values.nameAr);
    formData.append("nameEn", values.nameEn);
    formData.append("descriptionAr", values.descriptionAr);
    formData.append("descriptionEn", values.descriptionEn);
    formData.append("status", values.status);
    formData.append("color", values.color);
    
    if (selectedFile) {
      formData.append("image", selectedFile);
    }

    if (mode === "create") {
      await createMutation.mutateAsync(formData); 
    } else if (category) {
      await updateMutation.mutateAsync({ _id: category._id, formData });
    }
    
    onOpenChange(false);
    form.reset();
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* الـ side="right" هي المسؤولة عن السحب من اليمين، يمكنك تغييرها لـ "left" لو أردت */}
      <SheetContent side="right" className="sm:max-w-lg h-full overflow-y-auto flex flex-col">
        <SheetHeader className="pb-4 border-b">
          <SheetTitle>{mode === "create" ? "Create New Category" : "Edit Category"}</SheetTitle>
        </SheetHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 py-6 flex-1 flex flex-col justify-between">
            
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="nameAr" render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم (عربي)</FormLabel>
                    <FormControl><Input placeholder="مثال: أدوية" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="nameEn" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name (EN)</FormLabel>
                    <FormControl><Input placeholder="e.g. Medicines" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="descriptionAr" render={({ field }) => (
                <FormItem>
                  <FormLabel>الوصف (عربي)</FormLabel>
                  <FormControl><Textarea rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField control={form.control} name="descriptionEn" render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (EN)</FormLabel>
                  <FormControl><Textarea rows={4} {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormItem>
                <FormLabel>Category Image</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    <Input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                    {category?.image && !selectedFile && (
                      <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                        <img 
                          src={`${category.image}`} 
                          alt="Current" 
                          className="w-12 h-12 object-cover rounded"
                        />
                        <span className="text-xs text-muted-foreground">Current Image</span>
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>

              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="status" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )} />
                
                <FormField control={form.control} name="color" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color</FormLabel>
                    <FormControl><Input type="color" {...field} className="h-10 p-1 cursor-pointer" /></FormControl>
                  </FormItem>
                )} />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t mt-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {mode === "create" ? "Create Category" : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}

