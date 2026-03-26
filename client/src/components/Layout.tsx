



// import { Sidebar } from "./Sidebar";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useAuth } from "@/hooks/use-auth";
// import { Loader2 } from "lucide-react";
// import { Redirect } from "wouter";

// export function Layout({ children }: { children: React.ReactNode }) {
//   const { user, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="h-screen w-full flex items-center justify-center bg-background">
//         <Loader2 className="w-10 h-10 text-primary animate-spin" />
//       </div>
//     );
//   }

//   if (!user) {
//     return <Redirect to="/login" />;
//   }

//   return (
//     <div className="flex h-screen bg-background overflow-hidden">
//       <Sidebar />
      
//       {/* التعديل هنا: الـ ml-0 للموبايل و ml-64 للشاشات الكبيرة فقط */}
//       <main className="flex-1 ml-0 lg:ml-64 flex flex-col h-screen overflow-hidden bg-muted/10">
        
//         {/* التعديل هنا: تقليل الـ padding في الموبايل px-4 وزيادته في الشاشات الكبيرة px-8 */}
//         <ScrollArea className="flex-1 px-4 md:px-8 py-6 md:py-8">
//           <div className="max-w-7xl mx-auto space-y-8 pb-10">
//             {children}
//           </div>
//         </ScrollArea>
//       </main>
//     </div>
//   );
// }

import { Sidebar } from "./Sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect } from "wouter";

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 ml-0 lg:ml-64 flex flex-col h-screen overflow-hidden bg-muted/10">
        
        <ScrollArea className="flex-1">
          {/* pt-20 في الموبايل لتعطي مسافة رائعة أسفل شريط الـ Navbar العلوي الجديد */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 pt-20 lg:pt-8 pb-10 space-y-8">
            {children}
          </div>
        </ScrollArea>
      </main>
    </div>
  );
}