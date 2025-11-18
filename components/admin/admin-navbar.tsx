'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Package, Users, ShoppingBag, FileDown, Home, Warehouse, Tag, DollarSign, FolderTree, Bell, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function AdminNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/admin/products", icon: Package, label: "Productos" },
    { href: "/admin/orders", icon: ShoppingBag, label: "Pedidos" },
    { href: "/admin/customers", icon: Users, label: "Clientes" },
    { href: "/admin/inventory", icon: Warehouse, label: "Inventario" },
    { href: "/admin/stock-alerts", icon: Bell, label: "Alertas Stock" },
    { href: "/admin/categories", icon: FolderTree, label: "Categorías" },
    { href: "/admin/customer-prices", icon: DollarSign, label: "Precios Cliente" },
    { href: "/admin/import-export", icon: FileDown, label: "Importar/Exportar" },
  ];

  return (
    <div className="border-b">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">
          {/* Logo/Título - Responsive */}
          <Link href="/admin" className="text-lg sm:text-xl md:text-2xl font-bold truncate">
            <span className="hidden sm:inline">Panel de Administración</span>
            <span className="sm:hidden">Admin</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant="ghost" size="sm" className="text-xs xl:text-sm">
                    <Icon className="h-3 w-3 xl:h-4 xl:w-4 mr-1 xl:mr-2" />
                    <span className="hidden xl:inline">{item.label}</span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button and Desktop Home Button */}
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Volver al sitio</span>
                <span className="sm:hidden">Home</span>
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menú de Administración</SheetTitle>
                  <SheetDescription>
                    Navega a las diferentes secciones del panel
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-2">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  );
}

