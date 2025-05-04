function createCartItemHTML(item) {
    const stocks = JSON.parse(localStorage.getItem('productStocks')) || {};
    const initialStock = (window.products.find(p => String(p.id) === String(item.id))?.stock || 0);
    const inCart = item.quantity;
    const stock = stocks[item.id] !== undefined ? stocks[item.id] : initialStock - inCart;
    return `
        <div class="cart-item" data-product-id="${item.id}">
            <div class="item-image">
                <img src="${item.image}" alt="${item.title}">
            </div>
            <div class="item-details">
                <h3 class="item-title">${item.title}</h3>
                <div class="item-price">${item.price}</div>
                <div class="item-stock">Осталось: ${stock} шт</div>
            </div>
            <div class="item-quantity">
                <div class="quantity-controls">
                    <button class="decrease-quantity">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="increase-quantity" ${(stock === 0) ? 'disabled style="opacity:0.5;cursor:not-allowed;"' : ''}>+</button>
                </div>
                <button class="remove-item">Удалить</button>
            </div>
        </div>
    `;
}

function renderCart() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const totalItemsElement = document.getElementById('total-items');
    const totalPriceElement = document.getElementById('total-price');
    
    if (cart.items.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Ваша корзина пуста</div>';
        totalItemsElement.textContent = '0';
        totalPriceElement.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.items.map(createCartItemHTML).join('');
    totalItemsElement.textContent = cart.getTotalItems();
    totalPriceElement.textContent = cart.getTotalPrice().toLocaleString();
    
    addCartItemEventListeners();
    document.querySelectorAll('.remove-item').forEach(btn => btn.classList.add('button-orange'));
    document.querySelector('.clear-cart')?.classList.add('button-orange');
    document.querySelector('.checkout')?.classList.add('button-orange');
}

function addCartItemEventListeners() {
    document.querySelectorAll('.cart-item').forEach(item => {
        const productId = item.dataset.productId;
        
        item.querySelector('.increase-quantity').addEventListener('click', () => {
            const stocks = JSON.parse(localStorage.getItem('productStocks')) || {};
            const initialStock = (window.products.find(p => String(p.id) === String(productId))?.stock || 0);
            const currentQuantity = parseInt(item.querySelector('.quantity').textContent);
            const stock = stocks[productId] !== undefined ? stocks[productId] : initialStock - currentQuantity;
            if (stock === 0) return;
            cart.updateQuantity(productId, currentQuantity + 1);
            stocks[productId] = stock - 1;
            localStorage.setItem('productStocks', JSON.stringify(stocks));
            renderCart();
        });
        
        item.querySelector('.decrease-quantity').addEventListener('click', () => {
            const stocks = JSON.parse(localStorage.getItem('productStocks')) || {};
            const initialStock = (window.products.find(p => String(p.id) === String(productId))?.stock || 0);
            const currentQuantity = parseInt(item.querySelector('.quantity').textContent);
            const stock = stocks[productId] !== undefined ? stocks[productId] : initialStock - currentQuantity;
            if (currentQuantity > 1) {
                cart.updateQuantity(productId, currentQuantity - 1);
                stocks[productId] = stock + 1;
                localStorage.setItem('productStocks', JSON.stringify(stocks));
            } else {
                cart.removeItem(productId);
            }
            renderCart();
        });
        
        item.querySelector('.remove-item').addEventListener('click', () => {
            const stocks = JSON.parse(localStorage.getItem('productStocks')) || {};
            const initialStock = (window.products.find(p => String(p.id) === String(productId))?.stock || 0);
            const currentQuantity = parseInt(item.querySelector('.quantity').textContent);
            stocks[productId] = (stocks[productId] !== undefined ? stocks[productId] : initialStock - currentQuantity) + currentQuantity;
            localStorage.setItem('productStocks', JSON.stringify(stocks));
            cart.removeItem(productId);
            renderCart();
        });
    });
}

document.querySelector('.clear-cart')?.addEventListener('click', () => {
    if (confirm('Вы уверены, что хотите очистить корзину?')) {
        const stocks = JSON.parse(localStorage.getItem('productStocks')) || {};
        cart.items.forEach(item => {
            const initialStock = (window.products.find(p => String(p.id) === String(item.id))?.stock || 0);
            stocks[item.id] = (stocks[item.id] !== undefined ? stocks[item.id] : initialStock - item.quantity) + item.quantity;
        });
        localStorage.setItem('productStocks', JSON.stringify(stocks));
        cart.clearCart();
        renderCart();
    }
});

document.querySelector('.checkout')?.addEventListener('click', () => {
    if (cart.items.length === 0) {
        alert('Корзина пуста');
        return;
    }
    window.location.href = 'make_order.html';
});

document.addEventListener('DOMContentLoaded', renderCart); 