/**
 * Creaciones Yanmary - Shopping Cart System
 * Author: Creaciones Yanmary Team
 * Year: 2025
 */

'use strict';

// ========================================
// VARIABLES GLOBALES
// ========================================
let cart = [];

// ========================================
// FUNCIONES DE NAVEGACIÓN
// ========================================

/**
 * Alternar visibilidad del menú móvil
 */
function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// ========================================
// FUNCIONES DEL CARRITO
// ========================================

/**
 * Agregar producto al carrito
 * @param {string} name - Nombre del producto
 * @param {number} price - Precio del producto
 * @param {string} image - URL de la imagen del producto
 */
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification();
}

/**
 * Eliminar producto del carrito
 * @param {number} index - Índice del producto en el array
 */
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

/**
 * Actualizar cantidad de un producto
 * @param {number} index - Índice del producto
 * @param {number} change - Cambio en la cantidad (+1 o -1)
 */
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCart();
    }
}

/**
 * Actualizar interfaz del carrito
 */
function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    
    // Calcular total de productos
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Actualizar contador móvil también
    if (cartCountMobile) {
        cartCountMobile.textContent = totalItems;
    }
    
    // Si el carrito está vacío
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        totalAmount.textContent = '$0.00';
        return;
    }
    
    // Generar HTML de los productos
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)} c/u</div>
                    </div>
                </div>
                <div class="cart-item-quantity">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)" aria-label="Disminuir cantidad">−</button>
                    <span style="font-weight: bold; min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)" aria-label="Aumentar cantidad">+</button>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">Eliminar</button>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

/**
 * Alternar visibilidad del modal del carrito
 */
function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
    
    // Actualizar atributo aria-hidden
    const isActive = modal.classList.contains('active');
    modal.setAttribute('aria-hidden', !isActive);
}

/**
 * Mostrar notificación de producto agregado
 */
function showNotification() {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// ========================================
// FUNCIONES DE CHECKOUT
// ========================================

/**
 * Manejar proceso de checkout
 */
function handleCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }
    
    toggleCart(); // Cerrar carrito
    toggleContactModal(); // Abrir formulario
}

/**
 * Alternar modal de contacto
 */
function toggleContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.toggle('active');
    
    const isActive = modal.classList.contains('active');
    modal.setAttribute('aria-hidden', !isActive);
}

/**
 * Generar resumen del pedido en texto
 */
function generateOrderSummary() {
    let summary = '=== RESUMEN DEL PEDIDO ===\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        summary += `${index + 1}. ${item.name}\n`;
        summary += `   Cantidad: ${item.quantity}\n`;
        summary += `   Precio unitario: $${item.price.toFixed(2)}\n`;
        summary += `   Subtotal: $${itemTotal.toFixed(2)}\n\n`;
    });
    
    summary += `------------------------\n`;
    summary += `TOTAL: $${total.toFixed(2)}\n`;
    summary += `========================`;
    
    return summary;
}

/**
 * Generar mensaje para WhatsApp
 */
function generateWhatsAppMessage() {
    let message = '¡Hola! Creaciones Yanmary Me gustaría hacer un pedido:\n\n';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `${index + 1}. *${item.name}*\n`;
        message += `   • Cantidad: ${item.quantity}\n`;
        message += `   • Precio: $${item.price.toFixed(2)} c/u\n`;
        message += `   • Subtotal: $${itemTotal.toFixed(2)}\n\n`;
    });
    
    message += `💰 *TOTAL: $${total.toFixed(2)}*\n\n`;
    message += `¿Podrían confirmar disponibilidad? Gracias 😊`;
    
    return encodeURIComponent(message);
}

/**
 * Enviar pedido por WhatsApp
 */
function sendWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de enviar por WhatsApp.');
        return;
    }
    
    // Número de WhatsApp configurado (Venezuela +58 0412 8031454)
    const whatsappNumber = '5804128031454';
    
    const message = generateWhatsAppMessage();
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    // Abrir WhatsApp en nueva pestaña
    window.open(whatsappURL, '_blank');
}

/**
 * Enviar pedido por correo usando EmailJS
 */
function sendOrder(formData) {
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton.innerHTML;
    
    // Cambiar texto del botón
    submitButton.innerHTML = '📤 Enviando...';
    submitButton.disabled = true;
    
    const orderSummary = generateOrderSummary();
    
    // Calcular total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Preparar los parámetros del template
    const templateParams = {
        user_name: formData.user_name,
        user_email: formData.user_email,
        user_phone: formData.user_phone || 'No proporcionado',
        user_address: formData.user_address,
        user_notes: formData.user_notes || 'Ninguna',
        order_summary: orderSummary,
        order_total: `$${total.toFixed(2)}`,
        order_date: new Date().toLocaleString('es-ES')
    };
    
    // IMPORTANTE: Reemplaza estos valores con los tuyos de EmailJS
    const SERVICE_ID = 'service_5ns1roo';
    const TEMPLATE_ID = 'template_5lk9o49';
    
    // Enviar email usando EmailJS
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Mostrar mensaje de éxito
            alert('✅ ¡Pedido enviado exitosamente!\n\nRecibirás una confirmación en tu correo electrónico.');
            
            // Limpiar carrito y cerrar modal
            cart = [];
            updateCart();
            toggleContactModal();
            
            // Limpiar formulario
            document.getElementById('contactForm').reset();
            
        }, function(error) {
            console.log('FAILED...', error);
            
            // Restaurar botón
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Mostrar mensaje de error
            alert('❌ Error al enviar el pedido.\n\nPor favor, intenta nuevamente o contacta con soporte.\n\nError: ' + JSON.stringify(error));
        });
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Inicialización cuando el DOM está listo
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar carrito al cargar la página
    updateCart();
    
    // Event listener para el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obtener datos del formulario
            const formData = {
                user_name: document.getElementById('userName').value,
                user_email: document.getElementById('userEmail').value,
                user_phone: document.getElementById('userPhone').value,
                user_address: document.getElementById('userAddress').value,
                user_notes: document.getElementById('userNotes').value
            };
            
            // Enviar pedido
            sendOrder(formData);
        });
    }
    
    // Cerrar modal del carrito al hacer clic fuera del contenido
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === this) {
                toggleCart();
            }
        });
    }
    
    // Cerrar modal de contacto al hacer clic fuera
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === this) {
                toggleContactModal();
            }
        });
    }
    
    // Cerrar menú móvil al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            const menu = document.getElementById('navMenu');
            if (menu.classList.contains('active')) {
                menu.classList.remove('active');
            }
        });
    });
});

/**
 * Cerrar modales con tecla Escape
 */
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const cartModal = document.getElementById('cartModal');
        if (cartModal.classList.contains('active')) {
            toggleCart();
        }
        const contactModal = document.getElementById('contactModal');
        if (contactModal.classList.contains('active')) {
            toggleContactModal();
        }
    }
});