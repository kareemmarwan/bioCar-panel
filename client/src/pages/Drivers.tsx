import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useDrivers, useCreateDriver } from "@/hooks/use-drivers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// أضف DialogDescription هنا
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Plus, Phone, Mail, Star, Truck, Loader2, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Drivers() {
  const { data: drivers, isLoading } = useDrivers();
  const [isAddOpen, setIsAddOpen] = useState(false);
  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Drivers Management</h1>
          <p className="text-muted-foreground">Manage your delivery fleet and track performance.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 shadow-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add New Driver
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)
        ) : drivers?.length === 0 ? (
          <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl border-muted">
            <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No drivers found</h3>
            <p className="text-muted-foreground">Start by adding your first delivery driver.</p>
          </div>
        ) : drivers?.map((driver: any) => (
          <Card key={driver._id} className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/30">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
                {driver.name ? driver.name[0].toUpperCase() : <User className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{driver.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] bg-green-50 text-green-600 border-green-200">
                    {driver.role || 'Driver'}
                  </Badge>
                  <span className="flex items-center text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full">
                    <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                    {driver.rating || '5.0'}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm pt-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4 text-primary/70" />
                {driver.phone || 'No phone number'}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4 text-primary/70" />
                <span className="truncate">{driver.email}</span>
              </div>
              <div className="pt-3 border-t border-border/50 flex justify-between items-center mt-4">
                <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Deliveries</span>
                <span className="font-bold flex items-center gap-1.5 text-primary">
                  <Truck className="w-4 h-4" />
                  {driver.totalDeliveries || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AddDriverDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
    </Layout>
  );
}

function AddDriverDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
  const createMutation = useCreateDriver();
  
  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      role: "driver"
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await createMutation.mutateAsync(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      // تم حل مشكلة الـ SyntaxError هنا عبر معالجة الخطأ في الـ Hook نفسه
      console.error("Submission error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Register New Driver</DialogTitle>
          {/* إضافة الوصف لحل تحذير Radix UI */}
          <DialogDescription>
            Enter the details below to create a new driver account.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
            <FormField
              control={form.control}
              name="name"
              rules={{ required: "Name is required" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input placeholder="Ex: John Doe" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              rules={{ 
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl><Input placeholder="driver@company.com" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              rules={{ 
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number (Optional)</FormLabel>
                  <FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-2">
              <Button type="submit" className="w-full py-6 text-lg" disabled={createMutation.isPending}>
                {createMutation.isPending ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  "Register Driver Account"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}













// import { useState } from "react";
// import { Layout } from "@/components/Layout";
// import { useDrivers, useCreateDriver } from "@/hooks/use-drivers";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// // تم إزالة استيراد zod و schema
// import { Plus, Phone, Mail, Star, Truck, Loader2, User } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function Drivers() {
//   const { data: drivers, isLoading } = useDrivers();
//   const [isAddOpen, setIsAddOpen] = useState(false);

//   return (
//     <Layout>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-foreground">Drivers Management</h1>
//           <p className="text-muted-foreground">Manage your delivery fleet and track performance.</p>
//         </div>
//         <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90 shadow-sm">
//           <Plus className="w-4 h-4 mr-2" />
//           Add New Driver
//         </Button>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {isLoading ? (
//           [1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)
//         ) : drivers?.length === 0 ? (
//           <div className="col-span-full py-20 text-center border-2 border-dashed rounded-xl border-muted">
//             <User className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
//             <h3 className="text-lg font-medium">No drivers found</h3>
//             <p className="text-muted-foreground">Start by adding your first delivery driver.</p>
//           </div>
//         ) : drivers?.map((driver: any) => (
//           <Card key={driver._id} className="overflow-hidden border-border/50 hover:shadow-lg transition-all duration-300 group">
//             <CardHeader className="flex flex-row items-center gap-4 pb-2 bg-muted/30">
//               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform">
//                 {driver.name ? driver.name[0].toUpperCase() : <User className="w-6 h-6" />}
//               </div>
//               <div className="flex-1">
//                 <CardTitle className="text-lg">{driver.name}</CardTitle>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant="outline" className={`text-[10px] ${driver.role === 'driver' ? 'bg-green-50 text-green-600 border-green-200' : ''}`}>
//                     {driver.role || 'Driver'}
//                   </Badge>
//                   <span className="flex items-center text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-0.5 rounded-full">
//                     <Star className="w-3 h-3 mr-1 fill-yellow-500" />
//                     {driver.rating || '5.0'}
//                   </span>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm pt-4">
//               <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
//                 <Phone className="w-4 h-4 text-primary/70" />
//                 {driver.phone || 'No phone number'}
//               </div>
//               <div className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors">
//                 <Mail className="w-4 h-4 text-primary/70" />
//                 <span className="truncate">{driver.email}</span>
//               </div>
//               <div className="pt-3 border-t border-border/50 flex justify-between items-center mt-4">
//                 <span className="text-muted-foreground text-xs uppercase tracking-wider font-semibold">Deliveries</span>
//                 <span className="font-bold flex items-center gap-1.5 text-primary">
//                   <Truck className="w-4 h-4" />
//                   {driver.totalDeliveries || 0}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <AddDriverDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
//     </Layout>
//   );
// }

// function AddDriverDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
//   const createMutation = useCreateDriver();
  
//   // استخدام useForm بدون Zod resolver
//   const form = useForm({
//     defaultValues: {
//       name: "",
//       phone: "",
//       email: "",
//       password: "", // أضفنا الباسوورد لأنه ضروري لعملية الـ Register في الـ Backend
//       role: "driver"
//     }
//   });

//   const onSubmit = async (data: any) => {
//     try {
//       await createMutation.mutateAsync(data);
//       onOpenChange(false);
//       form.reset();
//     } catch (error) {
//       console.error("Failed to register driver:", error);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle className="text-2xl font-bold">Register New Driver</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
//             <FormField
//               control={form.control}
//               name="name"
//               rules={{ required: "Name is required" }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Full Name</FormLabel>
//                   <FormControl><Input placeholder="Ex: John Doe" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               rules={{ 
//                 required: "Email is required",
//                 pattern: { value: /^\S+@\S+$/i, message: "Invalid email format" }
//               }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email Address</FormLabel>
//                   <FormControl><Input placeholder="driver@company.com" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="password"
//               rules={{ 
//                 required: "Password is required",
//                 minLength: { value: 7, message: "Minimum 7 characters" }
//               }}
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number (Optional)</FormLabel>
//                   <FormControl><Input placeholder="+1 234 567 890" {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
            
//             <div className="pt-2">
//               <Button type="submit" className="w-full py-6 text-lg shadow-md" disabled={createMutation.isPending}>
//                 {createMutation.isPending ? (
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                 ) : (
//                   <Truck className="w-5 h-5 mr-2" />
//                 )}
//                 Register Driver Account
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }













// import { useState } from "react";
// import { Layout } from "@/components/Layout";
// import { useDrivers, useCreateDriver } from "@/hooks/use-drivers";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { insertDriverSchema, type InsertDriver } from "@shared/schema";
// import { Plus, Phone, Mail, Star, Truck, Loader2 } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";

// export default function Drivers() {
//   const { data: drivers, isLoading } = useDrivers();
//   const [isAddOpen, setIsAddOpen] = useState(false);

//   return (
//     <Layout>
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-display font-bold text-foreground">Drivers</h1>
//           <p className="text-muted-foreground">Manage your delivery fleet.</p>
//         </div>
//         <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90">
//           <Plus className="w-4 h-4 mr-2" />
//           Add Driver
//         </Button>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {isLoading ? (
//           [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)
//         ) : drivers?.map((driver) => (
//           <Card key={driver.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
//             <CardHeader className="flex flex-row items-center gap-4 pb-2">
//               <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
//                 {driver.name[0]}
//               </div>
//               <div className="flex-1">
//                 <CardTitle className="text-lg">{driver.name}</CardTitle>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge variant={driver.status === 'available' ? 'default' : 'secondary'} className="text-[10px]">
//                     {driver.status}
//                   </Badge>
//                   <span className="flex items-center text-xs text-yellow-600 font-medium">
//                     <Star className="w-3 h-3 mr-1 fill-yellow-500" />
//                     {driver.rating}
//                   </span>
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="flex items-center gap-3 text-muted-foreground">
//                 <Phone className="w-4 h-4" />
//                 {driver.phone}
//               </div>
//               <div className="flex items-center gap-3 text-muted-foreground">
//                 <Mail className="w-4 h-4" />
//                 {driver.email || 'No email'}
//               </div>
//               <div className="pt-2 border-t border-border/50 flex justify-between items-center mt-4">
//                 <span className="text-muted-foreground">Total Deliveries</span>
//                 <span className="font-bold flex items-center gap-1">
//                   <Truck className="w-4 h-4 text-primary" />
//                   {driver.totalDeliveries}
//                 </span>
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       <AddDriverDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
//     </Layout>
//   );
// }

// function AddDriverDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (val: boolean) => void }) {
//   const createMutation = useCreateDriver();
//   const form = useForm<InsertDriver>({
//     resolver: zodResolver(insertDriverSchema),
//     defaultValues: {
//       name: "",
//       phone: "",
//       email: "",
//       status: "available",
//       rating: "5.0",
//       totalDeliveries: 0,
//     }
//   });

//   const onSubmit = async (data: InsertDriver) => {
//     await createMutation.mutateAsync(data);
//     onOpenChange(false);
//     form.reset();
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Register New Driver</DialogTitle>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Full Name</FormLabel>
//                   <FormControl><Input {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number</FormLabel>
//                   <FormControl><Input {...field} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email (Optional)</FormLabel>
//                   <FormControl><Input {...field} value={field.value || ''} /></FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" className="w-full" disabled={createMutation.isPending}>
//               {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
//               Register Driver
//             </Button>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
