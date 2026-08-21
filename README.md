# CardCraft — Profile Card Management System

AAT-1 · Full Stack Web Development · HTML + CSS + JavaScript (no frameworks)

A small e-commerce style web app where the "products" are reusable **profile card
components**. Each card design is built from the same base component and restyled
using only margins, padding, borders, dimensions and shadows — which is exactly
what the problem statement asks for.

## How to run

1. Extract the folder anywhere on your computer.
2. Double-click `index.html` (or right-click → Open with → your browser).
3. That's it — no server, no installation needed. Internet is only used to load
   the Google Fonts; everything else works fully offline.

## Folder structure

```
profile-card-system/
├── index.html      → Landing page
├── products.html   → Product display page (8 card designs, filterable)
├── cart.html       → Shopping cart view page
├── payment.html    → Payment page with full form validation
├── css/
│   └── style.css   → One shared stylesheet (design tokens + all pages)
└── js/
    └── script.js   → One shared script (products, cart, validation)
```

## How each guideline is covered

- **HTML, CSS, JavaScript only** — no libraries or frameworks anywhere.
- **Responsive** — CSS Grid/Flexbox layouts with media queries at 980px, 820px
  and 620px; a hamburger menu appears on mobile.
- **Navigation between all pages** — a shared sticky navbar (with a live cart
  count badge) plus footer links connect all four pages.
- **Form validation on the Payment page** — JavaScript regex validation for
  name, email, 10-digit mobile, address, city, 6-digit PIN, card name,
  16-digit card number (auto-spaced as you type), MM/YY expiry (rejects past
  dates) and 3-digit CVV. Errors show inline under each field; a success
  modal with an order ID appears only when everything is valid.
- **Profile cards with margins/padding/borders/dimensions** — one `.pcard`
  base class defines the dimensions, padding and border; eight theme classes
  (`t-minimal`, `t-gradient`, `t-dark`, `t-glass`, `t-corporate`, `t-brutal`,
  `t-pastel`, `t-terminal`) restyle it. See section 12 of `style.css`.

## How the cart works

The cart is stored in the browser's `localStorage` under the key
`cardcraft_cart` as `{ productId: quantity }`. That is why it survives when you
navigate between pages or refresh. Paying successfully clears it.

## Things worth understanding before the viva

- The **box model**: how `width`, `padding`, `border` and `margin` interact,
  and what `box-sizing: border-box` changes.
- The negative-margin trick in the Corporate card (`.t-corporate .pcard-cover`
  and the avatar's `margin-top: -31px`) — a favourite viva question.
- How `document.body.dataset.page` decides which initialiser runs, so one
  script safely serves four pages.
- Event delegation (`grid.addEventListener("click", …)`) and why it keeps
  working after the grid is re-rendered.
- The regex patterns in the `validators` object and why `e.preventDefault()`
  is called on submit.
- `localStorage.getItem / setItem` and `JSON.parse / stringify`.

## Easy customisations

- Change the accent colour: edit `--blue` in `:root` (css/style.css, line ~14).
- Add your own name/college in the footer.
- Add a 9th card design: add one object to `PRODUCTS` in `js/script.js` and one
  `t-yourname { … }` theme block in section 12 of the CSS.
