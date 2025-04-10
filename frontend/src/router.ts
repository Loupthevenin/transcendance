import { LoginView } from "./views/login";
import { SignupView } from "./views/signup";
import { MainLayout } from "./layout/layout";
import { TwoFAView } from "./views/2fa";
import { ProfileView } from "./views/profile";

import { initSideBarNavigation } from "./controllers/navbar";
import { InitGame, CreateGameCanvas } from "./game/game";

type RouteHandler = () => HTMLElement;
type Route = {
  view: RouteHandler;
  setup?: (root: HTMLElement) => void;
};

const routes: Record<string, Route> = {
  "/auth/login": {
    view: LoginView,
    setup: async (root) => {
      const mod = await import("./controllers/login");
      mod.setupLoginHandlers(root);
    },
  },
  "/auth/signup": {
    view: SignupView,
    setup: async (root) => {
      const mod = await import("./controllers/signup");
      mod.setupSignupHandlers(root);
    },
  },
  "/profile": {
    view: ProfileView,
    setup: async (root) => {
      const mod = await import("./controllers/profile");
      mod.setupProfile(root);
    },
  },
  "/auth/verify-2fa": {
    view: TwoFAView,
    setup: async (root) => {
      const mod = await import("./controllers/2fa");
      mod.setupTwoFAHandlers(root);
    },
  },
  "/": {
    view: () => MainLayout(CreateGameCanvas()),
    setup: () => {
      initSideBarNavigation();
      InitGame();
    },
  },
};

export async function navigateTo(path: string) {
  history.pushState(null, "", path);
  await renderRoute();
}

export async function renderRoute() {
  const path = location.pathname;
  const route = routes[path];

  document.body.innerHTML = "";

  if (!route) {
    const el = document.createElement("div");
    el.textContent = "404 - Page non trouvée";
    document.body.appendChild(el);
    return;
  }

  const view = route.view();
  document.body.appendChild(view);

  if (route.setup) {
    await route.setup(view);
  }
}

window.addEventListener("popstate", renderRoute);
