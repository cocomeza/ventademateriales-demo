-- ============================================
-- DATOS DE EJEMPLO PARA MATERIALESYA
-- ============================================
-- Ejecuta este script DESPUÉS de setup-complete.sql
-- Solo si quieres datos de prueba en tu base de datos

-- Insertar categorías de ejemplo
INSERT INTO categories (name, description, slug, display_order, active) VALUES
('Cementos', 'Cementos y cales para construcción', 'cementos', 1, true),
('Ladrillos', 'Ladrillos y bloques', 'ladrillos', 2, true),
('Áridos', 'Arena, piedra y otros áridos', 'aridos', 3, true),
('Hierros', 'Hierros y aceros para construcción', 'hierros', 4, true),
('Revoques', 'Materiales para revoques', 'revoques', 5, true),
('Plomería', 'Tubos y accesorios de plomería', 'plomeria', 6, true),
('Electricidad', 'Materiales eléctricos', 'electricidad', 7, true),
('Pinturas', 'Pinturas y barnices', 'pinturas', 8, true),
('Cerámicos', 'Cerámicos y porcelanatos', 'ceramicos', 9, true),
('Impermeabilización', 'Materiales para impermeabilización', 'impermeabilizacion', 10, true),
('Aislantes', 'Materiales aislantes', 'aislantes', 11, true)
ON CONFLICT (name) DO NOTHING;

-- Insertar productos de ejemplo
INSERT INTO products (name, description, base_price, wholesale_price, stock, min_stock, category, category_id) VALUES
('Cemento Portland', 'Cemento de alta calidad para construcción general', 8500.00, 8000.00, 100, 20, 'Cementos', (SELECT id FROM categories WHERE slug = 'cementos')),
('Ladrillos Comunes', 'Ladrillos comunes de 12x18x33 cm', 450.00, 420.00, 500, 100, 'Ladrillos', (SELECT id FROM categories WHERE slug = 'ladrillos')),
('Arena Fina', 'Arena fina para mezclas y revoques', 3500.00, 3200.00, 200, 50, 'Áridos', (SELECT id FROM categories WHERE slug = 'aridos')),
('Piedra Partida', 'Piedra partida 6-20 para hormigón', 4200.00, 3900.00, 150, 30, 'Áridos', (SELECT id FROM categories WHERE slug = 'aridos')),
('Hierro del 8', 'Hierro redondo de 8mm para estructuras', 12000.00, 11000.00, 80, 15, 'Hierros', (SELECT id FROM categories WHERE slug = 'hierros')),
('Hierro del 10', 'Hierro redondo de 10mm para estructuras', 15000.00, 14000.00, 60, 10, 'Hierros', (SELECT id FROM categories WHERE slug = 'hierros')),
('Cal Hidratada', 'Cal hidratada para revoques y pinturas', 2800.00, 2600.00, 120, 25, 'Cementos', (SELECT id FROM categories WHERE slug = 'cementos')),
('Yeso Común', 'Yeso común para revoques interiores', 3200.00, 3000.00, 90, 20, 'Revoques', (SELECT id FROM categories WHERE slug = 'revoques')),
('Malla Sima', 'Malla sima para revoques, rollo de 50m', 8500.00, 8000.00, 40, 10, 'Revoques', (SELECT id FROM categories WHERE slug = 'revoques')),
('Tubos PVC 110mm', 'Tubos de PVC de 110mm para desagües', 4500.00, 4200.00, 70, 15, 'Plomería', (SELECT id FROM categories WHERE slug = 'plomeria')),
('Codos PVC 110mm', 'Codos de PVC de 110mm 90 grados', 1200.00, 1100.00, 100, 20, 'Plomería', (SELECT id FROM categories WHERE slug = 'plomeria')),
('Cable Eléctrico 2.5mm', 'Cable eléctrico de 2.5mm², rollo 100m', 25000.00, 23000.00, 30, 5, 'Electricidad', (SELECT id FROM categories WHERE slug = 'electricidad')),
('Interruptores', 'Interruptores simples marca reconocida', 850.00, 800.00, 150, 30, 'Electricidad', (SELECT id FROM categories WHERE slug = 'electricidad')),
('Tomas de Corriente', 'Tomas de corriente dobles', 1200.00, 1100.00, 100, 20, 'Electricidad', (SELECT id FROM categories WHERE slug = 'electricidad')),
('Pintura Látex', 'Pintura látex blanca, balde 20L', 15000.00, 14000.00, 50, 10, 'Pinturas', (SELECT id FROM categories WHERE slug = 'pinturas')),
('Imprimante', 'Imprimante para interiores, balde 20L', 12000.00, 11000.00, 40, 8, 'Pinturas', (SELECT id FROM categories WHERE slug = 'pinturas')),
('Cerámica 30x30', 'Cerámica esmaltada 30x30 cm, caja 2m²', 8500.00, 8000.00, 60, 12, 'Cerámicos', (SELECT id FROM categories WHERE slug = 'ceramicos')),
('Cerámica 45x45', 'Cerámica esmaltada 45x45 cm, caja 1.8m²', 12000.00, 11000.00, 45, 9, 'Cerámicos', (SELECT id FROM categories WHERE slug = 'ceramicos')),
('Membrana Asfáltica', 'Membrana asfáltica para techos, rollo 10m²', 18000.00, 17000.00, 25, 5, 'Impermeabilización', (SELECT id FROM categories WHERE slug = 'impermeabilizacion')),
('Aislante Térmico', 'Aislante térmico de poliestireno expandido, plancha 1m²', 3500.00, 3300.00, 80, 15, 'Aislantes', (SELECT id FROM categories WHERE slug = 'aislantes'))
ON CONFLICT (sku) DO NOTHING;

-- Nota: Los productos se insertan sin SKU para evitar conflictos
-- Puedes agregar SKUs únicos después si lo necesitas

