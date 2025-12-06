const RESUME_LOCAL_KEY = "sc-resume-local";

const RESUME_LOCAL_SEED = {
  education: [
    {
      school: "University of California, San Diego",
      degree: "B.S. in Computer Engineering",
      period: "09/2023 – 12/2025"
    },
    {
      school: "University of California, Santa Barbara",
      degree: "B.S. in Electrical Engineering",
      period: "09/2021 – 09/2023"
    }
  ],
  entrepreneurial: [
    {
      title: "Founder & CEO — RoundSense (Preparation & Planning)",
      summary:
        "Subscription-based AI tactical insights for competitive gamers · 07/2025 – Present",
      bullets: [
        "Led a 3-member team on product design and business research; analyzed 5 analytics platforms (e.g., Leetify, Blitz) to identify unmet needs.",
        "Defined MVP (Valorant in-game tips overlay + Discord bot) and product roadmap (training suite, multi-game expansion).",
        "Built TAM/SAM and financial models; projected first-year revenue ~$591K and net income ~$173K; prepared investor deck."
      ]
    },
    {
      title: "Founder & CEO — TreeVerse Technology (China)",
      summary: "Custom travel services for HNW clients · 05/2023 – Present",
      bullets: [
        "Built an 8-person team; negotiated 14 key supplier partnerships with up to 45% below market rates.",
        "Served 2,000+ HNW clients across US/EU; achieved ~4M RMB revenue in 2024 with ~300% YoY growth.",
        "Developed plans for AI-based risk management (e.g., weather/regulatory IRROPs) and a CRM to improve retention."
      ]
    }
  ],
  internship: [
    {
      title: "MRI Engineering Intern — GE Medical Systems (Hangzhou, China)",
      period: "07/2025 – 09/2025",
      bullets: [
        "Assisted installation of 3 MRI systems; ensured correct component configuration and smooth integration.",
        "Monitored 40+ hours of real-time data; optimized parameters to reduce downtime by ~10% and improve stability."
      ]
    },
    {
      title:
        "Supply Chain Project Specialist — Simon International Logistics (Hangzhou, China)",
      period: "12/2024 – 06/2025",
      bullets: [
        "Produced a 3,000-word report on lithium battery export to LA (customs, qualifications), enabling two partnerships with $20B+ market-cap firms.",
        "Engaged 150+ local vendors via calls, email, visits, and fairs; secured 18 partnerships (~12% conversion).",
        "Led 3 interns to redesign the corporate site, increasing traffic ~20% and time-on-page ~35% within two weeks."
      ]
    }
  ],
  projects: [
    {
      title: "Custom 16-bit Pipelined Processor",
      period: "03/2025 – 06/2025 · UC San Diego (Supervisor: John A. Eldon)",
      bullets: [
        "Designed ISA, datapath, ALU, control, and memory interface in SystemVerilog.",
        "Verified via assembly-level simulation and FPGA deployment; executed all benchmarks stably and efficiently."
      ]
    },
    {
      title: "Mobile App Prototype (Team Lead)",
      period: "01/2025 – 03/2025 · UC San Diego (Supervisor: Bill Griswold)",
      bullets: [
        "Drove requirements, sprints, retros; applied BDD and Design-by-Contract.",
        "Guided architecture with OOP & patterns; CI/CD and reviews reduced defects and ensured on-time MVP."
      ]
    }
  ],
  activities: [
    "Head of PR, UCSB CSSA (09/2021 – 06/2023): built 6 sponsor partnerships; raised $10,000+.",
    "Athlete, UCSD Badminton Club (09/2021 – 03/2023): 3rd place, CSSA Badminton Tournament 2022."
  ],
  skills: [
    {
      label: "Programming & Software",
      value: "C, C++, Java, Python, MATLAB, HTML, MS Office"
    },
    {
      label: "Languages",
      value: "Chinese (Native), English (Professional)"
    },
    {
      label: "Interests",
      value:
        "Snowboarding (Black Diamond), Robotics (2015 World Cup Best Designer), Esports, Aviation (IRROPs)"
    }
  ]
};

const RESUME_REMOTE_URL =
  "https://api.jsonbin.io/v3/b/6932d80943b1c97be9d9a12c/latest";

