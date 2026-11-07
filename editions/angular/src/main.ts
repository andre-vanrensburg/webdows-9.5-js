import { bootstrapApplication } from "@angular/platform-browser";
import { loadSharedStyles, preloadImages, revealWhenBooted } from "../../core/src";
import { appConfig } from "./app/app.config";
import { App } from "./app/app";

// The logo screen image downloads during POST so the desktop never peeks through
preloadImages("../img/loading-angular.jpg", "../img/es.png");

loadSharedStyles().then(() => {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
  revealWhenBooted();
});
