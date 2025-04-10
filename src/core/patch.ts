import { Patch, VNode } from '../types/vnode';
import { render } from './render';

function applyPatch(dom: HTMLElement, patch: Patch): void {
  switch (patch.type) {
    case 'APPEND':
      if (patch.node) {
        const newDom = render(patch.node, document.createElement('div')).firstChild as HTMLElement;
        dom.appendChild(newDom);
      }
      break;

    case 'REMOVE':
      if (dom.parentNode) {
        dom.parentNode.removeChild(dom);
      }
      break;

    case 'UPDATE_PROPS':
      if (patch.props) {
        Object.entries(patch.props).forEach(([key, value]) => {
          if (key.startsWith('on')) {
            const eventName = key.toLowerCase().slice(2);
            // Remove old event listener and add new one
            const oldValue = dom.getAttribute(key);
            if (oldValue) {
              dom.removeEventListener(eventName, oldValue as any);
            }
            dom.addEventListener(eventName, value as EventListener);
          } else if (key === 'className') {
            dom.setAttribute('class', value as string);
          } else {
            dom.setAttribute(key, value as string);
          }
        });
      }
      break;

    case 'REPLACE':
      if (patch.node) {
        const newDom = render(patch.node, document.createElement('div')).firstChild as HTMLElement;
        if (dom.parentNode) {
          dom.parentNode.replaceChild(newDom, dom);
        }
      }
      break;

    case 'TEXT':
      if (patch.text !== undefined) {
        dom.textContent = patch.text;
      }
      break;
  }
}

export function patch(dom: HTMLElement, patches: Patch[]): void {
  patches.forEach(patch => applyPatch(dom, patch));
} 