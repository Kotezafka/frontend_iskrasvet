const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

function getStocks() {
    let stocks = localStorage.getItem('productStocks');
    if (stocks) return JSON.parse(stocks);
    // Если нет в localStorage — инициализируем из products
    const stocksObj = {};
    (window.products || []).forEach(p => { stocksObj[p.id] = p.stock; });
    localStorage.setItem('productStocks', JSON.stringify(stocksObj));
    return stocksObj;
}
function setStocks(stocks) {
    localStorage.setItem('productStocks', JSON.stringify(stocks));
}

function loadProductDetails() {
    const products = window.products || [];
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) {
        document.querySelector('.product-container').innerHTML = '<div style="padding:2rem">Товар не найден</div>';
        return;
    }
    const stocks = getStocks();
    const stock = stocks[product.id] ?? product.stock;
    const img = document.getElementById('product-img');
    if (product.image) {
        img.src = product.image;
        img.alt = product.title;
        img.style.background = 'none';
    } else {
        img.src = '';
        img.alt = 'Нет изображения';
        img.style.background = '#FFA500';
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.display = 'flex';
        img.style.alignItems = 'center';
        img.style.justifyContent = 'center';
        img.style.color = '#222';
        img.style.fontSize = '1.2rem';
        img.style.fontWeight = 'bold';
        img.style.content = 'Изображение товара';
    }
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-description').textContent = product.description || '';
    document.getElementById('product-price').textContent = product.price;
    // Остаток
    const avail = document.getElementById('product-availability');
    avail.textContent = stock > 0 ? `Осталось: ${stock} шт` : 'Нет в наличии';
    avail.className = 'availability' + (stock > 0 ? ' in-stock' : ' out-of-stock');
    // Кнопка
    const btn = document.querySelector('.add-to-cart-button');
    btn.disabled = stock === 0;
    btn.style.opacity = stock > 0 ? '1' : '0.5';
}

function addToCart() {
    const products = window.products || [];
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) return;
    let stocks = getStocks();
    let stock = stocks[product.id] ?? product.stock;
    if (stock === 0) return;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => String(item.id) === String(productId));
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    stocks[product.id] = stock - 1;
    setStocks(stocks);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCounter();
    loadProductDetails();
    alert('Товар добавлен в корзину');
}

function updateCartCounter() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-item-count').textContent = totalItems;
}

document.querySelector('.add-to-cart-button').addEventListener('click', addToCart);
document.querySelector('.add-to-cart-button').classList.add('button-orange');
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    updateCartCounter();
}); 