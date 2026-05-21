"use strict";

const STORAGE_KEY = "kim-reuben-tabanda-portfolio-content-v2";
const SESSION_KEY = "kim-reuben-tabanda-portfolio-admin";
const ADMIN_PASSCODE = "change-me-2026";
const SUPABASE_CONFIG = {
  url: "https://ufcchadmnsgzmpzrvjpd.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVmY2NoYWRtbnNnem1wenJ2anBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMjIyOTYsImV4cCI6MjA5NDg5ODI5Nn0.uWP2eq1gaoGDzsQNzdwWuJEWLZaBv-w8LskdB7jTsTY",
  table: "portfolio_content",
  rowId: "public",
};

const defaultContent = {
  name: "Kim Reuben Tabanda",
  username: "@kimreuben",
  logoImage: "",
  title: "Programmer building web, mobile, and database-backed applications",
  headline:
    "Entry-level programmer focused on practical applications, clean interfaces, and reliable data-driven workflows.",
  about:
    "I build web and mobile projects using Python, HTML, CSS, JavaScript, TypeScript, React, PHP, and Supabase. My recent work is PawMap Mobile, a rescue app designed to help submit reports, organize rescue information, and monitor case progress. I am looking for a programmer or junior developer role where I can contribute to real products, learn from production code, and keep improving my engineering fundamentals.",
  location: "Philippines",
  availability: "Open to programmer roles",
  email: "k.tabanda29@gmail.com",
  github: "https://github.com/krstabanda15",
  linkedin: "https://www.linkedin.com/in/kim-reuben-tabanda-90872640b/",
  stats: [
    { label: "Recent project", value: "PawMap Mobile" },
    { label: "Frontend", value: "React" },
    { label: "Backend/data", value: "Supabase" },
    { label: "Main languages", value: "Python + JS" },
  ],
  skills: [
    "Python",
    "HTML",
    "CSS",
    "JavaScript",
    "TypeScript",
    "React",
    "PHP",
    "Supabase",
    "Mobile UI",
    "REST APIs",
    "Database Design",
    "Git",
  ],
  projects: [
    {
      name: "PawMap Mobile Rescue App",
      type: "Mobile App",
      description:
        "A mobile rescue app for submitting reports, monitoring case status, and helping organize information for rescue workflows.",
      tech: ["React Native", "Expo", "TypeScript", "Supabase"],
      status: "Recent project",
      link: "https://pawmapph.vercel.app",
    },
    {
      name: "Editable Programmer Portfolio",
      type: "Website",
      description:
        "A resume-style portfolio with a private admin editor for updating profile, projects, skills, and experience without editing the HTML directly.",
      tech: ["HTML", "CSS", "JavaScript"],
      status: "Current website",
      link: "https://kimreubentabanda.vercel.app",
    },
    {
      name: "KRST Mobile Website",
      type: "Mobile Website",
      description:
        "A recent mobile-friendly website project focused on responsive layouts, clean presentation, and accessible web delivery.",
      tech: ["HTML", "CSS", "JavaScript", "Vercel"],
      status: "Recent project",
      link: "https://krst.vercel.app",
    },
  ],
  experience: [
    {
      role: "Programmer / Project Developer",
      period: "Recent",
      description:
        "Built PawMap Mobile rescue app features across screens, routing, data handling, and user-facing workflows.",
    },
    {
      role: "Web and Software Development Practice",
      period: "Ongoing",
      description:
        "Building practice and portfolio projects with Python, PHP, React, TypeScript, JavaScript, HTML, CSS, and Supabase.",
    },
  ],
  education: [
    {
      role: "Bachelor of Science in Information Technology",
      period: "Graduate",
      description:
        "University of Negros Occidental - Recoletos. Focused on web development, application programming, databases, and project implementation.",
    },
  ],
};

let content = loadContent();
let supabaseClient = null;
let pendingLogoImage = null;

function normalizeContent(rawContent) {
  return {
    ...structuredClone(defaultContent),
    ...rawContent,
    stats: Array.isArray(rawContent?.stats) ? rawContent.stats : defaultContent.stats,
    skills: Array.isArray(rawContent?.skills) ? rawContent.skills : defaultContent.skills,
    projects: Array.isArray(rawContent?.projects) ? rawContent.projects : defaultContent.projects,
    experience: Array.isArray(rawContent?.experience) ? rawContent.experience : defaultContent.experience,
    education: Array.isArray(rawContent?.education) ? rawContent.education : defaultContent.education,
  };
}

