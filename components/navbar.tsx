"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, User, LogOut, Settings, Heart, Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { getUserRole, type UserRole } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { GlobalSearch } from "@/components/global-search";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function Navbar() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      // Cargar usuario inicial
      const loadUser = async () => {
        try {
          const { data: { user }, error } = await supabase.auth.getUser();
          if (error) {
            console.error("Error getting user:", error);
            setUser(null);
            setUserRole(null);
            return;
          }
          setUser(user);
          if (user) {
            const role = await getUserRole();
            setUserRole(role);
          } else {
            setUserRole(null);
          }
        } catch (error) {
          console.error("Error loading user:", error);
          setUser(null);
          setUserRole(null);
        }
      };

      loadUser();

      // Escuchar cambios en el estado de autenticación
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email || "sin usuario");
        console.log("Sesión completa:", session ? "existe" : "no existe");
        
        setUser(session?.user ?? null);
        if (session?.user) {
          console.log("Usuario autenticado, obteniendo rol...");
          const role = await getUserRole();
          setUserRole(role);
          console.log("Rol obtenido:", role);
        } else {
          setUserRole(null);
        }
        
        // Si el evento es SIGNED_IN, recargar la página para actualizar el estado
        if (event === 'SIGNED_IN' && session?.user) {
          console.log("Usuario inició sesión, recargando página...");
          setTimeout(() => {
            window.location.reload();
          }, 500);
        }
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
    <nav className="sticky top-0 z-50 border-b border-primary/10 bg-white/98 backdrop-blur-md supports-[backdrop-filter]:bg-white/95 shadow-sm" role="navigation" aria-label="Navegación principal">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <Logo showText={true} size="md" />

          {/* Búsqueda Global - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <GlobalSearch />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2 lg:gap-3">
            <Link href="/">
              <Button
                variant={pathname === "/" ? "default" : "ghost"}
                size="sm"
                className={pathname === "/" ? "font-semibold shadow-md" : "font-medium"}
                aria-label="Ver productos"
              >
                Productos
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                variant={pathname === "/contacto" ? "default" : "ghost"}
                size="sm"
                className={pathname === "/contacto" ? "font-semibold shadow-md" : "font-medium"}
                aria-label="Ir a contacto"
              >
                <Phone className="h-4 w-4 mr-1.5" aria-hidden="true" />
                Contacto
              </Button>
            </Link>

            {user && (
              <>
                {/* Mostrar opciones de cliente solo si NO es admin ni seller */}
                {userRole !== "admin" && userRole !== "seller" && (
                  <>
                    <Link href="/wishlist">
                      <Button
                        variant={pathname === "/wishlist" ? "default" : "ghost"}
                        size="sm"
                        className={pathname === "/wishlist" ? "font-semibold shadow-md" : "font-medium"}
                        aria-label="Ver mis favoritos"
                      >
                        <Heart className="h-4 w-4 mr-1.5" aria-hidden="true" />
                        Favoritos
                      </Button>
                    </Link>
                    <Link href="/orders">
                      <Button
                        variant={pathname === "/orders" ? "default" : "ghost"}
                        size="sm"
                        className={pathname === "/orders" ? "font-semibold shadow-md" : "font-medium"}
                        aria-label="Ver mis pedidos"
                      >
                        Mis Pedidos
                      </Button>
                    </Link>
                    <Link href="/perfil">
                      <Button
                        variant={pathname === "/perfil" ? "default" : "ghost"}
                        size="sm"
                        className={pathname === "/perfil" ? "font-semibold shadow-md" : "font-medium"}
                        aria-label="Ver mi perfil"
                      >
                        <User className="h-4 w-4 mr-1.5" aria-hidden="true" />
                        Mi Perfil
                      </Button>
                    </Link>
                  </>
                )}
                {/* Mostrar panel admin solo si es admin o seller */}
                {(userRole === "admin" || userRole === "seller") && (
                  <Link href="/admin">
                    <Button
                      variant={pathname.startsWith("/admin") ? "default" : "ghost"}
                      size="sm"
                      className={pathname.startsWith("/admin") ? "font-semibold shadow-md" : "font-medium"}
                      aria-label="Panel de administración"
                    >
                      <Settings className="h-4 w-4 mr-1.5" aria-hidden="true" />
                      Admin
                    </Button>
                  </Link>
                )}
              </>
            )}

            {/* Separador visual */}
            <div className="hidden md:block h-6 w-px bg-primary/20 mx-2" aria-hidden="true" />

            {/* Ocultar carrito para admin y seller */}
            {userRole !== "admin" && userRole !== "seller" && (
              <Link href="/cart" className="relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all"
                  aria-label={`Carrito de compras${itemCount > 0 ? ` con ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}` : ''}`}
                >
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground shadow-md animate-pulse" aria-hidden="true">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            {/* Toggle de tema */}
            <ThemeToggle />
            
            {user ? (
              <div className="hidden lg:flex items-center gap-2 ml-2">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-primary/5 border border-primary/10">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" aria-hidden="true" />
                  <span className="text-sm font-medium text-foreground hidden xl:inline" aria-label={`Usuario: ${user.email}`}>
                    {user.email}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="hover:bg-primary/10 hover:text-primary transition-all"
                  onClick={handleLogout} 
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <Link href="/auth/login" className="hidden md:block">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="font-medium hover:bg-primary/10 hover:text-primary transition-all"
                >
                  <User className="h-4 w-4 mr-2" aria-hidden="true" />
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Carrito en móvil */}
            {userRole !== "admin" && userRole !== "seller" && (
              <Link href="/cart" className="relative">
                <Button variant="outline" size="icon" aria-label={`Carrito${itemCount > 0 ? ` con ${itemCount} productos` : ''}`}>
                  <ShoppingCart className="h-5 w-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground" aria-hidden="true">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Abrir menú">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] sm:w-[400px] bg-gradient-to-b from-white to-primary/5 p-0">
                <SheetHeader className="border-b-2 border-primary/20 bg-white px-6 py-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Menu className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <SheetTitle className="text-primary text-2xl font-bold">Menú</SheetTitle>
                      <SheetDescription className="text-muted-foreground mt-1">
                        Navegación principal
                      </SheetDescription>
                    </div>
                  </div>
                </SheetHeader>
                <div className="px-4 py-6 flex flex-col gap-2">
                  {/* Búsqueda Global - Mobile */}
                  <div className="mb-4">
                    <GlobalSearch />
                  </div>
                  
                  <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant={pathname === "/" ? "default" : "ghost"} 
                      className={`w-full justify-start font-semibold h-12 text-base ${pathname === "/" ? "shadow-md" : "hover:bg-primary/10"}`}
                    >
                      Productos
                    </Button>
                  </Link>
                  <Link href="/contacto" onClick={() => setMobileMenuOpen(false)}>
                    <Button 
                      variant={pathname === "/contacto" ? "default" : "ghost"} 
                      className={`w-full justify-start font-semibold h-12 text-base ${pathname === "/contacto" ? "shadow-md" : "hover:bg-primary/10"}`}
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Contacto
                    </Button>
                  </Link>

                  {user && (
                    <>
                      {userRole !== "admin" && userRole !== "seller" && (
                        <>
                          <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)}>
                            <Button 
                              variant={pathname === "/wishlist" ? "default" : "ghost"} 
                              className={`w-full justify-start font-semibold h-12 text-base ${pathname === "/wishlist" ? "shadow-md" : "hover:bg-primary/10"}`}
                            >
                              <Heart className="h-5 w-5 mr-2" />
                              Favoritos
                            </Button>
                          </Link>
                          <Link href="/orders" onClick={() => setMobileMenuOpen(false)}>
                            <Button 
                              variant={pathname === "/orders" ? "default" : "ghost"} 
                              className={`w-full justify-start font-semibold h-12 text-base ${pathname === "/orders" ? "shadow-md" : "hover:bg-primary/10"}`}
                            >
                              Mis Pedidos
                            </Button>
                          </Link>
                          <Link href="/perfil" onClick={() => setMobileMenuOpen(false)}>
                            <Button 
                              variant={pathname === "/perfil" ? "default" : "ghost"} 
                              className={`w-full justify-start font-semibold h-12 text-base ${pathname === "/perfil" ? "shadow-md" : "hover:bg-primary/10"}`}
                            >
                              <User className="h-5 w-5 mr-2" />
                              Mi Perfil
                            </Button>
                          </Link>
                        </>
                      )}
                      {(userRole === "admin" || userRole === "seller") && (
                        <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                          <Button 
                            variant={pathname.startsWith("/admin") ? "default" : "ghost"} 
                            className={`w-full justify-start font-semibold h-12 text-base ${pathname.startsWith("/admin") ? "shadow-md" : "hover:bg-primary/10"}`}
                          >
                            <Settings className="h-5 w-5 mr-2" />
                            Admin
                          </Button>
                        </Link>
                      )}
                      <div className="border-t-2 border-primary/20 pt-6 mt-4">
                        <div className="px-4 py-3 text-sm font-semibold text-foreground mb-3 bg-primary/10 rounded-lg border border-primary/20 flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                          {user.email}
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start font-semibold h-12 text-base text-destructive hover:text-destructive hover:bg-destructive/10 border border-destructive/20" 
                          onClick={handleLogout}
                        >
                          <LogOut className="h-5 w-5 mr-2" />
                          Cerrar Sesión
                        </Button>
                      </div>
                    </>
                  )}

                  {!user && (
                    <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="default" className="w-full justify-start font-semibold h-12 text-base shadow-md">
                        <User className="h-5 w-5 mr-2" />
                        Iniciar Sesión
                      </Button>
                    </Link>
                  )}
                  
                  {/* Toggle de tema en móvil */}
                  <div className="border-t-2 border-primary/20 pt-4 mt-4">
                    <div className="flex items-center justify-between px-4 py-2">
                      <span className="text-sm font-semibold">Tema</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

