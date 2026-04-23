const stays = window.NILUWA_STAYS;
const storageKeys = window.NILUWA_STORAGE_KEYS;

const state = {
  cart: []
};

const clearBookingButton = document.getElementById("clear-booking");
const confirmBookingButton = document.getElementById("confirm-booking");
const bookingEmpty = document.getElementById("booking-empty");
const bookingContent = document.getElementById("booking-content");
const bookingCount = document.getElementById("booking-count");
const bookingTotal = document.getElementById("booking-total");
const bookingMessage = document.getElementById("booking-message");
const cartItems = document.getElementById("cart-items");
const navCartCount = document.getElementById("nav-cart-count");
const cartCountPill = document.getElementById("cart-count-pill");

function formatMoney(value) {
  return `$${value}`;
}

function goToDetail(id) {
  window.location.href = `detail.html?id=${id}`;
}

function saveState() {
  localStorage.setItem(storageKeys.cartIds, JSON.stringify(state.cart.map((stay) => stay.id)));
}

function restoreState() {
  const savedCartIds = localStorage.getItem(storageKeys.cartIds);

  if (savedCartIds) {
    try {
      const parsedIds = JSON.parse(savedCartIds);
      state.cart = parsedIds
        .map((id) => stays.find((stay) => stay.id === id))
        .filter(Boolean);
    } catch (error) {
      localStorage.removeItem(storageKeys.cartIds);
    }
  }
}

function updateCartCount() {
  const count = state.cart.length;
  const label = `${count} turar joy`;

  navCartCount.textContent = String(count);
  cartCountPill.textContent = label;
}

function renderCart() {
  updateCartCount();
  cartItems.innerHTML = "";

  if (!state.cart.length) {
    bookingEmpty.classList.remove("hidden");
    bookingContent.classList.add("hidden");
    return;
  }

  const total = state.cart.reduce((sum, stay) => sum + stay.price, 0);

  bookingEmpty.classList.add("hidden");
  bookingContent.classList.remove("hidden");

  state.cart.forEach((stay) => {
    const item = document.createElement("article");
    item.className = "cart-item";
    item.tabIndex = 0;
    item.setAttribute("role", "link");
    item.setAttribute("aria-label", `${stay.name} tafsilotlarini ochish`);
    item.classList.add("cart-item-clickable");
    item.innerHTML = `
      <div class="cart-item-main">
        <img class="cart-item-image" src="${stay.image}" alt="${stay.imageAlt}">
        <div class="cart-item-copy">
          <h3>${stay.name}</h3>
          <p class="cart-item-meta">${stay.city}, ${stay.country}</p>
          <p class="cart-item-meta">${stay.type}</p>
          <p class="cart-item-price">${formatMoney(stay.price)} / tun</p>
        </div>
      </div>
      <button class="cart-remove" type="button" aria-label="${stay.name} ni savatdan olib tashlash">Olib tashlash</button>
    `;

    item.querySelector(".cart-remove").addEventListener("click", () => {
      removeFromCart(stay.id);
    });

    item.addEventListener("click", (event) => {
      if (event.target.closest(".cart-remove")) {
        return;
      }

      goToDetail(stay.id);
    });

    item.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.target.closest(".cart-remove")) {
        event.preventDefault();
        goToDetail(stay.id);
      }
    });

    cartItems.appendChild(item);
  });

  bookingCount.textContent = `${state.cart.length} turar joy`;
  bookingTotal.textContent = `${formatMoney(total)} / tuniga`;
}

function removeFromCart(id) {
  const stay = state.cart.find((item) => item.id === id);
  state.cart = state.cart.filter((item) => item.id !== id);
  bookingMessage.textContent = stay ? `${stay.name} savatdan olib tashlandi.` : "";
  renderCart();
  saveState();
}

clearBookingButton.addEventListener("click", () => {
  state.cart = [];
  bookingMessage.textContent = "Savat tozalandi.";
  renderCart();
  saveState();
});

confirmBookingButton.addEventListener("click", () => {
  if (!state.cart.length) {
    return;
  }

  saveState();
  window.open("https://t.me/akmal_mahmudov", "_blank", "noopener,noreferrer");
});

restoreState();
renderCart();
