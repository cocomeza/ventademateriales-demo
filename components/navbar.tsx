"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, LogOut, Settings, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        setUser(user);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, []);

  const handleLogout = async () => {
    if (isSupabaseConfigured() && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    router.push("/");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">MaterialesYA</span>
          </Link>

          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
              >
                Productos
              </Button>
            </Link>

            {user && (
              <>
                <Link href="/wishlist">
                  <Button
                    variant={pathname === "/wishlist" ? "default" : "ghost"}
                    size="sm"
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Deseos
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button
                    variant={pathname === "/orders" ? "default" : "ghost"}
                    size="sm"
                  >
                    Mis Pedidos
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button
                    variant={pathname.startsWith("/admin") ? "default" : "ghost"}
                    size="sm"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                </Link>
              </>
            )}

            <Link href="/cart" className="relative">
              <Button variant="outline" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

