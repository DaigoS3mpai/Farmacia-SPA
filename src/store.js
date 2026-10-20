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
