import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export type UserRole = "admin" | "seller" | "customer";

/**
 * Obtiene el rol del usuario actual (cliente)
 */
export async function getUserRole(): Promise<UserRole | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return "customer"; // Default role
    return data.role as UserRole;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Obtiene el rol del usuario actual (servidor)
 * Esta función solo debe usarse en Server Components o API Routes
 */
export async function getUserRoleServer(): Promise<UserRole | null> {
  try {
    // Importación dinámica para evitar errores en componentes del cliente
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .single();

    if (error || !data) return "customer"; // Default role
    return data.role as UserRole;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export async function hasRole(requiredRole: UserRole | UserRole[]): Promise<boolean> {
  const userRole = await getUserRole();
  if (!userRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * Verifica si el usuario tiene un rol específico (servidor)
 */
export async function hasRoleServer(requiredRole: UserRole | UserRole[]): Promise<boolean> {
  const userRole = await getUserRoleServer();
  if (!userRole) return false;

  if (Array.isArray(requiredRole)) {
    return requiredRole.includes(userRole);
  }
  return userRole === requiredRole;
}

/**
 * Verifica si el usuario es admin
 */
export async function isAdmin(): Promise<boolean> {
  return hasRole("admin");
}

/**
 * Verifica si el usuario es admin (servidor)
 */
export async function isAdminServer(): Promise<boolean> {
  return hasRoleServer("admin");
}

/**
 * Verifica si el usuario puede acceder al admin
 */
export async function canAccessAdmin(): Promise<boolean> {
  return hasRole(["admin", "seller"]);
}

/**
 * Verifica si el usuario puede acceder al admin (servidor)
 */
export async function canAccessAdminServer(): Promise<boolean> {
  return hasRoleServer(["admin", "seller"]);
}

