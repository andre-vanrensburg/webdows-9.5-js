// A tiny observable store. Its subscribe() follows the Svelte store contract,
// and listen() suits React's useSyncExternalStore, Vue refs and Angular signals.
export type Listener<T> = (value: T) => void;

export class Store<T> {
  private listeners = new Set<Listener<T>>();
  constructor(private value: T) {}

  get = (): T => this.value;

  set = (value: T): void => {
    this.value = value;
    this.listeners.forEach((l) => l(value));
  };

  update = (fn: (value: T) => T): void => this.set(fn(this.value));

  /** Calls the listener now and on every change (Svelte store contract) */
  subscribe = (listener: Listener<T>): (() => void) => {
    listener(this.value);
    return this.listen(listener);
  };

  /** Calls the listener on every change only */
  listen = (listener: Listener<T>): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
}
