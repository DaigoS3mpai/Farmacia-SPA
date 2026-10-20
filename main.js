import { store } from './src/store.js'
import { clear } from './src/utils/dom.js'
import { header, footer } from './src/components/layout.js'
import { homeView } from './src/views/home.js'
import { catalogView, productDetailView } from './src/views/catalog.js'
import { cartView, checkoutView, confirmationView } from './src/views/cart.js'
import { compareView } from './src/views/compare.js'
import { ordersView } from './src/views/orders.js'
import { helpView, legalView } from './src/views/help.js'
import { loginView, registerView } from './src/views/auth.js'
import './style.css'

const app = document.querySelector('#app')

function render() {
  clear(app)
  const route = store.get('route')
  let view
  switch (route.name) {
    case 'home': view = homeView(); break
    case 'catalog': view = catalogView(); break
    case 'product': view = productDetailView(); break
    case 'cart': view = cartView(); break
    case 'checkout': view = checkoutView(); break
    case 'confirmation': view = confirmationView(); break
    case 'compare': view = compareView(); break
    case 'orders': view = ordersView(); break
    case 'help': view = helpView(); break
    case 'legal': view = legalView(); break
    case 'login': view = loginView(); break
    case 'register': view = registerView(); break
    default: view = homeView()
  }
  app.append(header(), view, footer())
}

store.subscribe(render)
render()
