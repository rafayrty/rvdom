type StateSetter<T> = (value: T | ((prev: T) => T)) => void;
type StateTuple<T> = [T, StateSetter<T>];

export class State<T> {
  private value: T;
  private subscribers: ((value: T) => void)[] = [];

  constructor(initialValue: T) {
    this.value = initialValue;
  }

  get(): T {
    return this.value;
  }

  set(newValue: T | ((prev: T) => T)): void {
    const nextValue = typeof newValue === 'function' 
      ? (newValue as (prev: T) => T)(this.value)
      : newValue;

    if (nextValue !== this.value) {
      this.value = nextValue;
      this.notify();
    }
  }

  subscribe(callback: (value: T) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notify(): void {
    this.subscribers.forEach(subscriber => subscriber(this.value));
  }
}

export function createState<T>(initialValue: T): StateTuple<T> {
  const state = new State(initialValue);
  return [state.get(), state.set.bind(state)];
} 