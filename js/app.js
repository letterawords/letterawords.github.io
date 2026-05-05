/**
 * Letter A Words — Main App
 * letterawords.github.io
 */

/* ── Word Finder App ───────────────────────────────── */
const WordFinder = {
  currentPage: 1,
  pageSize: 24,
  currentWords: [],
  currentFilter: "all",

  init() {
    this.currentWords = WordUtils.getAllWords();
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    const input = document.getElementById("finderSearch");
    const posSelect = document.getElementById("posFilter");

    if (input) {
      input.addEventListener("input", () => {
        this.currentPage = 1;
        this.search(input.value);
      });
    }
    if (posSelect) {
      posSelect.addEventListener("change", () => {
        this.currentPage = 1;
        this.filterByPos(posSelect.value);
      });
    }

    // Length tabs
    document.querySelectorAll(".length-tab").forEach(tab => {
      tab.addEventListener("click", () => {
        document.querySelectorAll(".length-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const len = tab.dataset.len;
        if (len === "all") {
          this.currentWords = WordUtils.getAllWords();
        } else {
          this.currentWords = WordUtils.getByLength(parseInt(len));
        }
        this.currentPage = 1;
        this.renderWords();
      });
    });
  },

  search(query) {
    const posSelect = document.getElementById("posFilter");
    let words = query.trim()
      ? WordUtils.search(query)
      : WordUtils.getAllWords();

    if (posSelect && posSelect.value !== "all") {
      words = words.filter(w => w.partOfSpeech === posSelect.value);
    }
    this.currentWords = words;
    this.renderWords();
  },

  filterByPos(pos) {
    const input = document.getElementById("finderSearch");
    let words = (input && input.value.trim())
      ? WordUtils.search(input.value)
      : WordUtils.getAllWords();

    if (pos !== "all") {
      words = words.filter(w => w.partOfSpeech === pos);
    }
    this.currentWords = words;
    this.renderWords();
  },

  render() {
    this.renderWords();
  },

  renderWords() {
    const grid = document.getElementById("wordsGrid");
    const pager = document.getElementById("pagination");
    if (!grid) return;

    const start = (this.currentPage - 1) * this.pageSize;
    const pageWords = this.currentWords.slice(start, start + this.pageSize);
    const totalPages = Math.ceil(this.currentWords.length / this.pageSize);

    // Count
    const countEl = document.getElementById("resultsCount");
    if (countEl) countEl.textContent = `${this.currentWords.length} word${this.currentWords.length !== 1 ? "s" : ""} found`;

    if (pageWords.length === 0) {
      grid.innerHTML = `
        <div class="no-results">
          <div class="nr-emoji">🔍</div>
          <p>No words found. Try a different search!</p>
        </div>`;
      if (pager) pager.innerHTML = "";
      return;
    }

    grid.innerHTML = pageWords.map((w, i) => `
      <div class="word-card animate-on-scroll animate-delay-${(i % 4) + 1}" tabindex="0" role="article" aria-label="${w.word}: ${w.definition}">
        <div class="wc-word">${this.highlight(w.word)}</div>
        ${w.partOfSpeech ? `<span class="wc-pos">${w.partOfSpeech}</span>` : ""}
        <p class="wc-def">${w.definition}</p>
      </div>
    `).join("");

    // Re-observe
    observeAnimations();

    // Pagination
    if (pager) {
      let pages = "";
      if (totalPages > 1) {
        pages += `<button class="page-btn" onclick="WordFinder.goPage(${this.currentPage - 1})" ${this.currentPage === 1 ? "disabled" : ""}>‹</button>`;
        for (let p = 1; p <= Math.min(totalPages, 7); p++) {
          pages += `<button class="page-btn ${p === this.currentPage ? "active" : ""}" onclick="WordFinder.goPage(${p})">${p}</button>`;
        }
        if (totalPages > 7) pages += `<span style="padding:8px;color:var(--text3)">…</span>`;
        pages += `<button class="page-btn" onclick="WordFinder.goPage(${this.currentPage + 1})" ${this.currentPage === totalPages ? "disabled" : ""}>›</button>`;
      }
      pager.innerHTML = pages;
    }
  },

  highlight(word) {
    const q = (document.getElementById("finderSearch") || {}).value || "";
    if (!q.trim()) return word;
    const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
    return word.replace(re, "<mark>$1</mark>");
  },

  goPage(p) {
    const total = Math.ceil(this.currentWords.length / this.pageSize);
    if (p < 1 || p > total) return;
    this.currentPage = p;
    this.renderWords();
    document.getElementById("finder").scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/* ── Browse by Length ──────────────────────────────── */
const Browse = {
  init() {
    const grid = document.getElementById("browseGrid");
    if (!grid) return;

    const lengths = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    grid.innerHTML = lengths.map(len => {
      const words = WordUtils.getByLength(len);
      return `
        <div class="length-card animate-on-scroll" onclick="Browse.show(${len})" role="button" tabindex="0" aria-label="${len} letter words: ${words.length} words">
          <div class="lc-num">${len}</div>
          <div class="lc-label">letters</div>
          <div class="lc-count">${words.length} words</div>
        </div>`;
    }).join("");
    observeAnimations();
  },

  show(len) {
    const words = WordUtils.getByLength(len);
    const results = document.getElementById("browseResults");
    const heading = document.getElementById("browseResultsHeading");
    if (!results) return;

    document.querySelectorAll(".length-card").forEach(c => c.classList.remove("selected"));
    document.querySelectorAll(".length-card")[len - 2]?.classList.add("selected");

    if (heading) heading.textContent = `${len}-Letter Words Starting with A (${words.length} words)`;

    const grid = results.querySelector(".words-grid");
    if (grid) {
      grid.innerHTML = words.map(w => `
        <div class="word-card">
          <div class="wc-word">${w.word}</div>
          ${w.partOfSpeech ? `<span class="wc-pos">${w.partOfSpeech}</span>` : ""}
          <p class="wc-def">${w.definition}</p>
        </div>`).join("");
    }

    results.classList.add("active");
    results.scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

/* ── Word of the Day ───────────────────────────────── */
const WotD = {
  examples: {
    "adventure": "The children went on an amazing adventure through the forest.",
    "amazing": "The magician performed an amazing trick that left everyone speechless.",
    "authentic": "She has an authentic passion for teaching that inspires her students.",
    "ambitious": "He was ambitious enough to start his own company at twenty.",
    "awesome": "The sunset over the mountains was truly awesome to behold.",
    "abundance": "The garden was filled with an abundance of colorful flowers.",
    "achieve": "Hard work and dedication helped her achieve her dream goal.",
    "articulate": "The speaker was eloquent and articulate in presenting the new ideas.",
  },

  init() {
    const words = [
      ...WORD_DATA.positiveWords,
      ...WordUtils.getByLength(9),
      ...WordUtils.getByLength(8),
    ];
    const idx = Math.floor((Date.now() / 86400000)) % words.length;
    const w = words[idx] || words[0];

    const wotdWord = document.getElementById("wotdWord");
    const wotdPos = document.getElementById("wotdPos");
    const wotdDef = document.getElementById("wotdDefinition");
    const wotdEx = document.getElementById("wotdExample");

    if (wotdWord) wotdWord.textContent = w.word;
    if (wotdPos) wotdPos.textContent = w.partOfSpeech || "word";
    if (wotdDef) wotdDef.textContent = w.definition;
    if (wotdEx) wotdEx.textContent = this.examples[w.word] || `The word "${w.word}" is used to express ${w.definition.toLowerCase()}.`;
  },

  refresh() {
    const btn = document.getElementById("wotdRefresh");
    if (btn) btn.style.transform = "rotate(360deg)";
    const all = [...WORD_DATA.positiveWords, ...WordUtils.getAllWords()];
    const w = all[Math.floor(Math.random() * all.length)];

    document.getElementById("wotdWord").textContent = w.word;
    document.getElementById("wotdPos").textContent = w.partOfSpeech || "word";
    document.getElementById("wotdDefinition").textContent = w.definition;
    document.getElementById("wotdExample").textContent =
      this.examples[w.word] || `The word "${w.word}" is a great example starting with the letter A.`;
    setTimeout(() => { if (btn) btn.style.transform = ""; }, 500);
  }
};

/* ── Kids Section ──────────────────────────────────── */
const Kids = {
  init() {
    const grid = document.getElementById("kidsGrid");
    if (!grid) return;
    grid.innerHTML = WORD_DATA.kidsWords.map((w, i) => `
      <div class="kid-card animate-on-scroll animate-delay-${(i % 4) + 1}" tabindex="0" role="article" aria-label="${w.word}">
        <span class="kid-emoji">${w.emoji}</span>
        <div class="kid-word">${w.word}</div>
        <p class="kid-def">${w.definition}</p>
      </div>
    `).join("");
    observeAnimations();
  }
};

/* ── Positive Words ────────────────────────────────── */
const Positive = {
  init() {
    const grid = document.getElementById("positiveGrid");
    if (!grid) return;
    grid.innerHTML = WORD_DATA.positiveWords.map((w, i) => `
      <div class="positive-card animate-on-scroll animate-delay-${(i % 3) + 1}">
        <div class="pc-dot"></div>
        <div>
          <div class="pc-word">${w.word}</div>
          <div class="pc-def">${w.definition}</div>
        </div>
      </div>
    `).join("");
    observeAnimations();
  }
};

/* ── Action Words ──────────────────────────────────── */
const Action = {
  icons: ["⚡", "🎯", "🚀", "💥", "🔥", "✨", "🌟", "💪", "🎪", "🏆", "🌊", "🦁", "🎨", "🔑", "💡", "🌱", "🌈", "🎵", "🏅", "🌺", "⚙️", "🎭", "🦋", "🔮"],

  init() {
    const grid = document.getElementById("actionGrid");
    if (!grid) return;
    grid.innerHTML = WORD_DATA.actionWords.map((w, i) => `
      <div class="action-card animate-on-scroll">
        <div class="ac-icon">${this.icons[i % this.icons.length]}</div>
        <div>
          <div class="ac-word">${w.word}</div>
          <div class="ac-def">${w.definition}</div>
        </div>
      </div>
    `).join("");
    observeAnimations();
  }
};

/* ── Scrabble Section ──────────────────────────────── */
const Scrabble = {
  init() {
    const grid = document.getElementById("scrabbleGrid");
    if (!grid) return;
    const sorted = [...WORD_DATA.scrabbleWords].sort((a, b) => b.points - a.points);
    grid.innerHTML = sorted.map(w => `
      <div class="scrabble-card animate-on-scroll">
        <div class="sc-word">${w.word}</div>
        <div class="sc-points">${w.points} pts</div>
      </div>
    `).join("");
    observeAnimations();
  }
};

/* ── Quiz ──────────────────────────────────────────── */
const Quiz = {
  questions: [],
  current: 0,
  score: 0,
  answered: false,
  total: 8,

  init() {
    this.generate();
    this.render();
  },

  generate() {
    const all = WordUtils.getAllWords().filter(w => w.definition);
    const shuffled = [...all].sort(() => Math.random() - 0.5);
    this.questions = shuffled.slice(0, this.total).map(w => {
      const others = all.filter(o => o.word !== w.word).sort(() => Math.random() - 0.5).slice(0, 3);
      const opts = [w.definition, ...others.map(o => o.definition)].sort(() => Math.random() - 0.5);
      return { word: w.word, correct: w.definition, options: opts };
    });
    this.current = 0;
    this.score = 0;
    this.answered = false;
  },

  render() {
    const container = document.getElementById("quizContainer");
    if (!container) return;

    if (this.current >= this.questions.length) {
      container.innerHTML = `
        <div class="quiz-card" style="animation: scaleIn 0.5s ease both;">
          <div style="font-size:4rem;margin-bottom:16px;">🎉</div>
          <h3 style="font-size:2rem;font-weight:900;margin-bottom:8px;">Quiz Complete!</h3>
          <p style="color:var(--text2);margin-bottom:24px;">You scored <strong style="color:var(--primary)">${this.score}</strong> out of <strong>${this.total}</strong></p>
          <div style="background:var(--bg2);border-radius:var(--radius);padding:16px;margin-bottom:24px;">
            ${this.score >= 6 ? "🏆 Excellent! You really know your A words!" : this.score >= 4 ? "👍 Good job! Keep practicing!" : "📚 Keep learning! Practice makes perfect."}
          </div>
          <button class="btn-primary" onclick="Quiz.restart()">Try Again ↺</button>
        </div>`;
      return;
    }

    const q = this.questions[this.current];
    const progressPct = (this.current / this.total) * 100;

    container.innerHTML = `
      <div class="quiz-card">
        <div class="quiz-progress"><div class="quiz-progress-bar" style="width:${progressPct}%"></div></div>
        <div class="quiz-score-display" style="margin-bottom:16px;">Question <span>${this.current + 1}</span> of ${this.total} • Score: <span>${this.score}</span></div>
        <div class="quiz-question">What does this word mean?</div>
        <div class="quiz-word">${q.word}</div>
        <div class="quiz-options" id="quizOptions">
          ${q.options.map((opt, i) => `
            <button class="quiz-opt" data-opt="${i}" onclick="Quiz.answer(this, '${opt.replace(/'/g, "\\'")}')">
              ${opt}
            </button>
          `).join("")}
        </div>
      </div>`;
    this.answered = false;
  },

  answer(btn, chosen) {
    if (this.answered) return;
    this.answered = true;
    const q = this.questions[this.current];
    const correct = chosen === q.correct;

    document.querySelectorAll(".quiz-opt").forEach(b => {
      b.disabled = true;
      if (b.textContent.trim() === q.correct) b.classList.add("correct");
    });
    if (!correct) btn.classList.add("wrong");
    else this.score++;

    setTimeout(() => {
      this.current++;
      this.render();
    }, 1200);
  },

  restart() {
    this.generate();
    this.render();
  }
};

/* ── FAQ ───────────────────────────────────────────── */
const FAQ = {
  init() {
    document.querySelectorAll(".faq-question").forEach(btn => {
      btn.addEventListener("click", () => {
        const item = btn.closest(".faq-item");
        const answer = item.querySelector(".faq-answer");
        const isOpen = item.classList.contains("open");

        document.querySelectorAll(".faq-item").forEach(i => {
          i.classList.remove("open");
          i.querySelector(".faq-answer").style.maxHeight = "0";
        });

        if (!isOpen) {
          item.classList.add("open");
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  }
};

/* ── Animate on Scroll ─────────────────────────────── */
function observeAnimations() {
  const els = document.querySelectorAll(".animate-on-scroll:not(.in-view)");
  if ("IntersectionObserver" in window) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); } });
    }, { threshold: 0.1 });
    els.forEach(el => obs.observe(el));
  } else {
    els.forEach(el => el.classList.add("in-view"));
  }
}

/* ── Hero Floaters ─────────────────────────────────── */
function initFloaters() {
  const container = document.querySelector(".hero-floaters");
  if (!container) return;
  const words = ["apple","amazing","awesome","art","adventure","agile","ardent","aerial","authentic","achieve","aspire","aura","anchor","arch","aster"];
  words.forEach((word, i) => {
    const el = document.createElement("div");
    el.className = "floater";
    el.textContent = word;
    el.style.cssText = `
      left: ${Math.random() * 100}%;
      font-size: ${2 + Math.random() * 4}rem;
      animation-duration: ${10 + Math.random() * 12}s;
      animation-delay: ${i * 1.5}s;
      color: rgba(${i % 2 === 0 ? "255,107,53" : "78,205,196"},0.06);
    `;
    container.appendChild(el);
  });
}

/* ── Animated Counters ─────────────────────────────── */
function animateCounters() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + (el.dataset.suffix || "");
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

/* ── Init ──────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  // Render components
  if (typeof Header !== "undefined") Header.render();
  if (typeof Footer !== "undefined") Footer.render();

  // Init sections
  WordFinder.init();
  Browse.init();
  WotD.init();
  Kids.init();
  Positive.init();
  Action.init();
  Scrabble.init();
  Quiz.init();
  FAQ.init();

  // Decorative
  initFloaters();
  observeAnimations();

  // Animate stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animateCounters(); statsObserver.disconnect(); } });
  }, { threshold: 0.5 });
  const heroStats = document.getElementById("heroStats");
  if (heroStats) statsObserver.observe(heroStats);

  // Hero search
  const heroForm = document.getElementById("heroSearchForm");
  if (heroForm) {
    heroForm.addEventListener("submit", e => {
      e.preventDefault();
      const val = document.getElementById("heroSearchInput").value.trim();
      if (!val) return;
      const finderInput = document.getElementById("finderSearch");
      if (finderInput) {
        finderInput.value = val;
        WordFinder.search(val);
      }
      document.getElementById("finder").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }
});
