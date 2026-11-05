-- Esquema SQLite de Mi Ecommerce (Sprint 3).
-- Reemplaza la persistencia basada en archivos JSON.

-- Catálogo de productos. Es la única fuente de datos de productos.
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  categories TEXT, -- Opcional: lista JSON de categorías adicionales (multi-categoría futura).
  price REAL NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  image TEXT
);

-- Categorías administrables por la API; el catálogo conserva sus nombres para SSR.
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE
);

-- Usuarios de la aplicación. La contraseña siempre se almacena como hash.
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'consumer' CHECK (role IN ('consumer', 'admin')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Tabla vacía preparada para futuros sprints (checkout / historial de compras).
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  total REAL NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users (id)
);

-- Tabla vacía preparada para futuros sprints (detalle de cada orden).
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders (id),
  FOREIGN KEY (product_id) REFERENCES products (id)
);
