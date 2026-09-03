const { WebSocket } = require('ws');

const clients = new Map();

/**
 * Serializa un evento WebSocket con la estructura JSON requerida.
 *
 * @param {string} type Tipo de evento.
 * @param {object} payload Datos asociados al evento.
 * @returns {string} Evento serializado.
 */
function emit(type, payload = {}) {
  return JSON.stringify({
    type,
    payload: payload && typeof payload === 'object' ? payload : {},
  });
}

/**
 * Registra un cliente WebSocket activo y lo asocia a una sesión.
 *
 * @param {WebSocket} client Cliente WebSocket conectado.
 * @param {string} sessionId Identificador de sesión de Express.
 * @returns {void}
 */
function addClient(client, sessionId) {
  clients.set(client, { sessionId });
  send(client, 'connected', { connected: true });
}

/**
 * Elimina un cliente WebSocket de la lista de conexiones activas.
 *
 * @param {WebSocket} client Cliente WebSocket desconectado.
 * @returns {void}
 */
function removeClient(client) {
  clients.delete(client);
}

/**
 * Envía un evento WebSocket estructurado a un cliente.
 *
 * @param {WebSocket} client Cliente destino.
 * @param {string} type Tipo de evento.
 * @param {object} payload Datos del evento.
 * @returns {boolean} `true` si el envío fue realizado.
 */
function send(client, type, payload = {}) {
  if (!client || client.readyState !== WebSocket.OPEN) {
    return false;
  }

  try {
    client.send(emit(type, payload));
    return true;
  } catch (error) {
    removeClient(client);
    return false;
  }
}

/**
 * Envía un evento WebSocket a todos los clientes conectados o a una sesión.
 *
 * @param {string} type Tipo de evento.
 * @param {object} payload Datos del evento.
 * @param {string} [sessionId] Sesión destino opcional.
 * @returns {void}
 */
function broadcast(type, payload = {}, sessionId) {
  clients.forEach((metadata, client) => {
    if (!sessionId || metadata.sessionId === sessionId) {
      send(client, type, payload);
    }
  });
}

/**
 * Configura el servidor WebSocket y centraliza la gestión de conexiones.
 *
 * @param {import('ws').WebSocketServer} wss Servidor WebSocket.
 * @param {import('express').RequestHandler} sessionMiddleware Middleware de sesión de Express.
 * @returns {void}
 */
function configure(wss, sessionMiddleware) {
  wss.on('connection', (client, request) => {
    const response = {
      getHeader() {},
      setHeader() {},
      writeHead() {},
      end() {},
    };

    sessionMiddleware(request, response, () => {
      addClient(client, request.sessionID);

      client.on('close', () => removeClient(client));
      client.on('error', () => removeClient(client));
    });
  });
}

module.exports = {
  addClient,
  removeClient,
  send,
  broadcast,
  emit,
  configure,
};
