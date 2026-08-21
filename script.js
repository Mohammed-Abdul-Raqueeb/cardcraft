/* ═══════════════════════════════════════════════════════════════
   CARDCRAFT — Profile Card Management System  (AAT-1)
   script.js — one shared script for all four pages.
   The <body data-page="…"> attribute decides which page-specific
   initialiser runs. Cart state lives in localStorage so it
   survives navigation between the pages.
   ═══════════════════════════════════════════════════════════════ */

"use strict";

/* ───────────────────────── 1. Product catalogue ───────────────────────── */
const PRODUCTS = [
  {
    id: "minimal", name: "Minimal Classic", cat: "light", price: 199,
    tagline: "Clean lines, quiet confidence. Works everywhere.",
    person: { initials: "AR", name: "Aarav Reddy", role: "Product Designer",
      stats: [{ v: "128", l: "Projects" }, { v: "4.9k", l: "Followers" }, { v: "96%", l: "Rating" }],
      btn: "Follow" }
  },
  {
    id: "gradient", name: "Sunset Gradient", cat: "bold", price: 299,
    tagline: "A warm two-stop gradient that refuses to be ignored.",
    person: { initials: "MI", name: "Meera Iyer", role: "UI Engineer",
      stats: [{ v: "86", l: "Projects" }, { v: "12.4k", l: "Followers" }, { v: "98%", l: "Rating" }],
      btn: "Follow" }
  },
  {
    id: "dark", name: "Dark Mode Pro", cat: "dark", price: 349,
    tagline: "Sleek, low-light elegance for night-owl portfolios.",
    person: { initials: "KS", name: "Kabir Shah", role: "Data Scientist",
      stats: [{ v: "54", l: "Projects" }, { v: "8.1k", l: "Followers" }, { v: "95%", l: "Rating" }],
      btn: "Connect" }
  },
  {
    id: "glass", name: "Glass Aurora", cat: "bold", price: 399,
    tagline: "Frosted glass floating over an aurora backdrop.",
    person: { initials: "AN", name: "Ananya Rao", role: "Creative Director",
      stats: [{ v: "212", l: "Projects" }, { v: "21k", l: "Followers" }, { v: "99%", l: "Rating" }],
      btn: "Follow" }
  },
  {
    id: "corporate", name: "Corporate Edge", cat: "light", price: 249,
    tagline: "Boardroom-ready polish with a navy cover strip.",
    person: { initials: "VN", name: "Vikram Nair", role: "Project Manager",
      stats: [{ v: "17", l: "Teams" }, { v: "3.2k", l: "Followers" }, { v: "92%", l: "Rating" }],
      btn: "Connect" }
  },
  {
    id: "brutal", name: "Neo Brutalist", cat: "bold", price: 329,
    tagline: "Thick borders, hard shadows, zero apologies.",
    person: { initials: "SK", name: "Sara Khan", role: "Brand Illustrator",
      stats: [{ v: "301", l: "Projects" }, { v: "15k", l: "Followers" }, { v: "97%", l: "Rating" }],
      btn: "Hire me" }
  },
  {
    id: "pastel", name: "Pastel Bloom", cat: "light", price: 279,
    tagline: "Soft, friendly and generously rounded.",
    person: { initials: "DP", name: "Dev Patel", role: "Content Creator",
      stats: [{ v: "95", l: "Projects" }, { v: "40k", l: "Followers" }, { v: "98%", l: "Rating" }],
      btn: "Follow" }
  },
  {
    id: "terminal", name: "Dev Terminal", cat: "dark", price: 359,
    tagline: "For people who live in the command line.",
    person: { initials: "IM", name: "Ishita Menon", role: "// full-stack dev",
      stats: [{ v: "142", l: "Repos" }, { v: "2.3k", l: "Stars" }, { v: "99%", l: "Uptime" }],
      btn: "$ connect" }
  }
];

const GST_RATE = 0.18; // 18% GST
const CART_KEY = "cardcraft_cart";

/* ───────────────────────── 2. Small helpers ───────────────────────── */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function money(n) {
  return "\u20B9" + n.toLocaleString("en-IN"); // ₹ formatted Indian style
}

