const hotelsData = [
  {
    id: 1,
    name: "Royal Onyx Suite",
    price: 18000,
    image: src="./hotel3.jpeg",
    amenities: ["Pool", "Spa", "Restaurant"],
  },
  {
    id: 2,
    name: "Crimson Palace",
    price: 22000,
    image: "https://placehold.co/600x400/3a1a1a/f3e5ab?text=Crimson+Palace",
    amenities: ["Infinity Pool", "Butler", "Bar"],
  },
  {
    id: 3,
    name: "Golden Eclipse",
    price: 33000,
    image: "https://placehold.co/600x400/1a2a1a/d4af37?text=Golden+Eclipse",
    amenities: ["Rooftop", "Cinema", "Gym"],
  },
  {
    id: 4,
    name: "Obsidian Villa",
    price: 65000,
    image: "https://placehold.co/600x400/0a0a0a/gold?text=Obsidian+Villa",
    amenities: ["Private Pool", "Chef", "Helipad"],
  },
];

// TRANSPORT DATA 
const transportData = [
  {
    id: 1,
    name: "Luxury SUV(7-sitter)",
    price: 75000,
    icon: "fa-shuttle-van",
    capacity: "7 guests",
  },
  {
    id: 2,
    name: "Luxury sedan(4-sitter",
    price: 40000,
    icon: "fa-car-side",
    capacity: "4 guests",
  },
  {
    id: 3,
    name: "Luxury coupe(2-sitter)",
    price: 25000,
    icon: "fa-car",
    capacity: "2 guests",
  },
];

// LOCALSTORAGE FUNCTIONS 
function getBookings() {
  return JSON.parse(localStorage.getItem("goldenstay_bookings") || "[]");
}

function saveBookings(bookings) {
  localStorage.setItem("goldenstay_bookings", JSON.stringify(bookings));
}

function addBooking(type, name, price, extra = {}) {
  const bookings = getBookings();
  const newBooking = {
    id: Date.now(),
    type: type,
    name: name,
    price: price,
    date: new Date().toLocaleString(),
    ...extra,
  };
  bookings.push(newBooking);
  saveBookings(bookings);
  showToast(`✅ ${name} booked successfully!`);
  updateAllDisplays();
  return newBooking;
}

function removeBooking(id) {
  let bookings = getBookings();
  bookings = bookings.filter((b) => b.id != id);
  saveBookings(bookings);
  showToast(`❌ Booking cancelled`);
  updateAllDisplays();
}

function clearAllBookings() {
  localStorage.removeItem("goldenstay_bookings");
  showToast(`🗑️ All bookings cleared`);
  updateAllDisplays();
}

// TOAST NOTIFICATION 
function showToast(message) {
  let existing = document.querySelector(".toast-message");
  if (existing) existing.remove();
  const toast = document.createElement("div");
  toast.className = "toast-message";
  toast.innerHTML = `<i class="fas fa-bell"></i> ${message}`;
  toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        background: var(--gold);
        color: #000;
        padding: 12px 24px;
        border-radius: 50px;
        font-weight: bold;
        z-index: 2000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: fadeInUp 0.3s ease;
    `;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2800);
}

// Add animation style 
if (!document.querySelector("#toast-style")) {
  const style = document.createElement("style");
  style.id = "toast-style";
  style.textContent = `
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
  document.head.appendChild(style);
}

//  RENDER FUNCTIONS 
function renderHotels() {
  const grid = document.getElementById("hotelsGrid");
  if (!grid) return;

  grid.innerHTML = hotelsData
    .map(
      (hotel) => `
        <div class="card">
            <div class="card-img" style="background-image: url('${hotel.image}'); background-size: cover;">
                <i class="fas fa-hotel"></i>
            </div>
            <div class="card-content">
                <div class="card-title">${hotel.name}</div>
                <div class="price">ksh${hotel.price} / night</div>
                <div class="amenity-badge" style="display:flex; gap:8px; flex-wrap:wrap; margin:10px 0;">
                    ${hotel.amenities.map((a) => `<span style="background:#333; padding:2px 10px; border-radius:20px; font-size:0.7rem;">${a}</span>`).join("")}
                </div>
                <button class="book-btn" data-type="hotel" data-name="${hotel.name}" data-price="${hotel.price}">Book Now →</button>
            </div>
        </div>
    `,
    )
    .join("");

  attachBookingEvents();
}

function renderTransport() {
  const grid = document.getElementById("transportGrid");
  if (!grid) return;

  grid.innerHTML = transportData
    .map(
      (vehicle) => `
        <div class="card">
            <div class="card-img" style="background:#2a2a2a;">
                <i class="fas ${vehicle.icon}"></i>
            </div>
            <div class="card-content">
                <div class="card-title">${vehicle.name}</div>
                <div class="price">ksh${vehicle.price} / ride</div>
                <p><i class="fas fa-users"></i> ${vehicle.capacity}</p>
                <button class="book-btn" data-type="transport" data-name=${vehicle.name}" data-price="${vehicle.price}">Book Ride →</button>
            </div>
        </div>
    `,
    )
    .join("");

  attachBookingEvents();
}

