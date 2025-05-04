const createProductCard = (product) => `
    <div class="product-card">
        <div class="product-image">
            <img src="${product.image}">
        </div>
        <div class="product-details">
            <a href="product_page.html?id=${product.id}" style="text-decoration: none; color: inherit;">
                <h3 class="product-title">${product.title}</h3>
            </a>
            <div class="product-divider"></div>
            <div class="product-footer">
                <span class="product-price">${product.price}</span>
                <button class="add-to-cart button-orange" data-product-id="${product.id}" data-product-title="${product.title}" data-product-price="${product.price}" data-product-image="${product.image}">В корзину</button>
            </div>
        </div>
    </div>
`;

function addCartEventListeners() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            const title = this.dataset.productTitle;
            const price = this.dataset.productPrice;
            const image = this.dataset.productImage;
            
            cart.addItem(productId, title, price, image);
            showNotification('Товар добавлен в корзину');
        });
    });
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function renderProducts(filtered) {
    const productsContainer = document.querySelector('.products');
    if (!productsContainer) return;
    productsContainer.innerHTML = (filtered || window.products).map(product => createProductCard(product)).join('');
    addCartEventListeners();
}

function filterProducts(query) {
    query = query.trim().toLowerCase();
    if (!query) return window.products;
    return window.products.filter(product =>
        product.title.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))
    );
}

document.addEventListener('DOMContentLoaded', () => {
    renderProducts(window.products);
    cart.updateCartCount();

    const searchInput = document.querySelector('.search input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const filtered = filterProducts(this.value);
            renderProducts(filtered);
        });
    }

    document.querySelector('.products').addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart')) {
            e.preventDefault();
        }
    });
}); 