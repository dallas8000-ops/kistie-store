// cart and purchase logic extracted from inventory.html
// This will allow cart features to be reused on other pages

let products = JSON.parse(localStorage.getItem('products')||'[]');
let cart = JSON.parse(localStorage.getItem('cart')||'[]');
let coupons = JSON.parse(localStorage.getItem('coupons')||'[]');
const rates = { USD: 1, UGX: 3800, KES: 160, GBP: 0.8 };
const symbols = { USD: '$', UGX: 'USh', KES: 'KSh', GBP: '£' };

function saveAll() {
  localStorage.setItem('products', JSON.stringify(products));
  localStorage.setItem('cart', JSON.stringify(cart));
  localStorage.setItem('coupons', JSON.stringify(coupons));
}

function renderProducts() {
  const tbody = document.querySelector('#productTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  products.forEach((p,i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.name}</td><td>$${(+p.price).toFixed(2)}</td><td>${p.image?`<img src='${p.image}' alt='' style='width:40px;height:40px;object-fit:cover;border-radius:4px;'>`:''}</td><td><button onclick='deleteProduct(${i})'>Delete</button> <button onclick='addToCart(${i})'>Add to Cart</button></td>`;
    tbody.appendChild(tr);
  });
}

function renderCart() {
  const tbody = document.getElementById('cartItems');
  const emptyDiv = document.getElementById('cartEmpty');
  if (!tbody) return;
  tbody.innerHTML = '';
  let total = 0;
  if (!cart || cart.length === 0) {
    if (emptyDiv) emptyDiv.style.display = '';
    return;
  } else {
    if (emptyDiv) emptyDiv.style.display = 'none';
  }
  cart.forEach((item, i) => {
    // item: {id, name, image, size, currency, quantity, price}
    let price = item.price;
    let symbol = symbols[item.currency] || item.currency;
    let rowTotal = price * item.quantity;
    total += rowTotal;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="display:flex;align-items:center;gap:10px;">
        <img src="${item.image}" alt="${item.name}" style="width:48px;height:48px;object-fit:cover;border-radius:6px;">
        <div>
          <div style="font-weight:600;">${item.name}</div>
          <div style="font-size:0.95em;color:#888;">Size: ${item.size}</div>
        </div>
      </td>
      <td>${symbol}${price.toLocaleString()}<br><span style="font-size:0.9em;color:#888;">${item.currency}</span></td>
      <td>
        <input type="number" min="1" max="10" value="${item.quantity}" style="width:50px;text-align:center;" onchange="updateCartQty(${i}, this.value)">
      </td>
      <td><button onclick="editCartItem(${i})">Edit</button></td>
      <td><button onclick="removeFromCart(${i})">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
  // Optionally, show total somewhere
  // document.getElementById('cartTotal')?.textContent = 'Total: ' + total;
}

window.updateCartQty = function(idx, val) {
  let qty = parseInt(val);
  if (isNaN(qty) || qty < 1) qty = 1;
  if (qty > 10) qty = 10;
  cart[idx].quantity = qty;
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

window.editCartItem = function(idx) {
  alert('To edit item details, please remove and re-add the item from the catalog.');
}

window.removeFromCart = function(idx) {
  cart.splice(idx, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCart();
}

function renderCoupons() {
  const ul = document.getElementById('couponList');
  if (!ul) return;
  ul.innerHTML = '';
  coupons.forEach((c,i) => {
    const li = document.createElement('li');
    li.textContent = `${c.code} - ${c.discount}% off `;
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.onclick = () => { coupons.splice(i,1); saveAll(); renderCoupons(); };
    li.appendChild(btn);
    ul.appendChild(li);
  });
}

window.deleteProduct = function(i) {
  products.splice(i,1); saveAll(); renderProducts(); renderCart(); };
window.addToCart = function(i) {
  let idx = cart.findIndex(item=>item.productIndex===i);
  if(idx>-1) cart[idx].qty++;
  else cart.push({productIndex:i,qty:1});
  saveAll(); renderCart(); };
window.removeFromCart = function(i) {
  cart.splice(i,1); saveAll(); renderCart(); };

document.addEventListener('DOMContentLoaded', function() {
  renderCart();
});
