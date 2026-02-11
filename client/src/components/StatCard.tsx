import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "default" | "primary" | "warning" | "destructive";
  delay?: number;
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  trendValue,
  color = "default",
  delay = 0 
}: StatCardProps) {
  
  const colorStyles = {
    default: "text-muted-foreground",
    primary: "text-primary",
    warning: "text-orange-500",
    destructive: "text-red-500"
  };

  const bgStyles = {
    default: "bg-muted/50",
    primary: "bg-primary/10",
    warning: "bg-orange-500/10",
    destructive: "bg-red-500/10"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
    >
      <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-300 group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn("p-2 rounded-full transition-colors", bgStyles[color])}>
            <Icon className={cn("h-4 w-4", colorStyles[color])} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-display font-bold text-foreground">{value}</div>
          {(description || trendValue) && (
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              {trend && (
                <span className={cn(
                  "font-medium",
                  trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"
                )}>
                  {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
                </span>
              )}
              <span className="opacity-80">{description}</span>
            </p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
