export function renderWithTemplate(template, parentElement) {
    parentElement.innerHTML = template;
}

export async function loadTemplate(path) {
    const res = await fetch(path);
    return await res.text();
}

export async function loadHeaderFooter() {
    const headerTemplate = await loadTemplate("public/partials/header.html");
    const footerTemplate = await loadTemplate("public/partials/footer.html");

    const headerElement = document.getElementById("main-header");
    const footerElement = document.getElementById("main-footer");

    renderWithTemplate(headerTemplate, headerElement);
    renderWithTemplate(footerTemplate, footerElement);
}

export function setupTheme() {
  const savedTheme = localStorage.getItem("ai-theme") || "light";
  document.documentElement.dataset.theme = savedTheme;

  const button = document.querySelector("#theme-toggle");

  if (!button) return;

  button.textContent = savedTheme === "dark" ? "Light Mode" : "Dark Mode";

  button.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("ai-theme", newTheme);
    button.textContent = newTheme === "dark" ? "Light Mode" : "Dark Mode";
  });
}