import { DestroyRef, Pipe, PipeTransform, Signal, inject, signal } from "@angular/core";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { EDITIONS, type Store } from "../../../core/src";

export const IMG = "../img/";
export const SOUND = "../mp3/win95.mp3";
export const EDITION = EDITIONS.find((e) => e.key === "angular")!;
export const LOGO = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg";
export const YEAR = new Date().getFullYear();

/** Mirrors a shared core store into an Angular signal for the lifetime of the injecting component */
export function fromStore<T>(store: Store<T>): Signal<T> {
  const value = signal(store.get());
  const stop = store.listen((v) => value.set(v));
  inject(DestroyRef).onDestroy(stop);
  return value.asReadonly();
}

/** The HTML we bind is our own static content (About text, SVG faces), so it is trusted as-is */
@Pipe({ name: "trustHtml" })
export class TrustHtmlPipe implements PipeTransform {
  private s = inject(DomSanitizer);
  transform(html: string | null | undefined): SafeHtml {
    return this.s.bypassSecurityTrustHtml(html || "");
  }
}
