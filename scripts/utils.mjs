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

  if (!button) {
    return;
  }

  if (savedTheme === "dark") {
    button.textContent = "Light Mode";
  } else {
    button.textContent = "Dark Mode";
  }

  button.addEventListener("click", function () {
    const currentTheme = document.documentElement.dataset.theme;
    let newTheme;

    if (currentTheme === "dark") {
      newTheme = "light";
    } else {
      newTheme = "dark";
    }

    document.documentElement.dataset.theme = newTheme;
    localStorage.setItem("ai-theme", newTheme);

    if (newTheme === "dark") {
      button.textContent = "Light Mode";
    } else {
      button.textContent = "Dark Mode";
    }
  });
}