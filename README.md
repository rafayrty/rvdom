# rvdom

A lightweight, type-safe virtual DOM implementation for TypeScript with reactive state management.

## Features

- 🚀 Lightweight and fast virtual DOM implementation
- 💪 Written in TypeScript with full type safety
- 🔄 Reactive state management
- 🎯 Simple and intuitive API
- 📦 Zero dependencies

## Installation

```bash
npm install rvdom
```

## Quick Start

```typescript
import { createApp, h, reactive } from 'rvdom';

// Create reactive state
const state = reactive({
  count: 0
});

// Create a component
const Counter = () => {
  return h('div', {}, [
    h('h1', {}, state.count.toString()),
    h('button', { 
      onClick: () => state.count++ 
    }, 'Increment')
  ]);
};

// Create and mount the app
createApp(Counter).mount('#app');
```

## API

### `createApp(rootComponent)`

Creates a new application instance.

### `h(tag, props, children)`

Creates a virtual DOM node.

### `reactive(state)`

Creates a reactive state object.

## Examples

Check out the [examples](examples/) directory for more usage examples:

- Counter App
- Todo App

## License

MIT 