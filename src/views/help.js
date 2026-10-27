import { store } from '../store.js'
import { el } from '../utils/dom.js'

export function helpView() {
  const faqs = [
    { q: '¿Cómo compro un medicamento con receta médica?', a: 'Ve a la página del producto, presiona "Validar receta (demo)" y luego podrás agregarlo al carrito. En una implementación real se solicitaría la receta emitida por un profesional habilitado.' },
    { q: '¿El pago con PayPal es real?', a: 'No. Este es un entorno de demostración. No se procesan pagos reales ni se almacenan datos de tarjetas.' },
    { q: '¿Cómo sigo mi pedido?', a: 'Ingresa a "Mis pedidos", escribe el identificador que recibiste al comprar (por ejemplo FS-10245) y consulta el estado.' },
    { q: '¿Qué es FARMACON?', a: 'FARMACON es el portal de autoayuda donde puedes resolver dudas frecuentes sobre medicamentos, dosis generales e interacciones. Es solo informativo y no reemplaza la consulta médica.' },
    { q: '¿Los precios mostrados son reales?', a: 'Los precios y disponibilidades son de demostración y pueden no coincidir con la realidad. No constituyen una oferta de venta.' },
  ]

  const faqItems = faqs.map((f) =>
    el('details', { class: 'faq-item' }, [
      el('summary', {}, f.q),
      el('p', {}, f.a),
    ]),
  )

  return el('div', { class: 'container view' }, [
    el('h1', { class: 'page-title' }, 'Ayuda y portal FARMACON'),
    el('p', { class: 'page-subtitle' }, 'Resolvemos tus dudas y te conectamos con el portal de autoayuda FARMACON.'),
    el('div', { class: 'help-grid' }, [
      el('div', { class: 'help-card farmaco-card' }, [
        el('h3', {}, 'Portal FARMACON'),
        el('p', {}, 'Autoconsulta de información general sobre medicamentos: indicaciones habituales, precauciones e interacciones frecuentes.'),
        el('span', { class: 'badge badge-info' }, ''),
        el('button', { class: 'btn btn-primary btn-sm', onclick: () => { window.location.href = '/autoayuda.html' } }, 'Acceder al portal'),
      ]),
      el('div', { class: 'help-card' }, [
        el('h3', {}, 'Contacto'),
        el('p', {}, 'Atención al cliente: +56 2 2345 6789'),
        el('p', {}, 'Correo: ayuda@farmaciasimple.cl'),
        el('p', {}, 'Horario: lunes a sábado, 9:00 a 21:00 hrs.'),
      ]),
      el('div', { class: 'help-card' }, [
        el('h3', {}, 'Métodos de pago'),
        el('p', {}, 'Demostración con PayPal. En producción se integrarían tarjetas y transferencia.'),
      ]),
    ]),
    el('h2', { class: 'section-title mt' }, 'Preguntas frecuentes'),
    el('div', { class: 'faq-list' }, faqItems),
    el('p', { class: 'demo-notice' }, 'La información de FARMACON es referencial y no sustituye la indicación de un profesional de la salud.'),
  ])
}

const legalDocs = {
  privacidad: {
    title: 'Política de privacidad',
    body: 'Esta demostración no almacena datos personales reales. En una implementación productiva se aplicaría la Ley 19.628 sobre protección de la vida privada y el reglamento de datos de salud.',
  },
  terminos: {
    title: 'Términos de uso',
    body: 'El sitio es un prototipo de demostración. Los productos, precios y disponibilidades son ficticios. No se realiza venta real de medicamentos a través de esta plataforma.',
  },
  compra: {
    title: 'Condiciones de compra',
    body: 'Las compras simuladas no generan obligaciones comerciales. Los medicamentos con receta médica requieren validación. Los envíos son ilustrativos.',
  },
}

export function legalView() {
  const doc = store.get('route').params.doc || 'privacidad'
  const content = legalDocs[doc] || legalDocs.privacidad
  return el('div', { class: 'container view' }, [
    el('h1', { class: 'page-title' }, content.title),
    el('p', { class: 'page-subtitle' }, content.body),
    el('button', { class: 'btn btn-outline', onclick: () => store.navigate('home') }, 'Volver al inicio'),
  ])
}
