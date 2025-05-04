document.addEventListener('DOMContentLoaded', function() {
    if (window.cart) cart.updateCartCount();

    const form = document.querySelector('.order-form form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const order = {
            name: form.name.value,
            surname: form.surname.value,
            phone: form.phone.value,
            email: form.email.value,
            address: form.address.value,
            cart: window.cart ? window.cart.items : []
        };
        const orderNumber = '№' + Date.now() + '-' + Math.floor(Math.random()*10000);
        sessionStorage.setItem('lastOrder', JSON.stringify({ ...order, orderNumber }));
        if (window.cart) window.cart.clearCart();
        window.location.href = 'order_confirmation.html';
    });
}); 