# Mi Ecommerce Sprint 5

Aplicación web monolítica educativa construida con Node.js, Express.js, EJS, HTML5 semántico y CSS3.
El proyecto utiliza una arquitectura MVC con Express, EJS, persistencia SQLite, carrito en sesión,
validaciones, manejo de errores y lógica de negocio separada en servicios. El Sprint 5 agrega una
API REST JSON que convive con las páginas SSR existentes.

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
- Fuente de datos local en `src/data/products.json` (sin base de datos ni APIs externas).
- Layout base `src/views/layouts/main.ejs` con `express-ejs-layouts` (login y register quedan fuera del layout).
- Página 404 (`pages/404.ejs`) para toda ruta inexistente y página 500 (`pages/500.ejs`) desde el middleware global de errores.
- Validación del registro con middleware reutilizable y validación en el cliente.
- Carrito en `req.session.cart` con `express-session`, guardando únicamente `{ productId, quantity }`.
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
| GET | `/cart` | Carrito con imagen, precio, cantidad, subtotal y total. |
| POST | `/cart/add/:id` | Agrega un producto o incrementa su cantidad. |
| POST | `/cart/increase/:id` | Suma una unidad. |
| POST | `/cart/decrease/:id` | Resta una unidad y elimina la línea si llega a 0. |
| POST | `/cart/clear` | Vacía el carrito. |
| GET | `/checkout` | Mensaje temporal del próximo sprint. |
| GET | `/login` | Formulario de login (sin autenticación real). |
| GET / POST | `/register` | Formulario de registro con validaciones. |

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
| POST | `/api/products` | Crea un producto (201). |
| PUT | `/api/products/:id` | Actualiza un producto. |
| DELETE | `/api/products/:id` | Elimina un producto. |
| GET | `/api/categories` | Lista categorías. |
| GET | `/api/categories/:id` | Obtiene una categoría. |
| POST | `/api/categories` | Crea una categoría (201). |
| PUT | `/api/categories/:id` | Actualiza una categoría y su nombre en los productos. |
| DELETE | `/api/categories/:id` | Elimina una categoría sin productos asociados. |
| GET | `/api/stats` | Devuelve cantidades de productos y categorías. |

Ejemplos para Postman o Thunder Client (seleccionar `Body > raw > JSON`):

```http
GET http://localhost:3000/api/products
GET http://localhost:3000/api/categories/1
GET http://localhost:3000/api/stats
```

```http
POST http://localhost:3000/api/products
Content-Type: application/json

{
  "name": "Teclado de demostración",
  "description": "Teclado para la demo del Sprint 5",
  "category": "Periféricos",
  "price": 49990,
  "stock": 12,
  "image": "/images/teclado.jpg"
}
```

```http
POST http://localhost:3000/api/categories
Content-Type: application/json

{ "name": "Accesorios" }
```

## Instalación

```bash
npm install
```

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
