-- ============================================
-- SCRIPT PARA CORREGIR POLÍTICAS RLS
-- Soluciona el error de recursión infinita en user_roles
-- ============================================
-- Ejecuta este script en el SQL Editor de Supabase si tienes el error:
-- "infinite recursion detected in policy for relation user_roles"

-- Eliminar políticas problemáticas de user_roles
DROP POLICY IF EXISTS "Users can view their own role" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON user_roles;

-- Crear políticas corregidas (sin recursión)
CREATE POLICY "Users can view their own role" ON user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can manage roles" ON user_roles
  FOR ALL USING (auth.role() = 'authenticated');

-- Eliminar políticas problemáticas de categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Admins and sellers can manage categories" ON categories;

-- Crear políticas corregidas (sin recursión)
CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (active = TRUE OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage categories" ON categories
  FOR ALL USING (auth.role() = 'authenticated');

-- Verificar que las políticas se crearon correctamente
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('user_roles', 'categories')
ORDER BY tablename, policyname;

