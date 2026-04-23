const stays = window.NILUWA_STAYS;
const storageKeys = window.NILUWA_STORAGE_KEYS;

const state = {
  cart: []
};

const resultsGrid = document.getElementById("results-grid");
const resultsCount = document.getElementById("results-count");
const template = document.getElementById("stay-card-template");
const navCartCount = document.getElementById("nav-cart-count");

function isInCart(id) {
  return state.cart.some((stay) => stay.id === id);
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
  navCartCount.textContent = String(state.cart.length);
}

function renderStays(items) {
  resultsGrid.innerHTML = "";
  resultsCount.textContent = `${items.length} ta turar joy`;

  items.forEach((stay) => {
    const fragment = template.content.cloneNode(true);
    const card = fragment.querySelector(".stay-card");
    const stayImage = fragment.querySelector(".stay-image");
    const stayButton = fragment.querySelector(".stay-button");

    card.classList.add("stay-card-clickable");
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", `${stay.name} tafsilotlarini ochish`);
    stayImage.src = stay.image;
    stayImage.alt = stay.imageAlt;
    fragment.querySelector(".stay-type").textContent = stay.type;
    fragment.querySelector(".stay-location").textContent = `${stay.city}, ${stay.country}`;
    fragment.querySelector(".stay-rating").textContent = `${stay.rating.toFixed(1)} reyting`;
    fragment.querySelector(".stay-name").textContent = stay.name;
    fragment.querySelector(".stay-description").textContent = stay.description;
    fragment.querySelector(".stay-price").textContent = `$${stay.price} / tun`;
    fragment.querySelector(".stay-capacity").textContent = `${stay.guests} tagacha mehmon`;

    const amenitiesList = fragment.querySelector(".stay-amenities");
    stay.amenities.forEach((amenity) => {
      const li = document.createElement("li");
      li.textContent = amenity;
      amenitiesList.appendChild(li);
    });

    if (isInCart(stay.id)) {
      stayButton.textContent = "Savatchada";
      stayButton.classList.add("is-added");
    }

    stayButton.addEventListener("click", () => {
      addToCart(stay.id);
    });

    card.addEventListener("click", (event) => {
      if (event.target.closest(".stay-button")) {
        return;
      }

      goToDetail(stay.id);
    });

    card.addEventListener("keydown", (event) => {
      if ((event.key === "Enter" || event.key === " ") && !event.target.closest(".stay-button")) {
        event.preventDefault();
        goToDetail(stay.id);
      }
    });

    resultsGrid.appendChild(fragment);
  });
}

function addToCart(id) {
  const stay = stays.find((item) => item.id === id);

  if (!stay || isInCart(id)) {
    return;
  }

  state.cart.push(stay);
  renderStays(stays);
  updateCartCount();
  saveState();
}

restoreState();
renderStays(stays);
updateCartCount();
