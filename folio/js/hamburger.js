/**
 * GESTIONNAIRE DU MENU HAMBURGER
 * JavaScript minimal pour une expérience optimale
 * Approche simple et fiable avec classes CSS
 */

// Récupération des éléments DOM
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileNav = document.getElementById("mobile-nav");
const navOverlay = document.getElementById("nav-overlay");
const mobileNavLinks = mobileNav.querySelectorAll("a");

// Variable pour suivre l'état du menu
let isMenuOpen = false;

/**
 * Fonction pour ouvrir le menu
 */
function openMenu() {
  isMenuOpen = true;
  hamburgerBtn.setAttribute("aria-expanded", "true");
  hamburgerBtn.setAttribute("aria-label", "Fermer le menu de navigation");

  // Ajouter les classes pour ouvrir le menu
  mobileNav.classList.add("menu-open");
  navOverlay.classList.add("menu-open");

  // Empêcher le scroll du body quand le menu est ouvert
  document.body.style.overflow = "hidden";

  // Focus sur le premier lien pour l'accessibilité
  setTimeout(() => {
    mobileNavLinks[0].focus();
  }, 100);
}

/**
 * Fonction pour fermer le menu
 */
function closeMenu() {
  isMenuOpen = false;
  hamburgerBtn.setAttribute("aria-expanded", "false");
  hamburgerBtn.setAttribute("aria-label", "Ouvrir le menu de navigation");

  // Retirer les classes pour fermer le menu
  mobileNav.classList.remove("menu-open");
  navOverlay.classList.remove("menu-open");

  // Rétablir le scroll du body
  document.body.style.overflow = "";
}

/**
 * Toggle du menu au clic sur le bouton hamburger
 */
hamburgerBtn.addEventListener("click", (e) => {
  e.stopPropagation();

  if (isMenuOpen) {
    closeMenu();
  } else {
    openMenu();
  }
});

/**
 * Fermeture du menu au clic sur l'overlay
 */
navOverlay.addEventListener("click", closeMenu);

/**
 * Fermeture du menu au clic sur un lien
 */
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

/**
 * Gestion du clavier pour l'accessibilité
 */
document.addEventListener("keydown", (e) => {
  // Fermer avec Échap
  if (e.key === "Escape" && isMenuOpen) {
    closeMenu();
    hamburgerBtn.focus(); // Retourner le focus au bouton
  }

  // Navigation au clavier dans le menu
  if (
    isMenuOpen &&
    (e.key === "Tab" || e.key === "ArrowDown" || e.key === "ArrowUp")
  ) {
    e.preventDefault();

    const currentFocus = document.activeElement;
    const currentIndex = Array.from(mobileNavLinks).indexOf(currentFocus);

    let nextIndex;
    if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
      nextIndex = (currentIndex + 1) % mobileNavLinks.length;
    } else {
      nextIndex =
        currentIndex <= 0 ? mobileNavLinks.length - 1 : currentIndex - 1;
    }

    mobileNavLinks[nextIndex].focus();
  }
});

/**
 * Fermeture automatique sur redimensionnement vers desktop
 * Pour éviter que le menu reste ouvert lors du passage en mode desktop
 */
window.addEventListener("resize", () => {
  if (window.innerWidth > 768 && isMenuOpen) {
    closeMenu();
  }
});

/**
 * Fermeture du menu si clic en dehors (sécurité supplémentaire)
 */
document.addEventListener("click", (e) => {
  if (
    isMenuOpen &&
    !mobileNav.contains(e.target) &&
    !hamburgerBtn.contains(e.target)
  ) {
    closeMenu();
  }
});

/**
 * Amélioration de la performance avec la détection de support
 */
if ("CSS" in window && "supports" in window.CSS) {
  // Vérifier le support du backdrop-filter
  if (!CSS.supports("backdrop-filter", "blur(10px)")) {
    // Ajouter une classe fallback pour les navigateurs sans support
    document.documentElement.classList.add("no-backdrop-filter");
  }
}
