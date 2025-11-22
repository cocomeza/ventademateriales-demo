# ⚡ Inicio Rápido

**Guía rápida para empezar en 3 pasos**

## 🎯 Paso 1: Subir Cambios (5 min)

```bash
git add .
git commit -m "feat: agregar CI/CD completo, Framer Motion y tests"
git push origin main
```

## 🔐 Paso 2: Configurar Secrets (15 min)

1. Ve a GitHub → Tu repo → **Settings** → **Secrets and variables** → **Actions**
2. Agrega estos 5 secrets:

   | Secret | Dónde obtenerlo |
   |--------|----------------|
   | `VERCEL_TOKEN` | vercel.com/dashboard → Settings → Tokens |
   | `VERCEL_ORG_ID` | vercel.com → Proyecto → Settings → Team ID |
   | `VERCEL_PROJECT_ID` | vercel.com → Proyecto → Settings → Project ID |
   | `NEXT_PUBLIC_SUPABASE_URL` | supabase.com → Proyecto → Settings → API → URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase.com → Proyecto → Settings → API → anon key |

## ✅ Paso 3: Verificar (5 min)

1. Ve a GitHub → **Actions**
2. Deberías ver el workflow "CI" ejecutándose
3. Espera a que termine (5-10 min)

## 🎉 ¡Listo!

Ahora cada push ejecutará automáticamente:
- ✅ Tests
- ✅ Validación de código
- ✅ Despliegue automático

---

**¿Necesitas más detalles?** → Ver [Guía Completa de CI/CD](ci-cd/README.md)

