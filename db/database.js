const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, 'ecommerce.sqlite3');
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');

/**
 * Conexión única y reutilizable a la base SQLite de la aplicación.
 * Se crea una sola vez por proceso y se exporta para que todos los
 * modelos/servicios la reutilicen en lugar de abrir conexiones propias.
 * Al iniciar, aplica `schema.sql` para garantizar que las tablas existan.
 * @type {import('better-sqlite3').Database}
 */
const db = new Database(DB_FILE);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

const schema = fs.readFileSync(SCHEMA_FILE, 'utf-8');
db.exec(schema);

module.exports = db;
