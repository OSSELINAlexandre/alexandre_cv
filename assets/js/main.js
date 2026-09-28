(() => {
  "use strict";

  const GREETING = "Bonjour chérie";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ── Year ── */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Letter stagger / typing ── */
  const lettersEl = document.getElementById("heroLetters");
  const cursorEl = document.querySelector(".hero__cursor");

  function renderGreeting() {
    if (!lettersEl) return;

    if (reduceMotion) {
      lettersEl.innerHTML = [...GREETING]
        .map((ch) => {
          if (ch === " ") return '<span class="hero__letter hero__letter--space">&nbsp;</span>';
          return `<span class="hero__letter is-glow">${ch}</span>`;
        })
        .join("");
      return;
    }

    lettersEl.innerHTML = "";
    if (cursorEl) cursorEl.classList.add("is-on");

    [...GREETING].forEach((ch, i) => {
      const span = document.createElement("span");
      span.className = "hero__letter" + (ch === " " ? " hero__letter--space" : "");
      span.textContent = ch === " " ? "\u00a0" : ch;
      span.style.setProperty("--d", String(80 + i * 70));
      if (i >= 8) span.classList.add("is-glow"); // "chérie"
      lettersEl.appendChild(span);
    });

    const total = 80 + GREETING.length * 70 + 700;
    setTimeout(() => {
      if (cursorEl) cursorEl.classList.remove("is-on");
    }, total + 1200);
  }

  renderGreeting();

  /* ── Cursor glow ── */
  const glow = document.querySelector(".cursor-glow");
  if (glow && !reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    let mx = 0;
    let my = 0;
    let gx = 0;
    let gy = 0;
    let raf = 0;

    document.addEventListener("pointermove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      document.body.classList.add("is-pointer");
      if (!raf) raf = requestAnimationFrame(tick);
    });

    document.addEventListener("pointerleave", () => {
      document.body.classList.remove("is-pointer");
    });

    function tick() {
      gx += (mx - gx) * 0.12;
      gy += (my - gy) * 0.12;
      glow.style.left = gx + "px";
      glow.style.top = gy + "px";
      if (Math.abs(mx - gx) > 0.3 || Math.abs(my - gy) > 0.3) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    }
  }

  /* ── Sidebar navigation ── */
  const navItems = [...document.querySelectorAll(".nav-item")];
  const sections = navItems
    .map((item) => document.getElementById(item.dataset.section))
    .filter(Boolean);

  function setActive(id) {
    navItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.section === id);
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      setActive(item.dataset.section);
      closeSidebar();
    });
  });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => io.observe(s));
  }

  /* ── Mobile menu ── */
  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");

  function closeSidebar() {
    document.body.classList.remove("sidebar-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", "false");
  }

  function toggleSidebar() {
    const open = document.body.classList.toggle("sidebar-open");
    if (menuToggle) menuToggle.setAttribute("aria-expanded", String(open));
  }

  if (menuToggle) menuToggle.addEventListener("click", toggleSidebar);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeSidebar();
  });

  document.getElementById("main")?.addEventListener("click", () => {
    if (document.body.classList.contains("sidebar-open")) closeSidebar();
  });

  /* ── Scroll reveals ── */
  const reveals = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    reveals.forEach((el) => el.classList.add("is-visible"));
  } else if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            ro.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ── Mood demo ── */
  const moods = {
    rose: { cls: "mood-rose", text: "Bonjour chérie — rose tendre, comme un souffle." },
    violet: { cls: "mood-violet", text: "Bonjour chérie — violet nocturne, profond et calme." },
    cyan: { cls: "mood-cyan", text: "Bonjour chérie — cyan électrique, vif et clair." },
    or: { cls: "mood-or", text: "Bonjour chérie — or doux, chaleureux et lumineux." },
  };

  const moodSelect = document.getElementById("moodSelect");
  const moodApply = document.getElementById("moodApply");
  const moodText = document.getElementById("moodText");
  const sparkles = document.getElementById("sparkles");

  function applyMood(key) {
    const mood = moods[key] || moods.rose;
    Object.values(moods).forEach((m) => document.body.classList.remove(m.cls));
    document.body.classList.add(mood.cls);
    if (moodText) {
      moodText.style.opacity = "0";
      moodText.style.transform = "translateY(6px)";
      setTimeout(() => {
        moodText.textContent = mood.text;
        moodText.style.transition = "opacity 0.35s ease, transform 0.35s ease";
        moodText.style.opacity = "1";
        moodText.style.transform = "translateY(0)";
      }, 120);
    }
    spawnSparkles();
  }

  function spawnSparkles() {
    if (!sparkles || reduceMotion) return;
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = "sparkle";
      s.style.left = 10 + Math.random() * 80 + "%";
      s.style.top = 20 + Math.random() * 60 + "%";
      s.style.setProperty("--sx", (Math.random() - 0.5) * 80 + "px");
      s.style.setProperty("--sy", -40 - Math.random() * 60 + "px");
      sparkles.appendChild(s);
      setTimeout(() => s.remove(), 1000);
    }
  }

  if (moodApply) {
    moodApply.addEventListener("click", () => {
      applyMood(moodSelect?.value || "rose");
    });
  }

  document.body.classList.add("mood-rose");

  /* ── Magic orb counter ── */
  const orbBtn = document.getElementById("orbBtn");
  const orbCount = document.getElementById("orbCount");
  let count = 0;

  if (orbBtn && orbCount) {
    orbBtn.addEventListener("click", () => {
      count += 1;
      orbCount.textContent = String(count);
      orbBtn.classList.remove("is-pop");
      void orbBtn.offsetWidth;
      orbBtn.classList.add("is-pop");
      spawnSparkles();
    });
  }
})();
