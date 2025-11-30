/* ===============================================
  CAROUSEL MAIN - Deuxième carrousel (grande image)
  ===============================================

  Gère l'affichage de la grande image avec:
  - Navigation entre les images d'un danseur
  - Bande de vignettes en dessous
  - Effet grayscale sur les vignettes
  - Bandes de navigation semi-transparentes
  - Gestion des images portrait/paysage

  DÉPENDANCES :
  - data-loader.js
  - carousel-thumbnails.js (événement dancerSelected)

  EXPORTS :
  - initMainCarousel() : Initialisation
  - showDancer() : Afficher un danseur

  ⚠️ CRITIQUE : object-fit: contain pour les images.

  💡 MODIFIABLE : Animations, effets, transitions.
*/

// ===============================================
// ÉLÉMENTS DOM
// ===============================================

let mainViewer, mainImage, mainPlaceholder, mainThumbnails;
let mainNavPrev, mainNavNext, mainCounter;


// ===============================================
// VARIABLES D'ÉTAT
// ===============================================

let currentDancer = null; // Danseur actuellement affiché
let currentImageIndex = 0; // Index de l'image courante
let currentImages = []; // Tableau d'images du danseur courant


// ===============================================
// INITIALISATION
// ===============================================

/**
 * Initialise le grand carrousel
 */
function initMainCarousel() {
  console.log('🎬 Initialisation du grand carrousel...');

  // Récupérer les éléments DOM
  mainViewer = document.getElementById('mainViewer');
  mainImage = document.getElementById('mainImage');
  mainPlaceholder = document.getElementById('mainPlaceholder');
  mainThumbnails = document.getElementById('mainThumbnails');
  mainNavPrev = document.getElementById('mainNavPrev');
  mainNavNext = document.getElementById('mainNavNext');
  mainCounter = document.getElementById('mainCounter');

  if (!mainViewer || !mainImage) {
  console.error('❌ Éléments du grand carrousel non trouvés');
  return;
  }

  // Event listener pour la sélection d'un danseur
  document.addEventListener('dancerSelected', (event) => {
  showDancer(event.detail);
  });

  // Event listeners pour la navigation
  setupNavigationListeners();

  console.log('✅ Grand carrousel initialisé');
}


// ===============================================
// AFFICHAGE D'UN DANSEUR
// ===============================================

/**
 * Affiche un danseur dans le grand carrousel
 *
 * @param {Object} dancer - Données du danseur
 */
function showDancer(dancer) {
  console.log(`🎬 Affichage du danseur: ${dancer.nom}`);

  if (!dancer || !dancer.images || dancer.images.length === 0) {
  console.warn('⚠️ Pas d\'images pour ce danseur');
  return;
  }

  // Sauvegarder le danseur courant
  currentDancer = dancer;
  currentImages = dancer.images;
  currentImageIndex = 0;

  // Cacher le placeholder, montrer l'image
  if (mainPlaceholder) mainPlaceholder.style.display = 'none';
  if (mainImage) mainImage.style.display = 'block';

  // Afficher la première image
  showImage(0);

  // Générer les vignettes
  renderMainThumbnails();

  // Afficher les contrôles de navigation si plusieurs images
  updateNavigationVisibility();
}


// ===============================================
// AFFICHAGE D'UNE IMAGE
// ===============================================

/**
 * Affiche une image spécifique du danseur courant
 *
 * @param {Number} index - Index de l'image à afficher
 */
function showImage(index) {
  if (!currentImages || currentImages.length === 0) return;

  // Valider l'index
  currentImageIndex = Math.max(0, Math.min(index, currentImages.length - 1));

  const imagePath = currentImages[currentImageIndex];

  // Mettre à jour l'image principale
  if (mainImage) {
  mainImage.src = imagePath;
  mainImage.alt = `${currentDancer.nom} - Photo ${currentImageIndex + 1}`;

  // Gestion d'erreur
  mainImage.onerror = () => {
  mainImage.src = window.DANCERS_DATA.CONFIG.fallbackImage;
  };
  }

  // Mettre à jour le compteur
  updateCounter();

  // Mettre à jour l'état des boutons de navigation
  updateNavigationState();

  // Mettre à jour la vignette active
  markActiveMainThumbnail(currentImageIndex);
}


// ===============================================
// VIGNETTES SOUS LE GRAND CARROUSEL
// ===============================================

/**
 * Génère les vignettes sous le grand carrousel
 */
function renderMainThumbnails() {
  if (!mainThumbnails) return;

  // Vider les vignettes existantes
  mainThumbnails.innerHTML = '';

  currentImages.forEach((imagePath, index) => {
  const thumb = createMainThumbnail(imagePath, index);
  mainThumbnails.appendChild(thumb);
  });

  console.log(`🎨 ${currentImages.length} vignettes créées sous le grand carrousel`);
}


/**
 * Crée une vignette pour le grand carrousel
 *
 * @param {String} imagePath - Chemin de l'image
 * @param {Number} index - Index de l'image
 * @returns {HTMLElement} Élément div.carousel-main-thumb
 */
