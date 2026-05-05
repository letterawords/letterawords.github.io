/**
 * Footer Component
 * letterawords.github.io
 */

const Footer = {
  render() {
    const footer = document.getElementById("site-footer");
    if (!footer) return;
    const year = new Date().getFullYear();
    footer.innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand">
          <a href="/" class="footer-logo" aria-label="Letter A Words">
            <span class="logo-letter">A</span>
            <span>LetterAWords</span>
          </a>
          <p>Your ultimate guide to words that start with the letter A. Explore thousands of words for learning, games, and creativity.</p>
        </div>

        <div class="footer-links">
          <div class="footer-col">
            <h4>Explore</h4>
            <ul>
              <li><a href="/#finder">Word Finder</a></li>
              <li><a href="/#browse">Browse by Length</a></li>
              <li><a href="/#kids">Kids Words</a></li>
              <li><a href="/#positive">Positive A Words</a></li>
              <li><a href="/#scrabble">Scrabble Helper</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Word Types</h4>
            <ul>
              <li><a href="/#action">Action Words</a></li>
              <li><a href="/#adjectives">Adjectives</a></li>
              <li><a href="/#nouns">Nouns</a></li>
              <li><a href="/#adverbs">Adverbs</a></li>
              <li><a href="/#learn">Word of the Day</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Learn</h4>
            <ul>
              <li><a href="/#learn">About the Letter A</a></li>
              <li><a href="/#tips">Learning Tips</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/#quiz">Word Quiz</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h4>Pages</h4>
            <ul>
              <li><a href="/about">About</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Use</a></li>
              <li><a href="/disclaimer">Disclaimer</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${year} LetterAWords.github.io — Words Starting With A</p>
        <p class="footer-tagline">Discover • Learn • Play with Letter A Words</p>
      </div>
    `;

    // Smooth scroll
    footer.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener("click", e => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute("href"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }
};
