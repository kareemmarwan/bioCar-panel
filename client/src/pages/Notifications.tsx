import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Bell, 
  Package, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MoreHorizontal,
  Check,
  Trash2,
  BellOff
} from "lucide-react";
import { useState } from "react";

type NotificationType = 'order' | 'stock' | 'system' | 'success';

type Notification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  time: string;
  isRead: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #ORD-7721 has been placed by Ahmed Mohamed.",
    type: "order",
    time: "2 mins ago",
    isRead: false,
  },
  {
    id: "2",
    title: "Critical: Low Stock Alert",
    message: "Panadol Advance 500mg is below the minimum threshold (5 items left).",
    type: "stock",
    time: "1 hour ago",
    isRead: false,
  },
  {
    id: "3",
    title: "System Maintenance",
    message: "Scheduled maintenance completed successfully. All systems are go.",
    type: "success",
    time: "5 hours ago",
    isRead: true,
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState("all");

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'order': return <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Package className="w-5 h-5" /></div>;
      case 'stock': return <div className="p-2 bg-red-100 text-red-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>;
      case 'success': return <div className="p-2 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>;
      default: return <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Clock className="w-5 h-5" /></div>;
    }
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8 py-6">
        
        {/* --- Header Section --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-4xl font-display font-black text-foreground tracking-tight">
              Notifications
            </h1>
            <p className="text-muted-foreground text-lg">
              Stay updated with your pharmacy's latest activities.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-10 font-semibold shadow-sm hover:bg-primary/5">
              <Check className="w-4 h-4 mr-2" /> Mark All Read
            </Button>
            <Button variant="ghost" size="sm" className="h-10 text-destructive hover:bg-destructive/5">
              <Trash2 className="w-4 h-4 mr-2" /> Clear All
            </Button>
          </div>
        </div>

        {/* --- Filter Tabs --- */}
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between border-b pb-px">
            <TabsList className="h-auto p-0 bg-transparent gap-6 rounded-none border-b-0">
              <TabsTrigger 
                value="all" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-bold transition-all"
              >
                All Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="unread" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-bold transition-all relative"
              >
                Unread
                <Badge className="ml-2 bg-primary text-primary-foreground h-5 min-w-5 flex items-center justify-center">2</Badge>
              </TabsTrigger>
              <TabsTrigger 
                value="archived" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3 font-bold transition-all"
              >
                Archived
              </TabsTrigger>
            </TabsList>
          </div>

          {/* --- Notifications Content --- */}
          <div className="mt-6 space-y-4">
            {mockNotifications.length > 0 ? (
              mockNotifications.map((n) => (
                <Card 
                  key={n.id} 
                  className={`group relative overflow-hidden transition-all duration-200 hover:shadow-md border-border/50 ${
                    !n.isRead ? "bg-primary/[0.02] border-l-4 border-l-primary" : "bg-card border-l-4 border-l-transparent"
                  }`}
                >
                  <CardContent className="p-5 flex items-start gap-5">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(n.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <h3 className={`text-base tracking-tight truncate ${!n.isRead ? "font-black text-foreground" : "font-semibold text-muted-foreground"}`}>
                            {n.title}
                          </h3>
                          {!n.isRead && <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />}
                        </div>
                        <time className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {n.time}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                        {n.message}
                      </p>
                    </div>

                    <div className="flex-shrink-0 self-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <MoreHorizontal className="w-5 h-5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem className="cursor-pointer">
                            <Check className="w-4 h-4 mr-2" /> Mark as read
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <BellOff className="w-4 h-4 mr-2" /> Mute alerts
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/5 focus:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              /* --- Professional Empty State --- */
              <div className="flex flex-col items-center justify-center py-24 text-center space-y-4 bg-muted/20 rounded-3xl border-2 border-dashed border-border/60">
                <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center shadow-sm">
                  <Bell className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-bold">Your Inbox is Empty</h3>
                  <p className="text-muted-foreground max-w-xs">
                    We'll notify you when something important happens in your store.
                  </p>
                </div>
                <Button variant="outline" className="mt-2 font-bold">
                  Notification Settings
                </Button>
              </div>
            )}
          </div>
        </Tabs>
      </div>
    </Layout>
  );
}