// ==================== CONFIGURATION ====================
const container = document.getElementById("projects-grid");
if (!container) {
  console.error("Le conteneur #projects-grid n'existe pas dans le HTML.");
  throw new Error("Container not found");
}

// Configuration basée sur les attributs data-*
const CONFIG = {
  mode: container.dataset.mode || "all",
  dataUrl: "./assets/Liste_Projets.json",
};

// Fonctionnalités activées selon le mode
const FEATURES = {
  enablePagination: CONFIG.mode === "all",
  enableSearch: CONFIG.mode === "all",
  enableFilters: CONFIG.mode === "all",
};

// ==================== ÉTAT DE L'APPLICATION ====================
let data = [];
let cardsPerPage = 10;
let currentPage = 1;
let currentCategory = "all";
let searchTerm = "";

// ==================== ÉLÉMENTS DOM ====================
const projectsGrid = container;
const pagination = document.getElementById("pagination");
const statusEl = document.getElementById("status");
const rowsSelect = document.getElementById("rows-select");
const filtersWrap = document.getElementById("filters");
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");

// ==================== UTILITAIRES ====================
const normalize = (s) =>
  (s ?? "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

// ==================== RECHERCHE (si activée) ====================
if (FEATURES.enableSearch && searchInput && clearSearchBtn) {
  searchInput.addEventListener("input", () => {
    searchTerm = normalize(searchInput.value);
    console.log("Recherche :", searchTerm);
    clearSearchBtn.style.display = searchTerm ? "inline-block" : "none";
    currentPage = 1;
    render();
  });

  clearSearchBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchTerm = "";
    clearSearchBtn.style.display = "none";
    currentPage = 1;
    render();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      searchTerm = "";
      clearSearchBtn.style.display = "none";
      currentPage = 1;
      render();
    }
  });
}

// ==================== FILTRAGE ====================
function getFiltered() {
  let filtered = data;

  // Filtre principal selon le mode
  if (CONFIG.mode === "featured") {
    filtered = filtered.filter((p) => p.featured === true);
  }

  // Filtres supplémentaires si activés
  if (FEATURES.enableFilters) {
    filtered = filtered.filter((p) => {
      const categoryMatch =
        normalize(currentCategory) === "all" ||
        normalize(p.category) === normalize(currentCategory);

      const searchMatch = [p.name, p.description]
        .map(normalize)
        .some((val) => val.includes(searchTerm));

      return categoryMatch && searchMatch;
    });
  } else if (FEATURES.enableSearch) {
    // Recherche uniquement si les filtres ne sont pas activés
    filtered = filtered.filter((p) =>
      [p.name, p.description]
        .map(normalize)
        .some((val) => val.includes(searchTerm))
    );
  }

  return filtered;
}

// ==================== PAGINATION ====================
function paginate(arr) {
  if (!FEATURES.enablePagination) {
    return arr; // Retourne toutes les données si la pagination est désactivée
  }
  const start = (currentPage - 1) * cardsPerPage;
  return arr.slice(start, start + cardsPerPage);
}

function clampCurrentPage(totalItems) {
  if (!FEATURES.enablePagination) return;
  const totalPages = Math.max(1, Math.ceil(totalItems / cardsPerPage));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;
}

function formatStatus(total, page, per) {
  const totalPages = Math.max(1, Math.ceil(total / per));
  const start = total === 0 ? 0 : (page - 1) * per + 1;
  const end = Math.min(total, page * per);
  return `${total} résultat${
    total > 1 ? "s" : ""
  } — ${start}–${end} | Page ${page}/${totalPages}`;
}

// ==================== RENDU DES CARTES ====================
function renderCard(project) {
  return `
    <div class="card">
      <a class="card-link" href="${project.url}">
        <div class="card-inner">
          <img src="${project.thumbnail}" alt="${project.name}" class="card-image">
          <div class="card-content">
            <span class="btnStatus">${project.category}</span>
            <h3>${project.name}</h3>
            <p>${project.description}</p>
          </div>
          <div class="project-meta2">
            <p class="project-location">${project.location}</p>
            <p class="project-date">${project.date}</p>
          </div>
        </div>
      </a>
    </div>
  `;
}

