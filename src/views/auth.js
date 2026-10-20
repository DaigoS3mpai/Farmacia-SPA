import { store } from '../store.js'
import { el } from '../utils/dom.js'

export function loginView() {
  const emailInput = el('input', { type: 'email', class: 'search-input', placeholder: 'tu@correo.cl', required: true })
  const passInput = el('input', { type: 'password', class: 'search-input', placeholder: 'Contraseña', required: true })
  const msg = el('p', { class: 'demo-notice' }, [])

  const form = el('form', {
    class: 'auth-form',
    onsubmit: (e) => {
      e.preventDefault()
      if (emailInput.value && passInput.value) {
        store.login(emailInput.value)
        store.navigate('home')
      } else {
        msg.textContent = 'Ingresa correo y contraseña (demo).'
      }
    },
  }, [
    el('h1', { class: 'page-title' }, 'Iniciar sesión'),
    el('label', {}, [el('span', {}, 'Correo electrónico'), emailInput]),
    el('label', {}, [el('span', {}, 'Contraseña'), passInput]),
    el('button', { class: 'btn btn-primary btn-block', type: 'submit' }, 'Entrar'),
    el('p', { class: 'demo-notice' }, 'Inicio de sesión de demostración. No se validan credenciales reales.'),
    el('button', { class: 'btn btn-ghost', type: 'button', onclick: () => store.navigate('register') }, '¿No tienes cuenta? Crear una'),
  ])

  return el('div', { class: 'container view auth-view' }, [form, msg])
}

export function registerView() {
  const nameInput = el('input', { type: 'text', class: 'search-input', placeholder: 'Tu nombre', required: true })
  const emailInput = el('input', { type: 'email', class: 'search-input', placeholder: 'tu@correo.cl', required: true })
  const passInput = el('input', { type: 'password', class: 'search-input', placeholder: 'Contraseña', required: true })

  const form = el('form', {
    class: 'auth-form',
    onsubmit: (e) => {
      e.preventDefault()
      if (emailInput.value && passInput.value) {
        store.login(emailInput.value)
        store.navigate('home')
      }
    },
  }, [
    el('h1', { class: 'page-title' }, 'Crear cuenta'),
    el('label', {}, [el('span', {}, 'Nombre completo'), nameInput]),
    el('label', {}, [el('span', {}, 'Correo electrónico'), emailInput]),
    el('label', {}, [el('span', {}, 'Contraseña'), passInput]),
    el('button', { class: 'btn btn-primary btn-block', type: 'submit' }, 'Registrarme'),
    el('p', { class: 'demo-notice' }, 'Registro de demostración. No se almacenan datos reales.'),
    el('button', { class: 'btn btn-ghost', type: 'button', onclick: () => store.navigate('login') }, '¿Ya tienes cuenta? Iniciar sesión'),
  ])

  return el('div', { class: 'container view auth-view' }, [form])
}
