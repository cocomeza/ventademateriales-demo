import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description: "Inicia sesión en tu cuenta de MaterialesYA para acceder a tus pedidos, favoritos y más.",
  alternates: {
    canonical: "/auth/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-8 text-center">Iniciar Sesión</h1>
        <LoginForm />
      </div>
    </main>
  );
}

