const PROJECTS_LOCAL_KEY = "sc-projects-local";

const PROJECTS_LOCAL_SEED = [
  {
    id: "cpu",
    title: "Custom 16-bit Pipelined Processor",
    timeframe: "03/2025 – 06/2025 · UC San Diego",
    desc: "Designed a five stage pipelined 16 bit CPU from the ISA up, including datapath, ALU, control logic, hazard detection, and forwarding. Implemented the design in SystemVerilog, wrote directed and random tests, and deployed to an FPGA board to run benchmark programs such as matrix multiply and Fibonacci in hardware.",
    tags: ["SystemVerilog", "FPGA", "CPU design", "Pipelining"],
    image: "PIPLINE.png",
    alt: "Diagram for a custom 16 bit processor project",
    link: "https://github.com/X1aoshu",
    linkLabel: "View related repository"
  },
  {
    id: "mobile-app",
    title: "Mobile App Prototype — Team Lead",
    timeframe: "01/2025 – 03/2025 · UC San Diego",
    desc: "Led a six person team to design and prototype a mobile application from zero, using agile iterations and sprint planning. Applied behaviour driven development and design by contract to keep requirements and tests aligned, and set up CI to automatically run checks on every pull request before merging.",
    tags: ["Team leadership", "Mobile UX", "BDD", "CI/CD"],
    image: "cse.png",
    alt: "UCSD CSE Department LOGO",
    link: "https://example.com/mobile-case-study",
    linkLabel: "Read project summary"
  },
  {
    id: "roundsense",
    title: "RoundSense — Competitive Gaming Insights",
    timeframe: "07/2025 – Present · Founder and Product Lead",
    desc: "Defined RoundSense as a subscription based tactical assistant for competitive gamers starting with Valorant. Researched the ecosystem of existing analytics tools, mapped the gaps between what high level players want and what current tools provide, and scoped an MVP that combines an in game overlay with a Discord bot.",
    tags: ["Product design", "Esports analytics", "Startup"],
    image: "RoundSense.png",
    alt: "LOGO of RoundSense",
    link: "https://example.com/roundsense-overview",
    linkLabel: "See product concept"
  },
  {
    id: "treeverse",
    title: "TreeVerse Technology — HNW Travel Services",
    timeframe: "05/2023 – Present · Founder and Operator",
    desc: "Founded TreeVerse to serve high net worth clients with custom travel planning beyond standard tour packages. Built and managed an eight person team, negotiated long term partnerships with overseas suppliers, and designed internal processes for quoting, risk checking, and on trip support.",
    tags: ["Operations", "Travel industry", "Partnerships", "Risk management"],
    image: "TreeVerse.png",
    alt: "LOGO of TreeVerse",
    link: "https://example.com/treeverse-story",
    linkLabel: "Learn about TreeVerse"
  }
];


const REMOTE_PROJECTS_URL = "https://api.jsonbin.io/v3/b/69327a77d0ea881f40140f45/latest";


function ensureLocalProjectsSeeded() {
  if (!window.localStorage) return;

  const existing = localStorage.getItem(PROJECTS_LOCAL_KEY);
  if (!existing) {
    localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(PROJECTS_LOCAL_SEED));
  }
}


function loadLocalProjects() {
  if (!window.localStorage) return [];

  const raw = localStorage.getItem(PROJECTS_LOCAL_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}


async function loadRemoteProjects() {
  const resp = await fetch(REMOTE_PROJECTS_URL, {
  });

  if (!resp.ok) {
    throw new Error(`Remote fetch failed: ${resp.status}`);
  }

  const data = await resp.json();

  let records = [];

  if (Array.isArray(data.record)) {
    records = data.record;
  } else if (data.record && Array.isArray(data.record.record)) {
    records = data.record.record;
  } else if (Array.isArray(data)) {
    records = data;
  }

  return records;
}


function renderProjects(projects, sourceLabel) {
  const container = document.getElementById("projects-grid");
  const statusEl  = document.getElementById("projects-status");

  if (!container) return;

  container.innerHTML = "";

  if (!projects || projects.length === 0) {
    container.textContent = "No projects to display.";
    if (statusEl) statusEl.textContent = `No projects loaded from ${sourceLabel}.`;
    return;
  }

  projects.forEach((proj) => {
    const card = document.createElement("project-card");

    if (proj.title)      card.setAttribute("title", proj.title);
    if (proj.timeframe)  card.setAttribute("timeframe", proj.timeframe);
    if (proj.desc)       card.setAttribute("desc", proj.desc);

    if (Array.isArray(proj.tags)) {
      card.setAttribute("tags", proj.tags.join(", "));
    } else if (typeof proj.tags === "string") {
      card.setAttribute("tags", proj.tags);
    }

    if (proj.image)      card.setAttribute("image", proj.image);
    if (proj.alt)        card.setAttribute("alt", proj.alt);
    if (proj.link)       card.setAttribute("link", proj.link);
    if (proj.linkLabel)  card.setAttribute("link-label", proj.linkLabel);

    container.appendChild(card);
  });

  if (statusEl) {
    statusEl.textContent = `Loaded ${projects.length} project(s) from ${sourceLabel}.`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureLocalProjectsSeeded();

  const btnLocal  = document.getElementById("btn-load-local");
  const btnRemote = document.getElementById("btn-load-remote");
  const statusEl  = document.getElementById("projects-status");

  if (btnLocal) {
    btnLocal.addEventListener("click", () => {
      const projects = loadLocalProjects();
      renderProjects(projects, "localStorage");
    });
  }

  if (btnRemote) {
    btnRemote.addEventListener("click", async () => {
      if (statusEl) statusEl.textContent = "Loading remote projects…";
      try {
        const projects = await loadRemoteProjects();
        renderProjects(projects, "remote server");
      } catch (err) {
        console.error(err);
        if (statusEl) {
          statusEl.textContent = "Failed to load remote projects. Please try again later.";
        }
      }
    });
  }
});
