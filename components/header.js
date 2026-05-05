/**
 * Header Component
 * letterawords.github.io
 */

const Header = {
  render() {
    const nav = document.getElementById("site-header");
    if (!nav) return;
    nav.innerHTML = `
      <div class="header-inner">
        <a href="/" class="logo" aria-label="Letter A Words Home">
          <span class="logo-letter">A</span>
          <span class="logo-text">LetterAWords</span>
        </a>
        <nav class="main-nav" role="navigation" aria-label="Main navigation">
          <ul>
            <li><a href="#finder">Word Finder</a></li>
            <li><a href="#browse">Browse</a></li>
            <li><a href="#kids">For Kids</a></li>
            <li><a href="#scrabble">Scrabble</a></li>
            <li><a href="#learn">Learn</a></li>
          </ul>
        </nav>
        <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    `;

    // Mobile nav toggle
    const toggle = document.getElementById("navToggle");
    const mainNav = nav.querySelector(".main-nav");
    if (toggle && mainNav) {
      toggle.addEventListener("click", () => {
        const expanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", !expanded);
        mainNav.classList.toggle("open");
        toggle.classList.toggle("active");
      });
    }

    // Scroll behavior
    window.addEventListener("scroll", () => {
      nav.classList.toggle("scrolled", window.scrollY > 40);
    });

    // Smooth scroll on nav links
    nav.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          mainNav.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
          toggle.classList.remove("active");
        }
      });
    });
  }
};
