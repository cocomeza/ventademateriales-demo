"use client";

import Link from "next/link";

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className = "", showText = true, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-8",
    md: "h-10",
    lg: "h-12",
  };

  const textSizes = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  const taglineSizes = {
    sm: "text-[8px]",
    md: "text-[9px]",
    lg: "text-[10px]",
  };

  return (
    <Link href="/" className={`flex items-center space-x-3 hover:opacity-90 transition-opacity ${className}`} aria-label="Ir a la página principal">
      {/* Icono gráfico del logo */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <LogoSVG size={size} />
      </div>
      
      {/* Text Logo */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizes[size]} leading-tight text-primary`}>
            materiales<span className="font-extrabold">YA</span>
          </span>
          <span className={`${taglineSizes[size]} text-primary/70 font-medium hidden sm:block leading-tight`}>
            VENTA DIRECTA
          </span>
        </div>
      )}
    </Link>
  );
}

// Componente SVG del logo con diseño arquitectónico moderno
export function LogoSVG({ className = "", size = "md" }: { className?: string; size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  return (
    <svg
      viewBox="0 0 100 100"
      className={`${sizeClasses[size]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MaterialesYA Logo"
      role="img"
    >
      {/* Formas arquitectónicas grises sólidas - más grandes y visibles */}
      {/* Edificio izquierdo */}
      <path
        d="M10 70 L10 30 L25 20 L25 60 L10 70 Z"
        fill="#4B5563"
        stroke="#374151"
        strokeWidth="1"
      />
      {/* Edificio derecho */}
      <path
        d="M90 70 L90 35 L75 25 L75 65 L90 70 Z"
        fill="#4B5563"
        stroke="#374151"
        strokeWidth="1"
      />
      
      {/* Estructuras naranjas con contorno (marcos arquitectónicos) - más gruesas y visibles */}
      {/* Marco izquierdo - estructura angular */}
      <path
        d="M20 50 L20 25 L35 15 L35 40 L20 50 Z"
        fill="none"
        stroke="#FF6600"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Marco central/derecho - estructura angular más grande */}
      <path
        d="M45 55 L45 30 L65 18 L65 43 L45 55 Z"
        fill="none"
        stroke="#FF6600"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Líneas de conexión/estructura - más visibles */}
      <line x1="35" y1="28" x2="45" y2="35" stroke="#FF6600" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="25" y1="38" x2="35" y2="32" stroke="#FF6600" strokeWidth="3.5" strokeLinecap="round" />
      
      {/* Línea horizontal de conexión base */}
      <line x1="20" y1="50" x2="45" y2="55" stroke="#FF6600" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
    </svg>
  );
}