function initSupabase() {
  if (!SUPABASE_CONFIG.url || !SUPABASE_CONFIG.anonKey || !window.supabase) {
    return null;
  }

  return window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
}

async function loadRemoteContent() {
  if (!supabaseClient) return;

  const { data, error } = await supabaseClient
    .from(SUPABASE_CONFIG.table)
    .select("content")
    .eq("id", SUPABASE_CONFIG.rowId)
    .single();

  console.log("LOAD DATA:", data);
  console.log("LOAD ERROR:", error);

  if (!error && data?.content) {
    content = normalizeContent(data.content);

    console.log("FINAL CONTENT:", content);

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(content)
    );

    renderPublicView();
  }
}

function loadContent() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return normalizeContent({});

  try {
    return normalizeContent(JSON.parse(saved));
  } catch {
    return normalizeContent({});
  }
}

async function saveContent(nextContent) {
  content = nextContent;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));

  if (supabaseClient) {
    const { data: sessionData } = await supabaseClient.auth.getSession();
    console.log("SUPABASE SESSION:", sessionData.session);

    const { data, error } = await supabaseClient
      .from(SUPABASE_CONFIG.table)
      .upsert(
        {
          id: SUPABASE_CONFIG.rowId,
          content,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      )
      .select();

    console.log("SUPABASE SAVE DATA:", data);
    console.log("SUPABASE SAVE ERROR:", error);

    if (error) throw error;
  }

  renderPublicView();
}

function text(value) {
  return value || "";
}

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = text(value);
  });
}

function setLinks() {
  document.querySelectorAll("[data-link='email']").forEach((link) => {
    link.href = content.email ? `mailto:${content.email}` : "#contact";
    if (!link.textContent.trim() || link.dataset.bind === "email") {
      link.textContent = content.email || "Email";
    }
  });

  document.querySelectorAll("[data-link='github']").forEach((link) => {
    link.href = content.github || "#";
  });

  document.querySelectorAll("[data-link='linkedin']").forEach((link) => {
    link.href = content.linkedin || "#";
  });
}

function renderPublicView() {
  document.querySelectorAll("[data-bind]").forEach((node) => {
    const key = node.dataset.bind;
    node.textContent = text(content[key]);
  });

  renderLogo();
  setLinks();
  renderStats();
  renderProjects();
  renderSkills();
  renderTimeline("experience-list", content.experience);
  renderTimeline("education-list", content.education);
}

function renderLogo() {
  document.querySelectorAll("[data-logo-mark]").forEach((node) => {
    node.textContent = "";

    if (content.logoImage) {
      const image = document.createElement("img");
      image.src = content.logoImage;
      image.alt = "Kim Reuben Tabanda logo";
      node.appendChild(image);
      return;
    }

    node.textContent = "KR";
  });
}

function renderLogoPreview(value = content.logoImage) {
  const preview = document.getElementById("logo-preview");
  if (!preview) return;

  preview.textContent = "";

  if (value) {
    const image = document.createElement("img");
    image.src = value;
    image.alt = "Logo preview";
    preview.appendChild(image);
    return;
  }

  preview.textContent = "KR";
}

function renderStats() {
  const list = document.getElementById("stats");
  list.innerHTML = content.stats
    .map(
      (item) => `
        <div class="col-6 col-lg-3">
          <div class="stat reveal-up">
            <strong>${escapeHtml(item.value)}</strong>
            <span>${escapeHtml(item.label)}</span>
          </div>
        </div>
      `,
    )
    .join("");
}

