# Mi Ecommerce Sprint 6

Aplicación web monolítica educativa construida con Node.js, Express.js, EJS, HTML5 semántico y CSS3.
El proyecto utiliza una arquitectura MVC con Express, EJS, persistencia SQLite, autenticación JWT y SSR,
autorización por roles, carrito en sesión,
validaciones, manejo de errores y lógica de negocio separada en servicios. El Sprint 5 agrega una
API REST JSON que convive con las páginas SSR existentes; el Sprint 6 protege las operaciones privadas.

La configuración local requiere un archivo `.env`. Consultá [README Security.md](README%20Security.md)
para configurar secretos, registrar usuarios y probar la API protegida.

## Estructura del proyecto

```text
project
│
├── public
│   ├── css
│   ├── images
│   └── js
│
├── src
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── services
│   ├── middlewares
│   ├── data
│   │   └── products.json
│   │
│   └── views
│       ├── layouts
│       ├── pages
│       └── partials
│
├── app.js
└── package.json
```

## Requisitos implementados

- Refactor MVC: controladores, modelos, rutas, servicios, middlewares y vistas separados.
- Persistencia local SQLite para catálogo, categorías y usuarios.
- Layout base `src/views/layouts/main.ejs` con `express-ejs-layouts` (login y register quedan fuera del layout).
- Página 404 (`pages/404.ejs`) para toda ruta inexistente y página 500 (`pages/500.ejs`) desde el middleware global de errores.
- Registro con hash bcrypt; JWT para la API y sesiones para SSR.
- Carrito y usuario autenticado en sesión con `express-session`.
- Header con `Carrito (N)` calculado desde la sesión.
- Home con secciones "Te puede interesar" (5 productos) y "Los más pedidos" (10 productos).
- Detalle de producto con productos relacionados por categoría (máximo 4) y control de stock.
- Listado por categoría, ordenamiento por precio y búsqueda por nombre.
- Checkout temporal informativo, sin lógica de negocio.
- Protección CSRF en los formularios que modifican estado (carrito, login y registro).
- Comentarios JSDoc en controladores, servicios, middlewares, rutas y configuración de Express.

## Rutas

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/` | Home con categorías, destacados y más pedidos. |
| GET | `/products` | Listado de productos (`?sort=asc` / `?sort=desc`). |
| GET | `/products/:id` | Detalle de producto y relacionados. |
| GET | `/categories/:category` | Productos filtrados por categoría. |
| GET | `/search?query=texto` | Búsqueda por coincidencia parcial del nombre. |
| GET | `/cart` | Carrito autenticado con imagen, precio, cantidad, subtotal y total. |
| POST | `/cart/add/:id` | Agrega un producto o incrementa su cantidad. |
| POST | `/cart/increase/:id` | Suma una unidad. |
| POST | `/cart/decrease/:id` | Resta una unidad y elimina la línea si llega a 0. |
| POST | `/cart/clear` | Vacía el carrito. |
| GET | `/checkout` | Checkout temporal; requiere sesión. |
| GET / POST | `/login` | Login SSR con sesión. |
| GET / POST | `/register` | Registro SSR con validaciones. |
| POST | `/logout` | Cierra la sesión SSR y requiere CSRF. |
| GET | `/orders` | Pedidos del usuario autenticado. |
| GET | `/admin` | Administración SSR; solo administradores. |

Los identificadores de las rutas se validan con `normalizeId()`: un id no numérico responde `400`
y un id inexistente responde `404`.

## API REST

La API está disponible bajo `/api`, acepta JSON, habilita CORS y devuelve respuestas JSON.
Las categorías existentes se migran desde el catálogo al iniciar la aplicación. Para conservar
consistentes las vistas SSR, una categoría asociada a productos no se puede eliminar (409).

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/products` | Lista productos. |
| GET | `/api/products/:id` | Obtiene un producto. |
| POST | `/api/products` | Crea un producto (201); requiere JWT admin. |
| PUT | `/api/products/:id` | Actualiza un producto; requiere JWT admin. |
| DELETE | `/api/products/:id` | Elimina un producto; requiere JWT admin. |
| GET | `/api/categories` | Lista categorías. |
| GET | `/api/categories/:id` | Obtiene una categoría. |
| POST | `/api/categories` | Crea una categoría (201); requiere JWT admin. |
| PUT | `/api/categories/:id` | Actualiza una categoría; requiere JWT admin. |
| DELETE | `/api/categories/:id` | Elimina una categoría; requiere JWT admin. |
| POST | `/api/auth/register` | Registra un usuario `consumer` con password hasheada. |
| POST | `/api/auth/login` | Valida credenciales y devuelve un JWT. |
| GET | `/api/stats` | Devuelve cantidades de productos y categorías. |

Ejemplos para Postman o Thunder Client (seleccionar `Body > raw > JSON`):

```http
GET http://localhost:3000/api/products
GET http://localhost:3000/api/categories/1
GET http://localhost:3000/api/stats
```

Las operaciones de escritura requieren el encabezado `Authorization: Bearer <token>`.

```http
POST http://localhost:3000/api/categories
Authorization: Bearer <token-de-admin>
Content-Type: application/json

{ "name": "Accesorios" }
```

## Instalación

```bash
npm install
cp .env.example .env
```

Antes de ejecutar, reemplazá ambos secretos de `.env` por valores aleatorios privados.
Las instrucciones completas están en [README Security.md](README%20Security.md).

## Ejecución

```bash
npm start
```

Luego abrir:

```text
http://localhost:3000
```

## Validación

```bash
npm test
```
