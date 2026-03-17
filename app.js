// ============================================================
// VegMarket B2B - Application Logic (SPA)
// ============================================================

/* ── State ── */
const State = {
  currentUser: null,
  currentPage: 'auth',
  cart: [],          // [{vegId, shopId, name, price, qty, unit, shopName, img}]
  currentMarket: null,
  currentShop: null,
  searchQuery: '',
  filterCategory: 'All',
  orders: [...AppData.orders],
  adminProducts: [...AppData.vegetables],
  livePrices: AppData.livePrices.map(p => ({ ...p })),
};

/* ── Utility ── */
const $ = id => document.getElementById(id);
const qs = sel => document.querySelector(sel);
const qsa = sel => document.querySelectorAll(sel);

function toast(msg, type = 'success') {
  const c = $('toast-container');
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  const icon = type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️';
  t.innerHTML = `<span>${icon}</span><span>${msg}</span>`;
  c.appendChild(t);
  setTimeout(() => { t.style.animation = 'fadeOut .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 3000);
}

function stars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  let s = '';
  for (let i = 0; i < full; i++) s += '★';
  if (half) s += '½';
  return `<span style="color:#f59e0b">${s}</span> <span style="font-size:.78rem;color:var(--gray-500)">${rating}</span>`;
}

function formatCurrency(n) { return '₹' + n.toLocaleString('en-IN'); }

function navigate(page, data = {}) {
  if (data.market) State.currentMarket = data.market;
  if (data.shop) State.currentShop = data.shop;
  State.currentPage = page;
  renderPage(page);
}

/* ── Router ── */
function renderPage(page) {
  const root = $('app-root');
  updateSidebarActive(page);
  updateCartBadge();

  switch (page) {
    case 'auth':      root.innerHTML = renderAuth(); bindAuth(); break;
    case 'dashboard': root.innerHTML = renderAppShell(renderDashboard()); bindAppShell(); startLivePriceTicker(); break;
    case 'markets':   root.innerHTML = renderAppShell(renderMarkets()); bindAppShell(); break;
    case 'shops':     root.innerHTML = renderAppShell(renderShops()); bindAppShell(); break;
    case 'products':  root.innerHTML = renderAppShell(renderProducts()); bindAppShell(); bindProducts(); break;
    case 'cart':      root.innerHTML = renderAppShell(renderCart()); bindAppShell(); bindCart(); break;
    case 'orders':    root.innerHTML = renderAppShell(renderOrders()); bindAppShell(); break;
    case 'tracking':  root.innerHTML = renderAppShell(renderTracking()); bindAppShell(); break;
    case 'admin':     root.innerHTML = renderAppShell(renderAdmin()); bindAppShell(); bindAdmin(); break;
    default:          root.innerHTML = renderAppShell(renderDashboard()); bindAppShell();
  }
}

/* ── App Shell (sidebar + topbar) ── */
function renderAppShell(content) {
  const u = State.currentUser;
  const cartCount = State.cart.reduce((a, b) => a + b.qty, 0);
  const isSeller = u.role === 'seller';

  const buyerNav = `
    <div class="nav-section-label">Main</div>
    <div class="nav-item ${State.currentPage === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">
      <span class="nav-item-icon">🏠</span> Dashboard
    </div>
    <div class="nav-item ${State.currentPage === 'markets' ? 'active' : ''}" onclick="navigate('markets')">
      <span class="nav-item-icon">🏪</span> Browse Markets
    </div>
    <div class="nav-item ${['shops','products'].includes(State.currentPage) ? 'active' : ''}" onclick="navigate('markets')">
      <span class="nav-item-icon">🥦</span> Buy Vegetables
    </div>
    <div class="nav-section-label">Orders</div>
    <div class="nav-item ${State.currentPage === 'cart' ? 'active' : ''}" onclick="navigate('cart')">
      <span class="nav-item-icon">🛒</span> Cart
      ${cartCount > 0 ? `<span class="nav-item-badge">${cartCount}</span>` : ''}
    </div>
    <div class="nav-item ${State.currentPage === 'orders' ? 'active' : ''}" onclick="navigate('orders')">
      <span class="nav-item-icon">📋</span> My Orders
    </div>
    <div class="nav-item ${State.currentPage === 'tracking' ? 'active' : ''}" onclick="navigate('tracking')">
      <span class="nav-item-icon">🚚</span> Track Orders
    </div>`;

  const sellerNav = `
    <div class="nav-section-label">Admin</div>
    <div class="nav-item ${State.currentPage === 'dashboard' ? 'active' : ''}" onclick="navigate('dashboard')">
      <span class="nav-item-icon">🏠</span> Dashboard
    </div>
    <div class="nav-item ${State.currentPage === 'admin' ? 'active' : ''}" onclick="navigate('admin')">
      <span class="nav-item-icon">⚙️</span> Manage Products
    </div>
    <div class="nav-item ${State.currentPage === 'orders' ? 'active' : ''}" onclick="navigate('orders')">
      <span class="nav-item-icon">📋</span> Incoming Orders
    </div>`;

  const pageTitle = { dashboard:'Dashboard', markets:'Markets', shops:'Vendors', products:'Products', cart:'Cart', orders:'Orders', tracking:'Track Orders', admin:'Admin Panel' };

  return `
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="sidebar-logo-icon">🥬</span>
        <span class="sidebar-logo-text">VegMarket</span>
        <span class="sidebar-logo-badge">B2B</span>
      </div>
      <div class="sidebar-user">
        <div class="sidebar-avatar">${u.name[0]}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${u.shopName}</div>
          <small>${isSeller ? '🏷️ Seller' : '🛒 Buyer'} · ${u.name}</small>
        </div>
      </div>
      <nav class="sidebar-nav">
        ${isSeller ? sellerNav : buyerNav}
      </nav>
      <div class="sidebar-footer">
        <div class="nav-item" onclick="logout()">
          <span class="nav-item-icon">🚪</span> Logout
        </div>
      </div>
    </aside>
    <div class="main-content">
      <header class="topbar">
        <div class="topbar-title">${pageTitle[State.currentPage] || 'VegMarket'}</div>
        <div class="topbar-search">
          <span>🔍</span>
          <input type="text" id="global-search" placeholder="Search vegetables, shops..." value="${State.searchQuery}" oninput="handleSearch(this.value)">
        </div>
        ${!isSeller ? `<div class="cart-btn" onclick="navigate('cart')">🛒<span class="cart-count" id="cart-badge" style="${cartCount === 0 ? 'display:none' : ''}">${cartCount}</span></div>` : ''}
        <div style="display:flex;align-items:center;gap:8px;font-size:.82rem;color:var(--gray-500)">
          <span style="width:8px;height:8px;background:var(--green-500);border-radius:50%;display:inline-block;animation:pulse 2s infinite"></span>
          Live Prices
        </div>
      </header>
      <div class="content-area fade-in">
        ${content}
      </div>
    </div>
  </div>
  <div id="invoice-modal-container"></div>`;
}

function bindAppShell() {}

function updateSidebarActive(page) {}

function updateCartBadge() {
  const badge = $('cart-badge');
  if (!badge) return;
  const count = State.cart.reduce((a, b) => a + b.qty, 0);
  badge.textContent = count;
  badge.style.display = count > 0 ? 'flex' : 'none';
}

/* ── Auth Page ── */
function renderAuth() {
  return `
  <div class="auth-layout">
    <div class="auth-brand">
      <div class="auth-brand-logo">🥬</div>
      <h1>VegMarket B2B</h1>
      <p>Connect directly with wholesale vegetable markets and simplify your sourcing.</p>
      <div class="auth-brand-stats">
        <div class="auth-stat"><span>40+</span><small>Vendors</small></div>
        <div class="auth-stat"><span>3</span><small>Markets</small></div>
        <div class="auth-stat"><span>200+</span><small>Products</small></div>
      </div>
    </div>
    <div class="auth-form-panel">
      <div class="auth-form-inner">
        <div class="auth-tabs">
          <div class="auth-tab active" id="tab-login" onclick="switchAuthTab('login')">Login</div>
          <div class="auth-tab" id="tab-register" onclick="switchAuthTab('register')">Register</div>
        </div>
        <div class="auth-role-tabs">
          <div class="auth-role-btn active" id="role-buyer" onclick="switchRole('buyer')">🛒 Grocery Owner</div>
          <div class="auth-role-btn" id="role-seller" onclick="switchRole('seller')">🏪 Market Vendor</div>
        </div>
        <div id="auth-form-body">
          ${renderLoginForm()}
        </div>
      </div>
    </div>
  </div>`;
}

let authTab = 'login', authRole = 'buyer';

function switchAuthTab(tab) {
  authTab = tab;
  $('tab-login').className = 'auth-tab' + (tab === 'login' ? ' active' : '');
  $('tab-register').className = 'auth-tab' + (tab === 'register' ? ' active' : '');
  $('auth-form-body').innerHTML = tab === 'login' ? renderLoginForm() : renderRegisterForm();
}

function switchRole(role) {
  authRole = role;
  $('role-buyer').className = 'auth-role-btn' + (role === 'buyer' ? ' active' : '');
  $('role-seller').className = 'auth-role-btn' + (role === 'seller' ? ' active' : '');
}

function renderLoginForm() {
  return `
    <div class="form-title">Welcome back!</div>
    <div class="form-sub">Login to your B2B account</div>
    <div class="form-group"><label class="form-label">Email</label>
      <input class="form-input" id="login-email" type="email" placeholder="you@store.com" value="swetha@store.com"></div>
    <div class="form-group"><label class="form-label">Password</label>
      <input class="form-input" id="login-pwd" type="password" placeholder="••••••••" value="buyer123"></div>
    <button class="btn btn-primary btn-full" style="margin-top:8px" onclick="doLogin()">Login →</button>
    <p style="text-align:center;margin-top:14px;font-size:.8rem;color:var(--gray-500)">
      Demo: buyer → swetha@store.com / buyer123 &nbsp;|&nbsp; seller → murugan@market.com / seller123
    </p>`;
}

function renderRegisterForm() {
  return `
    <div class="form-title">Create Account</div>
    <div class="form-sub">Join VegMarket B2B Platform</div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Full Name</label><input class="form-input" id="reg-name" placeholder="Your name"></div>
      <div class="form-group"><label class="form-label">Shop Name</label><input class="form-input" id="reg-shop" placeholder="Shop name"></div>
    </div>
    <div class="form-row">
      <div class="form-group"><label class="form-label">Email</label><input class="form-input" id="reg-email" type="email" placeholder="you@store.com"></div>
      <div class="form-group"><label class="form-label">Phone</label><input class="form-input" id="reg-phone" type="tel" placeholder="9XXXXXXXXX"></div>
    </div>
    <div class="form-group"><label class="form-label">Address</label><input class="form-input" id="reg-addr" placeholder="Shop address"></div>
    <div class="form-group"><label class="form-label">Password</label><input class="form-input" id="reg-pwd" type="password" placeholder="••••••••"></div>
    <button class="btn btn-primary btn-full" style="margin-top:8px" onclick="doRegister()">Create Account →</button>`;
}

function bindAuth() {}

function doLogin() {
  const email = $('login-email').value.trim();
  const pwd = $('login-pwd').value.trim();
  const user = AppData.users.find(u => u.email === email && u.password === pwd);
  if (!user) { toast('Invalid credentials. Use the demo accounts shown below.', 'error'); return; }
  if (authRole !== user.role) { toast(`This account is a ${user.role}. Please select the correct role.`, 'error'); return; }
  State.currentUser = user;
  toast(`Welcome back, ${user.name}! 👋`);
  navigate(user.role === 'seller' ? 'admin' : 'dashboard');
}

function doRegister() {
  const name = $('reg-name').value.trim();
  const shop = $('reg-shop').value.trim();
  const email = $('reg-email').value.trim();
  const phone = $('reg-phone').value.trim();
  const addr = $('reg-addr').value.trim();
  const pwd = $('reg-pwd').value.trim();
  if (!name || !shop || !email || !phone || !addr || !pwd) { toast('Please fill all fields', 'error'); return; }
  const newUser = { id: 'u_new', role: authRole, name, shopName: shop, email, phone, address: addr, password: pwd };
  AppData.users.push(newUser);
  State.currentUser = newUser;
  toast(`Account created! Welcome, ${name}! 🎉`);
  navigate(authRole === 'seller' ? 'admin' : 'dashboard');
}

function logout() {
  State.currentUser = null;
  State.cart = [];
  State.currentPage = 'auth';
  $('app-root').innerHTML = renderAuth();
  bindAuth();
  toast('Logged out successfully', 'info');
}

/* ── Dashboard ── */
function renderDashboard() {
  const u = State.currentUser;
  const myOrders = State.orders.filter(o => o.buyerId === u.id);
  const todayOrders = myOrders.filter(o => o.date === '2026-03-17');
  const totalSpend = myOrders.reduce((a, o) => a + o.total, 0);

  const priceCards = State.livePrices.map(p => {
    const dir = p.change > 0 ? 'up' : p.change < 0 ? 'down' : 'neutral';
    const arrow = p.change > 0 ? '▲' : p.change < 0 ? '▼' : '—';
    return `<div class="price-mini-card">
      <div class="veg-icon">${p.icon}</div>
      <div class="veg-name">${p.name}</div>
      <div class="veg-price">₹${p.price}<span>/${p.unit}</span></div>
      <div class="price-change ${dir}">${arrow} ₹${Math.abs(p.change)} today</div>
    </div>`;
  }).join('');

  const isSeller = u.role === 'seller';

  return `
  <div class="welcome-banner">
    <div>
      <h2>Good morning, ${u.name.split(' ')[0]}! 🌿</h2>
      <p>${isSeller ? 'Manage your products and view incoming orders.' : 'Fresh vegetables from Chennai\'s top markets, delivered to your store.'}</p>
    </div>
    ${!isSeller ? `<button class="btn btn-primary" onclick="navigate('markets')" style="background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:1.5px solid rgba(255,255,255,.4)">Shop Now →</button>` : ''}
  </div>

  <div class="stats-grid">
    <div class="stat-card green">
      <div class="stat-icon green">📋</div>
      <div class="stat-value">${myOrders.length}</div>
      <div class="stat-label">Total Orders</div>
      <div class="stat-change up">↑ 12% this month</div>
    </div>
    <div class="stat-card orange">
      <div class="stat-icon orange">📅</div>
      <div class="stat-value">${todayOrders.length}</div>
      <div class="stat-label">Today's Orders</div>
      <div class="stat-change up">↑ 2 new</div>
    </div>
    <div class="stat-card blue">
      <div class="stat-icon blue">💰</div>
      <div class="stat-value">${formatCurrency(totalSpend)}</div>
      <div class="stat-label">Total ${isSeller ? 'Revenue' : 'Spending'}</div>
      <div class="stat-change up">↑ 8% this week</div>
    </div>
    <div class="stat-card red-c">
      <div class="stat-icon red-c">🛒</div>
      <div class="stat-value">${State.cart.reduce((a, b) => a + b.qty, 0)}</div>
      <div class="stat-label">Items in Cart</div>
      <div class="stat-change neutral" style="color:var(--gray-400)">— pending order</div>
    </div>
  </div>

  <div class="price-ticker-wrap">
    <div class="section-header" style="margin-bottom:14px">
      <div>
        <div class="section-title">📈 Today's Live Prices</div>
        <div class="section-sub">Wholesale rates updated at 5:30 AM • Anna Market</div>
      </div>
      <span id="price-live-dot" style="display:flex;align-items:center;gap:6px;font-size:.8rem;color:var(--green-600);font-weight:600">
        <span style="width:8px;height:8px;background:var(--green-500);border-radius:50%;display:inline-block;animation:pulse 2s infinite"></span> LIVE
      </span>
    </div>
    <div class="price-cards-scroll" id="price-ticker">${priceCards}</div>
  </div>

  ${!isSeller ? `
  <div class="section-header">
    <div><div class="section-title">🏪 Nearby Markets</div><div class="section-sub">Tap to browse vendors</div></div>
    <button class="btn btn-outline btn-sm" onclick="navigate('markets')">View All</button>
  </div>
  <div class="markets-grid">
    ${AppData.markets.slice(0,3).map(m => renderMarketCard(m)).join('')}
  </div>` : `
  <div class="section-header"><div class="section-title">📦 Recent Orders</div></div>
  <div style="background:var(--white);border-radius:var(--radius-lg);border:1px solid var(--gray-100);overflow:hidden">
    <table class="admin-product-table">
      <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${State.orders.slice(0,5).map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.date}</td>
          <td>${o.items.length} items</td>
          <td><strong>${formatCurrency(o.total)}</strong></td>
          <td><span class="order-status-badge badge-${o.status}">${o.status.replace(/_/g,' ')}</span></td>
            <button class="btn btn-outline btn-sm" onclick="navigate('tracking')">Track</button>
            <button class="btn btn-ghost btn-sm" style="margin-left:4px" onclick="openInvoice('${o.id}')" title="View Invoice">Invoice</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`}`;
}

function startLivePriceTicker() {
  setInterval(() => {
    State.livePrices.forEach(p => {
      const delta = Math.floor(Math.random() * 5) - 2;
      p.price = Math.max(5, p.price + delta);
      p.change = delta;
    });
    const ticker = $('price-ticker');
    if (!ticker) return;
    ticker.innerHTML = State.livePrices.map(p => {
      const dir = p.change > 0 ? 'up' : p.change < 0 ? 'down' : 'neutral';
      const arrow = p.change > 0 ? '▲' : p.change < 0 ? '▼' : '—';
      return `<div class="price-mini-card">
        <div class="veg-icon">${p.icon}</div>
        <div class="veg-name">${p.name}</div>
        <div class="veg-price">₹${p.price}<span>/${p.unit}</span></div>
        <div class="price-change ${dir}">${arrow} ₹${Math.abs(p.change)} today</div>
      </div>`;
    }).join('');
  }, 4000);
}

/* ── Markets ── */
function renderMarketCard(m) {
  return `<div class="market-card" onclick="navigate('shops',{market:'${m.id}'})">
    <img class="market-card-img" src="${m.image}" alt="${m.name}" loading="lazy">
    <div class="market-card-body">
      <div class="market-card-name">${m.name}</div>
      <div class="market-card-loc">📍 ${m.location}</div>
      <div class="market-card-meta">
        <div class="rating-badge">⭐ ${m.rating}</div>
        <div class="vendor-count">🏪 ${m.totalShops} vendors</div>
        <div style="font-size:.78rem;color:var(--gray-400)">🕐 ${m.openTime}</div>
      </div>
    </div>
  </div>`;
}

function renderMarkets() {
  return `
  <div class="section-header">
    <div><div class="section-title">🏪 Wholesale Markets</div><div class="section-sub">Select a market to browse vendors</div></div>
  </div>
  <div class="markets-grid">
    ${AppData.markets.map(m => renderMarketCard(m)).join('')}
  </div>
  <div style="background:linear-gradient(135deg,var(--green-50),var(--white));border:1px solid var(--green-200);border-radius:var(--radius-lg);padding:24px;text-align:center;margin-top:8px">
    <div style="font-size:2rem;margin-bottom:8px">🌱</div>
    <div style="font-weight:700;font-size:1rem;margin-bottom:4px">Need a custom market?</div>
    <div style="font-size:.85rem;color:var(--gray-500);margin-bottom:14px">Contact us to onboard your local wholesale market.</div>
    <button class="btn btn-outline btn-sm">Contact Support</button>
  </div>`;
}

/* ── Shops ── */
function renderShops() {
  const market = AppData.markets.find(m => m.id === State.currentMarket) || AppData.markets[0];
  const shops = AppData.shops.filter(s => s.marketId === market.id).slice(0, 42);

  return `
  <div class="breadcrumb">
    <a onclick="navigate('markets')">Markets</a>
    <span>›</span> ${market.name}
  </div>
  <div style="background:var(--white);border-radius:var(--radius-lg);padding:20px 24px;border:1px solid var(--gray-100);margin-bottom:24px;display:flex;align-items:center;gap:16px">
    <img src="${market.image}" style="width:60px;height:60px;border-radius:12px;object-fit:cover">
    <div style="flex:1">
      <div style="font-size:1.15rem;font-weight:700">${market.name}</div>
      <div style="font-size:.82rem;color:var(--gray-500)">📍 ${market.location} &nbsp;|&nbsp; 🕐 ${market.openTime}</div>
      <div style="font-size:.82rem;color:var(--gray-500);margin-top:2px">${market.description}</div>
    </div>
    <div style="text-align:right">
      <div class="rating-badge">⭐ ${market.rating}</div>
      <div style="font-size:.78rem;color:var(--gray-400);margin-top:4px">${shops.length} vendors</div>
    </div>
  </div>
  <div class="section-header">
    <div><div class="section-title">🏪 Vendors</div><div class="section-sub">${shops.length} shops available</div></div>
  </div>
  <div class="shops-grid">
    ${shops.map(s => `
      <div class="shop-card">
        <img class="shop-card-img" src="${s.image}" alt="${s.name}" loading="lazy">
        <div class="shop-card-body">
          <div class="shop-card-name">${s.name}</div>
          <div class="shop-card-spec">🌿 ${s.speciality}</div>
          <div class="shop-card-footer">
            <div>${stars(s.rating)} <span style="font-size:.73rem;color:var(--gray-400)">(${s.reviews})</span></div>
          </div>
          <button class="btn btn-primary btn-full" style="margin-top:10px" onclick="navigate('products',{shop:'${s.id}'})">View Products</button>
        </div>
      </div>`).join('')}
  </div>`;
}

/* ── Products ── */
function renderProducts() {
  const isGlobalSearch = State.currentShop === 'global_search';
  const q = State.searchQuery.toLowerCase();
  
  let vegs = [];
  let shop = null;
  let market = null;

  if (isGlobalSearch) {
    vegs = [...AppData.vegetables];
  } else {
    shop = AppData.shops.find(s => s.id === State.currentShop) || AppData.shops[0];
    market = AppData.markets.find(m => m.id === (shop ? shop.marketId : 'm1'));
    vegs = AppData.vegetables.filter(v => v.shopId === shop.id);
  }

  if (q) vegs = vegs.filter(v => v.name.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
  if (State.filterCategory !== 'All') vegs = vegs.filter(v => v.category === State.filterCategory);

  const cats = ['All', ...new Set((isGlobalSearch && !q ? [] : vegs).map(v => v.category))];

  return `
  <div class="breadcrumb">
    <a onclick="navigate('markets')">Markets</a>
    ${isGlobalSearch ? `<span>›</span> Global Search: "${State.searchQuery}"` : `
    <span>›</span><a onclick="navigate('shops',{market:'${shop.marketId}'})">${market ? market.name : ''}</a>
    <span>›</span> ${shop.name}
    `}
  </div>
  ${!isGlobalSearch ? `
  <div style="background:var(--white);border-radius:var(--radius-lg);padding:16px 20px;border:1px solid var(--gray-100);margin-bottom:20px;display:flex;align-items:center;gap:14px">
    <img src="${shop.image}" style="width:52px;height:52px;border-radius:10px;object-fit:cover">
    <div style="flex:1">
      <div style="font-size:1rem;font-weight:700">${shop.name}</div>
      <div style="font-size:.8rem;color:var(--gray-500)">🌿 ${shop.speciality} &nbsp;|&nbsp; ${stars(shop.rating)} (${shop.reviews} reviews)</div>
    </div>
    <button class="btn btn-ghost btn-sm" onclick="navigate('cart')">🛒 Cart (${State.cart.reduce((a,b)=>a+b.qty,0)})</button>
  </div>` : `
  <div style="background:var(--white);border-radius:var(--radius-lg);padding:16px 20px;border:1px solid var(--green-200);background:var(--green-50);margin-bottom:20px;display:flex;align-items:center;justify-content:space-between">
    <div>
      <div style="font-size:1rem;font-weight:700;color:var(--green-800)">🔍 Search Results across All Markets</div>
      <div style="font-size:.8rem;color:var(--green-700)">Found ${vegs.length} products for "${State.searchQuery}"</div>
    </div>
    <button class="btn btn-primary btn-sm" onclick="navigate('cart')">🛒 Cart (${State.cart.reduce((a,b)=>a+b.qty,0)})</button>
  </div>
  `}
  <div class="filter-bar" id="cat-filter">
    ${cats.map(c => `<div class="chip ${State.filterCategory===c?'active':''}" onclick="setCategory('${c}')">${c}</div>`).join('')}
  </div>
  ${vegs.length === 0 ? `<div class="empty-state"><div class="empty-state-icon">🥦</div><h3>No vegetables found</h3><p>Try changing the search or filter</p></div>` :
  `<div class="products-grid">
    ${vegs.map(v => {
      const inCart = State.cart.find(c => c.vegId === v.id);
      const vShop = AppData.shops.find(s => s.id === v.shopId);
      return `<div class="product-card" id="pc-${v.id}">
        ${v.todayDeal ? '<div class="today-badge">Today\'s Deal</div>' : ''}
        <img class="product-card-img" src="${v.image}" alt="${v.name}" loading="lazy">
        <div class="product-card-body">
          <div class="product-name">${v.name}</div>
          <div class="product-cat">${v.category}${isGlobalSearch && vShop ? ` · <span style="color:var(--green-600)">${vShop.name}</span>` : ''}</div>
          <div class="product-price">₹${v.pricePerKg}<span> / ${v.unit}</span></div>
          <div class="qty-selector">
            <div class="qty-btn" onclick="changeQty('${v.id}',${v.pricePerKg},'${vShop ? vShop.name : ''}','${v.image}','${v.name}','${v.shopId}',-1)">−</div>
            <div class="qty-value" id="qty-${v.id}">${inCart ? inCart.qty : 0}</div>
            <div class="qty-btn" onclick="changeQty('${v.id}',${v.pricePerKg},'${vShop ? vShop.name : ''}','${v.image}','${v.name}','${v.shopId}',1)">+</div>
            <span style="font-size:.72rem;color:var(--gray-400)">kg</span>
          </div>
          <button class="btn ${inCart ? 'btn-outline' : 'btn-primary'} btn-full btn-sm" id="add-btn-${v.id}"
            onclick="addToCart('${v.id}',${v.pricePerKg},'${vShop ? vShop.name : ''}','${v.image}','${v.name}','${v.shopId}')">
            ${inCart ? '✓ In Cart' : '+ Add to Cart'}
          </button>
        </div>
      </div>`;
    }).join('')}
  </div>`}`;
}

function setCategory(cat) {
  State.filterCategory = cat;
  navigate('products');
}

function handleSearch(val) {
  State.searchQuery = val;
  if (val.length > 0) {
    navigate('products', { shop: 'global_search' });
  } else if (State.currentPage === 'products' && State.currentShop === 'global_search') {
    navigate('markets');
  } else if (State.currentPage === 'products') {
    navigate('products', { shop: State.currentShop });
  }
}

function bindProducts() {}

/* ── Cart Logic ── */
function changeQty(vegId, price, shopName, img, name, shopId, delta) {
  const idx = State.cart.findIndex(c => c.vegId === vegId);
  if (idx === -1 && delta > 0) {
    State.cart.push({ vegId, shopId, name, price, qty: 1, shopName, img });
  } else if (idx !== -1) {
    State.cart[idx].qty = Math.max(0, State.cart[idx].qty + delta);
    if (State.cart[idx].qty === 0) State.cart.splice(idx, 1);
  }
  const qtyEl = $(`qty-${vegId}`);
  if (qtyEl) {
    const cur = State.cart.find(c => c.vegId === vegId);
    qtyEl.textContent = cur ? cur.qty : 0;
  }
  const btn = $(`add-btn-${vegId}`);
  if (btn) {
    const inCart = State.cart.find(c => c.vegId === vegId);
    btn.className = `btn ${inCart ? 'btn-outline' : 'btn-primary'} btn-full btn-sm`;
    btn.textContent = inCart ? '✓ In Cart' : '+ Add to Cart';
  }
  updateCartBadge();
}

function addToCart(vegId, price, shopName, img, name, shopId) {
  const idx = State.cart.findIndex(c => c.vegId === vegId);
  if (idx === -1) {
    State.cart.push({ vegId, shopId, name, price, qty: 1, shopName, img });
    toast(`${name} added to cart 🛒`);
  } else {
    State.cart[idx].qty++;
    toast(`${name} qty updated`);
  }
  const qtyEl = $(`qty-${vegId}`);
  if (qtyEl) qtyEl.textContent = State.cart.find(c => c.vegId === vegId)?.qty || 0;
  const btn = $(`add-btn-${vegId}`);
  if (btn) { btn.className = 'btn btn-outline btn-full btn-sm'; btn.textContent = '✓ In Cart'; }
  updateCartBadge();
}

/* ── Cart Page ── */
function renderCart() {
  if (State.cart.length === 0) return `
    <div class="cart-empty">
      <div class="cart-empty-icon">🛒</div>
      <h3 style="font-size:1.1rem;font-weight:700;margin-bottom:8px">Your cart is empty</h3>
      <p style="color:var(--gray-500);margin-bottom:20px">Browse markets and add vegetables to get started</p>
      <button class="btn btn-primary" onclick="navigate('markets')">Browse Markets →</button>
    </div>`;

  const byShop = {};
  State.cart.forEach(item => {
    if (!byShop[item.shopId]) byShop[item.shopId] = { name: item.shopName, items: [] };
    byShop[item.shopId].items.push(item);
  });

  const subtotal = State.cart.reduce((a, b) => a + b.price * b.qty, 0);
  const delivery = 50;
  const gst = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + gst;

  const groups = Object.entries(byShop).map(([sid, grp]) => `
    <div class="cart-group-card">
      <div class="cart-group-header"><span>🏪</span><span>${grp.name}</span></div>
      ${grp.items.map(item => `
        <div class="cart-item">
          <img class="cart-item-img" src="${item.img}" alt="${item.name}" loading="lazy">
          <div class="cart-item-info">
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-price">₹${item.price}/kg</div>
            <div class="qty-selector" style="margin-top:6px;margin-bottom:0">
              <div class="qty-btn" onclick="cartQty('${item.vegId}',-1)">−</div>
              <div class="qty-value" id="cqty-${item.vegId}">${item.qty}</div>
              <div class="qty-btn" onclick="cartQty('${item.vegId}',1)">+</div>
              <span style="font-size:.72rem;color:var(--gray-400)">kg</span>
            </div>
          </div>
          <div class="cart-item-total">${formatCurrency(item.price * item.qty)}</div>
          <div class="remove-btn" onclick="removeFromCart('${item.vegId}')">✕</div>
        </div>`).join('')}
    </div>`).join('');

  return `
  <div class="cart-layout">
    <div>
      <div class="section-header">
        <div><div class="section-title">🛒 Your Cart</div><div class="section-sub">${State.cart.length} items from ${Object.keys(byShop).length} vendors</div></div>
        <button class="btn btn-ghost btn-sm" onclick="State.cart=[];navigate('cart')">Clear All</button>
      </div>
      ${groups}
    </div>
    <div>
      <div class="cart-summary">
        <div class="summary-title">Order Summary</div>
        <div class="summary-row"><span>Subtotal</span><span>${formatCurrency(subtotal)}</span></div>
        <div class="summary-row"><span>Delivery</span><span>${formatCurrency(delivery)}</span></div>
        <div class="summary-row"><span>GST (5%)</span><span>${formatCurrency(gst)}</span></div>
        <div class="summary-row total"><span>Total</span><span>${formatCurrency(total)}</span></div>
        <button class="btn btn-primary btn-full" style="margin-top:16px" onclick="placeOrder(${total})">Place Order →</button>
        <button class="btn btn-ghost btn-full" style="margin-top:8px" onclick="navigate('markets')">+ Add More Items</button>
      </div>
      <div style="margin-top:14px;background:var(--green-50);border:1px solid var(--green-200);border-radius:var(--radius);padding:14px">
        <div style="font-size:.82rem;font-weight:600;color:var(--green-700);margin-bottom:4px">🌿 Freshness Guarantee</div>
        <div style="font-size:.77rem;color:var(--gray-600)">All vegetables sourced fresh from today's market. Delivery within 3–5 hours of order placement.</div>
      </div>
    </div>
  </div>`;
}

function bindCart() {}

function cartQty(vegId, delta) {
  const idx = State.cart.findIndex(c => c.vegId === vegId);
  if (idx === -1) return;
  State.cart[idx].qty = Math.max(0, State.cart[idx].qty + delta);
  if (State.cart[idx].qty === 0) { State.cart.splice(idx, 1); navigate('cart'); return; }
  const el = $(`cqty-${vegId}`); if (el) el.textContent = State.cart[idx].qty;
  updateCartBadge();
  // refresh totals
  navigate('cart');
}

function removeFromCart(vegId) {
  State.cart = State.cart.filter(c => c.vegId !== vegId);
  navigate('cart');
  toast('Item removed', 'info');
}

function placeOrder(total) {
  const newOrder = {
    id: 'ORD-' + (2400 + State.orders.length + 1),
    buyerId: State.currentUser.id,
    date: '2026-03-17',
    status: 'placed',
    total,
    items: State.cart.map(c => ({ vegId: c.vegId, shopId: c.shopId, name: c.name, qty: c.qty, price: c.price })),
    timeline: [
      { status: 'Order Placed', time: new Date().toLocaleString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit' }), done: true },
      { status: 'Accepted by Shops', time: '', done: false },
      { status: 'Packed', time: '', done: false },
      { status: 'Out for Delivery', time: '', done: false },
      { status: 'Delivered', time: '', done: false },
    ],
    deliveryPartner: {
      name: ['Ramesh K', 'Suresh M', 'Karthik P', 'Mani V'][Math.floor(Math.random() * 4)],
      phone: '+91 9' + Math.floor(100000000 + Math.random() * 900000000),
      vehicleType: ['Tata Ace (Mini Truck)', 'Mahindra Bolero Pickup', 'Ashok Leyland Dost'][Math.floor(Math.random() * 3)],
      vehicleNo: 'TN ' + (Math.floor(Math.random() * 80) + 10) + ' ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + String.fromCharCode(65 + Math.floor(Math.random() * 26)) + ' ' + (Math.floor(Math.random() * 8999) + 1000)
    }
  };
  State.orders.unshift(newOrder);
  State.cart = [];
  toast(`Order ${newOrder.id} placed successfully! 🎉`);
  navigate('tracking');
}

/* ── Orders ── */
function renderOrders() {
  const myOrders = State.orders.filter(o => o.buyerId === State.currentUser.id || State.currentUser.role === 'seller');
  if (myOrders.length === 0) return `<div class="empty-state"><div class="empty-state-icon">📋</div><h3>No orders yet</h3><p>Place your first order from the markets</p><button class="btn btn-primary" onclick="navigate('markets')">Shop Now</button></div>`;
  return `
  <div class="section-header"><div class="section-title">📋 All Orders</div></div>
  <div style="background:var(--white);border-radius:var(--radius-lg);border:1px solid var(--gray-100);overflow:hidden;box-shadow:var(--shadow-sm)">
    <table class="admin-product-table">
      <thead><tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th><th>Action</th></tr></thead>
      <tbody>${myOrders.map(o => `
        <tr>
          <td><strong>${o.id}</strong></td>
          <td>${o.date}</td>
          <td>${o.items.length} items</td>
          <td><strong>${formatCurrency(o.total)}</strong></td>
          <td><span class="order-status-badge badge-${o.status}">${o.status.replace(/_/g,' ')}</span></td>
          <td>
            <button class="btn btn-outline btn-sm" onclick="navigate('tracking')">Track</button>
            <button class="btn btn-ghost btn-sm" style="margin-left:4px" onclick="openInvoice('${o.id}')" title="View Invoice">Invoice</button>
          </td>
        </tr>`).join('')}
      </tbody>
    </table>
  </div>`;
}

/* ── Tracking ── */
function renderTracking() {
  const myOrders = State.orders.filter(o => o.buyerId === State.currentUser.id || State.currentUser.role === 'seller');
  if (myOrders.length === 0) return `<div class="empty-state"><div class="empty-state-icon">🚚</div><h3>No orders to track</h3></div>`;

  const cards = myOrders.map(order => {
    const doneCount = order.timeline.filter(t => t.done).length;
    const pct = Math.round((doneCount / order.timeline.length) * 100);
    const activeIdx = order.timeline.findIndex(t => !t.done);
    const timelineHtml = order.timeline.map((t, i) => {
      const cls = t.done ? 'done' : (i === activeIdx ? 'active' : 'pending');
      return `<div class="timeline-item ${cls}">
        <div class="timeline-dot"></div>
        <div class="timeline-status">${t.done ? '✓ ' : ''}${t.status}</div>
        <div class="timeline-time">${t.time || (i === activeIdx ? 'In progress...' : 'Pending')}</div>
      </div>`;
    }).join('');

    const partnerInfo = order.deliveryPartner ? `
      <div style="margin-top:20px;padding-top:16px;border-top:1px dashed var(--gray-200)">
        <div style="font-size:.82rem;font-weight:700;color:var(--gray-600);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em">Delivery Partner Details</div>
        <div style="display:flex;align-items:center;gap:12px;background:var(--gray-50);padding:12px;border-radius:var(--radius);border:1px solid var(--gray-100);margin-bottom:12px">
          <div style="width:40px;height:40px;border-radius:50%;background:var(--green-100);display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0">🛵</div>
          <div style="flex:1">
            <div style="font-size:.9rem;font-weight:700">${order.deliveryPartner.name}</div>
            <div style="font-size:.78rem;color:var(--gray-500)">📞 ${order.deliveryPartner.phone}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:.8rem;font-weight:600;color:var(--gray-700)">${order.deliveryPartner.vehicleNo}</div>
            <div style="font-size:.7rem;color:var(--gray-500)">${order.deliveryPartner.vehicleType}</div>
          </div>
        </div>
        <div style="font-size:.82rem;font-weight:700;color:var(--gray-600);margin-bottom:10px;text-transform:uppercase;letter-spacing:.05em">Live Tracking</div>
        <div style="border-radius:var(--radius-lg);overflow:hidden;border:1px solid var(--gray-200);height:200px;background:var(--gray-100);position:relative">
          <iframe width="100%" height="100%" frameborder="0" style="border:0;filter:contrast(1.2) sepia(0.2) hue-rotate(80deg) blur(0.5px)" 
            src="https://maps.google.com/maps?q=Koyambedu%20Market%20Chennai&t=&z=13&ie=UTF8&iwloc=&output=embed" allowfullscreen>
          </iframe>
          <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2rem;text-shadow:0 2px 5px rgba(0,0,0,0.3);animation:bounce 2s infinite">🚚</div>
          <div style="position:absolute;bottom:10px;left:50%;transform:translateX(-50%);background:var(--white);padding:4px 12px;border-radius:20px;font-size:.75rem;font-weight:600;box-shadow:var(--shadow-md);display:flex;align-items:center;gap:6px">
            <span style="width:8px;height:8px;background:var(--green-500);border-radius:50%;display:inline-block;animation:pulse 2s infinite"></span> Live Location
          </div>
        </div>
      </div>` : '';

    return `<div class="order-card">
      <div class="order-card-head">
        <div>
          <div class="order-id">${order.id}</div>
          <div style="font-size:.76rem;color:var(--gray-400)">${order.date} · ${order.items.length} items · ${formatCurrency(order.total)}</div>
        </div>
        <span class="order-status-badge badge-${order.status}">${order.status.replace(/_/g,' ')}</span>
      </div>
      <div class="order-card-body">
        <div class="progress-bar-wrap"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <div style="font-size:.75rem;color:var(--gray-500);text-align:right;margin-top:4px;margin-bottom:16px">${pct}% complete</div>
        <div class="timeline">${timelineHtml}</div>
        ${partnerInfo}
      </div>
    </div>`;
  }).join('');

  return `<div class="section-header"><div class="section-title">🚚 Order Tracking</div><div class="section-sub">Real-time status of your orders</div></div>
  <div class="order-cards-grid">${cards}</div>`;
}

/* ── Admin Panel ── */
function renderAdmin() {
  const shopProducts = State.adminProducts.filter(p => {
    const shop = AppData.shops.find(s => s.sellerId === State.currentUser.id);
    return shop ? p.shopId === shop.id : true;
  });

  const tableRows = shopProducts.map(p => {
    const stockCls = p.stock > 100 ? 'stock-ok' : p.stock > 20 ? 'stock-low' : 'stock-out';
    const stockLabel = p.stock > 100 ? 'In Stock' : p.stock > 20 ? 'Low Stock' : 'Out';
    return `<tr>
      <td><img src="${p.image}" style="width:36px;height:36px;border-radius:8px;object-fit:cover;vertical-align:middle;margin-right:8px"><strong>${p.name}</strong></td>
      <td>${p.category}</td>
      <td id="price-${p.id}" style="font-weight:700;color:var(--green-700)">₹${p.pricePerKg}</td>
      <td><span class="stock-badge ${stockCls}">${stockLabel} (${p.stock}kg)</span></td>
      <td>${p.todayDeal ? '<span style="color:var(--green-600);font-weight:600">✓ Yes</span>' : '<span style="color:var(--gray-400)">—</span>'}</td>
      <td>
        <button class="btn btn-outline btn-sm" onclick="openEditModal('${p.id}',${p.pricePerKg},${p.stock})">Edit</button>
        <button class="btn btn-danger btn-sm" style="margin-left:4px" onclick="deleteProduct('${p.id}')">Delete</button>
      </td>
    </tr>`;
  }).join('');

  return `
  <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:18px;margin-bottom:24px">
    <div class="stat-card green"><div class="stat-icon green">📦</div><div class="stat-value">${shopProducts.length}</div><div class="stat-label">Products Listed</div></div>
    <div class="stat-card orange"><div class="stat-icon orange">📋</div><div class="stat-value">${State.orders.length}</div><div class="stat-label">Incoming Orders</div></div>
    <div class="stat-card blue"><div class="stat-icon blue">💰</div><div class="stat-value">${formatCurrency(State.orders.reduce((a,o)=>a+o.total,0))}</div><div class="stat-label">Total Revenue</div></div>
  </div>

  <div style="background:var(--white);border-radius:var(--radius-lg);border:1px solid var(--gray-100);overflow:hidden;box-shadow:var(--shadow-sm)">
    <div style="padding:16px 20px;border-bottom:1px solid var(--gray-100);display:flex;align-items:center;justify-content:space-between">
      <div><div class="section-title">📦 Product Management</div><div class="section-sub">${shopProducts.length} products</div></div>
      <button class="btn btn-primary btn-sm" onclick="openAddModal()">+ Add Product</button>
    </div>
    <table class="admin-product-table">
      <thead><tr><th>Product</th><th>Category</th><th>Price/kg</th><th>Stock</th><th>Today's Deal</th><th>Actions</th></tr></thead>
      <tbody id="admin-tbody">${tableRows}</tbody>
    </table>
  </div>

  <!-- Edit Modal -->
  <div class="modal-overlay" id="edit-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Edit Product</div>
        <div class="modal-close" onclick="closeModal('edit-modal')">✕</div>
      </div>
      <div class="form-group"><label class="form-label">Price per kg (₹)</label><input class="form-input" id="edit-price" type="number"></div>
      <div class="form-group"><label class="form-label">Stock (kg)</label><input class="form-input" id="edit-stock" type="number"></div>
      <input type="hidden" id="edit-pid">
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-primary" onclick="saveEdit()">Save Changes</button>
        <button class="btn btn-ghost" onclick="closeModal('edit-modal')">Cancel</button>
      </div>
    </div>
  </div>

  <!-- Add Modal -->
  <div class="modal-overlay" id="add-modal">
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">Add New Product</div>
        <div class="modal-close" onclick="closeModal('add-modal')">✕</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Name</label><input class="form-input" id="add-name" placeholder="Vegetable name"></div>
        <div class="form-group"><label class="form-label">Category</label>
          <select class="form-input" id="add-cat">${AppData.categories.filter(c=>c!=='All').map(c=>`<option>${c}</option>`).join('')}</select>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Price/kg (₹)</label><input class="form-input" id="add-price" type="number" placeholder="e.g. 45"></div>
        <div class="form-group"><label class="form-label">Stock (kg)</label><input class="form-input" id="add-stock" type="number" placeholder="e.g. 100"></div>
      </div>
      <div class="form-group"><label class="form-label">Image URL</label><input class="form-input" id="add-img" placeholder="https://..."></div>
      <div style="display:flex;gap:10px;margin-top:8px">
        <button class="btn btn-primary" onclick="addProduct()">Add Product</button>
        <button class="btn btn-ghost" onclick="closeModal('add-modal')">Cancel</button>
      </div>
    </div>
  </div>`;
}

function bindAdmin() {}

function openEditModal(pid, price, stock) {
  $('edit-pid').value = pid;
  $('edit-price').value = price;
  $('edit-stock').value = stock;
  $('edit-modal').classList.add('open');
}

function saveEdit() {
  const pid = $('edit-pid').value;
  const price = parseInt($('edit-price').value);
  const stock = parseInt($('edit-stock').value);
  const p = State.adminProducts.find(p => p.id === pid);
  if (p) { p.pricePerKg = price; p.stock = stock; }
  const pa = AppData.vegetables.find(p => p.id === pid);
  if (pa) { pa.pricePerKg = price; pa.stock = stock; }
  closeModal('edit-modal');
  toast('Product updated ✅');
  navigate('admin');
}

function deleteProduct(pid) {
  State.adminProducts = State.adminProducts.filter(p => p.id !== pid);
  const idx = AppData.vegetables.findIndex(p => p.id === pid);
  if (idx !== -1) AppData.vegetables.splice(idx, 1);
  toast('Product deleted', 'info');
  navigate('admin');
}

function openAddModal() { $('add-modal').classList.add('open'); }

function addProduct() {
  const name = $('add-name').value.trim();
  const cat = $('add-cat').value;
  const price = parseInt($('add-price').value);
  const stock = parseInt($('add-stock').value);
  const img = $('add-img').value.trim() || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=300&q=80';
  if (!name || !price || !stock) { toast('Fill all required fields', 'error'); return; }
  const shop = AppData.shops.find(s => s.sellerId === State.currentUser.id) || AppData.shops[0];
  const newP = { id: 'v_' + Date.now(), shopId: shop.id, name, category: cat, image: img, pricePerKg: price, unit: 'kg', stock, todayDeal: false };
  AppData.vegetables.push(newP);
  State.adminProducts.push(newP);
  closeModal('add-modal');
  toast(`${name} added successfully!`);
  navigate('admin');
}

function closeModal(id) { $(id).classList.remove('open'); }

/* ── Invoice ── */
function openInvoice(orderId) {
  const order = State.orders.find(o => o.id === orderId);
  if (!order) return;

  const subtotal = order.items.reduce((a, b) => a + (b.price * b.qty), 0);
  const delivery = 50;
  const gst = Math.round(subtotal * 0.05);

  const html = `
  <div class="modal-overlay open" id="invoice-${orderId}">
    <div class="modal" style="max-width:540px">
      <div class="modal-header" style="border-bottom:1px solid var(--gray-200);padding-bottom:16px;margin-bottom:16px">
        <div>
          <div class="modal-title" style="font-size:1.4rem">Invoice</div>
          <div style="font-size:.8rem;color:var(--gray-500)">Order #${order.id} &nbsp;|&nbsp; ${order.date}</div>
        </div>
        <div class="modal-close" onclick="closeModal('invoice-${orderId}')">✕</div>
      </div>
      <div style="margin-bottom:20px;font-size:.85rem;color:var(--gray-600);display:flex;justify-content:space-between">
        <div>
          <strong>Billed To:</strong><br>
          ${State.currentUser.shopName}<br>
          ${State.currentUser.name}<br>
          ${State.currentUser.phone}
        </div>
        <div style="text-align:right">
          <strong>From:</strong><br>
          VegMarket B2B Platform<br>
          Chennai Wholesale Hub
        </div>
      </div>
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;font-size:.85rem">
        <thead>
          <tr style="border-bottom:2px solid var(--gray-200);text-align:left">
            <th style="padding:8px 0">Item</th>
            <th style="padding:8px 0;text-align:right">Qty</th>
            <th style="padding:8px 0;text-align:right">Price</th>
            <th style="padding:8px 0;text-align:right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr style="border-bottom:1px solid var(--gray-100)">
              <td style="padding:10px 0">
                <strong>${item.name}</strong><br>
                <span style="font-size:.75rem;color:var(--gray-500)">Vendor: ${item.shopId}</span>
              </td>
              <td style="padding:10px 0;text-align:right">${item.qty} kg</td>
              <td style="padding:10px 0;text-align:right">₹${item.price}</td>
              <td style="padding:10px 0;text-align:right;font-weight:600">₹${item.price * item.qty}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div style="display:flex;justify-content:flex-end">
        <div style="width:240px;font-size:.85rem">
          <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>Subtotal:</span> <span>₹${subtotal}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px"><span>Delivery:</span> <span>₹${delivery}</span></div>
          <div style="display:flex;justify-content:space-between;margin-bottom:6px;padding-bottom:10px;border-bottom:1px solid var(--gray-200)"><span>GST (5%):</span> <span>₹${gst}</span></div>
          <div style="display:flex;justify-content:space-between;margin-top:10px;font-size:1.1rem;font-weight:800;color:var(--green-700)"><span>Total:</span> <span>₹${order.total}</span></div>
        </div>
      </div>
      <div style="margin-top:24px;display:flex;gap:12px;justify-content:flex-end;border-top:1px solid var(--gray-200);padding-top:20px">
        <button class="btn btn-outline" onclick="window.print()">🖨️ Print Invoice</button>
        <button class="btn btn-primary" onclick="closeModal('invoice-${orderId}')">Close</button>
      </div>
    </div>
  </div>`;
  $('invoice-modal-container').innerHTML = html;
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', () => {
  renderPage('auth');
});
