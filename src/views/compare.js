import { store } from '../store.js'
import { el } from '../utils/dom.js'
import { formatCLP, getProduct, products } from '../data/products.js'

export function compareView() {
  const wrap = el('div', { class: 'container view' }, [
    el('h1', { class: 'page-title' }, 'Comparador de precios'),
    el('p', { class: 'page-subtitle' }, 'Compara el precio y la disponibilidad de un producto entre nuestras sucursales. Los datos mostrados son de demostración.'),
  ])

  const select = el('select', { class: 'select', onchange: (e) => render(e.target.value) }, [
    el('option', { value: '' }, 'Selecciona un producto...'),
    ...products.map((p) => el('option', { value: p.id }, p.name)),
  ])

  const resultsBox = el('div', { class: 'compare-results' }, [])

  function render(productId) {
    resultsBox.innerHTML = ''
    if (!productId) {
      resultsBox.append(el('p', { class: 'empty-state' }, 'Elige un producto para ver la comparación de precios.'))
      return
    }
    const product = getProduct(productId)
    let branches = [...product.branches].sort((a, b) => a.price - b.price)
    const minPrice = Math.min(...branches.map((b) => b.price))

    const sortBtns = el('div', { class: 'sort-row' }, [
      el('span', {}, 'Ordenar por:'),
      el('button', { class: 'btn btn-ghost btn-sm', onclick: () => rerender(productId, 'price-asc') }, 'Precio ascendente'),
      el('button', { class: 'btn btn-ghost btn-sm', onclick: () => rerender(productId, 'price-desc') }, 'Precio descendente'),
      el('button', { class: 'btn btn-ghost btn-sm', onclick: () => rerender(productId, 'avail') }, 'Disponibilidad'),
    ])

    function rerender(pid, sort) {
      const prod = getProduct(pid)
      let list = [...prod.branches]
      if (sort === 'price-asc') list.sort((a, b) => a.price - b.price)
      if (sort === 'price-desc') list.sort((a, b) => b.price - a.price)
      if (sort === 'avail') list.sort((a, b) => Number(b.available) - Number(a.available))
      tableBody.innerHTML = ''
      list.forEach((b) => {
        const isMin = b.price === minPrice
        tableBody.append(
          el('tr', {}, [
            el('td', {}, b.branch),
            el('td', {}, [el('span', { class: isMin ? 'price-best' : '' }, formatCLP(b.price)), isMin ? el('span', { class: 'badge badge-success' }, 'Mejor precio') : null].filter(Boolean)),
            el('td', {}, b.available ? el('span', { class: 'badge badge-success' }, 'Disponible') : el('span', { class: 'badge badge-error' }, 'Agotado')),
          ]),
        )
      })
    }

    const tableBody = el('tbody', {}, [])
    branches.forEach((b) => {
      const isMin = b.price === minPrice
      tableBody.append(
        el('tr', {}, [
          el('td', {}, b.branch),
          el('td', {}, [el('span', { class: isMin ? 'price-best' : '' }, formatCLP(b.price)), isMin ? el('span', { class: 'badge badge-success' }, 'Mejor precio') : null].filter(Boolean)),
          el('td', {}, b.available ? el('span', { class: 'badge badge-success' }, 'Disponible') : el('span', { class: 'badge badge-error' }, 'Agotado')),
        ]),
      )
    })

    const table = el('table', { class: 'data-table' }, [
      el('thead', {}, [el('tr', {}, [el('th', {}, 'Sucursal'), el('th', {}, 'Precio'), el('th', {}, 'Disponibilidad')])]),
      tableBody,
    ])

    const productInfo = el('div', { class: 'compare-product' }, [
      el('img', { src: product.image, alt: product.name }),
      el('div', {}, [
        el('h2', {}, product.name),
        el('p', { class: 'product-presentation' }, product.presentation),
      ]),
    ])

    resultsBox.append(productInfo, sortBtns, table)
  }

  wrap.append(el('div', { class: 'compare-controls' }, [select]), resultsBox)
  render('')
  return wrap
}
