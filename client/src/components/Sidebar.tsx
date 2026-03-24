// import { Link, useLocation } from "wouter";
// import { cn } from "@/lib/utils";
// import { useAuth } from "@/hooks/use-auth";
// import {
//   LayoutDashboard,
//   Package,
//   ShoppingCart,
//   Users,
//   LogOut,
//   Pill,
//   Settings,
//   Bell,
//   Layers,
// } from "lucide-react";

// export function Sidebar() {
//   const [location] = useLocation();
//   const { user, logout } = useAuth();

//   const navItems = [
//     { label: "Dashboard", href: "/", icon: LayoutDashboard },
//     { label: "Categories", href: "/categories", icon: Layers },
//     { label: "Products", href: "/products", icon: Pill },
//     { label: "Orders", href: "/orders", icon: ShoppingCart },
//     { label: "Drivers", href: "/drivers", icon: Users },
//     { label: "shipping Areas", href: "/shippingareas", icon: Package },
//     { label: "Notifications", href: "/notifications", icon: Bell },
//   ];

//   return (
//     <aside className="w-64 flex flex-col h-screen border-r bg-card fixed left-0 top-0 z-40 shadow-sm">
//       <div className="p-6 flex items-center gap-3 border-b border-border/50">
//         <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
//           <Pill className="text-primary-foreground w-5 h-5" />
//         </div>
//         <div>
//           <h1 className="font-display font-bold text-lg tracking-tight leading-none text-foreground">
//             PharmaCore
//           </h1>
//           <p className="text-xs text-muted-foreground font-medium">Admin Dashboard</p>
//         </div>
//       </div>

//       <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
//         {navItems.map((item) => {
//           const isActive = location === item.href;
//           return (
//             <Link key={item.href} href={item.href}>
//               <div
//                 className={cn(
//                   "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer",
//                   isActive
//                     ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
//                     : "text-muted-foreground hover:bg-muted hover:text-foreground"
//                 )}
//               >
//                 <item.icon
//                   className={cn(
//                     "w-5 h-5 transition-colors",
//                     isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
//                   )}
//                 />
//                 {item.label}
//               </div>
//             </Link>
//           );
//         })}
//       </nav>

//       <div className="p-4 border-t border-border/50 bg-muted/20">
//         <div className="flex items-center gap-3 mb-4 px-2">
//           <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
//             {user?.firstName?.[0] || user?.email?.[0] || "A"}
//           </div>
//           <div className="flex-1 min-w-0">
//             <p className="text-sm font-semibold text-foreground truncate">
//               {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin User'}
//             </p>
//             <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
//           </div>
//         </div>
//         <button
//           onClick={() => logout()}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-all duration-200"
//         >
//           <LogOut className="w-4 h-4" />
//           Sign Out
//         </button>
//       </div>
//     </aside>
//   );
// }



import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Pill,
  Menu,
  X,
  Layers,
  Bell,
} from "lucide-react";

export function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false); // حالة فتح وإغلاق القائمة في الموبايل

  const navItems = [
    { label: "Dashboard", href: "/", icon: LayoutDashboard },
    { label: "Categories", href: "/categories", icon: Layers },
    { label: "Products", href: "/products", icon: Pill },
    { label: "Orders", href: "/orders", icon: ShoppingCart },
    { label: "Drivers", href: "/drivers", icon: Users },
    { label: "shipping Areas", href: "/shippingareas", icon: Package },
    { label: "Notifications", href: "/notifications", icon: Bell },
  ];

  return (
    <>
      {/* زر الهامبرغر - يظهر فقط في الموبايل */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border shadow-sm text-foreground active:scale-95 transition-transform"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* غطاء خلفي (Backdrop) عند فتح القائمة في الموبايل لإغلاقها بالضغط في أي مكان خارجها */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* الـ Sidebar الأساسي */}
      <aside
        className={cn(
          "w-64 flex flex-col h-screen border-r bg-card fixed left-0 top-0 z-40 shadow-sm transition-transform duration-300 ease-in-out",
          // إذا كانت الشاشة موبايل، ندفعه لليسار ليختفي، وفي الشاشات الكبيرة يرجع لمكانه الطبيعي
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
              <Pill className="text-primary-foreground w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lg tracking-tight leading-none text-foreground">
                PharmaCore
              </h1>
              <p className="text-xs text-muted-foreground font-medium">Admin Dashboard</p>
            </div>
          </div>

          {/* زر الإغلاق (X) يظهر فقط في الموبايل */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-1.5 rounded-md hover:bg-muted text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div
                  onClick={() => setIsOpen(false)} // يغلق السايدبار عند الضغط على رابط في الموبايل
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group cursor-pointer",
                    isActive
                      ? "bg-primary/10 text-primary shadow-sm ring-1 ring-primary/20"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-5 h-5 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                    )}
                  />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50 bg-muted/20">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shadow-sm">
              {user?.firstName?.[0] || user?.email?.[0] || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted text-sm font-medium text-foreground transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}