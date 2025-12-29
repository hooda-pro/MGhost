// ==================== تهيئة الموقع ====================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 موقع MGhost جاهز للعمل!');
    
    // تهيئة جميع المكونات
    initializeSplashScreen();
    initializeSettings();
    initializeCartSystem();
    initializeQuantitySelector();
    initializeGallery();
    initializeCheckout();
    initializeAnimations();
    
    // تحديث العداد أول مرة
    updateCartCount();
});

// ==================== 1. شاشة الترحيب ====================
function initializeSplashScreen() {
    const splashScreen = document.getElementById('splash-screen');
    
    // إخفاء شاشة الترحيب بعد 2.5 ثانية
    setTimeout(() => {
        splashScreen.classList.add('fade-out');
        
        // إزالة من DOM بعد انتهاء الأنيميشن
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
    }, 2500);
}

// ==================== 2. إعدادات اللغة والمظهر ====================
function initializeSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const settingsPanel = document.getElementById('settings-panel');
    const closeSettings = document.querySelector('.close-settings');
    const languageSelect = document.getElementById('language-select');
    const themeBtns = document.querySelectorAll('.theme-btn');

    // فتح/إغلاق لوحة الإعدادات
    settingsBtn.addEventListener('click', () => {
        settingsPanel.classList.toggle('show');
    });

    closeSettings.addEventListener('click', () => {
        settingsPanel.classList.remove('show');
    });

    // تغيير اللغة
    languageSelect.addEventListener('change', (e) => {
        const lang = e.target.value;
        changeLanguage(lang);
    });

    // تغيير المظهر
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            
            // إزالة النشط من جميع الأزرار
            themeBtns.forEach(b => b.classList.remove('active'));
            // إضافة النشط للزر المحدد
            this.classList.add('active');
            
            // تغيير المظهر
            changeTheme(theme);
        });
    });

    // إغلاق لوحة الإعدادات عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (!settingsPanel.contains(e.target) && !settingsBtn.contains(e.target)) {
            settingsPanel.classList.remove('show');
        }
    });

    // تحميل المظهر المحفوظ
    loadSavedTheme();
}

// تغيير اللغة
function changeLanguage(lang) {
    const html = document.documentElement;
    html.setAttribute('lang', lang);
    
    if (lang === 'ar') {
        html.setAttribute('dir', 'rtl');
        document.title = 'MGhost Gaming Finger Sleeves - صوابع الجيمينج';
        showNotification('تم تغيير اللغة إلى العربية');
    } else if (lang === 'en') {
        html.setAttribute('dir', 'ltr');
        document.title = 'MGhost Gaming Finger Sleeves';
        showNotification('Language changed to English');
    } else {
        html.setAttribute('dir', 'ltr');
        document.title = 'MGhost Gaming Finger Sleeves';
        showNotification('Language changed');
    }
    
    localStorage.setItem('language', lang);
}

// تغيير المظهر
function changeTheme(theme) {
    const body = document.body;
    
    if (theme === 'dark') {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme', 'light');
    }
}

// تحميل المظهر المحفوظ
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    changeTheme(savedTheme);
    
    // تحديث أزرار المظهر
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        }
    });
}

// ==================== 3. نظام السلة (مبسط) ====================
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function initializeCartSystem() {
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const addToCartBtn = document.getElementById('add-to-cart');
    const buyNowBtn = document.getElementById('buy-now');

    // فتح/إغلاق السلة
    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.add('show');
        updateCartDisplay();
    });

    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('show');
    });

    // زر أضف إلى السلة
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(quantity);
            cartSidebar.classList.add('show');
        });
    }

    // زر شراء الآن
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', () => {
            const quantity = parseInt(document.getElementById('quantity').value);
            addToCart(quantity);
            cartSidebar.classList.add('show');
        });
    }

    // زر إتمام الشراء
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            showNotification('السلة فارغة. أضف منتجات أولاً.');
            return;
        }
        cartSidebar.classList.remove('show');
        openCheckoutModal();
    });

    // تحديث السلة عند التحميل
    updateCartCount();
}

