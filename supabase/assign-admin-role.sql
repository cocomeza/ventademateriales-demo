-- Script para asignar rol de admin a un usuario
-- Reemplaza '22ce6b9b-e688-4f41-92ed-9048afca078b' con el User ID real de tu usuario

INSERT INTO user_roles (user_id, role) 
VALUES ('22ce6b9b-e688-4f41-92ed-9048afca078b', 'admin')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Verificar que se asignó correctamente
SELECT 
  u.email,
  ur.role,
  ur.created_at
FROM auth.users u
JOIN user_roles ur ON u.id = ur.user_id
WHERE u.id = '22ce6b9b-e688-4f41-92ed-9048afca078b';

