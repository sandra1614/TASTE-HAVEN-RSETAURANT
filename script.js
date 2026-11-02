
// ==================================
// TASTE HAVEN RESTAURANT WEBSITE
// ==================================


// 1. MOBILE NAVIGATION

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", function () {
    navLinks.classList.toggle("active");
    const isOpen = navLinks.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}


// 2. MENU FILTERS

const filterButtons = document.querySelectorAll(".filter-btn");
const foodCards = document.querySelectorAll(".food-card");

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const selectedCategory = button.dataset.filter;

    filterButtons.forEach(function (btn) {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    foodCards.forEach(function (card) {
      if (
        selectedCategory === "all" ||
        card.dataset.category === selectedCategory
      ) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  });
});


// 3. SHOPPING CART AND DISCOUNT

let cart = [];

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const checkoutButton = document.getElementById("checkoutButton");
const clearCartButton = document.getElementById("clearCartButton");

// 20% discount
const DISCOUNT_RATE = 0.20;

// Create a place to display the discount details
const discountSummary = document.createElement("div");
discountSummary.id = "discountSummary";

if (cartTotal) {
  cartTotal.insertAdjacentElement("afterend", discountSummary);
}


// DISPLAY CART

function updateCart() {
  let totalItems = 0;
  let originalTotal = 0;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<p>Your cart is empty.</p>";
  }

  cart.forEach(function (item, index) {
    const subtotal = item.price * item.quantity;

    totalItems += item.quantity;
    originalTotal += subtotal;

    const cartItem = document.createElement("div");
    cartItem.className = "cart-item";

    cartItem.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <p>$${item.price.toFixed(2)} each</p>
        <p>Subtotal: $${subtotal.toFixed(2)}</p>
      </div>

      <div class="cart-controls">
        <button class="quantity-btn decrease-btn" data-index="${index}">−</button>
        <span>${item.quantity}</span>
        <button class="quantity-btn increase-btn" data-index="${index}">+</button>
        <button class="remove-btn remove-item-btn" data-index="${index}">Remove</button>
      </div>
    `;

    cartItems.appendChild(cartItem);
  });

  // Calculate the discount
  const discountAmount = originalTotal * DISCOUNT_RATE;

  // Calculate the amount customer will pay
  const finalTotal = originalTotal - discountAmount;

  cartCount.textContent = totalItems;

  // Show discounted total
  cartTotal.textContent = finalTotal.toFixed(2);

  // Show original price and savings
  discountSummary.innerHTML = `
    <p>Original Total: $${originalTotal.toFixed(2)}</p>
    <p class="discount-saving">
      20% Discount: -$${discountAmount.toFixed(2)}
    </p>
    <p class="final-total">
      Amount to Pay: $${finalTotal.toFixed(2)}
    </p>
  `;

  checkoutButton.disabled = cart.length === 0;
  clearCartButton.disabled = cart.length === 0;
}


// 4. ADD FOOD TO CART

const addButtons = document.querySelectorAll(".order-button");

addButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    const foodName = button.dataset.food;
    const foodPrice = Number(button.dataset.price);

    const existingItem = cart.find(function (item) {
      return item.name === foodName;
    });

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        name: foodName,
        price: foodPrice,
        quantity: 1
      });
    }

    updateCart();
  });
});


// 5. INCREASE, DECREASE AND REMOVE ITEMS

cartItems.addEventListener("click", function (event) {
  const index = Number(event.target.dataset.index);

  if (event.target.classList.contains("increase-btn")) {
    cart[index].quantity++;
  }

  if (event.target.classList.contains("decrease-btn")) {
    cart[index].quantity--;

    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }
  }

  if (event.target.classList.contains("remove-item-btn")) {
    cart.splice(index, 1);
  }

  updateCart();
});


// 6. CLEAR ENTIRE CART

clearCartButton.addEventListener("click", function () {
  if (cart.length === 0) return;

  const confirmClear = confirm(
    "Are you sure you want to clear your cart?"
  );

  if (confirmClear) {
    cart = [];
    updateCart();
  }
});


// 7. CUSTOMER DELIVERY DETAILS

const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");
const customerNote = document.getElementById("customerNote");


// 8. WHATSAPP CHECKOUT

const restaurantWhatsApp = "2347042302823";

checkoutButton.addEventListener("click", function () {
  if (cart.length === 0) {
    alert("Please add food to your cart first.");
    return;
  }

  const name = customerName.value.trim();
  const phone = customerPhone.value.trim();
  const address = customerAddress.value.trim();
  const note = customerNote.value.trim();

  if (!name || !phone || !address) {
    alert("Please enter your name, phone number and delivery address.");
    return;
  }

  let orderMessage = "HELLO TASTE HAVEN! I WANT TO PLACE AN ORDER.\n\n";

  orderMessage += "CUSTOMER DETAILS\n";
  orderMessage += "Name: " + name + "\n";
  orderMessage += "Phone: " + phone + "\n";
  orderMessage += "Delivery Address: " + address + "\n";

  if (note) {
    orderMessage += "Special Instructions: " + note + "\n";
  }

  orderMessage += "\nMY ORDER\n";

  let originalTotal = 0;

  cart.forEach(function (item) {
    const subtotal = item.price * item.quantity;

    orderMessage +=
      item.name + " x " + item.quantity +
      " = $" + subtotal.toFixed(2) + "\n";

    originalTotal += subtotal;
  });

  // Calculate discount and final payment
  const discountAmount = originalTotal * DISCOUNT_RATE;
  const finalTotal = originalTotal - discountAmount;

  orderMessage += "\nOriginal Total: $" + originalTotal.toFixed(2);
  orderMessage += "\n20% Discount: -$" + discountAmount.toFixed(2);
  orderMessage += "\nFINAL AMOUNT TO PAY: $" + finalTotal.toFixed(2);
  orderMessage += "\n\nPlease confirm my order. Thank you!";

  const whatsappURL =
    "https://wa.me/" +
    restaurantWhatsApp +
    "?text=" +
    encodeURIComponent(orderMessage);

  window.open(whatsappURL, "_blank");
});


// 9. CONTACT WHATSAPP BUTTON

const contactWhatsApp = document.getElementById("contactWhatsApp");

if (contactWhatsApp) {
  contactWhatsApp.href = "https://wa.me/" + restaurantWhatsApp;
}


// 10. AUTOMATIC COPYRIGHT YEAR

const yearElement = document.getElementById("year");

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}


// INITIAL CART DISPLAY

updateCart();
