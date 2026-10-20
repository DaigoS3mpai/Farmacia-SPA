import { store } from '../store.js'
import { el } from '../utils/dom.js'
import { formatCLP, getProduct, products } from '../data/products.js'

export function cartView() {
  const cart = store.get('cart')
  const wrap = el('div', { class: 'container view' }, [el('h1', { class: 'page-title' }, 'Carrito de compras')])

  if (cart.length === 0) {
    wrap.append(el('p', { class: 'empty-state' }, 'Tu carrito está vacío.'))
    wrap.append(el('button', { class: 'btn btn-primary', onclick: () => store.navigate('catalog') }, 'Ir al catálogo'))
    return wrap
  }

  const rows = cart.map((item) => {
    const product = getProduct(item.id)
    if (!product) return null
    const validated = store.get('prescriptionValidated')[product.id]
    const blocked = product.requiresPrescription && !validated
    const line = product.price * item.qty
    return el('div', { class: 'cart-row' }, [
      el('button', { class: 'cart-thumb', onclick: () => store.navigate('product', { id: product.id }) }, [el('img', { src: product.image, alt: product.name })]),
      el('div', { class: 'cart-info' }, [
        el('h3', {}, product.name),
        el('p', { class: 'product-presentation' }, product.presentation),
        blocked ? el('span', { class: 'badge badge-warning' }, 'Receta pendiente') : null,
      ]),
      el('div', { class: 'cart-qty' }, [
        el('button', { class: 'qty-btn', onclick: () => store.updateQty(product.id, item.qty - 1) }, '−'),
        el('span', { class: 'qty-value' }, String(item.qty)),
        el('button', { class: 'qty-btn', onclick: () => store.updateQty(product.id, item.qty + 1) }, '+'),
      ]),
      el('div', { class: 'cart-line' }, formatCLP(line)),
      el('button', { class: 'btn btn-ghost btn-sm', onclick: () => store.removeFromCart(product.id) }, 'Quitar'),
    ])
  }).filter(Boolean)

  const subtotal = cart.reduce((s, item) => {
    const p = getProduct(item.id)
    return s + (p ? p.price * item.qty : 0)
  }, 0)
  const shipping = subtotal > 30000 ? 0 : 1990
  const total = subtotal + shipping

  const blockedItems = cart.filter((item) => {
    const p = getProduct(item.id)
    return p && p.requiresPrescription && !store.get('prescriptionValidated')[p.id]
  })

  const summary = el('div', { class: 'cart-summary' }, [
    el('h3', {}, 'Resumen'),
    el('div', { class: 'summary-row' }, [el('span', {}, 'Subtotal'), el('span', {}, formatCLP(subtotal))]),
    el('div', { class: 'summary-row' }, [el('span', {}, 'Envío'), el('span', {}, shipping === 0 ? 'Gratis' : formatCLP(shipping))]),
    el('div', { class: 'summary-row summary-total' }, [el('span', {}, 'Total'), el('span', {}, formatCLP(total))]),
    blockedItems.length > 0
      ? el('p', { class: 'callout callout-warning' }, 'Tienes productos que requieren validación de receta. Ve a los detalles para validarlos antes de pagar.')
      : null,
    el('button', { class: 'btn btn-primary btn-block', onclick: () => store.navigate('checkout') }, 'Continuar al pago'),
  ])

  const cartList = el('div', { class: 'cart-list' }, rows)
  wrap.append(el('div', { class: 'cart-layout' }, [cartList, summary]))
  return wrap
}

