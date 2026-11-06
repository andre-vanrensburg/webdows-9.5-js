import { shallowRef, onUnmounted, type Ref } from "vue";
import type { Store } from "../../core/src";

/** Mirrors a shared core store into a Vue ref for the lifetime of the component */
export function useStore<T>(store: Store<T>): Ref<T> {
  const value = shallowRef(store.get()) as Ref<T>;
  const stop = store.listen((v) => (value.value = v));
  onUnmounted(stop);
  return value;
}
