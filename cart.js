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
  const tbody = document.querySelector('#cartTable tbody');
  if (!tbody) return;
  tbody.innerHTML = '';
  let total = 0;
  const currency = document.getElementById('currencySelect')?.value || 'USD';
  cart.forEach((item,i) => {
    const prod = products[item.productIndex];
    if (!prod) return;
    let price = prod.price * (rates[currency]||1);
    total += price * item.qty;
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${prod.name}</td><td>${symbols[currency]||'$'}${(+price).toFixed(2)}</td><td>${item.qty}</td><td><button onclick='removeFromCart(${i})'>Remove</button></td>`;
    tbody.appendChild(tr);
  });
  const cartTotal = document.getElementById('cartTotal');
  if (cartTotal) cartTotal.textContent = 'Total: ' + (symbols[currency]||'$') + total.toFixed(2);
  // Payment summary
  const payment = document.getElementById('paymentMethod')?.value || 'card';
  let payText = 'Payment Method: ';
  if(payment==='card') payText += 'Card';
  if(payment==='mobilemoney-ug') payText += 'Mobile Money (Uganda)';
  if(payment==='mobilemoney-ke') payText += 'Mobile Money (Kenya)';
  if(payment==='mtn-uganda') payText += 'MTN (Uganda)';
  if(payment==='airtel-uganda') payText += 'Airtel (Uganda)';
  if(payment==='mtn-kenya') payText += 'MTN (Kenya)';
  if(payment==='airtel-kenya') payText += 'Airtel (Kenya)';
  if(payment==='mpesa-kenya') payText += 'M-Pesa (Kenya)';
  const paymentSummary = document.getElementById('paymentSummary');
  if (paymentSummary) paymentSummary.textContent = payText + ' | Currency: ' + currency;
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
  if(document.getElementById('addProductForm')) {
    document.getElementById('addProductForm').onsubmit = function(e) {
      e.preventDefault();
      const name = document.getElementById('productName').value.trim();
      const price = parseFloat(document.getElementById('productPrice').value);
      const image = document.getElementById('productImage').value.trim();
      if(name && !isNaN(price)) {
        products.push({name,price,image});
        saveAll(); renderProducts(); this.reset();
      }
    };
  }
  if(document.getElementById('addCouponForm')) {
    document.getElementById('addCouponForm').onsubmit = function(e) {
      e.preventDefault();
      const code = document.getElementById('couponCode').value.trim();
      const discount = parseInt(document.getElementById('couponDiscount').value);
      if(code && discount>0 && discount<=100) {
        coupons.push({code,discount});
        saveAll(); renderCoupons(); this.reset();
      }
    };
  }
  if(document.getElementById('currencySelect'))
    document.getElementById('currencySelect').onchange = renderCart;
  if(document.getElementById('paymentMethod'))
    document.getElementById('paymentMethod').onchange = renderCart;
  renderProducts(); renderCart(); renderCoupons();
});
