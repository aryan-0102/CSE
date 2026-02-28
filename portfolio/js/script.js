const portfolioData = {
  projects: {
    title: "Featured Projects",
    url: "portfolio.local/projects",
    description: "Hands-on projects spanning web apps, automation, and practical software engineering."
  },
  iit: {
    title: "IIT Research Work",
    url: "portfolio.local/iit",
    description: "Research contributions, technical papers, and experimentation developed during IIT collaborations."
  },
  aws: {
    title: "AWS Cloud Practitioner",
    url: "portfolio.local/aws",
    description: "Certified AWS Cloud Practitioner with interest in DevOps and automation."
  },
  devops: {
    title: "DevOps Toolkit",
    url: "portfolio.local/devops",
    description: "CI/CD workflows, infrastructure automation, containerization, and monitoring experience."
  },
  data: {
    title: "Data & Analytics",
    url: "portfolio.local/data",
    description: "Data analysis, dashboards, and machine learning explorations using Python and SQL."
  },
  resume: {
    title: "Resume - Aryan Dhasmana",
    url: "portfolio.local/resume",
    description: "View my complete CV including education, certifications, and experience."
  },
  contact: {
    title: "Contact Information",
    url: "portfolio.local/contact",
    description: "Email, LinkedIn, GitHub and other ways to reach me."
  },
  summary: {
    title: "About Aryan",
    url: "portfolio.local/summary",
    description: "DevOps-focused engineer passionate about cloud, automation, and data systems."
  }
};

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const curiousButton = document.getElementById("curiousButton");
const resultsContainer = document.getElementById("results");
const avatarButton = document.getElementById("avatarButton");
const profilePanel = document.getElementById("profilePanel");
const shortcutLinks = document.querySelectorAll("[data-shortcut]");

const basePlaceholder = "Search portfolio";
let showCursor = true;

function updateBlinkingPlaceholder() {
  searchInput.placeholder = showCursor ? `${basePlaceholder}|` : basePlaceholder;
  showCursor = !showCursor;
}

function getMatchingEntries(query) {
  // Split query into tokens and perform case-insensitive OR matching.
  const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);

  if (!tokens.length) {
    return Object.entries(portfolioData);
  }

  return Object.entries(portfolioData).filter(([key, item]) => {
    const blob = `${key} ${item.title} ${item.description}`.toLowerCase();
    return tokens.some((token) => blob.includes(token));
  });
}

function renderResults(matches) {
  resultsContainer.innerHTML = "";

  if (!matches.length) {
    resultsContainer.innerHTML =
      '<p class="no-results">No results found. Try: projects, aws, devops, data, resume.</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  matches.forEach(([, item]) => {
    const article = document.createElement("article");
    article.className = "result-item";

    const link = document.createElement("a");
    link.className = "result-title";
    link.href = `https://${item.url}`;
    link.textContent = item.title;

    const urlLine = document.createElement("p");
    urlLine.className = "result-url";
    urlLine.textContent = item.url;

    const description = document.createElement("p");
    description.className = "result-description";
    description.textContent = item.description;

    article.append(link, urlLine, description);
    fragment.appendChild(article);
  });

  resultsContainer.appendChild(fragment);
}

function runSearch() {
  const query = searchInput.value.trim();
  renderResults(getMatchingEntries(query));
}

function runShortcut(shortcut) {
  searchInput.value = shortcut;
  renderResults(getMatchingEntries(shortcut));
}

function toggleProfilePanel() {
  profilePanel.classList.toggle("hidden");
}

function closeProfilePanelOnOutsideClick(event) {
  const clickedInsidePanel = profilePanel.contains(event.target);
  const clickedAvatar = avatarButton.contains(event.target);
  if (!clickedInsidePanel && !clickedAvatar) {
    profilePanel.classList.add("hidden");
  }
}

searchButton.addEventListener("click", runSearch);
curiousButton.addEventListener("click", () => {
  const keys = Object.keys(portfolioData);
  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  runShortcut(randomKey);
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    runSearch();
  }
});

shortcutLinks.forEach((element) => {
  element.addEventListener("click", () => {
    const shortcut = element.dataset.shortcut;
    runShortcut(shortcut);
  });
});

avatarButton.addEventListener("click", toggleProfilePanel);
document.addEventListener("click", closeProfilePanelOnOutsideClick);

setInterval(updateBlinkingPlaceholder, 500);
updateBlinkingPlaceholder();
renderResults(getMatchingEntries(""));
