// ++++++++++++++++++++++++++++++++++++++++++
// FONCTION DE RECHERCHE AMÉLIORÉE
// ++++++++++++++++++++++++++++++++++++++++++
function performSearch(searchTerm) {
  const activeTag = document
    .querySelector(".tag.active")
    .getAttribute("data-tag");

  filteredProjects = projects.filter((project) => {
    // Filtre par tag
    const matchesTag =
      activeTag === "all" ||
      project.category.toLowerCase() === activeTag.toLowerCase();

    // Recherche dans tous les champs
    const matchesSearch =
      searchTerm === "" ||
      Object.values(project).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );

    return matchesTag && matchesSearch;
  });

  currentPage = 1;
  updatePagination();
}

// Gestion de la recherche en temps réel
document.getElementById("search").addEventListener("input", (e) => {
  performSearch(e.target.value.trim());
});

// Bouton pour effacer la recherche
document.querySelector(".clear-search").addEventListener("click", () => {
  const searchInput = document.getElementById("search");
  searchInput.value = "";
  searchInput.focus();
  performSearch("");
});

// Initialisation au chargement
document.addEventListener("DOMContentLoaded", function () {
  displayProjects();
  initPagination();

  // Permettre la recherche avec la touche Entrée
  document.getElementById("search").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSearch(e.target.value.trim());
    }
  });
});

