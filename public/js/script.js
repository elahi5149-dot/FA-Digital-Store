// خرابی سے بچاؤ کے ساتھ LocalStorage ڈیٹا لوڈ کریں
let cart = [];
try {
    cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (!Array.isArray(cart)) cart = [];
} catch (e) {
    cart = [];
}

// ہیڈر میں Cart کاؤنٹر درست اپ ڈیٹ کرنے کا فنکشن
function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => {
        const qty = parseInt(item.quantity) || 1;
        return sum + qty;
    }, 0);

    const cartLinks = document.querySelectorAll('a');
    cartLinks.forEach(link => {
        if (link.textContent.includes('Cart')) {
            link.textContent = `Cart 🛒 (${totalCount})`;
        }
    });
}

// پروڈکٹ ایڈ کرنے کا فنکشن
function addToCart(name, price) {
    const existingIndex = cart.findIndex(item => item && item.name === name);
    if (existingIndex > -1) {
        cart[existingIndex].quantity = (parseInt(cart[existingIndex].quantity) || 1) + 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`✅ "${name}" کارٹ میں شامل کر دی گئی ہے!`);
}

// پیج لوڈ ہونے پر ایونٹ لسنر
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();

    document.body.addEventListener('click', (e) => {
        const target = e.target;
        if (target.tagName === 'BUTTON' || target.classList.contains('btn') || target.tagName === 'A') {
            const text = target.textContent.trim().toLowerCase();
            if (text.includes('add to cart') || text.includes('shop now')) {
                e.preventDefault();
                
                const card = target.closest('.product-card, .card') || target.parentElement;
                const name = card.querySelector('h3, h2, .product-title')?.textContent.trim() || 'Smartwatch';
                const price = card.querySelector('.price, p')?.textContent.trim() || 'Rs. 3200';
                
                addToCart(name, price);
            }
        }
    });
});
