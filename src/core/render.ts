import { VNode, VNodeProps } from '../types/vnode';

function setAttributes(element: HTMLElement, props: VNodeProps): void {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.toLowerCase().slice(2);
      element.addEventListener(eventName, value as EventListener);
    } else if (key === 'className') {
      element.setAttribute('class', value as string);
    } else {
      element.setAttribute(key, value as string);
    }
  });
}

function createTextNode(text: string): Text {
  return document.createTextNode(text);
}

function createElement(vnode: VNode): HTMLElement | Text {
  if (typeof vnode === 'string') {
    return createTextNode(vnode);
  }

  const element = document.createElement(vnode.type);
  setAttributes(element, vnode.props);
  vnode.dom = element;

  if (vnode.children) {
    if (Array.isArray(vnode.children)) {
      vnode.children.forEach(child => {
        if (typeof child === 'string') {
          element.appendChild(createTextNode(child));
        } else {
          const childElement = createElement(child);
          element.appendChild(childElement);
          if (child.dom) {
            child.dom = childElement as HTMLElement;
          }
        }
      });
    } else if (typeof vnode.children === 'string') {
      element.appendChild(createTextNode(vnode.children));
    } else {
      const childElement = createElement(vnode.children);
      element.appendChild(childElement);
      if (vnode.children.dom) {
        vnode.children.dom = childElement as HTMLElement;
      }
    }
  }

  return element;
}

export function render(vnode: VNode, container: HTMLElement): HTMLElement {
  container.innerHTML = '';
  const element = createElement(vnode);
  container.appendChild(element);
  return container;
} 