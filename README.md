# rvdom (Reactive Virtual DOM)

A lightweight, type-safe virtual DOM implementation for TypeScript with reactive state management.

## Features

- Virtual DOM implementation with efficient diffing and patching
- Type-safe hyperscript function for creating virtual nodes
- Reactive state management
- Event handling support
- Zero dependencies
- Modern ES modules

## Installation

```bash
npm install rvdom
```

## Usage

### Basic Example

```typescript
import { h, render, createState, State } from 'rvdom';

// Create a state instance
const counterState = new State(0);

// Create a simple component
function Counter() {
  const count = counterState.get();

  const increment = () => counterState.set(prev => prev + 1);
  const decrement = () => counterState.set(prev => prev - 1);

  return h('div', { className: 'counter' }, 
    h('div', null, 
      h('div', null, [
        h('h1', null, `Count: ${count}`),
        h('div', { className: 'buttons' }, [
          h('button', { onClick: decrement }, 'Decrement'),
          h('button', { onClick: increment }, 'Increment')
        ])
      ])
    )
  );
}

// Render to DOM
const app = document.getElementById('app');
if (app) {
  // Initial render
  render(Counter(), app);

  // Subscribe to state changes
  counterState.subscribe(() => {
    // Re-render the entire component when state changes
    render(Counter(), app);
  });
}
```

### Creating Virtual Nodes

The `h` function creates virtual DOM nodes:

```typescript
h(type: string, props: VNodeProps | null, ...children: (VNode | string | null)[]): VNode
```

Example:
```typescript
const vnode = h('div', { className: 'container' }, [
  h('h1', null, 'Hello World'),
  h('p', null, 'This is a paragraph')
]);
```

### State Management

There are two ways to manage state:

#### 1. Using the State class directly

```typescript
const state = new State(initialValue);
state.get(); // Get current value
state.set(newValue); // Set new value
state.set(prev => prev + 1); // Update based on previous value
state.subscribe(callback); // Subscribe to changes
```

#### 2. Using the createState helper

```typescript
const [state, setState] = createState(initialValue);
setState(newValue); // Direct value
setState(prev => prev + 1); // Function update
```

### Event Handling

Events are handled through props:

```typescript
h('button', { 
  onClick: (e: MouseEvent) => console.log('clicked') 
}, 'Click me');
```

## API Reference

### h(type, props, ...children)

Creates a virtual DOM node.

- `type`: HTML tag name
- `props`: Object containing attributes and event handlers
- `children`: Child nodes (can be strings or other virtual nodes)

### render(vnode, container)

Renders a virtual DOM tree to a container element.

### createState<T>(initialValue)

Creates a state tuple with a getter and setter function.

### State<T> class

A class for managing reactive state.

- `constructor(initialValue: T)`: Creates a new state with an initial value
- `get(): T`: Gets the current value
- `set(newValue: T | ((prev: T) => T))`: Sets a new value or updates based on the previous value
- `subscribe(callback: (value: T) => void)`: Subscribes to state changes

## License

MIT 