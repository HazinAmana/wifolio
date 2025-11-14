// ==================== CONSTANTES & ÉTAT ====================
const DATA_URL = "./assets/Liste_Projets.json";
let data = [];
let cardsPerPage = 10;
let currentPage = 1;
let currentCategory = "all";
let searchTerm = "";

// ==================== ÉLÉMENTS DOM ====================
const projectsGrid = document.getElementById("projects-grid");
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

// ==================== RECHERCHE ====================
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

// ==================== FILTRAGE ====================
function getFiltered() {
  return data.filter((p) => {
    const matchCategory =
      normalize(currentCategory) === "all" ||
      normalize(p.category) === normalize(currentCategory);

    const matchSearch = [p.name, p.description]
      .map(normalize)
      .some((val) => val.includes(searchTerm));

    return matchCategory && matchSearch;
  });
}

// ==================== PAGINATION ====================
function paginate(arr) {
  const start = (currentPage - 1) * cardsPerPage;
  return arr.slice(start, start + cardsPerPage);
}

function clampCurrentPage(totalItems) {
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

// ==================== RENDU PRINCIPAL ====================
function render() {
  const filtered = getFiltered();
  clampCurrentPage(filtered.length);
  const pageData = paginate(filtered);

  // Rendu des cartes
  if (pageData.length === 0) {
    projectsGrid.innerHTML =
      "<p>Aucun projet ne correspond à votre recherche.</p>";
  } else {
    projectsGrid.innerHTML = pageData
      .map(
        (project) => `
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
      `
      )
      .join("");
  }

  renderPagination(filtered.length);
  statusEl.textContent = formatStatus(
    filtered.length,
    currentPage,
    cardsPerPage
  );
}

// ==================== RENDU FILTRES ====================
function renderFilters() {
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
rowsSelect.addEventListener("change", (e) => {
  cardsPerPage = parseInt(e.target.value, 10);
  currentPage = 1;
  render();
});

// ==================== CHARGEMENT DONNÉES ====================
fetch(DATA_URL)
  .then((r) => r.json())
  .then((json) => {
    data = json.map((x) => ({
      name: x.name,
      category: x.category,
      location: x.location,
      date: x.date,
      url: x.url,
      thumbnail: x.thumbnail,
      description: x.description,
    }));
    renderFilters();
    render();
  })
  .catch((err) => {
    console.error("Erreur chargement JSON", err);
    projectsGrid.innerHTML = `<p>Erreur de chargement des données.</p>`;
  });
