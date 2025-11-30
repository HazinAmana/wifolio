/* ===============================================
  DANCERS - Script principal d'orchestration
  ===============================================

  Ce fichier coordonne tous les modules du projet:
  - Chargement des données JSON
  - Initialisation des carrousels
  - Initialisation du bloc de texte
  - Gestion des événements globaux

  DÉPENDANCES (chargées dans cet ordre dans le HTML):
  1. data-loader.js
  2. carousel-thumbnails.js
  3. carousel-main.js
  4. text-block.js
  5. scrollbar/scrollbarScript.js => SUPPRIMÉ
  6. dancers.js (ce fichier)

  ⚠️ CRITIQUE : L'ordre de chargement des scripts est important.

  💡 MODIFIABLE : Logique d'orchestration, gestion d'erreurs.
*/

// ===============================================
// VARIABLES GLOBALES
// ===============================================

let isInitialized = false;

// ===============================================
// INITIALISATION PRINCIPALE
// ===============================================

/**
 * Point d'entrée principal de l'application
 * Exécuté automatiquement au chargement de la page
 */
async function initApp() {
  console.log("🚀 Démarrage de l'application Dancers Gallery...");
  console.log("⏰ ", new Date().toLocaleTimeString());

  try {
    // Étape 1: Charger les données JSON
    console.log("\n📂 Étape 1/4: Chargement des données...");
    const dancers = await window.DANCERS_DATA.loadDancersData();

    if (!dancers || dancers.length === 0) {
      throw new Error("Aucune donnée de danseur chargée");
    }

    console.log(`✅ ${dancers.length} danseurs chargés`);

    // Étape 2: Initialiser les modules
    console.log("\n🎨 Étape 2/4: Initialisation des modules...");

    // Initialiser le carrousel de vignettes
    if (window.THUMBNAIL_CAROUSEL) {
      window.THUMBNAIL_CAROUSEL.init();
      console.log("  ✅ Carrousel de vignettes initialisé");
    }

    // Initialiser le grand carrousel
    if (window.MAIN_CAROUSEL) {
      window.MAIN_CAROUSEL.init();
      console.log("  ✅ Grand carrousel initialisé");
    }

    // Initialiser le bloc de texte
    if (window.TEXT_BLOCK) {
      window.TEXT_BLOCK.init();
      console.log("  ✅ Bloc de texte initialisé");
    }

    // Étape 3: Rendre les vignettes
    console.log("\n🖼️  Étape 3/4: Génération des vignettes...");
    if (window.THUMBNAIL_CAROUSEL) {
      window.THUMBNAIL_CAROUSEL.render(dancers);
      console.log("  ✅ Vignettes rendues");
    }

    // Étape 4: Configuration finale
    console.log("\n⚙️  Étape 4/4: Configuration finale...");
    setupGlobalEventListeners();
    console.log("  ✅ Event listeners configurés");

    // Charger le contenu par défaut (NYC Dance Project)
    console.log("\n🎭 Chargement du contenu par défaut...");
    const { defaultContent } = window.DANCERS_DATA;
    if (defaultContent) {
      // Déclencher l'affichage dans le grand carrousel
      const event = new CustomEvent('dancerSelected', {
        detail: defaultContent
      });
      document.dispatchEvent(event);

      // Mettre à jour le bloc de texte
      const textEvent = new CustomEvent('updateText', {
        detail: {
          nom: defaultContent.nom,
          description: defaultContent.description
        }
      });
      document.dispatchEvent(textEvent);

      console.log("  ✅ Contenu par défaut affiché:", defaultContent.nom);
    }

    // Marquer comme initialisé
    isInitialized = true;

    // Affichage final
    console.log("\n✅ Application initialisée avec succès!");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`📊 Statistiques:`);
    console.log(`  - Nombre total de danseurs: ${dancers.length}`);
    console.log(`  - Pages du carrousel: ${window.THUMBNAIL_CAROUSEL?.totalPages || "N/A"}`);
    console.log(`  - Vignettes par page: Variable (responsive)`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error);
    showErrorMessage(
      "Impossible de charger la galerie. Veuillez recharger la page."
    );
  }
}

// ===============================================
// EVENT LISTENERS GLOBAUX
// ===============================================

/**
 * Configure les event listeners globaux de l'application
 */
