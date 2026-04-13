// Preloader
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.querySelector('.preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 2000);
});

// Custom Cursor
const cursor = document.querySelector('.cursor');
const updateCursor = () => {
    const interactiveElements = document.querySelectorAll('a, button, .product-card, .cart-trigger, .tab-btn');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
};

if (cursor) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    updateCursor();
}

// Navigation Scroll Effect
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
    if (nav) {
        if (window.scrollY > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-menu a');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('active');
    });

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            mobileMenu.classList.remove('active');
        });
    });
}

// Cart Sidebar Logic
const cartTrigger = document.querySelector('.cart-trigger');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartClose = document.querySelector('.cart-close');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.querySelector('.cart-count');
const cartTotalAmount = document.querySelector('.total-amount');

let cart = JSON.parse(localStorage.getItem('velirra_cart')) || [];

const toggleCart = () => {
    if (cartSidebar) cartSidebar.classList.toggle('active');
    if (cartOverlay) cartOverlay.classList.toggle('active');
};

if (cartTrigger) cartTrigger.addEventListener('click', toggleCart);
if (cartClose) cartClose.addEventListener('click', toggleCart);
if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

const updateCartUI = () => {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your collection is empty.</div>';
        if (cartCount) cartCount.textContent = '0';
        if (cartTotalAmount) cartTotalAmount.textContent = '₨ 0';
    } else {
        let total = 0;
        cart.forEach((item, index) => {
            total += item.price;
            const itemElement = document.createElement('div');
            itemElement.classList.add('cart-item');
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">₨ ${item.price.toLocaleString()}</p>
                    <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        if (cartCount) cartCount.textContent = cart.length;
        if (cartTotalAmount) cartTotalAmount.textContent = `₨ ${total.toLocaleString()}`;
    }
    localStorage.setItem('velirra_cart', JSON.stringify(cart));
};

window.addToCart = (id, name, price, image) => {
    cart.push({ id, name, price, image });
    updateCartUI();
    if (cartSidebar && !cartSidebar.classList.contains('active')) {
        toggleCart();
    }
};

window.removeFromCart = (index) => {
    cart.splice(index, 1);
    updateCartUI();
};

document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const card = e.target.closest('.product-card');
        const id = card.dataset.id;
        const name = card.querySelector('.product-name').textContent;
        const priceText = card.querySelector('.product-price').textContent;
        const price = parseFloat(priceText.replace(/[^0-9.]/g, ''));
        const image = card.querySelector('img').src;
        window.addToCart(id, name, price, image);
    });
});

updateCartUI();

// Category Filtering
const tabBtns = document.querySelectorAll('.tab-btn');
const productCards = document.querySelectorAll('.product-card');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.dataset.category;

        productCards.forEach(card => {
            if (category === 'all' || card.dataset.category.split(' ').includes(category)) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// Reveal Animation on Scroll disabled

// WhatsApp Checkout Implementation
const checkoutBtn = document.querySelector('.checkout-btn');
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your collection is empty! Add some fragrances before checking out.');
            return;
        }

        let message = "Hello Velirra Store! I would like to place an order from your website:\n\n";
        let total = 0;

        cart.forEach((item, index) => {
            message += `${index + 1}. *${item.name}*\n   Price: ₨ ${item.price.toLocaleString()}\n`;
            total += item.price;
        });

        message += `\n*TOTAL AMOUNT: ₨ ${total.toLocaleString()}*`;
        message += "\n\nPlease let me know the payment details and delivery time. Thank you!";

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/923710738971?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    });
}

// Search and Real-time Filtering
const searchInput = document.getElementById('perfume-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const activeTab = document.querySelector('.tab-btn.active');
        const currentCategory = activeTab ? activeTab.dataset.category : 'all';

        productCards.forEach(card => {
            const name = card.querySelector('.product-name').textContent.toLowerCase();
            const categoryText = card.querySelector('.product-category').textContent.toLowerCase();
            const matchesSearch = name.includes(searchTerm) || categoryText.includes(searchTerm);
            const matchesCategory = (currentCategory === 'all' || card.dataset.category === currentCategory);

            if (matchesSearch && matchesCategory) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Handle URL Parameters
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cat = urlParams.get('cat');
    if (cat) {
        const targetTab = document.querySelector(`.tab-btn[data-category="${cat}"]`);
        if (targetTab) {
            setTimeout(() => targetTab.click(), 100);
        }
    }
});
