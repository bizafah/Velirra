document.addEventListener('DOMContentLoaded', () => {
    /* --- SHARED DATA: PRODUCT DATABASE --- */
    const products = [
        { id: 'legacy', name: 'Velirra Legacy', inspiration: 'Azzaro The Most Wanted', price: 2700, image: 'legacybk.png', url: 'product-legacy.html', gender: 'Men', notes: 'Cardamom, Ginger, Lemon' },
        { id: 'classic', name: 'Velirra Classic', inspiration: 'Dolce & Gabbana Pour Homme', price: 2700, image: 'classicbk.png', url: 'product-classic.html', gender: 'Men', notes: 'Citrus, Herbs, Tobacco' },
        { id: '7one', name: 'Velirra 7ONE', inspiration: 'Invictus Legend', price: 2400, image: '7onebk.png', url: 'product-7one.html', gender: 'Unisex', notes: 'Sea Salt, Grapefruit, Amber Wood' },
        { id: 'aqua', name: 'Velirra Aqua', inspiration: 'Acqua Di Gio', price: 3250, image: 'aquabk.png', url: 'product-aqua.html', gender: 'Men', notes: 'Bergamot, Marine, Cedarwood' },
        { id: 'bloom', name: 'Velirra Bloom', inspiration: 'VS Bombshell', price: 1850, image: 'bloombk.png', url: 'product-bloom.html', gender: 'Women', notes: 'Passionfruit, Peony, Musk' },
        { id: 'legendary', name: 'Velirra Legendary', inspiration: '1 Million Lucky', price: 2300, image: 'legendarybk.png', url: 'product-legendary.html', gender: 'Unisex', notes: 'Plum, Hazelnut, Amber' },
        { id: 'intense', name: 'Velirra Intense', inspiration: 'Tom Ford Tuscan Leather', price: 2400, image: 'intensebk.png', url: 'product-intense.html', gender: 'Unisex', notes: 'Raspberry, Leather, Amber' },
        { id: 'ocean', name: 'Velirra Ocean', inspiration: 'Davidoff Cool Water', price: 1900, image: 'oceanbk.png', url: 'product-ocean.html', gender: 'Women', notes: 'Mint, Sea Water, Lavender' },
        { id: 'prime', name: 'Velirra Prime', inspiration: 'Bleu de Chanel', price: 2200, image: 'primebk.png', url: 'product-prime.html', gender: 'Men', notes: 'Citrus, Spices, Siky Notes' },
        { id: 'blue', name: 'Velirra Blue', inspiration: 'Light Blue D&G', price: 2900, image: 'Blue.jpeg', url: 'product-blue.html', gender: 'Women', notes: 'Mandarin, Grapefruit, Juniper' },
        { id: 'homme', name: 'Velirra Homme', inspiration: 'Dior Homme Intense', price: 2900, image: 'Homme.jpeg', url: 'product-homme.html', gender: 'Men', notes: 'Lavender, Iris, Cedar' }
    ];

    /* --- HERO SLIDER --- */
    const slides = document.querySelectorAll('.slide');
    if (slides.length > 0) {
        let currentSlide = 0;
        setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 1500);
    }

    /* --- SEARCH SYSTEM --- */
    const searchTrigger = document.querySelector('.search-trigger');
    const searchOverlay = document.querySelector('.search-overlay');
    const closeSearch = document.querySelector('.close-search');
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');

    if (searchTrigger) {
        searchTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            searchOverlay.classList.add('active');
            setTimeout(() => searchInput.focus(), 300);
        });
    }

    if (closeSearch) {
        closeSearch.addEventListener('click', () => searchOverlay.classList.remove('active'));
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            if (query.length < 2) {
                searchResults.innerHTML = '';
                return;
            }

            const matches = products.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.inspiration.toLowerCase().includes(query) ||
                p.notes.toLowerCase().includes(query)
            );

            searchResults.innerHTML = matches.map(p => `
                <a href="${p.url}" class="search-result-item">
                    <img src="${p.image}" alt="${p.name}">
                    <div class="search-result-info">
                        <h4>${p.name}</h4>
                        <p>${p.inspiration}</p>
                    </div>
                </a>
            `).join('');
        });
    }

    /* --- CART SYSTEM --- */
    let cart = JSON.parse(localStorage.getItem('velirra_cart')) || [];
    let isDiscountApplied = localStorage.getItem('velirra_discount') === 'true';

    const cartTrigger = document.querySelector('.cart-trigger');
    const cartDrawer = document.querySelector('.cart-drawer');
    const closeCart = document.querySelector('.close-cart');
    const drawerOverlay = document.querySelector('.drawer-overlay');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartCountBadge = document.querySelector('.cart-count');

    // Promo Elements
    const promoInput = document.getElementById('promo-input');
    const applyPromoBtn = document.getElementById('apply-promo');
    const discountRow = document.getElementById('discount-row');
    const discountAmountDisplay = document.getElementById('discount-amount');

    function updateCartUI() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty</div>';
            cartSubtotal.textContent = '₨ 0';
            cartCountBadge.textContent = '0';
            if (discountRow) discountRow.style.display = 'none';
            isDiscountApplied = false;
            localStorage.removeItem('velirra_discount');
        } else {
            let total = 0;
            let count = 0;
            cartItemsContainer.innerHTML = cart.map((item, index) => {
                total += item.price * item.quantity;
                count += item.quantity;
                return `
                    <div class="cart-item">
                        <div class="cart-item-img"><img src="${item.image}" alt="${item.name}"></div>
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <div class="cart-item-price">₨ ${item.price}</div>
                            <div class="cart-item-qty">
                                <button class="qty-control minus" data-index="${index}">-</button>
                                <span>${item.quantity}</span>
                                <button class="qty-control plus" data-index="${index}">+</button>
                            </div>
                            <button class="remove-item" data-index="${index}">Remove</button>
                        </div>
                    </div>
                `;
            }).join('');

            if (isDiscountApplied) {
                const discount = total * 0.20;
                const grandTotal = total - discount;
                if (discountRow) {
                    discountRow.style.display = 'flex';
                    discountAmountDisplay.textContent = `-₨ ${discount.toLocaleString()}`;
                }
                cartSubtotal.textContent = `₨ ${grandTotal.toLocaleString()}`;
            } else {
                if (discountRow) discountRow.style.display = 'none';
                cartSubtotal.textContent = `₨ ${total.toLocaleString()}`;
            }

            cartCountBadge.textContent = count;
        }
        localStorage.setItem('velirra_cart', JSON.stringify(cart));
    }

    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toLowerCase();
            if (code === 'velirra12345') {
                isDiscountApplied = true;
                localStorage.setItem('velirra_discount', 'true');
                alert('Success! 20% Discount Applied.');
                updateCartUI();
            } else {
                alert('Invalid Promo Code');
            }
        });
    }

    if (cartTrigger) {
        cartTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            cartDrawer.classList.add('active');
            drawerOverlay.classList.add('active');
        });
    }

    if (closeCart) {
        closeCart.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', () => {
            cartDrawer.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });
    }

    // Add to Cart Logic (on Product Detail Pages)
    const addToCartBtn = document.querySelector('.add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const productTitle = document.querySelector('.product-title').textContent.trim();
            const qtyInput = document.querySelector('.qty-input');
            const quantity = qtyInput ? parseInt(qtyInput.value) : 1;

            // Find product by title
            const productObj = products.find(p => productTitle.toLowerCase().includes(p.name.toLowerCase()));

            if (productObj) {
                const existingItem = cart.find(item => item.id === productObj.id);
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    cart.push({ ...productObj, quantity });
                }
                updateCartUI();
                cartDrawer.classList.add('active');
                drawerOverlay.classList.add('active');
            }
        });
    }

    // Cart Actions (Remove/Qty)
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (e.target.classList.contains('remove-item')) {
                cart.splice(index, 1);
                updateCartUI();
            } else if (e.target.classList.contains('plus')) {
                cart[index].quantity++;
                updateCartUI();
            } else if (e.target.classList.contains('minus')) {
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                    updateCartUI();
                }
            }
        });
    }

    /* --- WHATSAPP CHECKOUT --- */
    const checkoutBtn = document.querySelector('.checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const closeModalBtn = document.querySelector('.close-modal');

    if (checkoutBtn && checkoutModal) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return alert('Your cart is empty!');

            // Close cart drawer first
            cartDrawer.classList.remove('active');
            // Keep overlay active for modal

            // Open delivery details modal
            checkoutModal.classList.add('active');
        });
    }

    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', () => {
            checkoutModal.classList.remove('active');
            drawerOverlay.classList.remove('active');
        });
    }

    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get Delivery Details
            const phone = document.getElementById('checkout-phone').value;
            const address = document.getElementById('checkout-address').value;
            const postal = document.getElementById('checkout-postal').value;
            const location = document.getElementById('checkout-location').value;

            // Construct Message
            let message = "Salam Velirra! I would like to place an order:\n\n";
            message += "*--- ORDER DETAILS ---*\n";

            let total = 0;
            cart.forEach(item => {
                message += `• ${item.name} x${item.quantity} (₨ ${item.price * item.quantity})\n`;
                total += item.price * item.quantity;
            });

            if (isDiscountApplied) {
                const discount = total * 0.20;
                message += `\nSubtotal: ₨ ${total}\n`;
                message += `Promo Discount (20%): -₨ ${discount}\n`;
                message += `*Grand Total: ₨ ${total - discount}*\n`;
                message += `Code Applied: velirra12345\n`;
            } else {
                message += `\n*Total: ₨ ${total}*\n`;
            }

            message += "\n*--- DELIVERY DETAILS ---*\n";
            message += `📞 Phone: ${phone}\n`;
            message += `📍 Address: ${address}\n`;
            if (postal) message += `📮 Postal Code: ${postal}\n`;
            if (location) message += `🗺️ Map Location: ${location}\n`;

            message += "\n\nPlease let me know the payment details.";

            // Open WhatsApp
            const encodedMessage = encodeURIComponent(message);
            window.open(`https://wa.me/923710738971?text=${encodedMessage}`, '_blank');

            // Reset and Close
            checkoutModal.classList.remove('active');
            drawerOverlay.classList.remove('active');

            // Optional: Clear cart after order
            // cart = [];
            // updateCartUI();
        });
    }

    /* --- QUANTITY SELECTOR (Shared) --- */
    const minusBtn = document.querySelector('.qty-btn.minus');
    const plusBtn = document.querySelector('.qty-btn.plus');
    const qtyInput = document.querySelector('.qty-input');

    if (minusBtn && plusBtn && qtyInput) {
        minusBtn.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            if (value > 1) qtyInput.value = value - 1;
        });
        plusBtn.addEventListener('click', () => {
            let value = parseInt(qtyInput.value);
            qtyInput.value = value + 1;
        });
    }

    /* --- TESTIMONIAL CAROUSEL --- */
    const testimonialTrack = document.querySelector('.testimonial-track');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.dot');
    const nextBtn = document.querySelector('.next-test');
    const prevBtn = document.querySelector('.prev-test');

    if (testimonialTrack && testimonialCards.length > 0) {
        let currentIdx = 0;
        const totalSlides = testimonialCards.length;

        function getCardsPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function updateCarousel() {
            const cardsPerView = getCardsPerView();
            const cardWidth = testimonialCards[0].offsetWidth + 30; // Including gap
            testimonialTrack.style.transform = `translateX(-${currentIdx * cardWidth}px)`;

            // Update dots
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIdx);
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxIdx = totalSlides - getCardsPerView();
                currentIdx = (currentIdx + 1) > maxIdx ? 0 : currentIdx + 1;
                updateCarousel();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const maxIdx = totalSlides - getCardsPerView();
                currentIdx = (currentIdx - 1) < 0 ? maxIdx : currentIdx - 1;
                updateCarousel();
            });
        }

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentIdx = index;
                updateCarousel();
            });
        });

        // Handle Resizing
        window.addEventListener('resize', updateCarousel);
    }

    // Initial Load
    updateCartUI();
});