function getProduct(id) {
  return PRODUCTS.find(p => p.id === id);
}

/* ───────────────────────── 3. Cart state (localStorage) ───────────────────────── */
function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
function cartCount() {
  return Object.values(getCart()).reduce((sum, qty) => sum + qty, 0);
}
function cartTotals() {
  const cart = getCart();
  let subtotal = 0;
  for (const id in cart) {
    const p = getProduct(id);
    if (p) subtotal += p.price * cart[id];
  }
  const gst = Math.round(subtotal * GST_RATE);
  return { subtotal, gst, total: subtotal + gst };
}
function addToCart(id) {
  const cart = getCart();
  cart[id] = (cart[id] || 0) + 1;
  saveCart(cart);
}
function setQty(id, qty) {
  const cart = getCart();
  if (qty <= 0) delete cart[id];
  else cart[id] = qty;
  saveCart(cart);
}
function clearCart() {
  localStorage.removeItem(CART_KEY);
  updateCartBadge();
}
function updateCartBadge() {
  const badge = $("#cartCount");
  if (badge) badge.textContent = cartCount();
}

/* ───────────────────────── 4. Toast notification ───────────────────────── */
let toastTimer = null;
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ───────────────────────── 5. Profile-card renderer ─────────────────────────
   ONE function builds every card; the theme class (t-minimal, t-dark…)
   restyles it. This is the "reusable component" the assignment asks for. */
function renderPcard(product) {
  const p = product.person;
  const stats = p.stats
    .map(s => `<div><b>${s.v}</b><span>${s.l}</span></div>`)
    .join("");
  return `
    <article class="pcard t-${product.id}" aria-label="${product.name} profile card preview">
      <div class="pcard-cover"></div>
      <div class="pcard-avatar">${p.initials}</div>
      <h4 class="pcard-name">${p.name}</h4>
      <p class="pcard-role">${p.role}</p>
      <div class="pcard-stats">${stats}</div>
      <span class="pcard-btn">${p.btn}</span>
    </article>`;
}

/* ───────────────────────── 6. Landing page ───────────────────────── */
function initHome() {
  // hero signature card
  const heroCard = $("#heroCard");
  if (heroCard) heroCard.innerHTML = renderPcard(getProduct("gradient"));

  // three-card showcase
  const showcase = $("#showcase");
  if (showcase) {
    showcase.innerHTML = ["minimal", "dark", "brutal"]
      .map(id => `<div class="showcase-cell">${renderPcard(getProduct(id))}</div>`)
      .join("");
  }
}

/* ───────────────────────── 7. Products page ───────────────────────── */
function initProducts() {
  const grid = $("#productGrid");
  if (!grid) return;

  function renderGrid(filter) {
    const list = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.cat === filter);
    grid.innerHTML = list.map(p => `
      <article class="product">
        <div class="product-stage ${p.id === "glass" ? "stage-glass" : ""}">
          <span class="hover-frame"></span>
          <span class="hover-dims">248 &times; auto</span>
          ${renderPcard(p)}
        </div>
        <div class="product-info">
          <h3>${p.name}</h3>
          <p class="tagline">${p.tagline}</p>
          <div class="product-meta">
            <span class="price">${money(p.price)}</span>
            <button class="add-btn" data-id="${p.id}">Add to cart</button>
          </div>
        </div>
      </article>`).join("");
  }

  renderGrid("all");

  // filter chips
  $$(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      renderGrid(chip.dataset.filter);
    });
  });

  // add-to-cart (event delegation so it works after re-renders)
  grid.addEventListener("click", e => {
    const btn = e.target.closest(".add-btn");
    if (!btn) return;
    const product = getProduct(btn.dataset.id);
    addToCart(product.id);
    showToast(`${product.name} added to cart`);
    btn.textContent = "Added \u2713";
    btn.classList.add("added");
    setTimeout(() => {
      btn.textContent = "Add to cart";
      btn.classList.remove("added");
    }, 1400);
  });
}

