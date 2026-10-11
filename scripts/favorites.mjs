import { loadHeaderFooter, setupTheme } from "./utils.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupTheme();

  const favoritesContainer = document.getElementById("jobs-container");
  const statusMessage = document.getElementById("status-message");
  const resultsCount = document.getElementById("results-count");

  function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("ai-favorites")) || [];

    if (resultsCount) {
      resultsCount.textContent = `Saved Jobs: ${favorites.length}`;
    }

    if (favorites.length === 0) {
      if (statusMessage) statusMessage.textContent = "";
      favoritesContainer.innerHTML = `
        <div class="no-favorites">
          <p>You haven't saved any jobs to your favorites yet.</p>
          <a href="index.html" class="button primary-button">Browse Jobs</a>
        </div>
      `;
      return;
    }

    if (statusMessage) statusMessage.textContent = "";

    favoritesContainer.innerHTML = favorites.map(job => `
      <article class="job-card">
        <div class="job-card-header">
          <span class="job-emoji">${job.emoji || '🤖'}</span>
          <button class="fav-btn active remove-fav" data-id="${job.id || job.title}">
            ❤️
          </button>
        </div>
        <h3>${job.title}</h3>
        <p class="company"><strong>${job.company}</strong></p>
        <div class="tags">
          <span class="tag">${job.level || 'Mid'}</span>
          <span class="tag">${job.remote ? 'Remote' : 'On-site'}</span>
        </div>
        <div class="job-card-footer">
          <a href="${job.apply_url || '#'}" target="_blank" class="button primary-button">Apply Now</a>
        </div>
      </article>
    `).join("");
  }

  // Eliminar de favoritos al hacer clic en el corazón
  if (favoritesContainer) {
    favoritesContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("remove-fav")) {
        const id = e.target.dataset.id;
        let favorites = JSON.parse(localStorage.getItem("ai-favorites")) || [];
        favorites = favorites.filter(f => (f.id || f.title) !== id);
        localStorage.setItem("ai-favorites", JSON.stringify(favorites));
        renderFavorites();
      }
    });
  }

  renderFavorites();
});