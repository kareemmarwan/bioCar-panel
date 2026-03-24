import { Layout } from "@/components/Layout";
import { StatCard } from "@/components/StatCard";
import { useAnalytics } from "@/hooks/use-analytics"; // استيراد الهوك
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
  ResponsiveContainer
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Dashboard() {
  // ربط الهوك الحقيقي
  const { data, isLoading } = useAnalytics();

  return (
    <Layout>
      <div className="flex flex-col gap-1 mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your pharmacy performance and real-time metrics.</p>
      </div>

      {/* الإحصائيات العلوية - Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {isLoading ? (
          // عرض هياكل التحميل أثناء جلب البيانات
          [1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-32 rounded-xl" />)
        ) : (
          <>
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
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* الرسم البياني - Sales Chart */}
        <Card className="col-span-4 shadow-sm border-border/60 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <TrendingUp className="w-5 h-5 text-primary" />
              Monthly Sales Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full pt-4">
              {isLoading ? (
                <Skeleton className="w-full h-full rounded-lg" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.monthlySales || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9ca3af" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#9ca3af" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: 'rgba(var(--primary), 0.05)' }}
                    />
                    <Bar 
                      dataKey="value" 
                      fill="hsl(var(--primary))" 
                      radius={[6, 6, 0, 0]} 
                      barSize={45}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        {/* الطلبات الأخيرة - Recent Orders */}
        <Card className="col-span-3 shadow-sm border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Activity className="w-5 h-5 text-primary" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                [1, 2, 3, 4, 5].map((i) => <Skeleton key={i} className="h-16 w-full rounded-lg" />)
              ) : (
                (data?.recentOrders || []).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/40 transition-all group">
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">#{order.orderNumber}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {/* <span className="font-extrabold text-sm">${Number(order.totalAmount).toFixed(2)}</span> */}
                      <span className="font-extrabold text-sm">
  ${(Number(order.totalAmount) || 0).toFixed(2)}
</span>
                      <Badge 
                        className="text-[10px] px-2 py-0 h-5 shadow-sm"
                        variant={
                          order.status === 'delivered' ? 'default' : 
                          order.status === 'pending' ? 'secondary' : 
                          'outline'
                        }
                      >
                        {(order.status || 'pending').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
              {!isLoading && data?.recentOrders?.length === 0 && (
                 <div className="text-center py-10 text-muted-foreground text-sm">
                   No recent orders found.
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

