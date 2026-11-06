import { useSyncExternalStore } from "react";
import type { Store } from "../../core/src";

/** Subscribes a component to a shared core store */
export function useStore<T>(store: Store<T>): T {
  return useSyncExternalStore(store.listen, store.get);
}
