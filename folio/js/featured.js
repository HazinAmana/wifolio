function loadProjects() {
  const container = document.getElementById("projects-grid");
  if (!container) {
    console.error("Le conteneur #projects-grid n'existe pas dans le HTML.");
    return;
  }
  container.innerHTML = "<p>Chargement des projets en cours...</p>";
  fetch("./assets/Liste_Projets.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      return response.json();
    })
    .then((data) => {
      container.innerHTML = "";
      // Filtrer uniquement les projets avec featured: true
      const featuredProjects = data.filter(
        (project) => project.featured === true
      );

      featuredProjects.forEach((project) => {
        const projectElement = document.createElement("div");
        projectElement.className = "card";
        projectElement.innerHTML = `
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
            `;
        container.appendChild(projectElement);
      });
    })
    .catch((error) => {
      console.error("Erreur de chargement des données:", error);
      container.innerHTML = "<p>Impossible de charger les projets.</p>";
    });
}
// Appelle la fonction quand le DOM est chargé
document.addEventListener("DOMContentLoaded", loadProjects);
