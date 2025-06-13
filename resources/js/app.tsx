import "../css/app.css";
import "../css/globals.css";
import "./bootstrap";

import {createInertiaApp} from "@inertiajs/react";
import {resolvePageComponent} from "laravel-vite-plugin/inertia-helpers";
import {createRoot} from "react-dom/client";
import React from "react";
import {Toaster} from "./components/ui/sonner";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob("./Pages/**/*.tsx")),
  setup({el, App, props}) {
    const root = createRoot(el as HTMLElement);
    root.render(
      <React.StrictMode>
        <Toaster />
        <App {...props} />
      </React.StrictMode>
    );
  },
  progress: {
    color: "#4B5563",
  },
});