/* ───────────────────────── 8. Cart page ───────────────────────── */
function initCart() {
  const wrap = $("#cartWrap");
  if (!wrap) return;

  function render() {
    const cart = getCart();
    const ids = Object.keys(cart);

    if (ids.length === 0) {
      wrap.innerHTML = `
        <div class="empty-state">
          <div class="empty-mark">[ ]</div>
          <h2>Your cart is empty</h2>
          <p>Pick a card design and it will appear here.</p>
          <a href="products.html" class="btn btn-primary">Browse the cards</a>
        </div>`;
      return;
    }

    const rows = ids.map(id => {
      const p = getProduct(id);
      const qty = cart[id];
      return `
        <div class="cart-row">
          <div class="swatch sw-${p.id}" aria-hidden="true"></div>
          <div class="cart-item-info">
            <div class="cart-item-name">${p.name}</div>
            <div class="cart-item-price">${money(p.price)} each</div>
          </div>
          <div class="qty">
            <button data-id="${p.id}" data-action="dec" aria-label="Decrease quantity of ${p.name}">&minus;</button>
            <output>${qty}</output>
            <button data-id="${p.id}" data-action="inc" aria-label="Increase quantity of ${p.name}">+</button>
          </div>
          <div class="line-total">${money(p.price * qty)}</div>
          <button class="remove-btn" data-id="${p.id}" data-action="remove"
                  aria-label="Remove ${p.name} from cart">&times;</button>
        </div>`;
    }).join("");

    const t = cartTotals();
    wrap.innerHTML = `
      <div class="cart-layout">
        <div class="cart-list">${rows}</div>
        <aside class="summary">
          <h3>Order summary</h3>
          <div class="summary-line"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
          <div class="summary-line"><span>GST (18%)</span><span>${money(t.gst)}</span></div>
          <div class="summary-total"><span>Total</span><span>${money(t.total)}</span></div>
          <a href="payment.html" class="btn btn-primary btn-block">Proceed to payment</a>
          <p class="summary-note">Prices include a one-time licence per design.</p>
        </aside>
      </div>`;
  }

  render();

  // quantity + remove controls (event delegation)
  wrap.addEventListener("click", e => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const { id, action } = btn.dataset;
    const cart = getCart();
    if (action === "inc") setQty(id, cart[id] + 1);
    if (action === "dec") setQty(id, cart[id] - 1);
    if (action === "remove") {
      setQty(id, 0);
      showToast(`${getProduct(id).name} removed`);
    }
    render();
  });
}

