"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EditProfileForm } from "@/components/edit-profile-form";
import { ChangePasswordForm } from "@/components/change-password-form";
import { User, Lock, Package, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { User as UserType } from "@supabase/supabase-js";

interface UserProfileProps {
  user: UserType;
  profileData: any;
}

export function UserProfile({ user, profileData }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "password">("profile");

  const fullName = profileData?.full_name || user.user_metadata?.full_name || "";
  const phone = profileData?.phone || "";
  const address = profileData?.address || "";

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-2 border-b border-primary/20">
        <Button
          variant={activeTab === "profile" ? "default" : "ghost"}
          onClick={() => setActiveTab("profile")}
          className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <User className="h-4 w-4 mr-2" />
          Datos Personales
        </Button>
        <Button
          variant={activeTab === "password" ? "default" : "ghost"}
          onClick={() => setActiveTab("password")}
          className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary"
        >
          <Lock className="h-4 w-4 mr-2" />
          Cambiar Contraseña
        </Button>
      </div>

      {/* Profile Tab */}
      {activeTab === "profile" && (
        <div className="space-y-6">
          {/* Información actual */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/20">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Información Actual
              </CardTitle>
              <CardDescription>
                Tu información de cuenta actual
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                  <p className="text-base font-semibold">{user.email}</p>
                </div>
                {fullName && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <User className="h-4 w-4" />
                      Nombre Completo
                    </div>
                    <p className="text-base font-semibold">{fullName}</p>
                  </div>
                )}
                {phone && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      Teléfono
                    </div>
                    <p className="text-base font-semibold">{phone}</p>
                  </div>
                )}
                {address && (
                  <div className="space-y-1 sm:col-span-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      Dirección
                    </div>
                    <p className="text-base font-semibold">{address}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Formulario de edición */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/20">
              <CardTitle>Editar Información</CardTitle>
              <CardDescription>
                Actualiza tu información personal
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <EditProfileForm 
                initialData={{
                  email: user.email || "",
                  fullName: fullName,
                  phone: phone,
                  address: address,
                }}
              />
            </CardContent>
          </Card>

          {/* Accesos rápidos */}
          <Card className="border-primary/20 shadow-sm">
            <CardHeader className="bg-primary/5 border-b border-primary/20">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Accesos Rápidos
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Link href="/orders">
                  <Button variant="outline" className="w-full justify-start h-auto py-3 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                    <Package className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Mis Pedidos</div>
                      <div className="text-xs text-muted-foreground">Ver historial</div>
                    </div>
                  </Button>
                </Link>
                <Link href="/wishlist">
                  <Button variant="outline" className="w-full justify-start h-auto py-3 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
                    <Package className="h-4 w-4 mr-2" />
                    <div className="text-left">
                      <div className="font-semibold">Favoritos</div>
                      <div className="text-xs text-muted-foreground">Ver productos guardados</div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Password Tab */}
      {activeTab === "password" && (
        <Card className="border-primary/20 shadow-sm">
          <CardHeader className="bg-primary/5 border-b border-primary/20">
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Cambiar Contraseña
            </CardTitle>
            <CardDescription>
              Actualiza tu contraseña para mantener tu cuenta segura
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ChangePasswordForm />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

