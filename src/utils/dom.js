export function el(tag, props = {}, children = []) {
  const node = document.createElement(tag)
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') node.className = v
    else if (k === 'html') node.innerHTML = v
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v)
    else if (v !== null && v !== undefined) node.setAttribute(k, v)
  }
  const kids = Array.isArray(children) ? children : [children]
  for (const child of kids) {
    if (child == null || child === false) continue
    node.append(child instanceof Node ? child : document.createTextNode(String(child)))
  }
  return node
}

export function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild)
}

export function priceRanges(min, max) {
  return { min, max }
}
