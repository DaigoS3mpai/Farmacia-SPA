import { store } from '../store.js'
import { el } from '../utils/dom.js'
import { categories, formatCLP, getProduct, products } from '../data/products.js'

const catIcons = {
  pill: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"/><path d="m8.5 8.5 7 7"/></svg>',
  shield: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/></svg>',
  sun: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>',
  droplet: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>',
  activity: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  wind: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2"/></svg>',
  heart: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z"/></svg>',
  baby: '<svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="3"/><path d="M6 22v-4a6 6 0 0 1 12 0v4"/><path d="M9 11h.01M15 11h.01"/></svg>',
}

export function productCard(product) {
  const validated = store.get('prescriptionValidated')[product.id]
  const blocked = product.requiresPrescription && !validated
  const stockLabel = product.stock > 0
    ? el('span', { class: 'badge badge-success' }, 'Disponible')
    : el('span', { class: 'badge badge-error' }, 'Agotado')

  const rxTag = product.requiresPrescription
    ? el('span', { class: 'badge badge-warning' }, 'Receta médica')
    : null

  return el('article', { class: 'product-card' }, [
    el('button', {
      class: 'product-image',
      onclick: () => store.navigate('product', { id: product.id }),
    }, [el('img', { src: product.image, alt: product.name, loading: 'lazy' })]),
    el('div', { class: 'product-body' }, [
      el('h3', { class: 'product-name' }, product.name),
      el('p', { class: 'product-presentation' }, product.presentation),
      el('div', { class: 'product-tags' }, [stockLabel, rxTag].filter(Boolean)),
      el('div', { class: 'product-price' }, formatCLP(product.price)),
      el('div', { class: 'product-actions' }, [
        el('button', {
          class: 'btn btn-outline btn-sm',
          onclick: () => store.navigate('product', { id: product.id }),
        }, 'Ver detalles'),
        el('button', {
          class: 'btn btn-primary btn-sm',
          disabled: blocked || product.stock <= 0,
          onclick: () => {
            if (blocked) {
              store.navigate('product', { id: product.id })
              return
            }
            store.addToCart(product.id, 1)
          },
        }, blocked ? 'Requiere receta' : 'Agregar'),
      ]),
    ]),
  ])
}

export function homeView() {
  const featured = products.slice(0, 4)

  const hero = el('section', { class: 'hero' }, [
    el('div', { class: 'container hero-inner' }, [
      el('div', { class: 'hero-text' }, [
        el('h1', {}, 'Tus medicamentos, más simples y al mejor precio'),
        el('p', {}, 'Compra online con seguridad, compara precios entre sucursales y sigue tu pedido en tiempo real.'),
        el('div', { class: 'hero-search' }, [
          el('input', {
            type: 'search',
            class: 'search-input hero-search-input',
            placeholder: 'Busca un medicamento...',
            value: store.get('query'),
            oninput: (e) => store.set('query', e.target.value),
            onkeydown: (e) => {
              if (e.key === 'Enter') store.navigate('catalog', { query: e.target.value })
            },
          }),
          el('button', { class: 'btn btn-primary', onclick: () => store.navigate('catalog', { query: store.get('query') }) }, 'Buscar'),
        ]),
        el('div', { class: 'hero-cta' }, [
          el('button', { class: 'btn btn-outline', onclick: () => store.navigate('compare') }, 'Comparar precios'),
          el('button', { class: 'btn btn-ghost', onclick: () => store.navigate('help') }, 'Portal FARMACON'),
        ]),
      ]),
      el('div', { class: 'hero-image' }, [
        el('img', {
          src: 'https://images.pexels.com/photos/3873149/pexels-photo-3873149.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
          alt: 'Medicamentos',
        }),
      ]),
    ]),
  ])

  const catCards = categories.map((c) =>
    el('button', { class: 'category-card', onclick: () => store.navigate('catalog', { category: c.id }) }, [
      el('span', { class: 'category-icon', html: catIcons[c.icon] || catIcons.pill }),
      el('span', { class: 'category-name' }, c.name),
    ]),
  )

  const categoriesSection = el('section', { class: 'section' }, [
    el('div', { class: 'container' }, [
      el('h2', { class: 'section-title' }, 'Categorías'),
      el('div', { class: 'category-grid' }, catCards),
    ]),
  ])

  const featuredSection = el('section', { class: 'section section-alt' }, [
    el('div', { class: 'container' }, [
      el('div', { class: 'section-head' }, [
        el('h2', { class: 'section-title' }, 'Productos destacados'),
        el('button', { class: 'btn btn-ghost', onclick: () => store.navigate('catalog') }, 'Ver todo'),
      ]),
      el('div', { class: 'product-grid' }, featured.map(productCard)),
    ]),
  ])

  return el('div', {}, [hero, categoriesSection, featuredSection])
}
