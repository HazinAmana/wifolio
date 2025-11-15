(function () {
  "use strict";

  const THEME_KEY = "theme";
  const THEME_LIGHT = "light";
  const THEME_DARK = "dark";

  // Fonction pour obtenir les préférences système
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_DARK
      : THEME_LIGHT;
  }

  // Fonction pour mettre à jour l'aria-label et le texte pour lecteurs d'écran
  function updateThemeToggleLabel(theme) {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    const srText = toggle.querySelector(".theme-toggle-sr");
    if (!srText) return;
    if (theme === THEME_DARK) {
      toggle.setAttribute("aria-label", "Passer en mode clair");
      toggle.setAttribute("title", "Passer en mode clair");
      srText.textContent = "Passer en mode clair";
    } else {
      toggle.setAttribute("aria-label", "Passer en mode sombre");
      toggle.setAttribute("title", "Passer en mode sombre");
      srText.textContent = "Passer en mode sombre";
    }
  }

  // Fonction pour appliquer le thème
  function applyTheme(theme) {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    const isDarkMode = theme === THEME_DARK;

    // Appliquer le color-scheme
    document.documentElement.style.colorScheme = theme;

    // Mettre à jour la classe CSS pour l'animation
    if (isDarkMode) {
      toggle.classList.add("theme-toggle--toggled");
    } else {
      toggle.classList.remove("theme-toggle--toggled");
    }

    // Sauvegarder dans localStorage
    localStorage.setItem(THEME_KEY, theme);

    // Mettre à jour l'accessibilité
    updateThemeToggleLabel(theme);
  }

  // Fonction pour obtenir le thème courant
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) return savedTheme;
    return getSystemTheme();
  }

  // Fonction pour basculer le thème
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(newTheme);
  }

  // Initialisation
  function init() {
    const toggle = document.querySelector(".theme-toggle");
    if (!toggle) return;
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    // Déterminer le thème initial
    const initialTheme = getCurrentTheme();
    applyTheme(initialTheme);

    // Écouter les clics sur le bouton
    toggle.addEventListener("click", toggleTheme);

    // Support du clavier
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Écouter les changements des préférences système
    prefersDarkScheme.addEventListener("change", (e) => {
      // Ne changer que si aucune préférence n'est stockée
      if (!localStorage.getItem(THEME_KEY)) {
        const systemTheme = e.matches ? THEME_DARK : THEME_LIGHT;
        applyTheme(systemTheme);
      }
    });
  }

  // Démarrer quand le DOM est prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
