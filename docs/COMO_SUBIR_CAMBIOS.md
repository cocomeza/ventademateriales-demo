# 📤 Cómo Subir los Cambios a GitHub

## ✅ Archivos que se Agregaron/Modificaron

### Nuevos Archivos (a agregar):
- `.github/workflows/deploy-production.yml` - Workflow de despliegue a producción
- `.github/workflows/deploy-staging.yml` - Workflow de despliegue a staging
- `docs/CI_CD_SETUP.md` - Documentación técnica de CI/CD
- `docs/GUIA_CONFIGURACION.md` - Guía paso a paso de configuración
- `docs/RESUMEN_PROXIMOS_PASOS.md` - Resumen rápido
- `scripts/check-setup.js` - Script de verificación
- `tests/unit/stock.test.ts` - Tests unitarios de stock

### Archivos Modificados:
- `.github/workflows/ci.yml` - Workflow de CI actualizado
- `components/admin/products-admin.tsx` - Agregado Framer Motion
- `components/cart-view.tsx` - Agregadas animaciones
- `components/product-carousel.tsx` - Agregadas animaciones
- `components/product-catalog.tsx` - Agregadas animaciones
- `package.json` - Agregado framer-motion y nuevos scripts
- `package-lock.json` - Actualizado con nuevas dependencias

## 🚀 Pasos para Subir los Cambios

### Opción 1: Subir Todo de Una Vez (Recomendado)

```bash
# 1. Agregar todos los archivos nuevos y modificados
git add .

# 2. Verificar qué se va a subir (opcional pero recomendado)
git status

# 3. Hacer commit con un mensaje descriptivo
git commit -m "feat: agregar CI/CD, Framer Motion y tests de stock

- Agregar workflows de GitHub Actions para CI/CD
- Instalar y configurar Framer Motion para animaciones
- Agregar animaciones a carrito, catálogo y carousel
- Crear tests unitarios para lógica de stock
- Agregar scripts de verificación y documentación completa"

# 4. Subir a GitHub
git push origin main
```

### Opción 2: Subir por Categorías (Más Organizado)

```bash
# 1. Agregar workflows primero
git add .github/workflows/
git commit -m "feat: agregar workflows de CI/CD para GitHub Actions"

# 2. Agregar dependencias
git add package.json package-lock.json
git commit -m "feat: agregar Framer Motion y scripts de verificación"

# 3. Agregar componentes con animaciones
git add components/
git commit -m "feat: agregar animaciones con Framer Motion a componentes UI"

# 4. Agregar tests
git add tests/unit/stock.test.ts
git commit -m "test: agregar tests unitarios para lógica de stock"

# 5. Agregar documentación y scripts
git add docs/ scripts/
git commit -m "docs: agregar documentación completa de CI/CD y guías"

# 6. Subir todo a GitHub
git push origin main
```

## ⚠️ Antes de Hacer Push

### 1. Verificar que Todo Funciona Localmente

```bash
# Ejecutar el script de verificación
npm run check:setup

# Verificar lint
npm run lint

# Ejecutar tests
npm run test:unit

# Verificar que compila
npm run build
```

### 2. Revisar los Cambios

```bash
# Ver un resumen de los cambios
git status

# Ver los cambios en detalle (opcional)
git diff
```

## 🎯 Después de Hacer Push

Una vez que hagas push, automáticamente:

1. ✅ Se ejecutará el workflow "CI" en GitHub Actions
2. ✅ Se ejecutarán los tests automáticamente
3. ✅ Se validará el código con lint y type check
4. ✅ Se construirá la aplicación

**Nota:** Los workflows de deploy (staging/producción) solo se ejecutarán después de que configures los secrets en GitHub (ver `docs/GUIA_CONFIGURACION.md`).

## 🔍 Verificar que se Subió Correctamente

1. Ve a tu repositorio en GitHub
2. Ve a la pestaña **Actions**
3. Deberías ver el workflow "CI" ejecutándose o completado
4. Verifica que todos los archivos nuevos estén en el repositorio

## 📝 Mensaje de Commit Sugerido

Si prefieres un mensaje más simple:

```bash
git commit -m "feat: implementar CI/CD completo con GitHub Actions, Framer Motion y tests"
```

O si prefieres seguir Conventional Commits:

```bash
git commit -m "feat: agregar CI/CD, animaciones y tests

- CI/CD: workflows de GitHub Actions para validación y despliegue
- Animaciones: Framer Motion en carrito, catálogo y carousel  
- Tests: tests unitarios para lógica de stock
- Docs: documentación completa de configuración y uso"
```

## 🆘 Si Algo Sale Mal

### Si el push falla:
```bash
# Verificar que estás en la rama correcta
git branch

# Verificar el estado remoto
git fetch origin
git status

# Intentar push de nuevo
git push origin main
```

### Si quieres deshacer el último commit (antes de push):
```bash
git reset --soft HEAD~1  # Mantiene los cambios pero deshace el commit
```

### Si ya hiciste push y quieres corregir:
```bash
# Hacer los cambios necesarios
git add .
git commit --amend -m "nuevo mensaje"
git push --force origin main  # ⚠️ Solo si estás seguro
```

## ✅ Checklist Antes de Push

- [ ] Ejecuté `npm run check:setup` y pasó
- [ ] Ejecuté `npm run lint` (solo warnings menores)
- [ ] Ejecuté `npm run test:unit` y pasaron todos
- [ ] Ejecuté `npm run build` y compiló correctamente
- [ ] Revisé los cambios con `git status`
- [ ] Escribí un mensaje de commit descriptivo
- [ ] Estoy en la rama correcta (`main` o `develop`)

## 🎉 ¡Listo!

Una vez que hagas push, tu repositorio tendrá:
- ✅ Workflows de CI/CD configurados
- ✅ Animaciones con Framer Motion
- ✅ Tests unitarios de stock
- ✅ Documentación completa
- ✅ Scripts de verificación

**Siguiente paso:** Configurar los secrets en GitHub (ver `docs/GUIA_CONFIGURACION.md`)

