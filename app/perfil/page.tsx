import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/user-profile";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi Perfil - MaterialesYA",
  description: "Gestiona tu perfil y configuración de cuenta",
};

export default async function ProfilePage() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    // Obtener datos adicionales del perfil si existen
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    return (
      <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-primary">
            Mi Perfil
          </h1>
          <UserProfile user={user} profileData={profile || null} />
        </div>
      </main>
    );
  } catch (error) {
    redirect("/auth/login");
  }
}