// إضافة منتج للسلة (منتج واحد، لون واحد)
function addToCart(quantity) {
    // منتج واحد فقط - صورة واحدة
    const product = {
        id: 1, // منتج واحد فقط
        name: 'MGhost Gaming Finger Sleeves',
        price: 399.00,
        quantity: quantity,
        image: 'images/product.jpg' // صورة واحدة فقط
    };

    // إذا المنتج موجود بالسلة، نزيد الكمية فقط
    const existingIndex = cart.findIndex(item => item.id === 1);
    
    if (existingIndex > -1) {
        // تحديث الكمية إذا المنتج موجود
        cart[existingIndex].quantity += quantity;
    } else {
        // إضافة منتج جديد
        cart.push(product);
    }

    // حفظ في localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // تحديث العرض
    updateCartCount();
    updateCartDisplay();
    
    // إظهار رسالة تأكيد
    showNotification(`تم إضافة ${quantity} منتج إلى السلة`);
    
    // أنيميشن زر السلة
    animateCartButton();
}

// تحديث عداد السلة
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// تحديث عرض السلة
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // إذا السلة فارغة
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-cart"></i>
                <p>سلة المشتريات فارغة</p>
                <p>أضف منتجات لتظهر هنا</p>
            </div>
        `;
        cartTotalPrice.textContent = 'LE 0.00';
        return;
    }
    
    // تحديث العناصر
    cartItemsContainer.innerHTML = '';
    
    let totalPrice = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}" 
                 onerror="this.src='images/product.jpg'">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="item-price">LE ${item.price.toFixed(2)} للقطعة</p>
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn minus" onclick="updateCartItemQuantity(${index}, -1)">
                    <i class="fas fa-minus"></i>
                </button>
                <span class="item-qty">${item.quantity}</span>
                <button class="qty-btn plus" onclick="updateCartItemQuantity(${index}, 1)">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="remove-item" onclick="removeFromCart(${index})" title="إزالة">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    // تحديث السعر الإجمالي
    cartTotalPrice.textContent = `LE ${totalPrice.toFixed(2)}`;
}

// تحديث كمية عنصر في السلة
window.updateCartItemQuantity = function(index, change) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity += change;
        
        // إزالة المنتج إذا كانت الكمية 0 أو أقل
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
            showNotification('تم إزالة المنتج من السلة');
        } else {
            showNotification('تم تحديث الكمية');
        }
        
        // حفظ في localStorage
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // تحديث العرض
        updateCartCount();
        updateCartDisplay();
    }
}

// إزالة منتج من السلة
window.removeFromCart = function(index) {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        const itemName = cart[index].name;
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        
        updateCartCount();
        updateCartDisplay();
        showNotification(`تم إزالة ${itemName} من السلة`);
    }
}

// أنيميشن زر السلة
function animateCartButton() {
    const cartBtn = document.getElementById('cart-btn');
    cartBtn.style.transform = 'scale(1.2) rotate(-10deg)';
    
    setTimeout(() => {
        cartBtn.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
}

// ==================== 4. اختيار الكمية (مصحح بدون أسهم) ====================
function initializeQuantitySelector() {
    const quantityInput = document.getElementById('quantity');
    const minusBtn = document.getElementById('qty-minus');
    const plusBtn = document.getElementById('qty-plus');
    const totalPriceElement = document.getElementById('total-price');
    const unitPrice = 399.00;

    // إخفاء الأسهم نهائياً وجعل الحقل للقراءة فقط
    quantityInput.readOnly = true;
    
    // تحديث السعر الإجمالي
    function updateTotalPrice() {
        const quantity = parseInt(quantityInput.value);
        const totalPrice = unitPrice * quantity;
        totalPriceElement.textContent = `LE ${totalPrice.toFixed(2)}`;
        
        // أنيميشن التغيير
        totalPriceElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
            totalPriceElement.style.transform = 'scale(1)';
        }, 300);
    }

    // زر النقص - كبير وسهل الضغط
    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
            updateTotalPrice();
            
            // أنيميشن الزر
            minusBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                minusBtn.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // زر الزيادة - كبير وسهل الضغط
    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < 10) {
            quantityInput.value = value + 1;
            updateTotalPrice();
            
            // أنيميشن الزر
            plusBtn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                plusBtn.style.transform = 'scale(1)';
            }, 150);
        }
    });

    // تحديث أول مرة
    updateTotalPrice();
}

// ==================== 5. معرض الصور ====================
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const imageModal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const closeImageModal = document.querySelector('.close-image-modal');

    // تكبير الصور عند النقر
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const imgSrc = this.querySelector('img').src;
            modalImage.src = imgSrc;
            imageModal.classList.add('show');
        });
    });

    // إغلاق نافذة الصورة
    closeImageModal.addEventListener('click', () => {
        imageModal.classList.remove('show');
    });

    // إغلاق عند النقر خارج الصورة
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            imageModal.classList.remove('show');
        }
    });
}

// ==================== 6. إتمام الشراء ====================
function initializeCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutForm = document.getElementById('checkout-form');
    const closeCheckout = document.querySelector('.close-checkout');

    // فتح نافذة إتمام الشراء
    window.openCheckoutModal = function() {
        checkoutModal.classList.add('show');
    };

    // إغلاق نافذة إتمام الشراء
    closeCheckout.addEventListener('click', () => {
        checkoutModal.classList.remove('show');
    });

    // إغلاق عند النقر خارج النافذة
    checkoutModal.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.classList.remove('show');
        }
    });

    // معالجة نموذج الشراء
    checkoutForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // جمع البيانات
        const formData = {
            email: document.getElementById('email').value,
            firstName: document.getElementById('first-name').value,
            lastName: document.getElementById('last-name').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            phone: document.getElementById('phone').value,
            payment: document.querySelector('input[name="payment"]:checked').value,
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
        };
        
        // هنا يمكنك إرسال البيانات للخادم
        console.log('بيانات الطلب:', formData);
        
        // عرض رسالة نجاح
        showNotification('تم تأكيد طلبك بنجاح! سنتواصل معك قريباً.', 'success');
        
        // إغلاق النافذة
        checkoutModal.classList.remove('show');
        
        // تفريغ السلة
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        updateCartDisplay();
        
        // إعادة تعيين النموذج
        checkoutForm.reset();
    });
}

// ==================== 7. الأنيميشنات ====================
function initializeAnimations() {
    // أنيميشنات العناصر عند التمرير
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.scroll-animate');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.classList.add('animate');
            }
        });
    };

    // تشغيل عند التحميل والتمرير
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll();

    // تحديث عداد الزوار
    updateVisitorCounter();
}

// تحديث عداد الزوار
function updateVisitorCounter() {
    const visitorCount = document.getElementById('visitor-count');
    if (visitorCount) {
        // عداد عشوائي بين 20 و 30
        let count = Math.floor(Math.random() * 10) + 20;
        visitorCount.textContent = count;
        
        // تحديث كل 30 ثانية
        setInterval(() => {
            count += Math.floor(Math.random() * 3) - 1;
            if (count < 15) count = 15;
            if (count > 35) count = 35;
            visitorCount.textContent = count;
        }, 30000);
    }
}

// ==================== 8. وظائف مساعدة ====================
function showNotification(message, type = 'info') {
    // إنشاء عنصر الإشعار
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // إضافة الأنيميشن
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : '#6366f1'};
        color: white;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(100%);
        opacity: 0;
        transition: all 0.3s ease;
        font-family: var(--font-arabic);
        font-weight: 500;
        max-width: 300px;
    `;
    
    // إضافة للصفحة
    document.body.appendChild(notification);
    
    // أنيميشن الدخول
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        notification.style.opacity = '1';
    }, 10);
    
    // إزالة بعد 3 ثواني
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';
        
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==================== 9. التحكم بالفيديو ====================
const productVideo = document.getElementById('product-video');
const playBtn = document.querySelector('.play-btn');

if (playBtn && productVideo) {
    playBtn.addEventListener('click', function() {
        if (productVideo.paused) {
            productVideo.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            productVideo.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
}

// التحقق من الصور وإضافة صور بديلة إذا لزم
function checkImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.onerror = function() {
            console.log(`الصورة ${this.src} غير موجودة`);
            
            // استبدال بصورة افتراضية
            this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%236366f1"/><text x="200" y="150" font-family="Arial" font-size="20" fill="white" text-anchor="middle">MGhost Gaming</text></svg>';
            
            // أو استخدم أيقونة
            this.alt = 'الصورة غير متوفرة';
        };
    });
}

// استدع الدالة في DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... الكود السابق
    checkImages();
});