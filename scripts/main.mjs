import { loadHeaderFooter, setupTheme} from "./utils.mjs";
import { JobList } from "./JobList.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  await loadHeaderFooter();
  setupTheme();

  const jobList = new JobList();
  await jobList.init();
});