/* ───────────────────────── 9. Payment page ───────────────────────── */
function initPayment() {
  const form = $("#payForm");
  if (!form) return;

  /* — order summary — */
  const summaryBox = $("#paySummary");
  const cart = getCart();
  const ids = Object.keys(cart);
  const t = cartTotals();

  if (ids.length === 0) {
    summaryBox.innerHTML = `
      <h3>Order summary</h3>
      <p style="color:var(--muted);font-size:.92rem;margin-bottom:18px;">
        Your cart is empty, so there is nothing to pay for yet.</p>
      <a href="products.html" class="btn btn-ghost btn-block">Browse the cards</a>`;
    $("#payBtn").disabled = true;
  } else {
    const items = ids.map(id => {
      const p = getProduct(id);
      return `
        <div class="mini-item">
          <div class="swatch sw-${p.id}" aria-hidden="true"></div>
          <span class="m-name">${p.name}</span>
          <span class="m-qty">&times;${cart[id]}</span>
          <span class="m-price">${money(p.price * cart[id])}</span>
        </div>`;
    }).join("");
    summaryBox.innerHTML = `
      <h3>Order summary</h3>
      ${items}
      <div class="summary-line" style="margin-top:16px;"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
      <div class="summary-line"><span>GST (18%)</span><span>${money(t.gst)}</span></div>
      <div class="summary-total"><span>Total payable</span><span>${money(t.total)}</span></div>
      <p class="summary-note">You will not be charged &mdash; this is a demo checkout.</p>`;
    $("#payBtn").textContent = `Pay ${money(t.total)}`;
  }

  /* — live input formatting — */
  const cardInput = $("#cardNumber");
  cardInput.addEventListener("input", () => {
    const digits = cardInput.value.replace(/\D/g, "").slice(0, 16);
    cardInput.value = digits.replace(/(.{4})/g, "$1 ").trim(); // group in 4s
  });

  const expiryInput = $("#expiry");
  expiryInput.addEventListener("input", () => {
    let v = expiryInput.value.replace(/\D/g, "").slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
    expiryInput.value = v;
  });

  $("#cvv").addEventListener("input", () => {
    $("#cvv").value = $("#cvv").value.replace(/\D/g, "").slice(0, 3);
  });
  $("#phone").addEventListener("input", () => {
    $("#phone").value = $("#phone").value.replace(/\D/g, "").slice(0, 10);
  });
  $("#pincode").addEventListener("input", () => {
    $("#pincode").value = $("#pincode").value.replace(/\D/g, "").slice(0, 6);
  });

  /* — validators: each returns an error message or "" — */
  const validators = {
    fullName: v => /^[A-Za-z][A-Za-z .]{2,}$/.test(v.trim())
      ? "" : "Enter your full name (letters only, min 3 characters).",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())
      ? "" : "Enter a valid email address, e.g. name@example.com.",
    phone: v => /^[6-9]\d{9}$/.test(v.trim())
      ? "" : "Enter a valid 10-digit mobile number.",
    address: v => v.trim().length >= 10
      ? "" : "Address should be at least 10 characters.",
    city: v => /^[A-Za-z][A-Za-z ]{1,}$/.test(v.trim())
      ? "" : "Enter a valid city name.",
    pincode: v => /^\d{6}$/.test(v.trim())
      ? "" : "PIN code must be exactly 6 digits.",
    cardName: v => /^[A-Za-z][A-Za-z .]{2,}$/.test(v.trim())
      ? "" : "Enter the name printed on the card.",
    cardNumber: v => /^\d{16}$/.test(v.replace(/\s/g, ""))
      ? "" : "Card number must be 16 digits.",
    expiry: v => {
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(v.trim())) return "Use MM/YY format.";
      const [mm, yy] = v.split("/").map(Number);
      const expiryDate = new Date(2000 + yy, mm); // first day AFTER expiry month
      return expiryDate > new Date() ? "" : "This card has expired.";
    },
    cvv: v => /^\d{3}$/.test(v.trim())
      ? "" : "CVV must be 3 digits."
  };

  function setFieldState(input, message) {
    const err = $(`#err-${input.id}`);
    if (message) {
      input.classList.add("invalid");
      if (err) { err.textContent = message; err.classList.add("show"); }
    } else {
      input.classList.remove("invalid");
      if (err) err.classList.remove("show");
    }
  }

  // re-validate a field as soon as the user leaves it
  for (const id in validators) {
    const input = $("#" + id);
    input.addEventListener("blur", () => setFieldState(input, validators[id](input.value)));
    input.addEventListener("input", () => {
      if (input.classList.contains("invalid")) {
        setFieldState(input, validators[id](input.value));
      }
    });
  }

  /* — submit — */
  form.addEventListener("submit", e => {
    e.preventDefault(); // stop real submission; JS validates instead
    let firstInvalid = null;

    for (const id in validators) {
      const input = $("#" + id);
      const message = validators[id](input.value);
      setFieldState(input, message);
      if (message && !firstInvalid) firstInvalid = input;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      showToast("Please fix the highlighted fields");
      return;
    }

    // success — show confirmation and clear the cart
    const orderId = "CC-" + Date.now().toString().slice(-6);
    $("#orderId").textContent = "Order ID: " + orderId;
    $("#successModal").classList.add("show");
    clearCart();
  });
}

/* ───────────────────────── 10. Boot ───────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();

  // mobile menu
  const burger = $("#burger");
  const navLinks = $("#navLinks");
  if (burger && navLinks) {
    burger.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      burger.setAttribute("aria-expanded", open);
    });
  }

  // run the right initialiser for this page
  const page = document.body.dataset.page;
  if (page === "home") initHome();
  if (page === "products") initProducts();
  if (page === "cart") initCart();
  if (page === "payment") initPayment();
});
