(() => {
  const statusElement = document.getElementById('connection-status');
  const cartCountElement = document.getElementById('cart-count');
  const cartContentElement = document.getElementById('cart-content');
  const notificationElement = document.getElementById('cart-notification');
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.content ?? '';
  let reconnectDelay = 1000;
  let notificationTimer;

  /**
   * Actualiza el indicador visual y accesible de conexión WebSocket.
   *
   * @param {boolean} connected Estado actual de la conexión.
   * @returns {void}
   */
  function updateConnectionStatus(connected) {
    if (!statusElement) {
      return;
    }

    statusElement.textContent = connected ? '🟢 Conectado' : '🔴 Desconectado';
  }

  /**
   * Muestra una notificación accesible que desaparece automáticamente.
   *
   * @param {string} message Mensaje visible para el usuario.
   * @returns {void}
   */
  function showNotification(message) {
    if (!notificationElement) {
      return;
    }

    clearTimeout(notificationTimer);
    notificationElement.textContent = message;
    notificationElement.hidden = false;

    notificationTimer = setTimeout(() => {
      notificationElement.hidden = true;
      notificationElement.textContent = '';
    }, 3000);
  }

  /**
   * Actualiza el contador del carrito en el header sin recargar la página.
   *
   * @param {number} items Cantidad total de unidades.
   * @returns {void}
   */
  function updateCartCount(items) {
    if (cartCountElement) {
      cartCountElement.textContent = String(items);
    }
  }

  /**
   * Crea un formulario POST con token CSRF para acciones del carrito.
   *
   * @param {string} action URL de la acción.
   * @param {string} label Texto accesible del botón.
   * @param {string} text Texto visible del botón.
   * @returns {HTMLFormElement} Formulario listo para insertar en el DOM.
   */
  function createCartForm(action, label, text) {
    const form = document.createElement('form');
    form.action = action;
    form.method = 'POST';
    form.dataset.cartForm = '';

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = '_csrf';
    input.value = csrfToken;

    const button = document.createElement('button');
    button.type = 'submit';
    button.setAttribute('aria-label', label);
    button.textContent = text;

    form.append(input, button);
    return form;
  }

  /**
   * Renderiza la vista `/cart` usando el estado recibido por WebSocket.
   *
   * @param {{items: number, total: number, detailedItems: object[]}} cart Estado del carrito.
   * @returns {void}
   */
  function renderCart(cart) {
    if (!cartContentElement || !Array.isArray(cart.detailedItems)) {
      return;
    }

    cartContentElement.replaceChildren();

    if (cart.detailedItems.length === 0) {
      const message = document.createElement('p');
      message.className = 'empty-message';
      message.textContent = 'Tu carrito está vacío';

      const homeLink = document.createElement('a');
      homeLink.className = 'button';
      homeLink.href = '/';
      homeLink.textContent = 'Volver al inicio';

      cartContentElement.append(message, homeLink);
      return;
    }

    const list = document.createElement('div');
    list.className = 'cart-list';

    cart.detailedItems.forEach((item) => {
      const article = document.createElement('article');
      article.className = 'cart-item';

      const image = document.createElement('img');
      image.src = item.image;
      image.alt = `Imagen de ${item.name}`;

      const info = document.createElement('div');
      const title = document.createElement('h2');
      const productLink = document.createElement('a');
      productLink.href = `/products/${item.productId}`;
      productLink.textContent = item.name;
      title.append(productLink);

      const price = document.createElement('p');
      price.textContent = `Precio unitario: $${item.price}`;

      const quantity = document.createElement('p');
      quantity.textContent = `Cantidad: ${item.quantity}`;
      info.append(title, price, quantity);

      const controls = document.createElement('div');
      controls.className = 'quantity-controls';
      controls.setAttribute('aria-label', `Controles de cantidad de ${item.name}`);
      controls.append(
        createCartForm(`/cart/decrease/${item.productId}`, `Quitar una unidad de ${item.name}`, '-'),
        createCartForm(`/cart/increase/${item.productId}`, `Agregar una unidad de ${item.name}`, '+'),
        createCartForm(`/cart/remove/${item.productId}`, `Eliminar ${item.name}`, '×'),
      );

      const subtotal = document.createElement('p');
      subtotal.className = 'subtotal';
      subtotal.textContent = `Subtotal: $${item.subtotal}`;

      article.append(image, info, controls, subtotal);
      list.append(article);
    });

    const actions = document.createElement('div');
    actions.className = 'cart-actions';

    const total = document.createElement('p');
    total.className = 'price';
    total.textContent = `Total: $${cart.total}`;

    const checkoutLink = document.createElement('a');
    checkoutLink.className = 'button';
    checkoutLink.href = '/checkout';
    checkoutLink.textContent = 'Ir a Pagar';

    const clearForm = createCartForm('/cart/clear', 'Vaciar carrito', 'Vaciar carrito');
    clearForm.querySelector('button').className = 'button button--secondary';

    const productsLink = document.createElement('a');
    productsLink.className = 'button button--secondary';
    productsLink.href = '/products';
    productsLink.textContent = 'Seguir comprando';

    actions.append(total, checkoutLink, clearForm, productsLink);
    cartContentElement.append(list, actions);
  }

  /**
   * Procesa eventos WebSocket identificando su `type`.
   *
   * @param {{type: string, payload: object}} event Evento recibido.
   * @returns {void}
   */
  function handleEvent(event) {
    if (event.type === 'connected') {
      updateConnectionStatus(true);
      return;
    }

    if (event.type === 'cartUpdated') {
      updateCartCount(event.payload.items);
      renderCart(event.payload);
      return;
    }

    if (event.type === 'cartEmptied') {
      updateCartCount(event.payload.items);
      renderCart(event.payload);
      showNotification('El carrito quedó vacío');
    }
  }

  /**
   * Abre la conexión WebSocket y reintenta automáticamente si se pierde.
   *
   * @returns {void}
   */
  function connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);

    socket.addEventListener('open', () => {
      reconnectDelay = 1000;
      updateConnectionStatus(true);
    });

    socket.addEventListener('message', (message) => {
      try {
        handleEvent(JSON.parse(message.data));
      } catch (error) {
        // Ignora mensajes no válidos para conservar el protocolo estructurado.
      }
    });

    socket.addEventListener('close', () => {
      updateConnectionStatus(false);
      setTimeout(connectWebSocket, reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay + 1000, 5000);
    });

    socket.addEventListener('error', () => {
      updateConnectionStatus(false);
      socket.close();
    });
  }

  /**
   * Intercepta formularios del carrito para evitar refresh y dejar que el
   * WebSocket actualice el DOM en todas las pestañas.
   *
   * @returns {void}
   */
  function bindCartForms() {
    document.addEventListener('submit', (event) => {
      const form = event.target.closest('form[data-cart-form]');

      if (!form) {
        return;
      }

      event.preventDefault();

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json',
        },
      }).catch(() => {
        updateConnectionStatus(false);
      });
    });
  }

  updateConnectionStatus(false);
  bindCartForms();
  connectWebSocket();
})();
