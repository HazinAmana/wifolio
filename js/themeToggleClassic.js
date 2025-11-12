(function () {
  "use strict";

  const THEME_KEY = "theme";
  const THEME_LIGHT = "light";
  const THEME_DARK = "dark";

  // Référence DOM
  const toggle = document.querySelector(".theme-toggle");

  // Variable pour suivre l'état du thème
  let isDarkMode = false;

  // Fonction pour obtenir les préférences système
  function getSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_DARK
      : THEME_LIGHT;
  }

  // Fonction pour appliquer le thème
  function applyTheme(theme) {
    isDarkMode = theme === THEME_DARK;

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

    // Mettre à jour l'aria-label
    const nextTheme = isDarkMode ? THEME_LIGHT : THEME_DARK;
    toggle.setAttribute("aria-label", `Passer au thème ${nextTheme}`);
    toggle.setAttribute("title", `Passer au thème ${nextTheme}`);
  }

  // Fonction pour basculer le thème
  function toggleTheme() {
    const newTheme = isDarkMode ? THEME_LIGHT : THEME_DARK;
    applyTheme(newTheme);
  }

  // Initialisation
  function init() {
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const savedTheme = localStorage.getItem(THEME_KEY);

    // Déterminer le thème initial
    let initialTheme;
    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      initialTheme = getSystemTheme();
    }

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