function createMainThumbnail(imagePath, index) {
  const thumb = document.createElement('div');
  thumb.className = 'carousel-main-thumb';
  thumb.dataset.index = index;

  // Marquer la première comme active
  if (index === 0) {
  thumb.classList.add('active');
  }

  // Image
  const img = document.createElement('img');
  img.src = imagePath;
  img.alt = `${currentDancer.nom} - Thumbnail ${index + 1}`;
  img.loading = 'lazy';

  // Gestion d'erreur
  img.onerror = () => {
  img.src = window.DANCERS_DATA.CONFIG.fallbackImage;
  };

  thumb.appendChild(img);

  // Event listener pour le clic
  thumb.addEventListener('click', () => {
  showImage(index);
  });

  return thumb;
}


/**
 * Marque visuellement la vignette active sous le grand carrousel
 *
 * @param {Number} index - Index de la vignette active
 */
function markActiveMainThumbnail(index) {
  if (!mainThumbnails) return;

  // Retirer la classe active de toutes les vignettes
  mainThumbnails.querySelectorAll('.carousel-main-thumb').forEach(thumb => {
  thumb.classList.remove('active');
  });

  // Ajouter la classe active à la vignette sélectionnée
  const activeThumb = mainThumbnails.querySelector(`[data-index="${index}"]`);
  if (activeThumb) {
  activeThumb.classList.add('active');

  // Scroller pour que la vignette active soit visible
  activeThumb.scrollIntoView({
  behavior: 'smooth',
  block: 'nearest',
  inline: 'center'
  });
  }
}


// ===============================================
// NAVIGATION
// ===============================================

/**
 * Configure les event listeners pour la navigation
 */
function setupNavigationListeners() {
  if (mainNavPrev) {
  mainNavPrev.addEventListener('click', () => navigateImage(-1));
  }

  if (mainNavNext) {
  mainNavNext.addEventListener('click', () => navigateImage(+1));
  }

  // Navigation au clavier
  document.addEventListener('keydown', (e) => {
  if (!currentDancer) return;

  if (e.key === 'ArrowLeft') {
  navigateImage(-1);
  } else if (e.key === 'ArrowRight') {
  navigateImage(+1);
  }
  });
}


/**
 * Navigue vers l'image précédente/suivante
 *
 * @param {Number} direction - -1 pour précédent, +1 pour suivant
 */
function navigateImage(direction) {
  if (!currentImages || currentImages.length === 0) return;

  const newIndex = currentImageIndex + direction;

  // Valider l'index (ne pas boucler)
  if (newIndex < 0 || newIndex >= currentImages.length) {
  return;
  }

  showImage(newIndex);
}


/**
 * Met à jour l'état des boutons de navigation
 */
function updateNavigationState() {
  if (!mainNavPrev || !mainNavNext) return;

  // Désactiver "précédent" si première image
  if (currentImageIndex <= 0) {
  mainNavPrev.classList.add('disabled');
  } else {
  mainNavPrev.classList.remove('disabled');
  }

  // Désactiver "suivant" si dernière image
  if (currentImageIndex >= currentImages.length - 1) {
  mainNavNext.classList.add('disabled');
  } else {
  mainNavNext.classList.remove('disabled');
  }
}


/**
 * Affiche/cache les contrôles de navigation selon le nombre d'images
 */
function updateNavigationVisibility() {
  const hasMultipleImages = currentImages && currentImages.length > 1;

  if (mainNavPrev && mainNavNext) {
  mainNavPrev.style.display = hasMultipleImages ? '' : 'none';
  mainNavNext.style.display = hasMultipleImages ? '' : 'none';
  }

  if (mainCounter) {
  mainCounter.style.display = hasMultipleImages ? '' : 'none';
  }
}


/**
 * Met à jour le compteur d'images
 */
function updateCounter() {
  if (!mainCounter) return;

  if (currentImages && currentImages.length > 0) {
  mainCounter.textContent = `${currentImageIndex + 1}/${currentImages.length}`;
  }
}


// ===============================================
// UTILITAIRES
// ===============================================

/**
 * Réinitialise le carrousel à l'état initial
 */
function resetMainCarousel() {
  currentDancer = null;
  currentImages = [];
  currentImageIndex = 0;

  if (mainImage) {
  mainImage.style.display = 'none';
  mainImage.src = '';
  }

  if (mainPlaceholder) {
  mainPlaceholder.style.display = 'flex';
  }

  if (mainThumbnails) {
  mainThumbnails.innerHTML = '';
  }

  if (mainNavPrev && mainNavNext) {
  mainNavPrev.style.display = 'none';
  mainNavNext.style.display = 'none';
  }

  if (mainCounter) {
  mainCounter.style.display = 'none';
  }
}


// ===============================================
// EXPORTS
// ===============================================

window.MAIN_CAROUSEL = {
  init: initMainCarousel,
  showDancer,
  showImage,
  reset: resetMainCarousel,
  get currentDancer() {
  return currentDancer;
  },
  get currentImageIndex() {
  return currentImageIndex;
  }
};
