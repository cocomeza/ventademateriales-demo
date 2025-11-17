"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

interface EditProfileFormProps {
  initialData: {
    email: string;
    fullName: string;
    phone: string;
    address: string;
  };
}

export function EditProfileForm({ initialData }: EditProfileFormProps) {
  const [fullName, setFullName] = useState(initialData.fullName);
  const [phone, setPhone] = useState(initialData.phone);
  const [address, setAddress] = useState(initialData.address);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSupabaseConfigured() || !supabase) {
      toast({
        title: "Error",
        description: "Supabase no está configurado",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Usuario no autenticado");
      }

      // Actualizar metadata del usuario
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
        },
      });

      if (updateError) throw updateError;

      // Intentar actualizar o insertar en tabla profiles si existe
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          full_name: fullName,
          phone: phone || null,
          address: address || null,
          updated_at: new Date().toISOString(),
        }, {
          onConflict: "id",
        });

      // Si la tabla profiles no existe, no es crítico
      if (profileError && !profileError.message.includes("relation") && !profileError.message.includes("does not exist")) {
        console.warn("Error al actualizar perfil:", profileError);
      }

      toast({
        title: "Perfil actualizado",
        description: "Tu información se ha actualizado correctamente",
      });

      // Recargar la página para mostrar los cambios
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={initialData.email}
          disabled
          className="bg-muted cursor-not-allowed"
        />
        <p className="text-xs text-muted-foreground">
          El email no se puede cambiar
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullName">Nombre Completo</Label>
        <Input
          id="fullName"
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Tu nombre completo"
          className="border-primary/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono</Label>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+54 9 11 1234-5678"
          className="border-primary/20 focus:border-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Tu dirección completa"
          className="border-primary/20 focus:border-primary"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Guardando...
          </>
        ) : (
          "Guardar Cambios"
        )}
      </Button>
    </form>
  );
}