// ==================== RENDU PRINCIPAL ====================
function render() {
  const filtered = getFiltered();

  if (FEATURES.enablePagination) {
    clampCurrentPage(filtered.length);
  }

  const pageData = paginate(filtered);

  // Rendu des cartes
  if (pageData.length === 0) {
    projectsGrid.innerHTML =
      "<p>Aucun projet ne correspond à votre recherche.</p>";
  } else {
    projectsGrid.innerHTML = pageData.map(renderCard).join("");
  }

  // Rendu de la pagination et du statut (si activés)
  if (FEATURES.enablePagination && pagination && statusEl) {
    renderPagination(filtered.length);
    statusEl.textContent = formatStatus(
      filtered.length,
      currentPage,
      cardsPerPage
    );
  }
}

// ==================== RENDU FILTRES ====================
function renderFilters() {
  if (!FEATURES.enableFilters || !filtersWrap) return;

  const cats = Array.from(new Set(data.map((d) => d.category))).sort((a, b) =>
    normalize(a).localeCompare(normalize(b))
  );

  const buttons = [
    { label: "Tout", value: "all" },
    ...cats.map((c) => ({ label: c, value: c })),
  ];

  filtersWrap.innerHTML = buttons
    .map(
      (b) => `
        <button class="tag ${
          b.value === currentCategory ? "active" : ""
        }" data-category="${b.value}">
          ${b.label}
        </button>
      `
    )
    .join("");

  filtersWrap.querySelectorAll(".tag").forEach((btn) => {
    btn.addEventListener("click", () => {
      filtersWrap
        .querySelectorAll(".tag")
        .forEach((bb) => bb.classList.remove("active"));
      btn.classList.add("active");
      currentCategory = btn.dataset.category;
      currentPage = 1;
      render();
    });
  });
}

// ==================== RENDU PAGINATION ====================
function renderPagination(total) {
  if (!FEATURES.enablePagination || !pagination) return;

  const totalPages = Math.max(1, Math.ceil(total / cardsPerPage));
  pagination.innerHTML = "";

  const makeBtn = (label, disabled, onClick, extraClass = "") => {
    const b = document.createElement("button");
    b.textContent = label;
    b.className = `page-btn ${extraClass}`.trim();
    if (disabled) b.disabled = true;
    b.onclick = onClick;
    return b;
  };

  // Chevrons Gauche
  pagination.appendChild(
    makeBtn("⏮", currentPage === 1, () => {
      currentPage = 1;
      render();
    })
  );
  pagination.appendChild(
    makeBtn("◀", currentPage === 1, () => {
      currentPage -= 1;
      render();
    })
  );

  // Numéros (fenêtre autour de la page courante)
  const span = 2;
  const start = Math.max(1, currentPage - span);
  const end = Math.min(totalPages, currentPage + span);
  for (let i = start; i <= end; i++) {
    const btn = makeBtn(
      String(i),
      i === currentPage,
      () => {
        currentPage = i;
        render();
      },
      "page-num"
    );
    if (i === currentPage) btn.classList.add("active");
    pagination.appendChild(btn);
  }

  // Chevrons Droite
  pagination.appendChild(
    makeBtn("▶", currentPage === totalPages, () => {
      currentPage += 1;
      render();
    })
  );
  pagination.appendChild(
    makeBtn("⏭", currentPage === totalPages, () => {
      currentPage = totalPages;
      render();
    })
  );
}

// ==================== ÉVÉNEMENTS ====================
if (FEATURES.enablePagination && rowsSelect) {
  rowsSelect.addEventListener("change", (e) => {
    cardsPerPage = parseInt(e.target.value, 10);
    currentPage = 1;
    render();
  });
}

// ==================== CHARGEMENT DONNÉES ====================
function loadProjects() {
  projectsGrid.innerHTML = "<p>Chargement des projets en cours...</p>";

  fetch(CONFIG.dataUrl)
    .then((r) => {
      if (!r.ok) throw new Error(`Erreur HTTP : ${r.status}`);
      return r.json();
    })
    .then((json) => {
      data = json.map((x) => ({
        name: x.name,
        category: x.category,
        location: x.location,
        date: x.date,
        url: x.url,
        thumbnail: x.thumbnail,
        description: x.description,
        featured: x.featured,
      }));

      // Initialise les filtres si activés
      if (FEATURES.enableFilters) {
        renderFilters();
      }

      render();
    })
    .catch((err) => {
      console.error("Erreur chargement JSON", err);
      projectsGrid.innerHTML = `<p>Erreur de chargement des données.</p>`;
    });
}

// Démarrage automatique au chargement du DOM
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProjects);
} else {
  loadProjects();
}
