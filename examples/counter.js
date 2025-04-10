// src/core/h.ts
function h(type, props, children) {
  return {
    type,
    props: props || {},
    children: children || null,
  };
}

// src/core/render.ts
function setAttributes(element, props) {
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith("on") && typeof value === "function") {
      const eventName = key.toLowerCase().slice(2);
      element.addEventListener(eventName, value);
    } else if (key === "className") {
      element.setAttribute("class", value);
    } else {
      element.setAttribute(key, value);
    }
  });
}
function createTextNode(text) {
  return document.createTextNode(text);
}
function createElement(vnode) {
  if (typeof vnode === "string") {
    return createTextNode(vnode);
  }
  const element = document.createElement(vnode.type);
  setAttributes(element, vnode.props);
  vnode.dom = element;
  if (vnode.children) {
    if (Array.isArray(vnode.children)) {
      vnode.children.forEach((child) => {
        if (typeof child === "string") {
          element.appendChild(createTextNode(child));
        } else {
          const childElement = createElement(child);
          element.appendChild(childElement);
          if (child.dom) {
            child.dom = childElement;
          }
        }
      });
    } else if (typeof vnode.children === "string") {
      element.appendChild(createTextNode(vnode.children));
    } else {
      const childElement = createElement(vnode.children);
      element.appendChild(childElement);
      if (vnode.children.dom) {
        vnode.children.dom = childElement;
      }
    }
  }
  return element;
}
function render(vnode, container) {
  container.innerHTML = "";
  const element = createElement(vnode);
  container.appendChild(element);
  return container;
}

// src/core/state.ts
var State = class {
  constructor(initialValue) {
    this.subscribers = [];
    this.value = initialValue;
  }
  get() {
    return this.value;
  }
  set(newValue) {
    const nextValue =
      typeof newValue === "function" ? newValue(this.value) : newValue;
    if (nextValue !== this.value) {
      this.value = nextValue;
      this.notify();
    }
  }
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }
  notify() {
    this.subscribers.forEach((subscriber) => subscriber(this.value));
  }
};

// examples/counter.ts
var counterState = new State(0);
function Counter() {
  const count = counterState.get();
  const increment = () => counterState.set((prev) => prev + 1);
  const decrement = () => counterState.set((prev) => prev - 1);
  return h(
    "div",
    { className: "counter" },
    h(
      "div",
      null,
      h("div", null, [
        h("h1", null, `Count: ${count}`),
        h("div", { className: "buttons" }, [
          h("button", { onClick: decrement }, "Decrement"),
          h("button", { onClick: increment }, "Increment"),
        ]),
      ]),
    ),
  );
}
var app = document.getElementById("app");
if (app) {
  render(Counter(), app);
  counterState.subscribe(() => {
    render(Counter(), app);
  });
}
