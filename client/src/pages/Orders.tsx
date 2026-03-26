
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useOrders, useUpdateOrder, useDriversList } from "@/hooks/use-orders";
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
import { Loader2, Truck, CheckCircle, FileText, ExternalLink, MapPin, UserPlus } from "lucide-react";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";


export default function Orders() {
  const [statusFilter, setStatusFilter] = useState("all");
  
  const { data: orders, isLoading } = useOrders({ 
    status: statusFilter === "all" ? undefined : statusFilter
  });

  const { data: drivers } = useDriversList();
  const updateOrder = useUpdateOrder();

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    switch (s) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'assigned': return 'bg-indigo-100 text-indigo-700 border-indigo-200'; // لون مميز للتعيين
      case 'accepted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'ondelivery': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateInput: any) => {
    if (!dateInput) return "N/A";
    const dateStr = dateInput.$date ? dateInput.$date : dateInput;
    try {
      return format(new Date(dateStr), "MMM d, yyyy HH:mm");
    } catch (e) {
      return "Invalid Date";
    }
  };

  return (
    <Layout>
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">Monitor and manage the delivery lifecycle from assignment to completion.</p>
      </div>

      <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full mb-6">
        <TabsList className="bg-card border border-border/50 p-1">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger> 
          <TabsTrigger value="accepted">Accepted</TabsTrigger>          
          <TabsTrigger value="onDelivery">Shipping</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[150px]">Date & Time</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status Control</TableHead>
                <TableHead>Driver Assignment</TableHead>
                <TableHead className="text-right">Quick Actions</TableHead>
              </TableRow>
            </TableHeader>
            
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </TableCell>
                </TableRow>
              ) : (
                orders?.map((order: any) => (
                  <TableRow key={order._id || order.dbId} className="hover:bg-muted/30">
                    <TableCell className="text-xs">{formatDate(order.createdAt)}</TableCell>
                    
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">{order.customerName}</span>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{order.customerAddress}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="font-bold text-sm">
                      ${(order.totalAmount || order.total || 0).toFixed(2)}
                    </TableCell>
                    
                    {/* Status Control */}
                    <TableCell>
                      <select
                        className={`text-[10px] font-bold px-2 py-1 rounded border bg-transparent cursor-pointer outline-none appearance-none text-center ${getStatusColor(order.status)}`}
                        value={order.status}
                        onChange={(e) => updateOrder.mutate({ id: order._id || order.dbId, status: e.target.value })}
                      >
                        <option value="pending">PENDING</option>
                        <option value="assigned">ASSIGNED</option>
                        <option value="accepted">ACCEPTED</option>
                        <option value="onDelivery">ON DELIVERY</option>
                        <option value="delivered">DELIVERED</option>
                        <option value="cancelled">CANCELLED</option>
                      </select>
                    </TableCell>

                    {/* Driver Assignment Logic */}
                    <TableCell>
                      {/* نسمح بتعيين سائق فقط إذا كان الطلب بانتظار المراجعة أو تم تعيينه بالفعل */}
                      {(order.status === 'pending' || order.status === 'assigned') ? (
                        <div className="flex items-center gap-2">
                          <select 
                            className="text-[11px] border rounded h-8 w-full max-w-[130px] bg-background px-1"
                            value={typeof order.assignedDriver === 'string' ? order.assignedDriver : order.assignedDriver?._id || ""}
                            onChange={(e) => {
                              // عند اختيار سائق، نقوم بتغيير الحالة تلقائياً إلى assigned
                              updateOrder.mutate({ 
                                id: order._id || order.dbId, 
                                assignedDriver: e.target.value,
                                status: 'assigned' 
                              });
                            }}
                          >
                            <option value="">Select Driver...</option>
                            {drivers?.map((d: any) => (
                              <option key={d._id} value={d._id}>{d.name}</option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="text-[11px] flex items-center gap-1.5 text-muted-foreground">
                          {order.assignedDriver ? (
                            <>
                              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                              <span className="font-medium">
                                {typeof order.assignedDriver === 'object' ? order.assignedDriver.name : 'Assigned'}
                              </span>
                            </>
                          ) : (
                            <span className="italic opacity-50">No Driver</span>
                          )}
                        </div>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1.5">
                        {/* زر سريع للموافقة المبدئية */}
                        {order.status === 'pending' && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-[10px] gap-1 border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                            onClick={() => updateOrder.mutate({ id: order._id || order.dbId, status: 'assigned' })}
                          >
                            <UserPlus className="w-3.5 h-3.5" />
                            Ready to Assign
                          </Button>
                        )}
                        
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
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