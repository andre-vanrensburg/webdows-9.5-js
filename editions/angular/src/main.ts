import { bootstrapApplication } from "@angular/platform-browser";
import { loadSharedStyles, revealWhenBooted } from "../../core/src";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

loadSharedStyles().then(() => {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
  revealWhenBooted();
});
