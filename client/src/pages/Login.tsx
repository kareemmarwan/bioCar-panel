import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pill, Activity, ShieldCheck, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const { login, isLoggingIn, isAuthenticated } = useAuth();
  const [location, setLocation] = useLocation(); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onSuccess: () =>{
        setLocation("/")},
        onError: (error: any) =>
          alert(error.response?.data?.message || "Login failed"),
      }
    );
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/90"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold font-display">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Pill className="w-8 h-8" />
            </div>
            PharmaCore
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
            Manage your pharmacy with precision.
          </h1>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Complete administrative control over inventory, orders, drivers, and analytics in one secure platform.
          </p>
          <div className="grid grid-cols-2 gap-6">
            <div className="flex gap-3">
              <Activity className="w-6 h-6 opacity-80" />
              <div>
                <h3 className="font-bold">Real-time Analytics</h3>
                <p className="text-sm opacity-70">Track sales live</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="w-6 h-6 opacity-80" />
              <div>
                <h3 className="font-bold">Secure Access</h3>
                <p className="text-sm opacity-70">Role-based control</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm opacity-60">
          © 2024 PharmaCore Admin System.
        </div>
      </div>

      {/* Right Side - Login */}
      <div className="flex items-center justify-center p-8 bg-background">
        <Card className="w-full max-w-md border-none shadow-none lg:border lg:shadow-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold font-display">
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to your administrative account
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit} className="grid gap-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />

              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12"
              />

              <Button
                type="submit"
                disabled={isLoggingIn}
                className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group"
              >
                {isLoggingIn ? "Signing in..." : "Sign In"}
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Secure Access
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our Terms of Service and Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}











// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Pill, Activity, ShieldCheck, ArrowRight } from "lucide-react";

// export default function Login() {
//   return (
//     <div className="min-h-screen grid lg:grid-cols-2">
//       {/* Left Side - Hero */}
//       <div className="hidden lg:flex flex-col justify-between bg-primary p-12 text-primary-foreground relative overflow-hidden">
//         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1576091160550-217358c7e618?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-multiply"></div>
//         <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary/90"></div>
        
//         {/* Descriptive comment for the background image: Medical lab abstract background */}
        
//         <div className="relative z-10">
//           <div className="flex items-center gap-3 text-2xl font-bold font-display">
//             <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
//               <Pill className="w-8 h-8" />
//             </div>
//             PharmaCore
//           </div>
//         </div>

//         <div className="relative z-10 max-w-lg">
//           <h1 className="text-5xl font-display font-bold mb-6 leading-tight">
//             Manage your pharmacy with precision.
//           </h1>
//           <p className="text-primary-foreground/80 text-lg mb-8">
//             Complete administrative control over inventory, orders, drivers, and analytics in one secure platform.
//           </p>
//           <div className="grid grid-cols-2 gap-6">
//             <div className="flex gap-3">
//               <Activity className="w-6 h-6 opacity-80" />
//               <div>
//                 <h3 className="font-bold">Real-time Analytics</h3>
//                 <p className="text-sm opacity-70">Track sales live</p>
//               </div>
//             </div>
//             <div className="flex gap-3">
//               <ShieldCheck className="w-6 h-6 opacity-80" />
//               <div>
//                 <h3 className="font-bold">Secure Access</h3>
//                 <p className="text-sm opacity-70">Role-based control</p>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         <div className="relative z-10 text-sm opacity-60">
//           © 2024 PharmaCore Admin System.
//         </div>
//       </div>

//       {/* Right Side - Login */}
//       <div className="flex items-center justify-center p-8 bg-background">
//         <Card className="w-full max-w-md border-none shadow-none lg:border lg:shadow-sm">
//           <CardHeader className="space-y-1">
//             <CardTitle className="text-2xl font-bold font-display">Welcome back</CardTitle>
//             <CardDescription>
//               Sign in to your administrative account
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="grid gap-4">
//             <Button 
//               className="w-full h-12 text-lg font-medium bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 group"
//               onClick={() => window.location.href = "/api/login"}
//             >
//               Sign In with Replit Auth
//               <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
//             </Button>
            
//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <span className="w-full border-t" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-background px-2 text-muted-foreground">
//                   Secure Access
//                 </span>
//               </div>
//             </div>

//             <p className="text-center text-sm text-muted-foreground">
//               By clicking continue, you agree to our Terms of Service and Privacy Policy.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