function ensureResumeSeeded() {
  if (!window.localStorage) return;
  const existing = localStorage.getItem(RESUME_LOCAL_KEY);
  if (!existing) {
    localStorage.setItem(RESUME_LOCAL_KEY, JSON.stringify(RESUME_LOCAL_SEED));
  }
}

function loadResumeLocal() {
  if (!window.localStorage) return {};
  const raw = localStorage.getItem(RESUME_LOCAL_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function loadResumeRemote() {
  const resp = await fetch(RESUME_REMOTE_URL, {
  });

  if (!resp.ok) {
    throw new Error(`Remote resume fetch failed: ${resp.status}`);
  }

  const data = await resp.json();

  if (data && typeof data === "object") {
    if (data.record && typeof data.record === "object") {
      if (data.record.record && typeof data.record.record === "object") {
        return data.record.record;
      }
      return data.record;
    }
  }
  return data;
}

function renderEducation(list) {
  const root = document.getElementById("resume-education-list");
  if (!root) return;
  root.innerHTML = "";

  (list || []).forEach((item) => {
    const art = document.createElement("article");

    const h3 = document.createElement("h3");
    h3.textContent = item.school || "";

    const pDegree = document.createElement("p");
    pDegree.textContent = item.degree || "";

    const pPeriod = document.createElement("p");
    pPeriod.textContent = item.period || "";

    art.appendChild(h3);
    art.appendChild(pDegree);
    art.appendChild(pPeriod);

    root.appendChild(art);
  });
}

function renderArticleSection(list, containerId) {
  const root = document.getElementById(containerId);
  if (!root) return;
  root.innerHTML = "";

  (list || []).forEach((item) => {
    const art = document.createElement("article");

    const h3 = document.createElement("h3");
    h3.textContent = item.title || "";
    art.appendChild(h3);

    const p = document.createElement("p");
    p.textContent = item.summary || item.period || "";
    art.appendChild(p);

    const bullets =
      Array.isArray(item.bullets) ? item.bullets : item.bullets ? [item.bullets] : [];

    if (bullets.length > 0) {
      const ul = document.createElement("ul");
      bullets.forEach((b) => {
        const li = document.createElement("li");
        li.textContent = b;
        ul.appendChild(li);
      });
      art.appendChild(ul);
    }

    root.appendChild(art);
  });
}

function renderActivities(list) {
  const root = document.getElementById("resume-activities-list");
  if (!root) return;
  root.innerHTML = "";

  const ul = document.createElement("ul");
  (list || []).forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    ul.appendChild(li);
  });
  root.appendChild(ul);
}

function renderSkills(list) {
  const root = document.getElementById("resume-skills-list");
  if (!root) return;
  root.innerHTML = "";

  const ul = document.createElement("ul");
  (list || []).forEach((item) => {
    const li = document.createElement("li");
    const b = document.createElement("b");
    b.textContent = (item.label || "") + ": ";
    li.appendChild(b);
    li.appendChild(document.createTextNode(item.value || ""));
    ul.appendChild(li);
  });
  root.appendChild(ul);
}

function renderResumeAll(data, sourceLabel) {
  const statusEl = document.getElementById("resume-data-status");

  renderEducation(data.education);
  renderArticleSection(data.entrepreneurial, "resume-entrepreneurial-list");
  renderArticleSection(data.internship, "resume-internship-list");
  renderArticleSection(data.projects, "resume-projects-list");
  renderActivities(data.activities);
  renderSkills(data.skills);

  if (statusEl) {
    statusEl.textContent = `Loaded resume data from ${sourceLabel}.`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  ensureResumeSeeded();

  const btnLocal = document.getElementById("btn-resume-load-local");
  const btnRemote = document.getElementById("btn-resume-load-remote");
  const statusEl = document.getElementById("resume-data-status");

  if (btnLocal) {
    btnLocal.addEventListener("click", () => {
      const data = loadResumeLocal();
      renderResumeAll(data, "localStorage");
    });
  }

  if (btnRemote) {
    btnRemote.addEventListener("click", async () => {
      if (statusEl) statusEl.textContent = "Loading resume data from remote…";
      try {
        const data = await loadResumeRemote();
        renderResumeAll(data, "remote server");
      } catch (err) {
        console.error(err);
        if (statusEl) {
          statusEl.textContent =
            "Failed to load remote resume data. Please check JSONBin URL / key.";
        }
      }
    });
  }
});


