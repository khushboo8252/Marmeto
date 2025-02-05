document.addEventListener("DOMContentLoaded", () => {
    const cartList = document.getElementById("cart-list");
    const subtotalEl = document.getElementById("subtotal");
    const totalEl = document.getElementById("total");
    const cartCount = document.getElementById("cart-count");
    const checkoutBtn = document.getElementById("checkout-btn");

    let cartData = [];

    // Fetch API Data
    async function fetchCartData() {
        try {
            const response = await fetch("https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889");
            const data = await response.json();
            cartData = data.items;
            renderCart();
        } catch (error) {
            console.error("Error fetching cart data:", error);
        }
    }

    // Render Cart Items
    function renderCart() {
        cartList.innerHTML = "";
        let subtotal = 0;

        cartData.forEach((item, index) => {
            const itemTotal = (item.price / 100) * item.quantity; // Convert price to INR
            subtotal += itemTotal;

            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <p>${item.product_description}</p>
                    <p>Price: ₹${(item.price / 100).toFixed(2)}</p>
                    <input type="number" class="quantity" value="${item.quantity}" min="1" data-index="${index}">
                    <p>Subtotal: ₹${itemTotal.toFixed(2)}</p>
                </div>
                <i class="fas fa-trash remove-item" data-index="${index}"></i>
            `;

            cartList.appendChild(cartItem);
        });

        subtotalEl.innerText = `₹${subtotal.toFixed(2)}`;
        totalEl.innerText = `₹${subtotal.toFixed(2)}`;
        cartCount.innerText = cartData.length;
    }

    // Event Delegation for Quantity Update and Remove
    cartList.addEventListener("input", (e) => {
        if (e.target.classList.contains("quantity")) {
            const index = parseInt(e.target.dataset.index, 10);
            let newQuantity = parseInt(e.target.value, 10);

            if (isNaN(newQuantity) || newQuantity < 1) {
                newQuantity = 1; // Ensure minimum quantity is 1
                e.target.value = 1;
            }

            cartData[index].quantity = newQuantity;
            renderCart();
        }
    });

    cartList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-item")) {
            const index = parseInt(e.target.dataset.index, 10);
            cartData.splice(index, 1);
            renderCart();
        }
    });

    // Checkout Button
    checkoutBtn.addEventListener("click", () => {
        alert("Proceeding to checkout!");
    });

    fetchCartData();
});
