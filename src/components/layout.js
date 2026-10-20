import { store } from '../store.js'
import { el } from '../utils/dom.js'
import { formatCLP, getProduct } from '../data/products.js'

const cartIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`
const pillIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>`

export function header() {
  const cartCount = store.cartCount()
  const user = store.get('user')

  const navItems = [
    { name: 'home', label: 'Inicio' },
    { name: 'catalog', label: 'Medicamentos' },
    { name: 'compare', label: 'Comparar precios' },
    { name: 'orders', label: 'Mis pedidos' },
    { name: 'help', label: 'Ayuda' },
  ]

  const navLinks = navItems.map((item) => {
    const active = store.get('route').name === item.name ? 'nav-link active' : 'nav-link'
    return el('button', { class: active, onclick: () => store.navigate(item.name) }, item.label)
  })

  const searchInput = el('input', {
    type: 'search',
    class: 'search-input',
    placeholder: 'Buscar medicamentos...',
    value: store.get('query'),
    oninput: (e) => store.set('query', e.target.value),
    onkeydown: (e) => {
      if (e.key === 'Enter') store.navigate('catalog', { query: e.target.value })
    },
  })

  const brand = el('button', { class: 'brand', onclick: () => store.navigate('home') }, [
    el('span', { class: 'brand-icon', html: pillIcon }),
    el('span', { class: 'brand-name' }, 'Farmacia Simple'),
  ])

  const accountArea = user
    ? el('div', { class: 'account-area' }, [
        el('span', { class: 'user-email' }, user.email),
        el('button', { class: 'btn btn-ghost', onclick: () => store.logout() }, 'Cerrar sesión'),
      ])
    : el('div', { class: 'account-area' }, [
        el('button', { class: 'btn btn-ghost', onclick: () => store.navigate('login') }, 'Iniciar sesión'),
        el('button', { class: 'btn btn-outline', onclick: () => store.navigate('register') }, 'Crear cuenta'),
      ])

  const cartButton = el('button', { class: 'cart-btn', onclick: () => store.navigate('cart') }, [
    el('span', { html: cartIcon }),
    cartCount > 0 ? el('span', { class: 'cart-badge' }, String(cartCount)) : null,
  ])

  const topRow = el('div', { class: 'header-top container' }, [
    brand,
    el('div', { class: 'search-wrap' }, [searchInput]),
    el('div', { class: 'header-actions' }, [accountArea, cartButton]),
  ])

  const navRow = el('nav', { class: 'header-nav container' }, navLinks)

  return el('header', { class: 'site-header' }, [topRow, navRow])
}

export function footer() {
  return el('footer', { class: 'site-footer' }, [
    el('div', { class: 'container footer-grid' }, [
      el('div', { class: 'footer-col' }, [
        el('h4', {}, 'Farmacia Simple SPA'),
        el('p', {}, 'Tu farmacia online de confianza. Medicamentos, salud y bienestar a un clic.'),
        el('p', { class: 'footer-note' }, 'Av. Providencia 1200, Santiago, Chile · +56 2 2345 6789'),
      ]),
      el('div', { class: 'footer-col' }, [
        el('h4', {}, 'Atención al cliente'),
        el('ul', {}, [
          el('li', {}, [el('button', { class: 'link-btn', onclick: () => store.navigate('help') }, 'Preguntas frecuentes')]),
          el('li', {}, [el('button', { class: 'link-btn', onclick: () => store.navigate('help') }, 'Portal FARMACON')]),
          el('li', {}, [el('button', { class: 'link-btn', onclick: () => store.navigate('orders') }, 'Seguir mi pedido')]),
        ]),
      ]),
      el('div', { class: 'footer-col' }, [
        el('h4', {}, 'Legal'),
        el('ul', {}, [
          el('li', {}, [el('button', { class: 'link-btn', onclick: () => store.navigate('legal', { doc: 'privacidad' }) }, 'Política de privacidad')]),
          el('li', {}, [el('button', { class: 'link-btn', onclick: () => store.navigate('legal', { doc: 'terminos' }) }, 'Términos de uso')]),
          el('li', {}, [el('button', { class: 'link-btn', onclick: () => store.navigate('legal', { doc: 'compra' }) }, 'Condiciones de compra')]),
        ]),
      ]),
    ]),
    el('div', { class: 'footer-bottom' }, [
      el('div', { class: 'container' }, [
        el('p', {}, '© 2026 Farmacia Simple SPA · Demostración. Los datos mostrados son ficticios y no constituyen una oferta real.'),
      ]),
    ]),
  ])
}
