# Seguridad y autenticación — Sprint 6

La autenticación se centraliza en `authService`; `usersService` aplica hash bcrypt y delega
persistencia en `userModel`. Los controladores orquestan HTTP y las consultas SQLite permanecen
en modelos. La API usa JWT; las páginas EJS usan sesiones protegidas contra CSRF.

## Configuración

Instalá dependencias y creá la configuración local:

```bash
npm install
cp .env.example .env
```

Reemplazá los valores de ejemplo por secretos distintos generados localmente. Por ejemplo:

```bash
openssl rand -hex 32
openssl rand -hex 32
```

Configurá `JWT_SECRET`, `JWT_EXPIRES_IN` (por ejemplo, `1h`) y `SESSION_SECRET`.
`.env` está ignorado por Git; no compartas ni confirmes sus valores. `express-session` usa
MemoryStore para esta demo, no es un almacén adecuado para producción.

Iniciá el servidor con `npm start` en una terminal. La migración agrega el rol `consumer` a las
cuentas existentes y conserva el esquema y los datos previos.

## Registro

`POST /api/auth/register` recibe nombre, email y contraseña. El email se normaliza a minúsculas,
es único, y la contraseña se guarda como hash bcrypt; el rol inicial siempre es `consumer`.

```bash
curl -i http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"name":"Juan","email":"juan@mail.com","password":"ClaveSegura!123"}'
```

Éxito: `201 Created` con `{"message":"Usuario registrado correctamente"}`. Los campos
obligatorios inválidos devuelven `400`; un email registrado devuelve `409`.

## Login y JWT

`POST /api/auth/login` compara la contraseña con bcrypt y genera un JWT firmado con `JWT_SECRET`.
Su expiración se configura con `JWT_EXPIRES_IN`. El token contiene `id`, `email` y `role`.
Usuario inexistente y contraseña incorrecta producen la misma respuesta `401`.

```bash
curl -i http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"juan@mail.com","password":"ClaveSegura!123"}'
```

Guardá el campo `token` de la respuesta para las siguientes peticiones:

```bash
curl http://localhost:3000/api/products \
  -H 'Authorization: Bearer <token>'
```

El middleware `verifyToken` requiere ese formato, verifica firma y expiración y publica el payload
como `req.user`. Si falta o no es válido devuelve `401`.

## Roles y rutas protegidas

Los roles soportados son `consumer` y `admin`. El registro público no permite elegir ni elevar el
rol. `requireAdmin` responde `403` salvo que el token autenticado incluya `role: "admin"`.

Solo un administrador puede modificar productos:

| Método | Ruta | Protección |
| --- | --- | --- |
| GET | `/api/products` | Pública |
| GET | `/api/products/:id` | Pública |
| POST | `/api/products` | JWT + admin |
| PUT | `/api/products/:id` | JWT + admin |
| DELETE | `/api/products/:id` | JWT + admin |
| GET | `/api/categories` | Pública |
| GET | `/api/categories/:id` | Pública |
| POST | `/api/categories` | JWT + admin |
| PUT | `/api/categories/:id` | JWT + admin |
| DELETE | `/api/categories/:id` | JWT + admin |

Para una demostración local, registrá una cuenta y promovela manualmente en SQLite:

```bash
node -e "const db=require('./db/database'); console.log(db.prepare('UPDATE users SET role = ? WHERE email = ?').run('admin', 'juan@mail.com').changes)"
```

Volvé a iniciar sesión para emitir un token con el rol actualizado. No existe una ruta pública para
crear administradores.

Ejemplo Postman: seleccioná `POST`, agregá `Content-Type: application/json`, enviá el cuerpo JSON
de login y copiá el token de la respuesta en la pestaña **Authorization > Bearer Token** de una
petición protegida. Un `consumer` obtiene `403` al intentar escribir; sin token o con un token
inválido/expirado la respuesta es `401`.

## Sesiones SSR y navegación

El formulario EJS `/login` usa el mismo servicio de autenticación y crea una sesión regenerada tras
validar las credenciales. `POST /logout` destruye la sesión y exige el token CSRF existente.
`sessionAuth` expone el usuario a las vistas; el header muestra Login/Registro a visitantes y,
cuando hay sesión, Carrito y Mis pedidos. Administración aparece solo para admins.

Carrito, checkout y pedidos requieren sesión. La administración SSR devuelve `403` para
consumidores. Home y catálogo permanecen públicos. Para probar en el navegador, abrí `/register`,
creá una cuenta, iniciá sesión desde `/login`, verificá el header y luego cerrá sesión.

## Ejemplos CRUD

Copiá el JWT de admin devuelto por login a la variable local (no lo publiques):

```bash
TOKEN='<jwt-de-admin>'
```

```bash
curl -i -X POST http://localhost:3000/api/products \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teclado demo","description":"Ejemplo","category":"Periféricos","price":49990,"stock":12,"image":"/images/teclado.svg"}'
```

```bash
curl -i -X PUT http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{"name":"Teclado actualizado","description":"Ejemplo","category":"Periféricos","price":49990,"stock":10,"image":"/images/teclado.svg"}'
```

```bash
curl -i -X DELETE http://localhost:3000/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

## Verificación

```bash
npm test
```

La API conserva sus respuestas públicas de consulta; las escrituras administrativas requieren
JWT y rol `admin`. No se deben incluir contraseñas, tokens ni secretos de `.env` en capturas,
logs o commits.
