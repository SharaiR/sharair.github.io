document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.PORTFOLIO_CONFIG || {};

  function setHref(id, url, prefix) {
    const el = document.getElementById(id);
    if (!el || !url) return;
    el.href = prefix ? `${prefix}${url}` : url;
  }

  /* LINKS */
  setHref("link-linkedin-contact", cfg.linkedin);
  setHref("link-github", cfg.githubProfile);

  if (cfg.repos) {
    setHref("link-repo-pytest-selenium", cfg.repos.pytestSelenium);
    setHref("link-repo-python-api-tests", cfg.repos.pythonApiTests);
  }

  // App Store and QR
  setHref("link-appstore", cfg.appStoreUrl);
  setHref("link-qr", cfg.qrImage);

  // Email
  if (cfg.email) {
    setHref("link-email", cfg.email, "mailto:");

    // insert the text in plain text (if there is an element)
    const emailPlain = document.getElementById("email-plain");
    if (emailPlain) {
      emailPlain.textContent = cfg.email;
    }
  }

  // Copy email button
  const copyBtn = document.getElementById("copy-email");
  if (copyBtn && cfg.email && navigator.clipboard) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(cfg.email);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = "✅ Copied!";
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 5000);
      } catch (err) {
        console.error("Failed to copy email:", err);
      }
    });
  }


  /* THEME HANDLING */
  const STORAGE_KEY = "raman-portfolio-theme";
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");

  const prefersDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  function applyTheme(theme) {
    if (theme === "light") {
      body.classList.add("light-theme");
    } else {
      body.classList.remove("light-theme");
    }
  }

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
  } else {
    // default: if the system is dark - dark, otherwise light
    applyTheme(prefersDark ? "dark" : "light");
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const currentlyLight = body.classList.contains("light-theme");
      const newTheme = currentlyLight ? "dark" : "light";
      applyTheme(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
    });
  }


  /* YEAR IN FOOTER */
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }


  /* PROJECT FILTERS */
  const filterPills = document.querySelectorAll(".filter-pill");
  const projectCards = document.querySelectorAll(".project-card");

  function applyFilter(filter) {
    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (filter === "all" || tags.includes(filter)) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  }

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.dataset.filter;
      filterPills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
      applyFilter(filter);
    });
  });
});
