import { store } from '../store.js'
import { el } from '../utils/dom.js'
import { categories, formatCLP, getCategory, getProduct, products } from '../data/products.js'

export function catalogView() {
  const routeParams = store.get('route').params || {}
  const initialQuery = routeParams.query || store.get('query') || ''
  const initialCategory = routeParams.category || 'all'
  let currentSort = 'price-asc'

  const wrap = el('div', { class: 'container view' }, [
    el('h1', { class: 'page-title' }, 'Catálogo de medicamentos'),
    el('p', { class: 'page-subtitle' }, 'Encuentra lo que necesitas y filtra por categoría. Los productos con receta médica solo pueden agregarse al carrito tras validar la receta.'),
  ])

  const resultsBox = el('div', { class: 'product-grid' }, [])

  function render() {
    const q = searchInput.value.trim().toLowerCase()
    const cat = categorySelect.value
    const sort = sortSelect.value
    let list = products.filter((p) => {
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.presentation.toLowerCase().includes(q)
      const matchesCat = cat === 'all' || p.category === cat
      return matchesQ && matchesCat
    })
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name))

    resultsBox.innerHTML = ''
    if (list.length === 0) {
      resultsBox.append(el('p', { class: 'empty-state' }, 'No se encontraron productos para tu búsqueda.'))
      return
    }
    list.forEach((p) => {
      const validated = store.get('prescriptionValidated')[p.id]
      const blocked = p.requiresPrescription && !validated
      const stockLabel = p.stock > 0
        ? el('span', { class: 'badge badge-success' }, 'Disponible')
        : el('span', { class: 'badge badge-error' }, 'Agotado')
      const rxTag = p.requiresPrescription ? el('span', { class: 'badge badge-warning' }, 'Receta') : null
      resultsBox.append(
        el('article', { class: 'product-card' }, [
          el('button', { class: 'product-image', onclick: () => store.navigate('product', { id: p.id }) }, [
            el('img', { src: p.image, alt: p.name, loading: 'lazy' }),
          ]),
          el('div', { class: 'product-body' }, [
            el('h3', { class: 'product-name' }, p.name),
            el('p', { class: 'product-presentation' }, p.presentation),
            el('div', { class: 'product-tags' }, [stockLabel, rxTag].filter(Boolean)),
            el('div', { class: 'product-price' }, formatCLP(p.price)),
            el('div', { class: 'product-actions' }, [
              el('button', { class: 'btn btn-outline btn-sm', onclick: () => store.navigate('product', { id: p.id }) }, 'Ver detalles'),
              el('button', {
                class: 'btn btn-primary btn-sm',
                disabled: blocked || p.stock <= 0,
                onclick: () => {
                  if (blocked) { store.navigate('product', { id: p.id }); return }
                  store.addToCart(p.id, 1)
                },
              }, blocked ? 'Requiere receta' : 'Agregar'),
            ]),
          ]),
        ]),
      )
    })
  }

  const searchInput = el('input', {
    type: 'search',
    class: 'search-input',
    placeholder: 'Buscar por nombre o presentación...',
    value: initialQuery,
    oninput: render,
  })

  const categorySelect = el('select', { class: 'select', onchange: render }, [
    el('option', { value: 'all' }, 'Todas las categorías'),
    ...categories.map((c) => el('option', { value: c.id, selected: c.id === initialCategory }, c.name)),
  ])

  const sortSelect = el('select', { class: 'select', onchange: render }, [
    el('option', { value: 'price-asc' }, 'Precio: menor a mayor'),
    el('option', { value: 'price-desc' }, 'Precio: mayor a menor'),
    el('option', { value: 'name' }, 'Nombre A-Z'),
  ])

  const filters = el('div', { class: 'catalog-filters' }, [searchInput, categorySelect, sortSelect])

  wrap.append(filters, resultsBox)
  render()
  return wrap
}

export function productDetailView() {
  const id = store.get('route').params.id
  const product = getProduct(id)
  if (!product) {
    return el('div', { class: 'container view' }, [
      el('p', { class: 'empty-state' }, 'Producto no encontrado.'),
      el('button', { class: 'btn btn-outline', onclick: () => store.navigate('catalog') }, 'Volver al catálogo'),
    ])
  }

  const validated = store.get('prescriptionValidated')[product.id]
  const blocked = product.requiresPrescription && !validated
  const cat = getCategory(product.category)

  const validateBtn = el('button', { class: 'btn btn-outline btn-sm', onclick: () => store.validatePrescription(product.id) }, 'Validar receta (demo)')

  const prescriptionBlock = product.requiresPrescription
    ? el('div', { class: 'callout callout-warning' }, [
        el('strong', {}, 'Este medicamento requiere receta médica.'),
        el('p', {}, validated ? 'Receta validada (demostración). Ya puedes agregarlo al carrito.' : 'Para comprar, valida tu receta. En una implementación real se solicitaría cargar la receta emitida por un profesional habilitado.'),
        validated ? el('span', { class: 'badge badge-success' }, 'Receta validada') : validateBtn,
      ])
    : null

  const branchesTable = el('table', { class: 'data-table' }, [
    el('thead', {}, [el('tr', {}, [el('th', {}, 'Sucursal'), el('th', {}, 'Precio'), el('th', {}, 'Disponibilidad')])]),
    el('tbody', {}, product.branches.map((b) =>
      el('tr', {}, [
        el('td', {}, b.branch),
        el('td', {}, formatCLP(b.price)),
        el('td', {}, b.available ? el('span', { class: 'badge badge-success' }, 'Disponible') : el('span', { class: 'badge badge-error' }, 'Agotado')),
      ]),
    )),
  ])

  return el('div', { class: 'container view' }, [
    el('button', { class: 'btn btn-ghost btn-sm back-btn', onclick: () => store.navigate('catalog') }, '← Volver al catálogo'),
    el('div', { class: 'product-detail' }, [
      el('div', { class: 'product-detail-image' }, [el('img', { src: product.image, alt: product.name })]),
      el('div', { class: 'product-detail-info' }, [
        el('span', { class: 'category-tag' }, cat.name),
        el('h1', { class: 'page-title' }, product.name),
        el('p', { class: 'product-presentation' }, product.presentation),
        el('div', { class: 'product-tags' }, [
          product.stock > 0 ? el('span', { class: 'badge badge-success' }, `Disponible (${product.stock})`) : el('span', { class: 'badge badge-error' }, 'Agotado'),
          product.requiresPrescription ? el('span', { class: 'badge badge-warning' }, 'Receta médica') : null,
        ].filter(Boolean)),
        el('div', { class: 'product-price product-price-lg' }, formatCLP(product.price)),
        el('p', { class: 'product-description' }, product.description),
        prescriptionBlock,
        el('div', { class: 'product-actions' }, [
          el('button', {
            class: 'btn btn-primary',
            disabled: blocked || product.stock <= 0,
            onclick: () => store.addToCart(product.id, 1),
          }, blocked ? 'Requiere receta' : 'Agregar al carrito'),
          el('button', { class: 'btn btn-outline', onclick: () => store.navigate('cart') }, 'Ir al carrito'),
        ]),
      ]),
    ]),
    el('h2', { class: 'section-title mt' }, 'Disponibilidad por sucursal'),
    branchesTable,
  ])
}