function renderProjects() {
  const list = document.getElementById("projects-list");
  list.innerHTML = content.projects
    .map(
      (project) => `
        <div class="col-md-6">
          <article class="project-card reveal-up">
            <header>
              <div>
                <h3>${escapeHtml(project.name)}</h3>
                <p>${escapeHtml(project.status)}</p>
              </div>
              <span class="repo-type">${escapeHtml(project.type)}</span>
            </header>
            <p>${escapeHtml(project.description)}</p>
            <div class="tech-row">
              ${(project.tech || []).map((item) => `<span class="tag">${escapeHtml(item)}</span>`).join("")}
            </div>
            <div class="project-footer">
              <span>Featured build</span>
              ${project.link ? `<a href="${escapeAttribute(project.link)}" target="_blank" rel="noreferrer">View project</a>` : ""}
            </div>
          </article>
        </div>
      `,
    )
    .join("");
}

function renderSkills() {
  const list = document.getElementById("skills-list");
  list.innerHTML = content.skills.map((skill) => `<span class="skill">${escapeHtml(skill)}</span>`).join("");
}

function renderTimeline(id, items) {
  const list = document.getElementById(id);
  list.innerHTML = items
    .map(
      (item) => `
        <article class="timeline-item">
          <h3>${escapeHtml(item.role)}</h3>
          <time>${escapeHtml(item.period)}</time>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `,
    )
    .join("");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

function route() {
  const isAdmin = window.location.hash === "#admin";
  document.getElementById("public-view").hidden = isAdmin;
  document.getElementById("admin-view").hidden = !isAdmin;

  if (isAdmin) {
    syncAdminState();
  }
}

function syncBackToTop() {
  const button = document.querySelector(".back-to-top");
  if (!button) return;

  button.classList.toggle("is-visible", window.scrollY > 520);
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) === "true";
}

function syncAdminState() {
  const unlocked = isLoggedIn();
  document.getElementById("login-form").hidden = unlocked;
  document.getElementById("editor-form").hidden = !unlocked;

  if (unlocked) {
    fillEditor();
  }
}

function fillEditor() {
  const form = document.getElementById("editor-form");
  pendingLogoImage = null;
  const fields = [
    "name",
    "username",
    "title",
    "headline",
    "about",
    "location",
    "availability",
    "email",
    "github",
    "linkedin",
  ];

  fields.forEach((field) => {
    form.elements[field].value = content[field] || "";
  });

  form.elements.stats.value = content.stats.map((item) => `${item.label} | ${item.value}`).join("\n");
  form.elements.skills.value = content.skills.join(", ");
  form.elements.projects.value = content.projects.map(formatProject).join("\n\n");
  form.elements.projectLinks.value = content.projects
    .filter((project) => project.link)
    .map((project) => `${project.name} | ${project.link}`)
    .join("\n");
  form.elements.experience.value = content.experience
    .map((item) => `${item.role} | ${item.period} | ${item.description}`)
    .join("\n");
  form.elements.education.value = content.education
    .map((item) => `${item.role} | ${item.period} | ${item.description}`)
    .join("\n");
  form.elements.logoUpload.value = "";
  renderLogoPreview();
}

function resizeLogoImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.addEventListener("error", () => reject(new Error("Could not read logo file.")));
    reader.addEventListener("load", () => {
      if (file.type === "image/svg+xml") {
        resolve(reader.result);
        return;
      }

      const image = new Image();
      image.addEventListener("error", () => reject(new Error("Could not load logo image.")));
      image.addEventListener("load", () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const sourceSize = Math.min(image.width, image.height);
        const sourceX = (image.width - sourceSize) / 2;
        const sourceY = (image.height - sourceSize) / 2;

        canvas.width = size;
        canvas.height = size;
        context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
        resolve(canvas.toDataURL("image/webp", 0.86));
      });
      image.src = reader.result;
    });

    reader.readAsDataURL(file);
  });
}

function formatProject(project) {
  return [
    project.name,
    project.type,
    project.status,
    project.description,
    (project.tech || []).join(", "),
    project.link || "",
  ].join(" | ");
}

function parseStats(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label = "", valueText = ""] = line.split("|").map((part) => part.trim());
      return { label, value: valueText };
    });
}

function parseSkills(value) {
  return value
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
}

function parseProjects(value) {
  return value
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const [name = "", type = "", status = "", description = "", tech = "", link = ""] = block
        .split("|")
        .map((part) => part.trim());

      return {
        name,
        type,
        status,
        description,
        tech: parseSkills(tech),
        link,
      };
    });
}

function parseProjectLinks(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name = "", link = ""] = line.split("|").map((part) => part.trim());
      return { name, link };
    })
    .filter((item) => item.name && item.link);
}

