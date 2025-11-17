"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useThemeStore } from "@/store/theme-store";

export function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();
  const [effectiveTheme, setEffectiveTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Calcular el tema efectivo
    const getEffectiveTheme = () => {
      if (theme === 'system') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      return theme;
    };

    const currentEffectiveTheme = getEffectiveTheme();
    setEffectiveTheme(currentEffectiveTheme);
    
    // Aplicar el tema al documento
    document.documentElement.classList.toggle('dark', currentEffectiveTheme === 'dark');

    // Escuchar cambios en la preferencia del sistema si está en modo 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        const newTheme = mediaQuery.matches ? 'dark' : 'light';
        setEffectiveTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const toggleTheme = () => {
    // Cambiar directamente entre claro y oscuro
    if (effectiveTheme === 'dark') {
      setTheme('light');
    } else {
      setTheme('dark');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="hover:bg-primary/10 hover:text-primary relative border-2 border-primary/30 hover:border-primary/60 bg-background shadow-sm"
          onClick={(e) => {
            // Toggle rápido con doble click o mantener presionado
            e.preventDefault();
            toggleTheme();
          }}
          onDoubleClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label={effectiveTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          title={effectiveTheme === 'dark' ? 'Click para modo claro' : 'Click para modo oscuro'}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-primary" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
          <span className="sr-only">Cambiar tema</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem 
          onClick={() => setTheme('light')} 
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <Sun className="mr-2 h-4 w-4" />
            <span>Claro</span>
          </div>
          {theme === 'light' && <span className="text-primary font-bold">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('dark')} 
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <Moon className="mr-2 h-4 w-4" />
            <span>Oscuro</span>
          </div>
          {theme === 'dark' && <span className="text-primary font-bold">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme('system')} 
          className="cursor-pointer flex items-center justify-between"
        >
          <div className="flex items-center">
            <Monitor className="mr-2 h-4 w-4" />
            <span>Sistema</span>
          </div>
          {theme === 'system' && <span className="text-primary font-bold">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

