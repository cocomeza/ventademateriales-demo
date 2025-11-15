# Guía de Contribución

¡Gracias por tu interés en contribuir a MaterialesYA! 🎉

Esta guía te ayudará a entender cómo puedes contribuir al proyecto de manera efectiva.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Cómo Contribuir](#cómo-contribuir)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Testing](#testing)
- [Pull Requests](#pull-requests)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Features](#sugerir-features)

## 📜 Código de Conducta

Al participar en este proyecto, te comprometes a mantener un ambiente respetuoso y acogedor para todos los contribuidores.

## 🚀 Cómo Contribuir

### 1. Fork y Clone

```bash
# Fork el repositorio en GitHub, luego:
git clone https://github.com/tu-usuario/MaterialesYA.git
cd MaterialesYA
```

### 2. Configurar el Entorno

```bash
# Instalar dependencias
npm install

# Crear archivo de variables de entorno
cp .env.example .env.local

# Configurar tus credenciales en .env.local
```

### 3. Crear una Rama

```bash
# Crear una nueva rama desde main
git checkout -b feature/nombre-de-tu-feature
# o
git checkout -b fix/descripcion-del-bug
```

**Convención de nombres de ramas:**
- `feature/` - Para nuevas funcionalidades
- `fix/` - Para correcciones de bugs
- `docs/` - Para cambios en documentación
- `refactor/` - Para refactorización de código
- `test/` - Para agregar o mejorar tests

## 💻 Proceso de Desarrollo

### 1. Hacer Cambios

- Escribe código limpio y bien documentado
- Sigue los estándares de código del proyecto
- Agrega tests para nuevas funcionalidades
- Actualiza la documentación si es necesario

### 2. Ejecutar Tests

```bash
# Tests unitarios
npm run test

# Tests end-to-end
npm run test:e2e

# Linter
npm run lint
```

### 3. Commit

```bash
git add .
git commit -m "tipo: descripción breve

Descripción más detallada si es necesario"
```

**Formato de commits (Conventional Commits):**
- `feat:` Nueva funcionalidad
- `fix:` Corrección de bug
- `docs:` Cambios en documentación
- `style:` Cambios de formato (no afectan el código)
- `refactor:` Refactorización de código
- `test:` Agregar o modificar tests
- `chore:` Cambios en build o herramientas auxiliares

**Ejemplos:**
```
feat: agregar filtro de búsqueda por precio
fix: corregir cálculo de descuentos en carrito
docs: actualizar guía de instalación
```

### 4. Push y Pull Request

```bash
git push origin feature/nombre-de-tu-feature
```

Luego crea un Pull Request en GitHub.

## 📐 Estándares de Código

### TypeScript

- Usa TypeScript estricto
- Define tipos explícitos cuando sea necesario
- Evita `any` - usa `unknown` si es necesario
- Usa interfaces para objetos, types para uniones

### React/Next.js

- Usa componentes funcionales con hooks
- Prefiere `"use client"` solo cuando sea necesario
- Usa Server Components por defecto
- Nombres de componentes en PascalCase

### Estilos

- Usa Tailwind CSS para estilos
- Sigue el sistema de diseño existente
- Usa componentes de `shadcn/ui` cuando sea posible

### Estructura de Archivos

```
components/
  feature-name/
    feature-name.tsx
    feature-name.test.tsx
    index.ts
```

## 🧪 Testing

### Tests Unitarios

- Escribe tests para funciones utilitarias
- Usa Vitest como framework
- Cobertura objetivo: >80%

```typescript
import { describe, it, expect } from 'vitest'
import { formatPrice } from '@/lib/utils'

describe('formatPrice', () => {
  it('should format price correctly', () => {
    expect(formatPrice(1000)).toBe('$1.000,00')
  })
})
```

### Tests E2E

- Escribe tests para flujos críticos del usuario
- Usa Playwright
- Ejemplos: login, agregar al carrito, checkout

## 🔍 Pull Requests

### Antes de Crear un PR

- [ ] El código sigue los estándares del proyecto
- [ ] Los tests pasan (`npm run test`)
- [ ] Los tests e2e pasan (`npm run test:e2e`)
- [ ] El linter no muestra errores (`npm run lint`)
- [ ] La documentación está actualizada
- [ ] Los commits siguen el formato Conventional Commits

### Template de PR

```markdown
## Descripción
Breve descripción de los cambios

## Tipo de cambio
- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Checklist
- [ ] Tests agregados/actualizados
- [ ] Documentación actualizada
- [ ] Sin errores de linter

## Screenshots (si aplica)
```

## 🐛 Reportar Bugs

Usa el template de issues de GitHub:

```markdown
**Descripción del bug**
Descripción clara y concisa del bug

**Pasos para reproducir**
1. Ir a '...'
2. Click en '...'
3. Ver error

**Comportamiento esperado**
Lo que debería pasar

**Screenshots**
Si aplica

**Entorno**
- OS: [e.g. Windows 10]
- Navegador: [e.g. Chrome 120]
- Versión: [e.g. 1.0.0]

**Información adicional**
Cualquier otra información relevante
```

## 💡 Sugerir Features

```markdown
**¿Es tu feature request relacionada con un problema?**
Descripción clara del problema

**Describe la solución que te gustaría**
Descripción clara de lo que quieres que pase

**Describe alternativas consideradas**
Otras soluciones o features que consideraste

**Contexto adicional**
Cualquier otra información, screenshots, etc.
```

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Supabase](https://supabase.com/docs)
- [Guía de TypeScript](https://www.typescriptlang.org/docs/)
- [Conventional Commits](https://www.conventionalcommits.org/)

## ❓ Preguntas

Si tienes preguntas, puedes:
- Abrir un issue con la etiqueta `question`
- Revisar la documentación existente
- Contactar a los mantenedores

---

¡Gracias por contribuir! 🎉