function applyProjectLinks(projects, projectLinks) {
  return projects.map((project) => {
    const matchingLink = projectLinks.find(
      (item) => item.name.toLowerCase() === project.name.toLowerCase(),
    );

    if (!matchingLink) return project;

    return {
      ...project,
      link: matchingLink.link,
    };
  });
}

function parseTimeline(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [role = "", period = "", description = ""] = line.split("|").map((part) => part.trim());
      return { role, period, description };
    });
}

document.getElementById("login-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("admin-email");
  const input = document.getElementById("admin-password");

  if (supabaseClient) {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email: email.value.trim(),
      password: input.value,
    });

    if (!error) {
      sessionStorage.setItem(SESSION_KEY, "true");
      input.value = "";
      syncAdminState();
      return;
    }

    input.setCustomValidity(error.message);
    input.reportValidity();
    input.setCustomValidity("");
    return;
  }

  if (input.value === ADMIN_PASSCODE) {
    sessionStorage.setItem(SESSION_KEY, "true");
    input.value = "";
    syncAdminState();
    return;
  }

  input.setCustomValidity("Incorrect passcode");
  input.reportValidity();
  input.setCustomValidity("");
});

document.getElementById("editor-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const projects = applyProjectLinks(
    parseProjects(form.elements.projects.value),
    parseProjectLinks(form.elements.projectLinks.value),
  );
  const nextContent = {
    ...content,
    name: form.elements.name.value.trim(),
    username: form.elements.username.value.trim(),
    title: form.elements.title.value.trim(),
    headline: form.elements.headline.value.trim(),
    about: form.elements.about.value.trim(),
    location: form.elements.location.value.trim(),
    availability: form.elements.availability.value.trim(),
    email: form.elements.email.value.trim(),
    github: form.elements.github.value.trim(),
    linkedin: form.elements.linkedin.value.trim(),
    logoImage: pendingLogoImage === null ? content.logoImage : pendingLogoImage,
    stats: parseStats(form.elements.stats.value),
    skills: parseSkills(form.elements.skills.value),
    projects,
    experience: parseTimeline(form.elements.experience.value),
    education: parseTimeline(form.elements.education.value),
  };

  const status = document.getElementById("save-status");
  status.textContent = "Saving...";

  try {
    await saveContent(nextContent);
    status.textContent = supabaseClient
      ? "Saved to Supabase. Public visitors will see the updates."
      : "Saved locally. Open Public view to see the updates on this browser.";
  } catch (error) {
    status.textContent = `Saved locally, but remote save failed: ${error.message}`;
  }
});

document.getElementById("editor-form").elements.logoUpload.addEventListener("change", async (event) => {
  const [file] = event.currentTarget.files;
  const status = document.getElementById("save-status");

  if (!file) return;

  try {
    pendingLogoImage = await resizeLogoImage(file);
    renderLogoPreview(pendingLogoImage);
    status.textContent = "Logo ready. Click Save changes to publish it.";
  } catch (error) {
    status.textContent = error.message;
  }
});

document.getElementById("remove-logo-button").addEventListener("click", () => {
  pendingLogoImage = "";
  document.getElementById("editor-form").elements.logoUpload.value = "";
  renderLogoPreview("");
  document.getElementById("save-status").textContent = "Text logo ready. Click Save changes to publish it.";
});

document.getElementById("logout-button").addEventListener("click", async () => {
  if (supabaseClient) {
    await supabaseClient.auth.signOut();
  }

  sessionStorage.removeItem(SESSION_KEY);
  syncAdminState();
});

document.getElementById("reset-button").addEventListener("click", async () => {
  await saveContent(structuredClone(defaultContent));
  fillEditor();
  document.getElementById("save-status").textContent = "Default content restored.";
});

window.addEventListener("hashchange", route);
window.addEventListener("scroll", syncBackToTop, { passive: true });
document.getElementById("footer-year").textContent = new Date().getFullYear();
supabaseClient = initSupabase();
if (supabaseClient) {
  document.getElementById("login-hint").textContent = "Sign in with your admin email and password.";
  loadRemoteContent();
}
renderPublicView();
route();
syncBackToTop();
