const listeners = new Set()

export const store = {
  state: {
    cart: [],
    route: { name: 'home', params: {} },
    query: '',
    user: null,
    prescriptionValidated: {},
    compareList: [],
  },
  get(key) {
    return this.state[key]
  },
  set(key, value) {
    this.state[key] = value
    listeners.forEach((l) => l(this.state))
  },
  subscribe(fn) {
    listeners.add(fn)
    return () => listeners.delete(fn)
  },
  notify() {
    listeners.forEach((l) => l(this.state))
  },
  addToCart(productId, qty = 1) {
    const existing = this.state.cart.find((c) => c.id === productId)
    if (existing) {
      existing.qty += qty
    } else {
      this.state.cart.push({ id: productId, qty })
    }
    this.notify()
  },
  updateQty(productId, qty) {
    const item = this.state.cart.find((c) => c.id === productId)
    if (!item) return
    if (qty <= 0) {
      this.state.cart = this.state.cart.filter((c) => c.id !== productId)
    } else {
      item.qty = qty
    }
    this.notify()
  },
  removeFromCart(productId) {
    this.state.cart = this.state.cart.filter((c) => c.id !== productId)
    this.notify()
  },
  clearCart() {
    this.state.cart = []
    this.notify()
  },
  cartCount() {
    return this.state.cart.reduce((s, c) => s + c.qty, 0)
  },
  navigate(name, params = {}) {
    this.state.route = { name, params }
    const path = buildPath(name, params)
    if (path && window.location.pathname !== path) {
      window.history.pushState({ name, params }, '', path)
    }
    this.notify()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  },
  validatePrescription(productId) {
    this.state.prescriptionValidated[productId] = true
    this.notify()
  },
  toggleCompare(productId) {
    if (this.state.compareList.includes(productId)) {
      this.state.compareList = this.state.compareList.filter((id) => id !== productId)
    } else if (this.state.compareList.length < 4) {
      this.state.compareList.push(productId)
    }
    this.notify()
  },
  login(email) {
    this.state.user = { email }
    this.notify()
  },
  logout() {
    this.state.user = null
    this.notify()
  },
}

const routePaths = {
  home: '/',
  catalog: '/medicamentos',
  product: '/producto',
  cart: '/carrito',
  checkout: '/pago',
  confirmation: '/confirmacion',
  compare: '/comparar',
  orders: '/pedidos',
  help: '/ayuda',
  legal: '/legal',
  login: '/login',
  register: '/registro',
}

export function buildPath(name, params = {}) {
  const base = routePaths[name]
  if (!base) return ''
  if (name === 'product' && params.id) return `${base}/${params.id}`
  if (name === 'legal' && params.doc) return `${base}/${params.doc}`
  return base
}

export function parsePath(pathname) {
  if (pathname === '/' || pathname === '') return { name: 'home', params: {} }
  const parts = pathname.replace(/^\//, '').split('/').filter(Boolean)
  const seg = parts[0]
  const rest = parts.slice(1)
  const byPath = {
    medicamentos: 'catalog',
    producto: 'product',
    carrito: 'cart',
    pago: 'checkout',
    confirmacion: 'confirmation',
    comparar: 'compare',
    pedidos: 'orders',
    ayuda: 'help',
    legal: 'legal',
    login: 'login',
    registro: 'register',
  }
  const name = byPath[seg]
  if (!name) return { name: 'home', params: {} }
  if (name === 'product' && rest[0]) return { name, params: { id: rest[0] } }
  if (name === 'legal' && rest[0]) return { name, params: { doc: rest[0] } }
  if (name === 'catalog' && rest[0]) {
    if (rest[0] === 'categoria' && rest[1]) return { name, params: { category: rest[1] } }
    return { name, params: { query: decodeURIComponent(rest[0]) } }
  }
  return { name, params: {} }
}
