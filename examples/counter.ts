import { h, render, createState, State } from '../src/index';

// Create a single state instance for the counter
const counterState = new State(0);

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

// Initialize the app
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