document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.PORTFOLIO_CONFIG || {};

  initName(cfg.person?.name);
  initLinks(cfg);
  initEmail(cfg.contact?.email);
  initTheme();
  initFooterYear();
  initFilters();
  initRevealAnimations();
});

function setHref(id, url, prefix) {
  const el = document.getElementById(id);
  if (!el || !url) return;
  el.href = prefix ? `${prefix}${url}` : url;
}

function initName(fullName) {
  if (!fullName) return;

  const titleSuffix = "SDET | QA Automation Engineer";
  document.title = `${fullName} – ${titleSuffix}`;

  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      `Portfolio of ${fullName} – ${titleSuffix} focused on Python, Selenium, API, and performance testing.`,
    );
  }

  ["brand-name", "hero-title", "footer-name"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = fullName;
    }
  });

  const avatar = document.getElementById("brand-avatar");
  if (avatar && avatar.tagName !== "IMG") {
    avatar.textContent = fullName.charAt(0) || avatar.textContent;
  }
}

function initLinks(cfg) {
  const linkMap = [
    ["link-linkedin-contact", cfg.contact?.linkedin],
    ["link-github", cfg.profiles?.github],
    ["link-repo-pytest-selenium", cfg.repos?.pytestSelenium],
    ["link-repo-python-api-tests", cfg.repos?.pythonApiTests],
    ["link-repo-playwright-python", cfg.repos?.playwrightPython],
    ["link-appstore", cfg.apps?.appStoreUrl],
    ["link-qr", cfg.apps?.qrImage],
    ["link-night-dimmer-appstore", cfg.apps?.nightDimmerAppStoreUrl],
    ["link-night-dimmer-website", cfg.apps?.nightDimmerWebsiteUrl],
    ["link-ad-quiet-website", cfg.apps?.adQuietWebsiteUrl],
    ["link-email", cfg.contact?.email, "mailto:"],
  ];

  linkMap.forEach(([id, url, prefix]) => setHref(id, url, prefix));
}

function initEmail(email) {
  if (!email) return;

  const emailPlain = document.getElementById("email-plain");
  if (emailPlain) {
    emailPlain.textContent = email;
  }

  const copyBtn = document.getElementById("copy-email");
  if (!copyBtn || !navigator.clipboard) return;

  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(email);
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

function initTheme() {
  const STORAGE_KEY = "raman-portfolio-theme";
  const body = document.body;
  const toggleBtn = document.getElementById("theme-toggle");
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)");

  const applyTheme = (theme) => {
    body.classList.toggle("light-theme", theme === "light");
  };

  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const initialTheme =
    savedTheme === "light" || savedTheme === "dark"
      ? savedTheme
      : prefersDark?.matches
        ? "dark"
        : "light";

  applyTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const nextTheme = body.classList.contains("light-theme") ? "dark" : "light";
      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
    });
  }
}

function initFooterYear() {
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

function initFilters() {
  const filterPills = document.querySelectorAll(".filter-pill");
  const projectCards = document.querySelectorAll(".project-card");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (!filterPills.length || !projectCards.length) return;

  const applyFilter = (filter, animate = false) => {
    let visibleIndex = 0;

    projectCards.forEach((card) => {
      const tags = (card.dataset.tags || "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const shouldShow = filter === "all" || tags.includes(filter);
      card.classList.toggle("hidden", !shouldShow);

      if (shouldShow && animate && !reduceMotion && card.animate) {
        card.getAnimations().forEach((animation) => animation.cancel());
        card.animate(
          [
            { opacity: 0, transform: "translateY(10px) scale(0.99)" },
            { opacity: 1, transform: "translateY(0) scale(1)" },
          ],
          {
            duration: 260,
            delay: Math.min(visibleIndex * 35, 175),
            easing: "cubic-bezier(0.2, 0.75, 0.25, 1)",
            fill: "backwards",
          },
        );
        visibleIndex += 1;
      }
    });
  };

  const activatePill = (pill) => {
    filterPills.forEach((node) => {
      const isActive = node === pill;
      node.classList.toggle("active", isActive);
      node.setAttribute("aria-pressed", String(isActive));
    });
  };

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const filter = pill.dataset.filter || "all";
      activatePill(pill);
      applyFilter(filter, true);
    });
  });

  const defaultActive = document.querySelector(".filter-pill.active") || filterPills[0];
  if (defaultActive) {
    activatePill(defaultActive);
    applyFilter(defaultActive.dataset.filter || "all");
  }
}

function initRevealAnimations() {
  const revealItems = document.querySelectorAll(
    ".hero, .tech-strip, #about, #projects, #skills, #contact",
  );
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  if (!revealItems.length) return;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  revealItems.forEach((item) => item.classList.add("reveal-item"));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -6%",
    },
  );

  revealItems.forEach((item) => observer.observe(item));
}
