# Configuración de Supabase - Solución de Problemas

## Error: "Invalid API key" (401)

Este error indica que la clave de API de Supabase no está configurada correctamente o es inválida.

### Pasos para Solucionar

1. **Verifica que tengas un archivo `.env.local`** en la raíz del proyecto con las siguientes variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

2. **Obtén tus credenciales de Supabase**:
   - Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
   - Ve a **Settings** > **API**
   - Copia la **Project URL** (esta es tu `NEXT_PUBLIC_SUPABASE_URL`)
   - Copia la **anon/public** key (esta es tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

3. **Verifica el formato de las variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` debe comenzar con `https://`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` debe ser una cadena larga (más de 100 caracteres)

4. **Reinicia el servidor de desarrollo**:
   ```bash
   # Detén el servidor (Ctrl+C)
   # Luego inícialo de nuevo
   npm run dev
   ```

### Ejemplo de `.env.local` correcto

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

### Verificación

Para verificar que las variables están configuradas correctamente:

1. Abre la consola del navegador (F12)
2. Busca mensajes de advertencia sobre Supabase
3. Si ves "Supabase no está configurado", las variables no están siendo leídas

### Notas Importantes

- ⚠️ **NUNCA** uses la `service_role` key en el cliente. Solo usa la `anon` key.
- ⚠️ **NUNCA** subas tu archivo `.env.local` a Git. Debe estar en `.gitignore`.
- ✅ Las variables que comienzan con `NEXT_PUBLIC_` son públicas y se exponen al cliente.
- ✅ La `anon` key es segura para usar en el cliente porque las políticas RLS protegen los datos.

### Si el Problema Persiste

1. Verifica que el proyecto de Supabase esté activo
2. Verifica que las políticas RLS permitan acceso público a productos activos
3. Revisa los logs de Supabase Dashboard para ver errores específicos
4. Asegúrate de que no haya espacios extra en las variables de entorno

---

**Última actualización**: $(Get-Date -Format "yyyy-MM-dd HH:mm")

