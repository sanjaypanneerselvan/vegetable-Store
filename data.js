// ============================================================
// VegMarket B2B Platform - Data Layer
// ============================================================

const AppData = {

  // --- Users (demo accounts) ---
  users: [
    { id: 'u1', role: 'buyer', name: 'Rajesh Kumar', shopName: 'Kumar General Store', email: 'rajesh@store.com', phone: '9876543210', address: '12 Gandhi Nagar, Chennai', password: 'buyer123' },
    { id: 'u2', role: 'seller', name: 'Murugan Selvan', shopName: 'Murugan Vegetables', email: 'murugan@market.com', phone: '9876501234', address: 'Stall 5, Anna Market, Chennai', password: 'seller123' },
    { id: 'u3', role: 'buyer', name: 'Priya Sharma', shopName: 'Priya Kirana Shop', email: 'priya@kirana.com', phone: '9123456789', address: '45 Nehru Street, Chennai', password: 'buyer123' },
  ],

  // --- Markets ---
  markets: [
    {
      id: 'm1',
      name: 'Anna Market',
      location: 'Koyambedu, Chennai',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80',
      totalShops: 42,
      rating: 4.5,
      openTime: '4:00 AM – 12:00 PM',
      description: 'Chennai\'s largest wholesale vegetable market with 40+ vendors offering fresh produce daily.'
    },
    {
      id: 'm2',
      name: 'Koyambedu Market',
      location: 'Koyambedu, Chennai',
      image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&q=80',
      totalShops: 35,
      rating: 4.3,
      openTime: '3:00 AM – 11:00 AM',
      description: 'Major wholesale hub for vegetables and fruits, serving thousands of retailers every day.'
    },
    {
      id: 'm3',
      name: 'Broadway Market',
      location: 'Broadway, Chennai',
      image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=600&q=80',
      totalShops: 28,
      rating: 4.1,
      openTime: '5:00 AM – 1:00 PM',
      description: 'Heritage market at Broadway known for premium quality vegetables and competitive B2B pricing.'
    }
  ],

  // --- Shops (Vendors) for Anna Market ---
  shops: [
    { id: 's1', marketId: 'm1', name: 'Murugan Vegetables', owner: 'Murugan Selvan', image: 'https://images.unsplash.com/photo-1516594798947-e65505dbb29d?w=400&q=80', rating: 4.8, reviews: 214, speciality: 'Leafy Greens & Herbs', sellerId: 'u2' },
    { id: 's2', marketId: 'm1', name: 'Selvam Fresh Farm', owner: 'Selvam Raj', image: 'https://images.unsplash.com/photo-1506484381205-f7945653044d?w=400&q=80', rating: 4.6, reviews: 189, speciality: 'Root Vegetables' },
    { id: 's3', marketId: 'm1', name: 'Anbu Traders', owner: 'Anbu Kumar', image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?w=400&q=80', rating: 4.5, reviews: 156, speciality: 'Exotic Vegetables' },
    { id: 's4', marketId: 'm1', name: 'Lakshmi Agro Mart', owner: 'Lakshmi Devi', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80', rating: 4.7, reviews: 302, speciality: 'Tomato & Onion' },
    { id: 's5', marketId: 'm1', name: 'Rajan Organic Farm', owner: 'Rajan P', image: 'https://images.unsplash.com/photo-1492496913980-501348b61469?w=400&q=80', rating: 4.9, reviews: 87, speciality: 'Organic Produce' },
    { id: 's6', marketId: 'm1', name: 'Balu & Sons', owner: 'Balu Krishnan', image: 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&q=80', rating: 4.4, reviews: 143, speciality: 'Gourds & Squash' },
    { id: 's7', marketId: 'm1', name: 'Sri Venkat Stores', owner: 'Venkat S', image: 'https://images.unsplash.com/photo-1561043433-aaf687c4cf04?w=400&q=80', rating: 4.3, reviews: 98, speciality: 'Beans & Legumes' },
    { id: 's8', marketId: 'm1', name: 'Karthi Vegetables', owner: 'Karthikeyan M', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=400&q=80', rating: 4.6, reviews: 211, speciality: 'South Indian Veggies' },
    { id: 's9', marketId: 'm1', name: 'Prabhu Farm Fresh', owner: 'Prabhu R', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80', rating: 4.5, reviews: 174, speciality: 'Mixed Vegetables' },
    { id: 's10', marketId: 'm1', name: 'Nagesh Wholesale', owner: 'Nagesh T', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=400&q=80', rating: 4.2, reviews: 65, speciality: 'Bulk Orders' },
    { id: 's11', marketId: 'm1', name: 'Siva Green Mart', owner: 'Sivakumar P', image: 'https://images.unsplash.com/photo-1569870499705-504209102861?w=400&q=80', rating: 4.7, reviews: 132, speciality: 'Fresh Greens' },
    { id: 's12', marketId: 'm1', name: 'Devi Organics', owner: 'Devika R', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=400&q=80', rating: 4.8, reviews: 265, speciality: 'Certified Organic' },
    // More shops for Anna Market
    ...Array.from({ length: 30 }, (_, i) => ({
      id: `s${13 + i}`, marketId: 'm1',
      name: [`Arun Traders`, `Senthil Mart`, `Velmurugan Store`, `Annamalai Fresh`, `Ravi Vegetables`, `Suresh Farm`, `Vijay Agro`, `Kannan Store`, `Palani Traders`, `Mani Fresh Mart`][i % 10] + ` ${Math.floor(i / 10) + 1}`,
      owner: `Vendor ${13 + i}`,
      image: `https://images.unsplash.com/photo-${['1542838132-92c53300491e','1488459716781-31db52582fe9','1506484381205-f7945653044d','1518843875459-f738682238a6','1464226184884-fa280b87c399'][i % 5]}?w=400&q=80`,
      rating: parseFloat((3.8 + Math.random() * 1.1).toFixed(1)),
      reviews: Math.floor(30 + Math.random() * 200),
      speciality: ['Leafy Greens', 'Root Vegetables', 'Tomatoes', 'Onions', 'Exotic Veggies'][i % 5]
    })),
    // Shops for Market 2
    ...Array.from({ length: 35 }, (_, i) => ({
      id: `k${i + 1}`, marketId: 'm2',
      name: `Koyambedu Shop ${i + 1}`,
      owner: `Owner ${i + 1}`,
      image: `https://images.unsplash.com/photo-${['1607305387299-a3d9611cd469','1516594798947-e65505dbb29d','1498579150354-977475b7ea0b'][i % 3]}?w=400&q=80`,
      rating: parseFloat((3.5 + Math.random() * 1.4).toFixed(1)),
      reviews: Math.floor(20 + Math.random() * 150),
      speciality: ['Vegetables', 'Fruits', 'Herbs'][i % 3]
    })),
    // Shops for Market 3
    ...Array.from({ length: 28 }, (_, i) => ({
      id: `b${i + 1}`, marketId: 'm3',
      name: `Broadway Shop ${i + 1}`,
      owner: `Owner ${i + 1}`,
      image: `https://images.unsplash.com/photo-${['1607305387299-a3d9611cd469','1463797221720-6b07e6426c24','1518977956812-cd3dbadaaf31'][i % 3]}?w=400&q=80`,
      rating: parseFloat((3.6 + Math.random() * 1.3).toFixed(1)),
      reviews: Math.floor(15 + Math.random() * 120),
      speciality: ['Vegetables', 'Herbs', 'Gourds'][i % 3]
    }))
  ],

  // --- Vegetables / Products per shop ---
  vegetables: [
    // Murugan Vegetables (s1)
    { id: 'v1', shopId: 's1', name: 'Spinach', category: 'Leafy Greens', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80', pricePerKg: 35, unit: 'kg', stock: 150, todayDeal: true },
    { id: 'v2', shopId: 's1', name: 'Coriander', category: 'Herbs', image: 'https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=300&q=80', pricePerKg: 80, unit: 'kg', stock: 60, todayDeal: false },
    { id: 'v3', shopId: 's1', name: 'Mint Leaves', category: 'Herbs', image: 'https://images.unsplash.com/photo-1628557010615-cf0ddabfe0e3?w=300&q=80', pricePerKg: 120, unit: 'kg', stock: 40, todayDeal: true },
    { id: 'v4', shopId: 's1', name: 'Fenugreek', category: 'Leafy Greens', image: 'https://images.unsplash.com/photo-1515516969-d4008cc6241a?w=300&q=80', pricePerKg: 45, unit: 'kg', stock: 80, todayDeal: false },

    // Selvam Fresh Farm (s2)
    { id: 'v5', shopId: 's2', name: 'Carrot', category: 'Root Vegetables', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&q=80', pricePerKg: 55, unit: 'kg', stock: 200, todayDeal: true },
    { id: 'v6', shopId: 's2', name: 'Beetroot', category: 'Root Vegetables', image: 'https://images.unsplash.com/photo-1593105544559-ecb03bf76f82?w=300&q=80', pricePerKg: 40, unit: 'kg', stock: 120, todayDeal: false },
    { id: 'v7', shopId: 's2', name: 'Radish', category: 'Root Vegetables', image: 'https://images.unsplash.com/photo-1615484477778-ca3b77940c25?w=300&q=80', pricePerKg: 30, unit: 'kg', stock: 90, todayDeal: false },
    { id: 'v8', shopId: 's2', name: 'Potato', category: 'Root Vegetables', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=300&q=80', pricePerKg: 28, unit: 'kg', stock: 500, todayDeal: true },

    // Anbu Traders (s3)
    { id: 'v9', shopId: 's3', name: 'Broccoli', category: 'Exotic', image: 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=300&q=80', pricePerKg: 90, unit: 'kg', stock: 50, todayDeal: true },
    { id: 'v10', shopId: 's3', name: 'Zucchini', category: 'Exotic', image: 'https://images.unsplash.com/photo-1563699085-5f3b64cd8e4c?w=300&q=80', pricePerKg: 75, unit: 'kg', stock: 40, todayDeal: false },
    { id: 'v11', shopId: 's3', name: 'Bell Pepper', category: 'Exotic', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=300&q=80', pricePerKg: 110, unit: 'kg', stock: 70, todayDeal: true },
    { id: 'v12', shopId: 's3', name: 'Cherry Tomato', category: 'Exotic', image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&q=80', pricePerKg: 130, unit: 'kg', stock: 30, todayDeal: false },

    // Lakshmi Agro Mart (s4)
    { id: 'v13', shopId: 's4', name: 'Tomato', category: 'Fruit Vegetables', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80', pricePerKg: 22, unit: 'kg', stock: 800, todayDeal: true },
    { id: 'v14', shopId: 's4', name: 'Onion', category: 'Bulbs', image: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300&q=80', pricePerKg: 35, unit: 'kg', stock: 600, todayDeal: true },
    { id: 'v15', shopId: 's4', name: 'Garlic', category: 'Bulbs', image: 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2383?w=300&q=80', pricePerKg: 160, unit: 'kg', stock: 120, todayDeal: false },
    { id: 'v16', shopId: 's4', name: 'Ginger', category: 'Roots', image: 'https://images.unsplash.com/photo-1603431777007-61eca81e5d65?w=300&q=80', pricePerKg: 140, unit: 'kg', stock: 80, todayDeal: false },

    // Rajan Organic Farm (s5)
    { id: 'v17', shopId: 's5', name: 'Organic Spinach', category: 'Organic', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=300&q=80', pricePerKg: 65, unit: 'kg', stock: 60, todayDeal: true },
    { id: 'v18', shopId: 's5', name: 'Organic Carrot', category: 'Organic', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300&q=80', pricePerKg: 85, unit: 'kg', stock: 90, todayDeal: false },
    { id: 'v19', shopId: 's5', name: 'Organic Tomato', category: 'Organic', image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=300&q=80', pricePerKg: 48, unit: 'kg', stock: 120, todayDeal: true },

    // Balu & Sons (s6)
    { id: 'v20', shopId: 's6', name: 'Bottle Gourd', category: 'Gourds', image: 'https://images.unsplash.com/photo-1569870499705-504209102861?w=300&q=80', pricePerKg: 18, unit: 'kg', stock: 200, todayDeal: true },
    { id: 'v21', shopId: 's6', name: 'Ridge Gourd', category: 'Gourds', image: 'https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=300&q=80', pricePerKg: 22, unit: 'kg', stock: 150, todayDeal: false },
    { id: 'v22', shopId: 's6', name: 'Bitter Gourd', category: 'Gourds', image: 'https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=300&q=80', pricePerKg: 30, unit: 'kg', stock: 100, todayDeal: false },
    { id: 'v23', shopId: 's6', name: 'Ash Gourd', category: 'Gourds', image: 'https://images.unsplash.com/photo-1590005024862-6b67679a29fb?w=300&q=80', pricePerKg: 15, unit: 'kg', stock: 180, todayDeal: true },

    // Sri Venkat Stores (s7)
    { id: 'v24', shopId: 's7', name: 'Green Beans', category: 'Beans', image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=300&q=80', pricePerKg: 60, unit: 'kg', stock: 80, todayDeal: true },
    { id: 'v25', shopId: 's7', name: 'Cluster Beans', category: 'Beans', image: 'https://images.unsplash.com/photo-1567375698348-5d9d5ae99de0?w=300&q=80', pricePerKg: 45, unit: 'kg', stock: 60, todayDeal: false },
    { id: 'v26', shopId: 's7', name: 'Peas', category: 'Legumes', image: 'https://images.unsplash.com/photo-1587734361993-0490df26bce0?w=300&q=80', pricePerKg: 70, unit: 'kg', stock: 90, todayDeal: true },

    // Karthi Vegetables (s8)
    { id: 'v27', shopId: 's8', name: 'Brinjal', category: 'South Indian', image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=300&q=80', pricePerKg: 35, unit: 'kg', stock: 120, todayDeal: true },
    { id: 'v28', shopId: 's8', name: 'Drumstick', category: 'South Indian', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=300&q=80', pricePerKg: 55, unit: 'kg', stock: 70, todayDeal: false },
    { id: 'v29', shopId: 's8', name: 'Raw Banana', category: 'South Indian', image: 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=300&q=80', pricePerKg: 25, unit: 'kg', stock: 150, todayDeal: true },
    { id: 'v30', shopId: 's8', name: 'Raw Mango', category: 'South Indian', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=300&q=80', pricePerKg: 65, unit: 'kg', stock: 80, todayDeal: false },
  ],

  // --- Categories ---
  categories: ['All', 'Leafy Greens', 'Root Vegetables', 'Herbs', 'Exotic', 'Organic', 'Gourds', 'Beans', 'Legumes', 'South Indian', 'Fruit Vegetables', 'Bulbs'],

  // --- Sample Orders ---
  orders: [
    {
      id: 'ORD-2401', buyerId: 'u1', date: '2026-03-16', status: 'delivered', total: 1850,
      items: [
        { vegId: 'v1', shopId: 's1', name: 'Spinach', qty: 10, price: 35 },
        { vegId: 'v13', shopId: 's4', name: 'Tomato', qty: 20, price: 22 },
        { vegId: 'v14', shopId: 's4', name: 'Onion', qty: 15, price: 35 },
      ],
      timeline: [
        { status: 'Order Placed', time: '2026-03-16 05:30', done: true },
        { status: 'Accepted by Shops', time: '2026-03-16 06:00', done: true },
        { status: 'Packed', time: '2026-03-16 07:15', done: true },
        { status: 'Out for Delivery', time: '2026-03-16 08:00', done: true },
        { status: 'Delivered', time: '2026-03-16 09:30', done: true },
      ]
    },
    {
      id: 'ORD-2402', buyerId: 'u1', date: '2026-03-17', status: 'out_for_delivery', total: 2240,
      items: [
        { vegId: 'v5', shopId: 's2', name: 'Carrot', qty: 15, price: 55 },
        { vegId: 'v8', shopId: 's2', name: 'Potato', qty: 20, price: 28 },
        { vegId: 'v9', shopId: 's3', name: 'Broccoli', qty: 8, price: 90 },
        { vegId: 'v11', shopId: 's3', name: 'Bell Pepper', qty: 5, price: 110 },
      ],
      timeline: [
        { status: 'Order Placed', time: '2026-03-17 05:00', done: true },
        { status: 'Accepted by Shops', time: '2026-03-17 05:45', done: true },
        { status: 'Packed', time: '2026-03-17 06:30', done: true },
        { status: 'Out for Delivery', time: '2026-03-17 07:30', done: true },
        { status: 'Delivered', time: '', done: false },
      ]
    },
  ],

  // --- Live price fluctuations (simulated) ---
  livePrices: [
    { name: 'Tomato', price: 22, change: -3, unit: 'kg', icon: '🍅' },
    { name: 'Onion', price: 35, change: +2, unit: 'kg', icon: '🧅' },
    { name: 'Potato', price: 28, change: 0, unit: 'kg', icon: '🥔' },
    { name: 'Carrot', price: 55, change: -5, unit: 'kg', icon: '🥕' },
    { name: 'Spinach', price: 35, change: +4, unit: 'kg', icon: '🥬' },
    { name: 'Brinjal', price: 35, change: -2, unit: 'kg', icon: '🟣' },
    { name: 'Broccoli', price: 90, change: +8, unit: 'kg', icon: '🥦' },
    { name: 'Ginger', price: 140, change: -10, unit: 'kg', icon: '🫚' },
  ]
};
