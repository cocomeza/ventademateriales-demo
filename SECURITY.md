# Política de Seguridad

## 🔒 Versiones Soportadas

Actualmente, solo la última versión del proyecto recibe actualizaciones de seguridad.

| Versión | Soportada          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## 🐛 Reportar una Vulnerabilidad

Si descubres una vulnerabilidad de seguridad, por favor **NO** abras un issue público.

En su lugar, envía un email a [tu-email@ejemplo.com] con los siguientes detalles:

- Descripción de la vulnerabilidad
- Pasos para reproducirla
- Impacto potencial
- Sugerencias de mitigación (si las tienes)

### Proceso

1. Reporta la vulnerabilidad por email
2. Recibirás una respuesta dentro de 48 horas
3. Trabajaremos en una solución
4. Publicaremos un fix y te daremos crédito (si lo deseas)

## 🛡️ Buenas Prácticas de Seguridad

### Para Desarrolladores

- **Nunca** commits credenciales o secrets al repositorio
- Usa variables de entorno para información sensible
- Mantén las dependencias actualizadas
- Revisa el código antes de hacer merge
- Usa autenticación fuerte en Supabase

### Variables de Entorno

Nunca expongas:
- Claves de API privadas
- Tokens de autenticación
- Credenciales de base de datos
- Secrets de Sentry

### Dependencias

- Ejecuta `npm audit` regularmente
- Actualiza dependencias con vulnerabilidades conocidas
- Revisa los cambios en `package-lock.json`

### Supabase

- Configura Row Level Security (RLS) correctamente
- Usa políticas restrictivas por defecto
- Valida datos en el servidor
- No confíes solo en validación del cliente

## 📋 Checklist de Seguridad

Antes de hacer deploy:

- [ ] Todas las variables de entorno están configuradas
- [ ] No hay credenciales hardcodeadas
- [ ] RLS está habilitado en Supabase
- [ ] Las políticas de acceso son restrictivas
- [ ] Las dependencias están actualizadas
- [ ] `npm audit` no muestra vulnerabilidades críticas
- [ ] Los tests pasan
- [ ] La autenticación funciona correctamente

## 🔐 Recursos

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/platform/security)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

Gracias por ayudar a mantener MaterialesYA seguro! 🙏

