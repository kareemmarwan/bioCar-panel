import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Eye, Truck, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState("all");
  const { data, isLoading } = useOrders({ 
    status: statusFilter === "all" ? undefined : statusFilter,
    page: "1",
    limit: "20"
  });
  
  const updateStatus = useUpdateOrderStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700 hover:bg-green-100 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200';
      case 'out_for_delivery': return 'bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200';
      case 'cancelled': return 'bg-red-100 text-red-700 hover:bg-red-100 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold text-foreground">Orders</h1>
        <p className="text-muted-foreground">Track and manage customer orders.</p>
      </div>

      <Tabs defaultValue="all" onValueChange={setStatusFilter} className="w-full">
        <TabsList className="bg-card border border-border/50 p-1">
          <TabsTrigger value="all">All Orders</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="preparing">Preparing</TabsTrigger>
          <TabsTrigger value="out_for_delivery">Out for Delivery</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading orders...
                    </div>
                  </TableCell>
                </TableRow>
              ) : data?.items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono">{order.orderNumber}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt && format(new Date(order.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="font-medium">{order.customerName}</TableCell>
                    <TableCell>${order.totalAmount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusColor(order.status)}>
                        {order.status.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={order.paymentStatus === 'paid' ? 'border-green-200 text-green-700' : 'border-yellow-200 text-yellow-700'}>
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            title="Accept Order"
                            onClick={() => updateStatus.mutate({ id: order.id, status: 'preparing' })}
                          >
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </Button>
                        )}
                         {order.status === 'preparing' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 w-8 p-0"
                            title="Dispatch"
                            onClick={() => updateStatus.mutate({ id: order.id, status: 'out_for_delivery' })}
                          >
                            <Truck className="w-4 h-4 text-blue-600" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Layout>
  );
}
