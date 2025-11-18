'use client'

import { usePathname } from 'next/navigation'
import { Footer } from './footer'

/**
 * Componente que muestra el Footer solo si no estamos en rutas de admin
 */
export function ConditionalFooter() {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin') ?? false
  
  // No mostrar footer en rutas de admin
  if (isAdminRoute) {
    return null
  }
  
  return <Footer />
}

