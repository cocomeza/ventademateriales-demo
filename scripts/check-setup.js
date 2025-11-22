#!/usr/bin/env node

/**
 * Script para verificar que la configuración local está correcta
 * antes de hacer push a GitHub
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración del proyecto...\n');

const checks = [];
let hasErrors = false;

// 1. Verificar que existe .env.local
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  console.log('✅ Archivo .env.local encontrado');
  checks.push({ name: '.env.local', status: 'ok' });
  
  // Verificar variables importantes
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const hasSupabaseUrl = envContent.includes('NEXT_PUBLIC_SUPABASE_URL');
  const hasSupabaseKey = envContent.includes('NEXT_PUBLIC_SUPABASE_ANON_KEY');
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('✅ Variables de Supabase configuradas');
    checks.push({ name: 'Supabase vars', status: 'ok' });
  } else {
    console.log('⚠️  Variables de Supabase no encontradas en .env.local');
    checks.push({ name: 'Supabase vars', status: 'warning' });
  }
} else {
  console.log('⚠️  Archivo .env.local no encontrado (opcional para desarrollo)');
  checks.push({ name: '.env.local', status: 'warning' });
}

// 2. Verificar que existe package.json
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (fs.existsSync(packageJsonPath)) {
  console.log('✅ package.json encontrado');
  checks.push({ name: 'package.json', status: 'ok' });
  
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Verificar dependencias importantes (buscar en dependencies y devDependencies)
  const requiredDeps = ['next', 'react', 'framer-motion'];
  const requiredDevDeps = ['typescript'];
  const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  const missingDeps = requiredDeps.filter(dep => !allDeps[dep]);
  const missingDevDeps = requiredDevDeps.filter(dep => !allDeps[dep]);
  
  if (missingDeps.length === 0 && missingDevDeps.length === 0) {
    console.log('✅ Dependencias principales instaladas');
    checks.push({ name: 'Dependencies', status: 'ok' });
  } else {
    const allMissing = [...missingDeps, ...missingDevDeps];
    console.log(`❌ Dependencias faltantes: ${allMissing.join(', ')}`);
    console.log('   Ejecuta: npm install');
    checks.push({ name: 'Dependencies', status: 'error' });
    hasErrors = true;
  }
} else {
  console.log('❌ package.json no encontrado');
  checks.push({ name: 'package.json', status: 'error' });
  hasErrors = true;
}

// 3. Verificar workflows de GitHub Actions
const workflowsPath = path.join(process.cwd(), '.github', 'workflows');
if (fs.existsSync(workflowsPath)) {
  const workflows = fs.readdirSync(workflowsPath).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  if (workflows.length > 0) {
    console.log(`✅ ${workflows.length} workflow(s) de GitHub Actions encontrado(s)`);
    workflows.forEach(wf => console.log(`   - ${wf}`));
    checks.push({ name: 'GitHub Workflows', status: 'ok' });
  } else {
    console.log('⚠️  No se encontraron workflows en .github/workflows');
    checks.push({ name: 'GitHub Workflows', status: 'warning' });
  }
} else {
  console.log('⚠️  Directorio .github/workflows no encontrado');
  checks.push({ name: 'GitHub Workflows', status: 'warning' });
}

// 4. Verificar tests
const testsPath = path.join(process.cwd(), 'tests');
if (fs.existsSync(testsPath)) {
  const unitTests = fs.existsSync(path.join(testsPath, 'unit'));
  const e2eTests = fs.existsSync(path.join(testsPath, 'e2e'));
  
  if (unitTests) {
    console.log('✅ Tests unitarios encontrados');
    checks.push({ name: 'Unit Tests', status: 'ok' });
  }
  if (e2eTests) {
    console.log('✅ Tests E2E encontrados');
    checks.push({ name: 'E2E Tests', status: 'ok' });
  }
} else {
  console.log('⚠️  Directorio tests no encontrado');
  checks.push({ name: 'Tests', status: 'warning' });
}

console.log('\n📋 Resumen:');
console.log('─'.repeat(50));
checks.forEach(check => {
  const icon = check.status === 'ok' ? '✅' : check.status === 'warning' ? '⚠️' : '❌';
  console.log(`${icon} ${check.name}: ${check.status}`);
});

console.log('\n📝 Próximos pasos:');
console.log('─'.repeat(50));

if (hasErrors) {
  console.log('❌ Hay errores que deben corregirse antes de continuar');
  process.exit(1);
} else {
  console.log('1. Configura los secrets en GitHub (ver docs/GUIA_CONFIGURACION.md)');
  console.log('2. Ejecuta: npm run lint');
  console.log('3. Ejecuta: npm run test:unit');
  console.log('4. Ejecuta: npm run build');
  console.log('5. Haz push a GitHub para probar los workflows');
  console.log('\n✅ Configuración local verificada correctamente');
  process.exit(0);
}

