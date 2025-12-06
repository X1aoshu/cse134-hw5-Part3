class ProjectCard extends HTMLElement {
  static get observedAttributes() {
    return ["title", "timeframe", "desc", "image", "alt", "link", "link-label"];
  }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: inherit;
          color: inherit;
        }

        .card {
          background: var(--card-bg, var(--card, #f7f7f7));
          color: var(--ink, #222);
          border-radius: var(--radius, 12px);
          box-shadow: var(--shadow-soft, 0 4px 16px rgba(0,0,0,.1));
          padding: 1rem 1rem 1.1rem;
          display: grid;
          gap: 0.5rem;
        }

        .header {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .thumb {
          flex: 0 0 72px;
          width: 72px;
          height: 72px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgba(0,0,0,.08);
          background: rgba(0,0,0,.04);
        }

        .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .title-block {
          flex: 1;
          min-width: 0;
        }

        h2 {
          font-size: clamp(18px, 2.4vw, 22px);
          margin: 0;
          line-height: 1.25;
        }

        .timeframe {
          margin: 0.25rem 0 0;
          font-size: 0.9rem;
          color: var(--muted, #555);
        }

        .timeframe span {
          white-space: nowrap;
        }

        .body {
          font-size: 0.95rem;
          color: var(--muted, #555);
        }

        .body p {
          margin: 0;
        }

        .footer {
          margin-top: 0.35rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.3rem;
          font-size: 0.78rem;
        }

        .tag {
          padding: 0.12rem 0.5rem;
          border-radius: 999px;
          background: color-mix(in oklab,
            var(--primary, #7fd3d4) 20%,
            transparent
          );
          border: 1px solid color-mix(in oklab,
            var(--primary, #7fd3d4) 45%,
            #000 5%
          );
        }

        a.more {
          margin-left: auto;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--accent, #f2442e);
          display: inline-flex;
          align-items: center;
          gap: 0.2rem;
        }

        a.more::after {
          content: "↗";
          font-size: 0.85em;
        }

        a.more:hover,
        a.more:focus-visible {
          text-decoration: underline;
        }

        @media (max-width: 600px) {
          .header {
            align-items: center;
          }
        }
      </style>

      <article class="card">
        <div class="header">
            <figure class="thumb" part="thumbnail" hidden>
                <picture>
                <img part="thumbnail-image">
                </picture>
            </figure>

          <div class="title-block">
            <h2 part="title"></h2>
            <p class="timeframe" part="timeframe"></p>
          </div>
        </div>

        <div class="body">
          <p part="description"></p>
        </div>

        <div class="footer">
          <div class="tags" part="tags"></div>
          <a class="more" part="link" href="#" target="_blank" rel="noopener" hidden></a>
        </div>
      </article>
    `;
  }

  connectedCallback() {
    this._upgradeProperty("title");
    this._upgradeProperty("timeframe");
    this._upgradeProperty("desc");
    this._upgradeProperty("image");
    this._upgradeProperty("alt");
    this._upgradeProperty("link");
    this._upgradeProperty("link-label");

    this._render();
  }

  _upgradeProperty(prop) {
    if (Object.prototype.hasOwnProperty.call(this, prop)) {
      const value = this[prop];
      delete this[prop];
      this.setAttribute(prop, value);
    }
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    const root = this.shadowRoot;
    if (!root) return;

    const titleEl     = root.querySelector("[part=title]");
    const timeframeEl = root.querySelector("[part=timeframe]");
    const descEl      = root.querySelector("[part=description]");
    const thumbFigure = root.querySelector(".thumb");
    const imgEl       = root.querySelector(".thumb img");
    const linkEl      = root.querySelector(".more");
    const tagsRoot    = root.querySelector(".tags");

    const title     = this.getAttribute("title")     || "";
    const timeframe = this.getAttribute("timeframe") || "";
    const desc      = this.getAttribute("desc")      || "";
    const image     = this.getAttribute("image");
    const alt       = this.getAttribute("alt") || title || "";
    const link      = this.getAttribute("link");
    const linkLabel = this.getAttribute("link-label") || "View details";
    const techTags  = this.getAttribute("tags"); 

    if (titleEl)     titleEl.textContent     = title;
    if (timeframeEl) timeframeEl.textContent = timeframe;
    if (descEl)      descEl.textContent      = desc;

    if (image && imgEl && thumbFigure) {
      imgEl.src = image;
      imgEl.alt = alt;
      thumbFigure.hidden = false;
    } else if (thumbFigure) {
      thumbFigure.hidden = true;
    }

    if (link && linkEl) {
      linkEl.href = link;
      linkEl.textContent = linkLabel;
      linkEl.hidden = false;
    } else if (linkEl) {
      linkEl.hidden = true;
    }

    if (tagsRoot) {
      tagsRoot.innerHTML = "";
      if (techTags) {
        techTags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean)
          .forEach(tagText => {
            const span = document.createElement("span");
            span.className = "tag";
            span.textContent = tagText;
            tagsRoot.appendChild(span);
          });
      }
    }
  }
}

customElements.define("project-card", ProjectCard);
