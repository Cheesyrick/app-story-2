import routes from "../routes/routes";
import logout from "../utils/logout.js";
import { getActiveRoute } from "../routes/url-parser";
import { shouldSkipToContent, clearSkipFlag } from "../index.js";

function supportsViewTransition() {
  return typeof document.startViewTransition === "function";
}

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this._setupDrawer();
  }

  _setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

async renderPage() {
  const url = getActiveRoute();
  const page = routes[url];

  if (
    this.#currentPage &&
    typeof this.#currentPage.stopCamera === "function"
  ) {
    this.#currentPage.stopCamera();
  }

  const renderContent = async () => {
    // Menambahkan kelas transisi keluar untuk halaman lama
    this.#content.classList.add("transition-view-exit");

    // Tunggu hingga transisi keluar selesai
    await new Promise(resolve => setTimeout(resolve, 300));

    // Bersihkan konten dan pasang konten baru
    this.#content.innerHTML = await page.render();
    await page.afterRender();

    this.#currentPage = page;

    if (
      this.#currentPage &&
      typeof this.#currentPage.startCamera === "function"
    ) {
      this.#currentPage.startCamera();
    }

    this._setupAuthUI();

    if (shouldSkipToContent()) {
      this.#content.setAttribute("tabindex", "-1");
      this.#content.focus();
      this.#content.scrollIntoView();
      clearSkipFlag();
    }

    // Setelah konten dimuat, aktifkan transisi masuk
    this.#content.classList.add("transition-view-enter");
    setTimeout(() => {
      this.#content.classList.remove("transition-view-enter");
      this.#content.classList.remove("transition-view-exit");
    }, 300);
  };

  // 🌟 Jika browser mendukung View Transition
  if (supportsViewTransition()) {
    await document.startViewTransition(renderContent).finished;
  } else {
    // 🧱 Fallback: transisi manual
    this.#content.classList.add("transition-leave");
    await new Promise(resolve => setTimeout(resolve, 300));
    this.#content.classList.remove("transition-leave");

    await renderContent();

    this.#content.classList.add("transition-enter");
    setTimeout(() => {
      this.#content.classList.remove("transition-enter");
    }, 300);
  }
}

  _setupAuthUI() {
    const token = localStorage.getItem("token");
    const loginLink = document.querySelector('a[href="#/login"]');
    const registerLink = document.querySelector('a[href="#/register"]');
    const logoutLink = document.getElementById("logout-link");

    if (token) {
      if (loginLink) loginLink.parentElement.style.display = "none";
      if (registerLink) registerLink.parentElement.style.display = "none";
      if (logoutLink) logoutLink.parentElement.style.display = "list-item";
    } else {
      if (loginLink) loginLink.parentElement.style.display = "list-item";
      if (registerLink) registerLink.parentElement.style.display = "list-item";
      if (logoutLink) logoutLink.parentElement.style.display = "none";
    }

    if (logoutLink) {
      logoutLink.addEventListener("click", (e) => {
        e.preventDefault();
        logout();
      });
    }
  }
}

export default App;