function renderFeatured() {
  const grid = document.getElementById("featuredGrid");
  if (!grid) return;

  const featured = hotelsData.slice(0, 2);
  grid.innerHTML = featured
    .map(
      (hotel) => `
        <div class="card">
            <div class="card-img" style="background-image: url(./background.jpg); background-size: cover;">
                <i class="fas fa-star" style="color:var(--gold);"></i>
            </div>
            <div class="card-content">
                <div class="card-title">${hotel.name}</div>
                <div class="price">ksh${hotel.price} / night</div>
                <button class="book-btn" data-type="hotel" data-name="${hotel.name}" data-price="${hotel.price}">Book Now →</button>
            </div>
        </div>
    `,
    )
    .join("");

  attachBookingEvents();
}

function updateBookingList() {
  const container = document.getElementById("bookingList");
  if (!container) return;

  const bookings = getBookings();
  if (bookings.length === 0) {
    container.innerHTML =
      'No bookings yet. Click "Book Now" on any hotel or ride.';
    return;
  }

  container.innerHTML = bookings
    .map(
      (booking) => `
        <div class="booking-item">
            <div>
                <strong>${booking.name}</strong> - ksh${booking.price}<br>
                <small>${booking.type} | ${booking.date}</small>
            </div>
            <button class="btn-small remove-item" data-id="${booking.id}">✖ Cancel</button>
        </div>
    `,
    )
    .join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.getAttribute("data-id"));
      removeBooking(id);
    });
  });
}

function updateTransportBookingList() {
  const container = document.getElementById("transportBookingList");
  if (!container) return;

  const bookings = getBookings().filter((b) => b.type === "transport");
  if (bookings.length === 0) {
    container.innerHTML = "No rides booked yet.";
    return;
  }

  container.innerHTML = bookings
    .map(
      (booking) => `
        <div class="booking-item">
            <div>
                <strong>${booking.name}</strong> - ksh${booking.price}<br>
                <small>${booking.pickup ? `${booking.pickup} → ${booking.dropoff}` : ""} | ${booking.date}</small>
            </div>
            <button class="btn-small remove-item" data-id="${booking.id}">✖ Cancel</button>
        </div>
    `,
    )
    .join("");

  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = parseInt(btn.getAttribute("data-id"));
      removeBooking(id);
    });
  });
}

function attachBookingEvents() {
  document.querySelectorAll(".book-btn").forEach((btn) => {
    btn.removeEventListener("click", handleBooking);
    btn.addEventListener("click", handleBooking);
  });
}

function handleBooking(e) {
  const btn = e.currentTarget;
  const type = btn.getAttribute("data-type");
  const name = btn.getAttribute("data-name");
  const price = parseInt(btn.getAttribute("data-price"));
  if (type && name && price) {
    addBooking(type, name, price);
  }
}

function updateAllDisplays() {
  updateBookingList();
  updateTransportBookingList();
}

// INITIALIZE PAGE 
document.addEventListener("DOMContentLoaded", () => {
  // Render based on current page
  if (document.getElementById("hotelsGrid")) {
    renderHotels();
    updateBookingList();
  }
  if (document.getElementById("transportGrid")) {
    renderTransport();
    updateTransportBookingList();
  }
  if (document.getElementById("featuredGrid")) {
    renderFeatured();
  }

  // Clear buttons
  const clearBtn = document.getElementById("clearAllBtn");
  if (clearBtn) clearBtn.addEventListener("click", clearAllBookings);

  const clearTransportBtn = document.getElementById("clearTransportBtn");
  if (clearTransportBtn)
    clearTransportBtn.addEventListener("click", clearAllBookings);

  // Custom ride form
  const rideForm = document.getElementById("rideForm");
  if (rideForm) {
    rideForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const pickup = document.getElementById("pickupLocation")?.value;
      const dropoff = document.getElementById("dropoffLocation")?.value;
      const vehicle = document.getElementById("vehicleSelect")?.value;
      const datetime = document.getElementById("rideDateTime")?.value;

      if (!pickup || !dropoff || !vehicle || !datetime) {
        showToast("Please fill all fields!");
        return;
      }

      let price = 0;
      if (vehicle.includes("Luxury SUV")) price = 75000;
      else if (vehicle.includes("Luxury sedan")) price = 40000;
      else if (vehicle.includes("Luxury coupe")) price = 25000;

      addBooking("transport", vehicle, price, { pickup, dropoff, datetime });
      rideForm.reset();
    });
  }
});
let deadline = new Date();
deadline.setDate(deadline.getDate() + 20);
deadline.setHours(23, 59, 59);

setInterval(() => {
  let diff = deadline - new Date();

  if (diff <= 0) {
    document.getElementById("goldTimer").innerHTML = "ACTIVE NOW!";
  } else {
    let days = Math.floor(diff / (1000 * 60 * 60 * 24));
    let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((diff % (1000 * 60)) / 1000);

    document.getElementById("goldTimer").innerHTML =
      String(days).padStart(2, "0") +
      "days" +
      String(hours).padStart(2, "0") +
      "hrs " +
      String(minutes).padStart(2, "0") +
      "min " +
      String(seconds).padStart(2, "0") +
      "sec";
  }
}, 1000);
