/**
 * Creaciones Yanmary - Shopping Cart System
 * Author: Creaciones Yanmary Team
 * Year: 2025
 * CON PROTECCIÓN ANTI-SPAM COMPLETA
 */

'use strict';

// ========================================
// VARIABLES GLOBALES
// ========================================
let cart = [];
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 60000; // 1 minuto entre envíos

// ========================================
// FUNCIONES DE NAVEGACIÓN
// ========================================

function toggleMenu() {
    const menu = document.getElementById('navMenu');
    menu.classList.toggle('active');
}

// ========================================
// FUNCIONES DEL CARRITO
// ========================================

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

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        removeFromCart(index);
    } else {
        updateCart();
    }
}

function updateCart() {
    const cartCount = document.getElementById('cartCount');
    const cartCountMobile = document.getElementById('cartCountMobile');
    const cartItems = document.getElementById('cartItems');
    const totalAmount = document.getElementById('totalAmount');
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    if (cartCountMobile) {
        cartCountMobile.textContent = totalItems;
    }
    
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

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.classList.toggle('active');
    
    const isActive = modal.classList.contains('active');
    modal.setAttribute('aria-hidden', !isActive);
}

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

function handleCheckout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de finalizar la compra.');
        return;
    }
    
    toggleCart();
    toggleContactModal();
}

function toggleContactModal() {
    const modal = document.getElementById('contactModal');
    modal.classList.toggle('active');
    
    const isActive = modal.classList.contains('active');
    modal.setAttribute('aria-hidden', !isActive);
}

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

function generateWhatsAppMessage() {
    let message = '¡Hola! Creaciones Yanmary - Me gustaría hacer un pedido:\n\n';
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

function sendWhatsApp() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío. Agrega productos antes de enviar por WhatsApp.');
        return;
    }
    
    const whatsappNumber = '5804128031454';
    const message = generateWhatsAppMessage();
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${message}`;
    
    window.open(whatsappURL, '_blank');
}

// ========================================
// FUNCIONES DE SEGURIDAD ANTI-SPAM
// ========================================

/**
 * Validar honeypot (trampa para bots)
 */
function validateHoneypot() {
    const honeypot = document.getElementById('website');
    if (honeypot && honeypot.value !== '') {
        console.log('🤖 Bot detectado: honeypot lleno');
        return false;
    }
    return true;
}

/**
 * Validar rate limiting (máximo 1 envío por minuto)
 */
function validateRateLimit() {
    const currentTime = Date.now();
    const timeSinceLastSubmit = currentTime - lastSubmitTime;
    
    if (timeSinceLastSubmit < SUBMIT_COOLDOWN) {
        const remainingSeconds = Math.ceil((SUBMIT_COOLDOWN - timeSinceLastSubmit) / 1000);
        alert(`⏱️ Por favor espera ${remainingSeconds} segundos antes de enviar otro pedido.`);
        return false;
    }
    
    return true;
}

/**
 * Validar contenido sospechoso en campos de texto
 */
function validateContent(text) {
    const suspiciousKeywords = [
        'nigeria', 'nigerian', 'prince', 'inheritance', 'lottery', 'winner', 
        'million', 'billion', 'bitcoin', 'crypto', 'investment', 'viagra',
        'casino', 'loan', 'debt', 'refinance', 'credit card', 'bank account',
        'príncipe', 'herencia', 'lotería', 'ganador', 'millón', 'préstamo'
    ];
    
    const lowerText = text.toLowerCase();
    
    for (const keyword of suspiciousKeywords) {
        if (lowerText.includes(keyword)) {
            console.log(`🚫 Contenido sospechoso detectado: ${keyword}`);
            return false;
        }
    }
    
    // Detectar exceso de URLs
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    const urls = text.match(urlPattern);
    if (urls && urls.length > 2) {
        console.log('🚫 Demasiadas URLs detectadas');
        return false;
    }
    
    // Detectar caracteres repetidos excesivamente (típico de spam)
    const repeatedChars = /(.)\1{10,}/g;
    if (repeatedChars.test(text)) {
        console.log('🚫 Caracteres repetidos detectados');
        return false;
    }
    
    return true;
}

/**
 * Sanitizar texto para prevenir inyección
 */
function sanitizeText(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Enviar pedido por correo usando EmailJS
 */
function sendOrder(formData) {
    const submitButton = document.getElementById('submitButton');
    const originalText = submitButton.innerHTML;
    
    // VALIDACIÓN 1: Honeypot
    if (!validateHoneypot()) {
        console.log('❌ Envío bloqueado: Bot detectado');
        return;
    }
    
    // VALIDACIÓN 2: Rate Limiting
    if (!validateRateLimit()) {
        return;
    }
    
    // VALIDACIÓN 3: Contenido sospechoso
    const fullText = `${formData.user_name} ${formData.user_address} ${formData.user_notes}`;
    if (!validateContent(fullText)) {
        alert('⚠️ Tu mensaje contiene contenido que no podemos procesar. Por favor, revisa la información e intenta nuevamente.');
        return;
    }
    
    // VALIDACIÓN 4: Longitud mínima del nombre
    if (formData.user_name.length < 3) {
        alert('⚠️ Por favor ingresa tu nombre completo.');
        return;
    }
    
    // VALIDACIÓN 5: Email válido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.user_email)) {
        alert('⚠️ Por favor ingresa un correo electrónico válido.');
        return;
    }
    
    submitButton.innerHTML = '📤 Enviando...';
    submitButton.disabled = true;
    
    const orderSummary = generateOrderSummary();
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Sanitizar datos antes de enviar
    const templateParams = {
        user_name: sanitizeText(formData.user_name),
        user_email: sanitizeText(formData.user_email),
        user_phone: sanitizeText(formData.user_phone || 'No proporcionado'),
        user_address: sanitizeText(formData.user_address),
        user_notes: sanitizeText(formData.user_notes || 'Ninguna'),
        order_summary: orderSummary,
        order_total: `$${total.toFixed(2)}`,
        order_date: new Date().toLocaleString('es-ES')
    };
    
    const SERVICE_ID = 'service_5ns1roo';
    const TEMPLATE_ID = 'template_5lk9o49';
    
    emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams)
        .then(function(response) {
            console.log('✅ SUCCESS!', response.status);
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Actualizar timestamp del último envío
            lastSubmitTime = Date.now();
            
            alert('✅ ¡Pedido enviado exitosamente!\n\nRecibirás una confirmación en tu correo electrónico.');
            
            cart = [];
            updateCart();
            toggleContactModal();
            document.getElementById('contactForm').reset();
            
        }, function(error) {
            console.log('❌ FAILED...', error);
            
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            alert('❌ Error al enviar el pedido.\n\nPor favor, intenta nuevamente.');
        });
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    updateCart();
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                user_name: document.getElementById('userName').value,
                user_email: document.getElementById('userEmail').value,
                user_phone: document.getElementById('userPhone').value,
                user_address: document.getElementById('userAddress').value,
                user_notes: document.getElementById('userNotes').value
            };
            
            sendOrder(formData);
        });
    }
    
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('click', function(e) {
            if (e.target === this) {
                toggleCart();
            }
        });
    }
    
    const contactModal = document.getElementById('contactModal');
    if (contactModal) {
        contactModal.addEventListener('click', function(e) {
            if (e.target === this) {
                toggleContactModal();
            }
        });
    }
    
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