function setupGlobalEventListeners() {
  // Event listener pour les erreurs d'images non chargées
  document.addEventListener(
    "error",
    (e) => {
      if (e.target.tagName === "IMG") {
        console.warn(`⚠️ Erreur de chargement d'image: ${e.target.src}`);
        e.target.src = window.DANCERS_DATA.CONFIG.fallbackImage;
      }
    },
    true
  );

  // Event listener pour le scroll (smooth scroll sur ancres)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Event listener pour le mode debug (Ctrl+Shift+D)
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === "D") {
      toggleDebugMode();
    }
  });

  // DEBUG: Click Inspector
  // Affiche dans la console l'élément cliqué pour déboguer les problèmes de z-index
  document.addEventListener("click", (e) => {
    if (e.ctrlKey) { // Seulement si Ctrl est maintenu pour éviter le spam
      console.log("🕵️ CLICK DEBUG:", e.target);
      console.log("   Parents:", e.composedPath());
      const style = window.getComputedStyle(e.target);
      console.log("   Z-Index:", style.zIndex);
      console.log("   Pointer-Events:", style.pointerEvents);
    }
  }, true);
}

// ===============================================
// GESTION D'ERREURS
// ===============================================

/**
 * Affiche un message d'erreur à l'utilisateur
 *
 * @param {String} message - Message d'erreur à afficher
 */
function showErrorMessage(message) {
  const errorDiv = document.createElement("div");
  errorDiv.style.cssText = `
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #ff4444;
  color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  z-index: 10000;
  text-align: center;
  max-width: 400px;
  `;
  errorDiv.innerHTML = `
  <h3 style="margin: 0 0 1rem 0;">⚠️ Erreur</h3>
  <p style="margin: 0;">${message}</p>
  `;
  document.body.appendChild(errorDiv);
}

// ===============================================
// MODE DEBUG
// ===============================================

let debugMode = false;

/**
 * Active/désactive le mode debug pour le développement
 * Raccourci: Ctrl+Shift+D
 */
function toggleDebugMode() {
  debugMode = !debugMode;

  if (debugMode) {
    console.log("🐛 MODE DEBUG ACTIVÉ");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("État de l'application:");
    console.log("  - Initialisé:", isInitialized);
    console.log(
      "  - Danseurs chargés:",
      window.DANCERS_DATA?.allDancers?.length || 0
    );
    console.log(
      "  - Page carrousel:",
      window.THUMBNAIL_CAROUSEL?.currentPage || "N/A"
    );
    console.log(
      "  - Danseur actif:",
      window.MAIN_CAROUSEL?.currentDancer?.nom || "Aucun"
    );
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Ajouter un indicateur visuel
    const debugIndicator = document.createElement("div");
    debugIndicator.id = "debug-indicator";
    debugIndicator.style.cssText = `
  position: fixed;
  top: 10px;
  right: 10px;
  background: #ff6b00;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  z-index: 10000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  `;
    debugIndicator.textContent = "🐛 DEBUG MODE";
    document.body.appendChild(debugIndicator);
  } else {
    console.log("🐛 MODE DEBUG DÉSACTIVÉ");
    const indicator = document.getElementById("debug-indicator");
    if (indicator) indicator.remove();
  }
}

// ===============================================
// UTILITAIRES
// ===============================================

/**
 * Affiche un message de bienvenue dans la console
 */
function showWelcomeMessage() {
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #9b8400");
  console.log(
    "%c🎭 NYC DANCE PROJECT - Galerie de Danseurs",
    "color: #9b8400; font-size: 16px; font-weight: bold"
  );
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #9b8400");
  console.log(
    "%cPhotographie par Ken Browar et Deborah Ory",
    "color: #999; font-style: italic"
  );
  console.log("%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", "color: #9b8400");
  console.log("");
  console.log(
    "%c💡 Astuce : Appuyez sur Ctrl+Shift+D pour activer le mode debug",
    "color: #666; font-size: 11px"
  );
  console.log("");
}

/**
 * Vérifie si tous les modules nécessaires sont chargés
 *
 * @returns {Boolean} True si tous les modules sont disponibles
 */
function checkDependencies() {
  const required = [
    "DANCERS_DATA",
    "THUMBNAIL_CAROUSEL",
    "MAIN_CAROUSEL",
    "TEXT_BLOCK",
  ];

  const missing = required.filter((dep) => !window[dep]);

  if (missing.length > 0) {
    console.error("❌ Modules manquants:", missing);
    return false;
  }

  return true;
}

// ===============================================
// DÉMARRAGE AUTOMATIQUE
// ===============================================

// Message de bienvenue
showWelcomeMessage();

// Attendre que le DOM soit chargé
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    // Vérifier les dépendances
    if (checkDependencies()) {
      // Petit délai pour s'assurer que tous les scripts sont chargés
      setTimeout(initApp, 100);
    } else {
      showErrorMessage("Erreur de chargement des modules JavaScript.");
    }
  });
} else if (checkDependencies()) {
  setTimeout(initApp, 100);
} else {
  showErrorMessage("Erreur de chargement des modules JavaScript.");
}