export function checkoutView() {
  const cart = store.get('cart')
  const wrap = el('div', { class: 'container view' }, [el('h1', { class: 'page-title' }, 'Finalizar compra')])

  if (cart.length === 0) {
    wrap.append(el('p', { class: 'empty-state' }, 'No hay productos para pagar.'))
    wrap.append(el('button', { class: 'btn btn-primary', onclick: () => store.navigate('catalog') }, 'Ir al catálogo'))
    return wrap
  }

  const blockedItems = cart.filter((item) => {
    const p = getProduct(item.id)
    return p && p.requiresPrescription && !store.get('prescriptionValidated')[p.id]
  })

  if (blockedItems.length > 0) {
    wrap.append(el('div', { class: 'callout callout-warning' }, [
      el('p', {}, 'Hay productos con receta médica pendiente de validación. Completa la validación antes de continuar.'),
      el('button', { class: 'btn btn-outline btn-sm', onclick: () => store.navigate('cart') }, 'Volver al carrito'),
    ]))
    return wrap
  }

  const subtotal = cart.reduce((s, item) => {
    const p = getProduct(item.id)
    return s + (p ? p.price * item.qty : 0)
  }, 0)
  const shipping = subtotal > 30000 ? 0 : 1990
  const total = subtotal + shipping

  const form = el('form', { class: 'checkout-form', onsubmit: (e) => e.preventDefault() }, [
    el('h3', {}, 'Datos de despacho'),
    el('div', { class: 'form-row' }, [
      el('label', {}, [el('span', {}, 'Nombre completo'), el('input', { type: 'text', required: true, placeholder: 'Tu nombre' })]),
      el('label', {}, [el('span', {}, 'RUT'), el('input', { type: 'text', required: true, placeholder: '12.345.678-9' })]),
    ]),
    el('label', {}, [el('span', {}, 'Correo electrónico'), el('input', { type: 'email', required: true, placeholder: 'tu@correo.cl' })]),
    el('label', {}, [el('span', {}, 'Dirección'), el('input', { type: 'text', required: true, placeholder: 'Calle, número, depto' })]),
    el('div', { class: 'form-row' }, [
      el('label', {}, [el('span', {}, 'Comuna'), el('input', { type: 'text', required: true, placeholder: 'Comuna' })]),
      el('label', {}, [el('span', {}, 'Teléfono'), el('input', { type: 'tel', required: true, placeholder: '+56 9 ...' })]),
    ]),
  ])

  const paypalBtn = el('button', { class: 'btn paypal-btn', onclick: () => store.navigate('confirmation') }, [
    el('span', { class: 'paypal-logo' }, 'Pay'),
    el('span', { class: 'paypal-logo-2' }, 'Pal'),
  ])

  const demoNotice = el('p', { class: 'demo-notice' }, 'Pago en modo demostración. No se procesa ni almacena información de tarjetas reales.')

  const summary = el('div', { class: 'cart-summary' }, [
    el('h3', {}, 'Resumen del pedido'),
    ...cart.map((item) => {
      const p = getProduct(item.id)
      return el('div', { class: 'summary-row' }, [el('span', {}, `${p.name} × ${item.qty}`), el('span', {}, formatCLP(p.price * item.qty))])
    }),
    el('div', { class: 'summary-row' }, [el('span', {}, 'Envío'), el('span', {}, shipping === 0 ? 'Gratis' : formatCLP(shipping))]),
    el('div', { class: 'summary-row summary-total' }, [el('span', {}, 'Total'), el('span', {}, formatCLP(total))]),
    paypalBtn,
    demoNotice,
  ])

  wrap.append(el('div', { class: 'cart-layout' }, [form, summary]))
  return wrap
}

export function confirmationView() {
  const cart = store.get('cart')
  const orderId = 'FS-' + Math.floor(10000 + Math.random() * 89999)
  const date = new Date().toISOString().slice(0, 10)
  const total = cart.reduce((s, item) => {
    const p = getProduct(item.id)
    return s + (p ? p.price * item.qty : 0)
  }, 0)

  const savedOrders = JSON.parse(localStorage.getItem('fs_orders') || '[]')
  savedOrders.push({
    id: orderId,
    date,
    status: 'recibido',
    items: cart.map((item) => {
      const p = getProduct(item.id)
      return { id: item.id, name: p.name, qty: item.qty, price: p.price }
    }),
    total,
  })
  localStorage.setItem('fs_orders', JSON.stringify(savedOrders))

  store.clearCart()

  return el('div', { class: 'container view confirmation' }, [
    el('div', { class: 'confirmation-card' }, [
      el('div', { class: 'confirmation-icon' }, '✓'),
      el('h1', { class: 'page-title' }, '¡Compra simulada completada!'),
      el('p', {}, 'Este es un pago de demostración. No se realizó ninguna transacción real ni se almacenaron datos bancarios.'),
      el('div', { class: 'confirmation-detail' }, [
        el('div', { class: 'summary-row' }, [el('span', {}, 'Identificador del pedido'), el('span', { class: 'mono' }, orderId)]),
        el('div', { class: 'summary-row' }, [el('span', {}, 'Fecha'), el('span', {}, date)]),
        el('div', { class: 'summary-row summary-total' }, [el('span', {}, 'Total'), el('span', {}, formatCLP(total))]),
      ]),
      el('div', { class: 'product-actions' }, [
        el('button', { class: 'btn btn-primary', onclick: () => store.navigate('orders', { id: orderId }) }, 'Seguir mi pedido'),
        el('button', { class: 'btn btn-outline', onclick: () => store.navigate('catalog') }, 'Seguir comprando'),
      ]),
    ]),
  ])
}
