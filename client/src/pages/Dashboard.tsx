import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { useAnalytics } from "@/hooks/use-analytics";
import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle,
  TrendingUp,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Dashboard() {
  const { data, isLoading } = useAnalytics();

  return (
    <Layout>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-display font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your pharmacy performance.</p>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Revenue"
            value={`$${Number(data?.totalRevenue || 0).toLocaleString()}`}
            icon={DollarSign}
            color="primary"
            trend="up"
            trendValue="+12.5%"
            description="vs last month"
            delay={0.1}
          />
          <StatCard
            title="Total Orders"
            value={data?.totalOrders || 0}
            icon={ShoppingCart}
            color="default"
            trend="up"
            trendValue="+4.3%"
            description="vs last month"
            delay={0.2}
          />
          <StatCard
            title="Total Products"
            value={data?.totalProducts || 0}
            icon={Package}
            color="default"
            description="Active inventory items"
            delay={0.3}
          />
          <StatCard
            title="Low Stock Alert"
            value={data?.lowStockProducts || 0}
            icon={AlertTriangle}
            color="destructive"
            description="Items below threshold"
            delay={0.4}
          />
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Sales
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px] w-full">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.monthlySales || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#888888" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))" 
                      radius={[4, 4, 0, 0]} 
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3 shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
              ) : (
                data?.recentOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/60 transition-colors">
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm text-foreground">{order.customerName}</span>
                      <span className="text-xs text-muted-foreground">Order #{order.orderNumber}</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-bold text-sm">${order.totalAmount}</span>
                      <Badge variant={
                        order.status === 'delivered' ? 'default' : 
                        order.status === 'pending' ? 'secondary' : 
                        'outline'
                      } className="text-[10px] px-1.5 py-0 h-5">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              {(!data?.recentOrders || data.recentOrders.length === 0) && (
                <div className="text-center py-8 text-muted-foreground text-sm">No recent orders found.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
