import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useDrivers, useCreateDriver } from "@/hooks/use-drivers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertDriverSchema, type InsertDriver } from "@shared/schema";
import { Plus, Phone, Mail, Star, Truck, Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Drivers() {
  const { data: drivers, isLoading } = useDrivers();
  const [isAddOpen, setIsAddOpen] = useState(false);

  return (
    <Layout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Drivers</h1>
          <p className="text-muted-foreground">Manage your delivery fleet.</p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="bg-primary hover:bg-primary/90">
          <Plus className="w-4 h-4 mr-2" />
          Add Driver
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          [1, 2, 3].map(i => <Skeleton key={i} className="h-48 rounded-xl" />)
        ) : drivers?.map((driver) => (
          <Card key={driver.id} className="overflow-hidden border-border/50 hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {driver.name[0]}
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg">{driver.name}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={driver.status === 'available' ? 'default' : 'secondary'} className="text-[10px]">
                    {driver.status}
                  </Badge>
                  <span className="flex items-center text-xs text-yellow-600 font-medium">
                    <Star className="w-3 h-3 mr-1 fill-yellow-500" />
                    {driver.rating}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-muted-foreground">
                <Phone className="w-4 h-4" />
                {driver.phone}
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Mail className="w-4 h-4" />
                {driver.email || 'No email'}
              </div>
              <div className="pt-2 border-t border-border/50 flex justify-between items-center mt-4">
                <span className="text-muted-foreground">Total Deliveries</span>
                <span className="font-bold flex items-center gap-1">
                  <Truck className="w-4 h-4 text-primary" />
                  {driver.totalDeliveries}
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
  const form = useForm<InsertDriver>({
    resolver: zodResolver(insertDriverSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      status: "available",
      rating: "5.0",
      totalDeliveries: 0,
    }
  });

  const onSubmit = async (data: InsertDriver) => {
    await createMutation.mutateAsync(data);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register New Driver</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Optional)</FormLabel>
                  <FormControl><Input {...field} value={field.value || ''} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={createMutation.isPending}>
              {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Register Driver
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
