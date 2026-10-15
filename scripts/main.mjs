import { loadHeaderFooter, setupTheme} from "./utils.mjs";
import { JobList } from "./JobList.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupTheme();

  const jobList = new JobList();
  await jobList.init();

  const currentYearSpan = document.getElementById('currentyear');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  const lastModifiedSpan = document.getElementById('lastModified');
  if (lastModifiedSpan) {
    lastModifiedSpan.textContent = document.lastModified;
  }
});

