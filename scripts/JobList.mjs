import { fetchJobs, fetchEmoji } from "./api.mjs";

export class JobList {
  constructor() {
    this.allJobs = [];
    this.filteredJobs = [];
    this.favorites = JSON.parse(localStorage.getItem("ai-favorites")) || [];
    
    this.container = document.getElementById("jobs-container");
    this.statusMessage = document.getElementById("status-message");
    this.resultsCount = document.getElementById("results-count");
    
    this.searchInput = document.getElementById("search-input");
    this.searchForm = document.getElementById("search-form");
    this.levelFilter = document.getElementById("level-filter");
    this.remoteFilter = document.getElementById("remote-filter");
    this.clearBtn = document.getElementById("clear-filters");
    
    this.modal = document.getElementById("job-modal");
    this.modalBody = document.getElementById("modal-body");
    this.modalClose = document.getElementById("modal-close");
  }

  async init() {
    this.statusMessage.textContent = "Loading AI jobs...";
    this.allJobs = await fetchJobs();
    
    // Asignar un emoji dinámico de EmojiHub a cada empleo
    for (let job of this.allJobs) {
      job.emoji = await fetchEmoji();
    }

    this.filteredJobs = [...this.allJobs];
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.statusMessage.textContent = "";
    this.resultsCount.textContent = `Showing ${this.filteredJobs.length} jobs`;

    if (this.filteredJobs.length === 0) {
      this.container.innerHTML = `<p class="no-results">No AI jobs found matching your criteria.</p>`;
      return;
    }

    this.container.innerHTML = this.filteredJobs.map(job => {
      // Validaciones de datos faltantes para prevenir fallos visuales
      const jobId = job.id || job.title || "unknown-id";
      const jobTitle = job.title || "Untitled Position";
      const jobCompany = job.company || "Confidential Company";
      const jobLevel = job.level || "Mid";
      const jobApplyUrl = job.apply_url || job.url || "#";
      
      const isFav = this.favorites.some(f => (f.id || f.title) === jobId);
      
      return `
        <article class="job-card">
          <div class="job-card-header">
            <span class="job-emoji">${job.emoji || '🤖'}</span>
            <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${jobId}">
              ${isFav ? '❤️' : '🤍'}
            </button>
          </div>
          <h3>${jobTitle}</h3>
          <p class="company"><strong>${jobCompany}</strong></p>
          <div class="tags">
            <span class="tag">${jobLevel}</span>
            <span class="tag">${job.remote ? 'Remote' : 'On-site'}</span>
          </div>
          <div class="job-card-footer">
            <button class="button secondary-button view-details-btn" data-id="${jobTitle}">View Details</button>
            <a href="${jobApplyUrl}" target="_blank" class="button primary-button">Apply Now</a>
          </div>
        </article>
      `;
    }).join("");
  }

  setupEventListeners() {
    // Buscador
    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.applyFilters();
    });

    // Filtros por Nivel y Tipo
    this.levelFilter.addEventListener("change", () => this.applyFilters());
    this.remoteFilter.addEventListener("change", () => this.applyFilters());

    // Botón Limpiar Filtros
    this.clearBtn.addEventListener("click", () => {
      this.searchInput.value = "";
      this.levelFilter.value = "all";
      this.remoteFilter.value = "all";
      this.filteredJobs = [...this.allJobs];
      this.render();
    });

    // Eventos delegados en la cuadrícula (Favoritos y Detalles)
    this.container.addEventListener("click", (e) => {
      if (e.target.classList.contains("fav-btn")) {
        const id = e.target.dataset.id;
        this.toggleFavorite(id);
      } else if (e.target.classList.contains("view-details-btn")) {
        const title = e.target.dataset.id;
        this.showModal(title);
      }
    });

    // Cierre de Modal
    this.modalClose.addEventListener("click", () => this.closeModal());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  applyFilters() {
    const searchTerm = this.searchInput.value.toLowerCase().trim();
    const selectedLevel = this.levelFilter.value;
    const selectedRemote = this.remoteFilter.value;

    this.filteredJobs = this.allJobs.filter(job => {
      const title = job.title || "";
      const company = job.company || "";
      
      const matchesSearch = title.toLowerCase().includes(searchTerm) || 
                            company.toLowerCase().includes(searchTerm);
      
      const matchesLevel = selectedLevel === "all" || job.level === selectedLevel;
      
      let matchesRemote = true;
      if (selectedRemote === "remote") matchesRemote = job.remote === true || job.location?.toLowerCase().includes("remote");
      if (selectedRemote === "onsite") matchesRemote = job.remote === false && !job.location?.toLowerCase().includes("remote");

      return matchesSearch && matchesLevel && matchesRemote;
    });

    this.render();
  }

  toggleFavorite(id) {
    const job = this.allJobs.find(j => (j.id || j.title) === id);
    if (!job) return;

    const index = this.favorites.findIndex(f => (f.id || f.title) === id);
    if (index >= 0) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(job);
    }

    localStorage.setItem("ai-favorites", JSON.stringify(this.favorites));
    this.render();
  }

  showModal(title) {
    const job = this.allJobs.find(j => j.title === title);
    if (!job) return;

    // Validaciones seguras para el Modal
    const jobTitle = job.title || "Untitled Position";
    const jobCompany = job.company || "Confidential Company";
    const jobLocation = job.location || "Location Not Specified";
    const jobLevel = job.level || "N/A";
    const jobApplyUrl = job.apply_url || job.url || "#";

    this.modalBody.innerHTML = `
      <div class="modal-header">
        <span class="modal-emoji">${job.emoji || '🤖'}</span>
        <h2>${jobTitle}</h2>
        <p class="company">${jobCompany} - ${jobLocation}</p>
      </div>
      <hr>
      <div class="modal-details">
        <p><strong>Experience Level:</strong> ${jobLevel}</p>
        <p><strong>Work Type:</strong> ${job.remote ? 'Remote' : 'On-site'}</p>
      </div>
      <div class="modal-footer">
        <a href="${jobApplyUrl}" target="_blank" class="button primary-button">Apply Directly</a>
      </div>
    `;

    this.modal.classList.remove("hidden");
    this.modal.setAttribute("aria-hidden", "false");
  }

  closeModal() {
    this.modal.classList.add("hidden");
    this.modal.setAttribute("aria-hidden", "true");
  }
}