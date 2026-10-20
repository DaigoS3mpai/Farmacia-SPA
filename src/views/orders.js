import { store } from '../store.js'
import { el } from '../utils/dom.js'
import { demoOrders, formatCLP } from '../data/products.js'

const STATUS_FLOW = [
  { key: 'recibido', label: 'Pedido recibido' },
  { key: 'preparacion', label: 'En preparación' },
  { key: 'despacho', label: 'En despacho' },
  { key: 'entregado', label: 'Entregado' },
]

function statusIndex(key) {
  return STATUS_FLOW.findIndex((s) => s.key === key)
}

function orderCard(order) {
  const idx = statusIndex(order.status)
  const steps = STATUS_FLOW.map((s, i) =>
    el('div', { class: 'status-step ' + (i <= idx ? 'done' : '') }, [
      el('div', { class: 'status-dot' }, i <= idx ? '●' : '○'),
      el('span', {}, s.label),
    ]),
  )

  const total = order.items.reduce((s, it) => s + it.price * it.qty, 0) + (order.total || 0 && order.shipping ? order.shipping : 0)
  const computedTotal = order.items.reduce((s, it) => s + it.price * it.qty, 0)

  return el('div', { class: 'order-card' }, [
    el('div', { class: 'order-head' }, [
      el('div', {}, [
        el('h3', {}, order.id),
        el('p', { class: 'muted' }, `Fecha: ${order.date}`),
      ]),
      el('span', { class: 'badge badge-info' }, STATUS_FLOW[statusIndex(order.status)].label),
    ]),
    el('div', { class: 'status-track' }, steps),
    el('div', { class: 'order-items' }, [
      el('h4', {}, 'Productos'),
      ...order.items.map((it) =>
        el('div', { class: 'summary-row' }, [el('span', {}, `${it.name} × ${it.qty}`), el('span', {}, formatCLP(it.price * it.qty))]),
      ),
      el('div', { class: 'summary-row summary-total' }, [el('span', {}, 'Total'), el('span', {}, formatCLP(order.total || computedTotal))]),
    ]),
  ])
}

export function ordersView() {
  const wrap = el('div', { class: 'container view' }, [
    el('h1', { class: 'page-title' }, 'Mis pedidos'),
    el('p', { class: 'page-subtitle' }, 'Consulta el estado de tu pedido con el identificador que recibiste al comprar.'),
  ])

  const input = el('input', { type: 'text', class: 'search-input', placeholder: 'Ej: FS-10245' })
  const resultBox = el('div', { class: 'order-result' }, [])

  const savedOrders = JSON.parse(localStorage.getItem('fs_orders') || '[]')
  const allOrders = [...demoOrders, ...savedOrders]

  function renderList(list, heading) {
    resultBox.innerHTML = ''
    if (heading) resultBox.append(el('h2', { class: 'section-title mt' }, heading))
    if (list.length === 0) {
      resultBox.append(el('p', { class: 'empty-state' }, 'No se encontraron pedidos con ese identificador.'))
      return
    }
    list.forEach((o) => resultBox.append(orderCard(o)))
  }

  function search() {
    const q = input.value.trim().toUpperCase()
    if (!q) {
      renderList(allOrders, 'Pedidos recientes (demostración)')
      return
    }
    const found = allOrders.filter((o) => o.id.toUpperCase().includes(q))
    renderList(found, `Resultados para "${q}"`)
  }

  const searchBtn = el('button', { class: 'btn btn-primary', onclick: search }, 'Consultar')
  const searchRow = el('div', { class: 'order-search' }, [input, searchBtn])

  const demoIds = el('p', { class: 'demo-ids' }, 'Identificadores de demostración: FS-10245 · FS-10390')

  wrap.append(searchRow, demoIds, resultBox)
  renderList(allOrders, 'Pedidos recientes (demostración)')
  return wrap
}
