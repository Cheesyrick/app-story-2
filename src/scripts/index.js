import "../styles/styles.css";
import App from "./pages/app";

let skipToContentFlag = false;

export function setSkipToContentFlag() {
  skipToContentFlag = true;
}

export function shouldSkipToContent() {
  return skipToContentFlag;
}

export function clearSkipFlag() {
  skipToContentFlag = false;
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  await app.renderPage();
  window._appInstance = app;

  const skipLink = document.querySelector(".skip-link");
  const mainContent = document.querySelector("#main-content");

  if (skipLink && mainContent) {
    skipLink.addEventListener("click", (event) => {
      event.preventDefault();
      skipLink.blur();
      mainContent.setAttribute("tabindex", "-1");
      mainContent.focus();
      mainContent.scrollIntoView();
    });
  }
});

window.addEventListener("hashchange", async () => {
  if (window._appInstance) {
    if (typeof window._appInstance.stopCamera === "function") {
      window._appInstance.stopCamera();
    }

    await window._appInstance.renderPage();
  }
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("user-is-tabbing");
  }
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then((registration) => {
        console.log('Service Worker registered successfully:', registration);
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error);
      });
  });
}

