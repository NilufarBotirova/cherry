const stays = window.NILUWA_STAYS;
const storageKeys = window.NILUWA_STORAGE_KEYS;

const state = {
  cart: []
};

const navCartCount = document.getElementById("nav-cart-count");
const detailMissing = document.getElementById("detail-missing");
const detailContent = document.getElementById("detail-content");
const detailImage = document.getElementById("detail-image");
const detailType = document.getElementById("detail-type");
const detailName = document.getElementById("detail-name");
const detailLocation = document.getElementById("detail-location");
const detailRating = document.getElementById("detail-rating");
const detailGuests = document.getElementById("detail-guests");
const detailPrice = document.getElementById("detail-price");
const detailDescription = document.getElementById("detail-description");
const detailAmenities = document.getElementById("detail-amenities");
const detailAddButton = document.getElementById("detail-add-button");
const detailMessage = document.getElementById("detail-message");

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

function saveState() {
  localStorage.setItem(storageKeys.cartIds, JSON.stringify(state.cart.map((stay) => stay.id)));
}

function updateCartCount() {
  navCartCount.textContent = String(state.cart.length);
}

function isInCart(id) {
  return state.cart.some((stay) => stay.id === id);
}

function updateButtonState(stay) {
  if (isInCart(stay.id)) {
    detailAddButton.textContent = "Savatchada";
    detailAddButton.classList.add("is-added");
  } else {
    detailAddButton.textContent = "Savatga qo'shish";
    detailAddButton.classList.remove("is-added");
  }
}

function renderMissing() {
  detailMissing.classList.remove("hidden");
  detailContent.classList.add("hidden");
}

function renderDetail(stay) {
  detailMissing.classList.add("hidden");
  detailContent.classList.remove("hidden");

  detailImage.src = stay.image;
  detailImage.alt = stay.imageAlt;
  detailType.textContent = stay.type;
  detailName.textContent = stay.name;
  detailLocation.textContent = `${stay.city}, ${stay.country}`;
  detailRating.textContent = `${stay.rating.toFixed(1)} reyting`;
  detailGuests.textContent = `${stay.guests} tagacha mehmon`;
  detailPrice.textContent = `$${stay.price} / tun`;
  detailDescription.textContent = stay.description;
  detailAmenities.innerHTML = "";

  stay.amenities.forEach((amenity) => {
    const li = document.createElement("li");
    li.textContent = amenity;
    detailAmenities.appendChild(li);
  });

  updateButtonState(stay);

  detailAddButton.addEventListener("click", () => {
    if (isInCart(stay.id)) {
      detailMessage.textContent = "Bu turar joy allaqachon savatda mavjud.";
      return;
    }

    state.cart.push(stay);
    saveState();
    updateCartCount();
    updateButtonState(stay);
    detailMessage.textContent = `${stay.name} savatga qo'shildi.`;
  });
}

function getStayIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
}

restoreState();
updateCartCount();

const stayId = getStayIdFromUrl();
const stay = stays.find((item) => item.id === stayId);

if (!stay) {
  renderMissing();
} else {
  renderDetail(stay);
}
