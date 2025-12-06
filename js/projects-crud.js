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

function ensureLocalSeed() {
  if (!window.localStorage) return;
  const existing = localStorage.getItem(PROJECTS_LOCAL_KEY);
  if (!existing) {
    localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(PROJECTS_LOCAL_SEED));
  }
}

function readProjects() {
  if (!window.localStorage) return [];
  const raw = localStorage.getItem(PROJECTS_LOCAL_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeProjects(projects) {
  if (!window.localStorage) return;
  localStorage.setItem(PROJECTS_LOCAL_KEY, JSON.stringify(projects));
}

function findProjectIndexById(projects, id) {
  return projects.findIndex((p) => p.id === id);
}

document.addEventListener("DOMContentLoaded", () => {
  ensureLocalSeed();

  const form = document.getElementById("crudForm");
  if (!form) return;

  const statusEl       = document.getElementById("crud-status");
  const idInput        = document.getElementById("proj-id");
  const titleInput     = document.getElementById("proj-title");
  const timeframeInput = document.getElementById("proj-timeframe");
  const descInput      = document.getElementById("proj-desc");
  const tagsInput      = document.getElementById("proj-tags");
  const imageInput     = document.getElementById("proj-image");
  const altInput       = document.getElementById("proj-alt");
  const linkInput      = document.getElementById("proj-link");
  const linkLabelInput = document.getElementById("proj-linkLabel");

  const btnLoad    = document.getElementById("btn-load-existing");
  const btnCreate  = document.getElementById("btn-create");
  const btnUpdate  = document.getElementById("btn-update");
  const btnDelete  = document.getElementById("btn-delete");

  function setStatus(message, isError = false) {
    if (!statusEl) return;
    statusEl.textContent = message;
    statusEl.classList.toggle("error", Boolean(isError));
  }

  function getFormData() {
    const id = idInput.value.trim();
    return {
      id,
      title: titleInput.value.trim(),
      timeframe: timeframeInput.value.trim(),
      desc: descInput.value.trim(),
      tags: tagsInput.value
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      image: imageInput.value.trim(),
      alt: altInput.value.trim(),
      link: linkInput.value.trim(),
      linkLabel: linkLabelInput.value.trim()
    };
  }

  function fillForm(project) {
    if (!project) return;
    idInput.value        = project.id || "";
    titleInput.value     = project.title || "";
    timeframeInput.value = project.timeframe || "";
    descInput.value      = project.desc || "";
    tagsInput.value      = Array.isArray(project.tags)
      ? project.tags.join(", ")
      : (project.tags || "");
    imageInput.value     = project.image || "";
    altInput.value       = project.alt || "";
    linkInput.value      = project.link || "";
    linkLabelInput.value = project.linkLabel || "";
  }

  btnLoad.addEventListener("click", () => {
    const id = idInput.value.trim();
    if (!id) {
      setStatus("Please enter an ID to load.", true);
      idInput.focus();
      return;
    }

    const projects = readProjects();
    const idx = findProjectIndexById(projects, id);

    if (idx === -1) {
      setStatus(`No project found with id "${id}".`, true);
      return;
    }

    fillForm(projects[idx]);
    setStatus(`Loaded project "${id}" into the form.`);
  });

  btnCreate.addEventListener("click", () => {
    const data = getFormData();
    if (!data.id) {
      setStatus("ID is required to create a project.", true);
      idInput.focus();
      return;
    }

    const projects = readProjects();
    const existingIndex = findProjectIndexById(projects, data.id);

    if (existingIndex !== -1) {
      setStatus(
        `A project with id "${data.id}" already exists. Use Update instead.`,
        true
      );
      return;
    }

    projects.push(data);
    writeProjects(projects);
    setStatus(
      `Created project "${data.id}". Go to Projects page and click "Load Local" to see it.`
    );
  });

  btnUpdate.addEventListener("click", () => {
    const data = getFormData();
    if (!data.id) {
      setStatus("ID is required to update a project.", true);
      idInput.focus();
      return;
    }

    const projects = readProjects();
    const idx = findProjectIndexById(projects, data.id);

    if (idx === -1) {
      setStatus(
        `No project found with id "${data.id}". Use Create if you want a new entry.`,
        true
      );
      return;
    }

    projects[idx] = data;
    writeProjects(projects);
    setStatus(
      `Updated project "${data.id}". Reload local data on the Projects page to see changes.`
    );
  });

  btnDelete.addEventListener("click", () => {
    const id = idInput.value.trim();
    if (!id) {
      setStatus("ID is required to delete a project.", true);
      idInput.focus();
      return;
    }

    const projects = readProjects();
    const idx = findProjectIndexById(projects, id);

    if (idx === -1) {
      setStatus(`No project found with id "${id}".`, true);
      return;
    }

    const updated = projects.filter((p) => p.id !== id);
    writeProjects(updated);
    setStatus(
      `Deleted project "${id}". On the Projects page, click "Load Local" to refresh.`
    );

    titleInput.value = "";
    timeframeInput.value = "";
    descInput.value = "";
    tagsInput.value = "";
    imageInput.value = "";
    altInput.value = "";
    linkInput.value = "";
    linkLabelInput.value = "";
  });
});
