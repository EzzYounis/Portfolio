/**
 * EZZALDEEN YOUNIS — PORTFOLIO
 * High-Performance Animation, Interactive Viewports & Telemetry Systems
 */

document.addEventListener("DOMContentLoaded", () => {
  // Ensure GSAP and ScrollTrigger are loaded
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // --- 1. Smooth Scrolling (Lenis) ---
  let lenis = null;
  if (typeof Lenis !== "undefined") {
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof ScrollTrigger !== "undefined") {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0, 0);
    }
  }

  // Smooth scroll to in-page anchors
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        if (document.body.classList.contains('menu-open')) {
          toggleMenu();
        }
        if (lenis) {
          lenis.scrollTo(target, { offset: -60 });
        } else {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // --- 2. Custom Cursor & Magnetic Interactions ---
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor__dot');
  const cursorRing = document.querySelector('.cursor__ring');
  const cursorLabel = document.querySelector('.cursor__label');
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;

  if (cursor && isFinePointer) {
    let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
    let ringX = mouseX, ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.set(cursorDot, { x: mouseX, y: mouseY });
    }, { passive: true });

    gsap.ticker.add(() => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;
      gsap.set(cursorRing, { x: ringX, y: ringY });
    });

    // Hoverable elements cursor styling
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [data-cursor]');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        const label = el.getAttribute('data-cursor');
        if (label) {
          cursorLabel.textContent = label;
          cursor.classList.add('is-label');
        } else {
          cursor.classList.add('is-hover');
        }
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-hover', 'is-label');
        cursorLabel.textContent = '';
      });
    });

    // Magnetic pull effect
    const magnetics = document.querySelectorAll('[data-magnetic]');
    magnetics.forEach(el => {
      const strength = parseFloat(el.getAttribute('data-magnetic')) || 0.25;
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(el, { x: x * strength, y: y * strength, duration: 0.5, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.35)' });
      });
    });
  }

  // --- 3. Text Splitting Utility ---
  function splitText(selector, type = 'words') {
    document.querySelectorAll(selector).forEach(el => {
      const text = el.innerText.trim();
      if (!text) return;

      if (type === 'chars') {
        el.innerHTML = text.split('').map(c => c === ' ' ? '&nbsp;' : `<span class="char-mask"><span class="char">${c}</span></span>`).join('');
      } else if (type === 'words') {
        el.innerHTML = text.split(/\s+/).map(w => `<span class="word">${w}</span>`).join(' ');
      } else if (type === 'split') {
        el.innerHTML = `<span class="line-mask"><span class="line-inner">${text}</span></span>`;
      }
    });
  }
  
  splitText('[data-chars]', 'chars');
  splitText('[data-reveal-words]', 'words');
  splitText('[data-split]', 'split');

  // --- 4. Preloader & Intro Sequence (Optimized for Fast Recruiter Delivery) ---
  const preloader = document.querySelector('.preloader');
  const preloaderCount = document.querySelector('.preloader__count');
  const preloaderBar = document.querySelector('.preloader__bar span');
  let progress = 0;
  let preloaderFinished = false;

  const introTl = gsap.timeline({ paused: true });
  introTl
    .to('.preloader', { yPercent: -100, duration: 0.65, ease: 'power4.inOut' })
    .fromTo('.nav', { yPercent: -100 }, { yPercent: 0, duration: 0.65, ease: 'power3.out' }, "-=0.2")
    .fromTo('.hero__pre-title', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4 }, "-=0.3")
    .fromTo('.hero__name-text', { opacity: 0, y: 25 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, "-=0.3")
    .fromTo('.hero__role-row', { opacity: 0, x: -15 }, { opacity: 1, x: 0, duration: 0.4 }, "-=0.3")
    .fromTo('.hero__summary', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
    .fromTo('.hero__cta-group', { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3")
    .fromTo('.snapshot-card', { opacity: 0, y: 25, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.2)' }, "-=0.4")
    .fromTo('.hero__bottom-bar', { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");

  function finishPreloader() {
    if (preloaderFinished) return;
    preloaderFinished = true;
    sessionStorage.setItem('portfolio_visited', 'true');
    document.documentElement.classList.remove('is-loading');
    introTl.play();
    startHeroCanvas();
    startMeshCanvas();
  }

  const alreadyVisited = sessionStorage.getItem('portfolio_visited') === 'true';

  if (alreadyVisited) {
    if (preloader) preloader.style.display = 'none';
    finishPreloader();
  } else {
    // Fast initial counter (<200ms)
    const loadInterval = setInterval(() => {
      progress += 25;
      if (progress > 100) progress = 100;
      if (preloaderCount) preloaderCount.textContent = progress.toString().padStart(3, '0');
      if (preloaderBar) gsap.to(preloaderBar, { scaleX: progress / 100, duration: 0.08 });

      if (progress === 100) {
        clearInterval(loadInterval);
        setTimeout(finishPreloader, 100);
      }
    }, 25);

    if (preloader) {
      preloader.addEventListener('click', finishPreloader);
    }
    setTimeout(finishPreloader, 400);
  }

  // --- 5. Mobile Navigation & Header Scroll Behavior ---
  const nav = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const menu = document.querySelector('.menu');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > 40) {
      nav.classList.add('is-scrolled');
    } else {
      nav.classList.remove('is-scrolled');
    }

    if (currentScrollY > lastScrollY && currentScrollY > 250) {
      nav.classList.add('is-hidden');
    } else {
      nav.classList.remove('is-hidden');
    }
    lastScrollY = currentScrollY;
  }, { passive: true });

  let isMenuOpen = false;
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', isMenuOpen);
    menu.setAttribute('aria-hidden', !isMenuOpen);

    if (isMenuOpen) {
      gsap.to(menu, { autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.5, ease: 'power3.inOut' });
      gsap.fromTo('.menu__link .menu__txt', 
        { yPercent: 100 }, 
        { yPercent: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.15 }
      );
    } else {
      gsap.to(menu, { clipPath: 'inset(0 0 100% 0)', duration: 0.5, ease: 'power3.inOut', onComplete: () => {
        gsap.set(menu, { autoAlpha: 0 });
      }});
    }
  }

  if (burger) {
    burger.addEventListener('click', toggleMenu);
  }
  document.querySelectorAll('.menu__link').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMenuOpen) toggleMenu();
  });

  // --- 6. Role Words Carousel (Clean Transition, Zero Overlaying) ---
  const roleWords = document.querySelectorAll('.hero__role-word');
  if (roleWords.length > 1) {
    let currentWordIndex = 0;
    let roleTimer = null;
    let isFlipping = false;

    // Ensure initial state: only first word is visible
    roleWords.forEach((word, idx) => {
      if (idx === 0) {
        word.classList.add('is-active');
        gsap.set(word, { opacity: 1, visibility: 'visible', yPercent: 0, position: 'relative' });
      } else {
        word.classList.remove('is-active');
        gsap.set(word, { opacity: 0, visibility: 'hidden', yPercent: 100, position: 'absolute' });
      }
    });

    function showNextWord() {
      if (isFlipping || document.hidden) return;
      isFlipping = true;

      const currentWord = roleWords[currentWordIndex];
      currentWordIndex = (currentWordIndex + 1) % roleWords.length;
      const nextWord = roleWords[currentWordIndex];

      // Prepare next word hidden below
      gsap.set(nextWord, { yPercent: 80, opacity: 0, visibility: 'visible', position: 'absolute' });

      // Animate current out
      gsap.to(currentWord, {
        yPercent: -80,
        opacity: 0,
        duration: 0.45,
        ease: 'power2.inOut',
        onComplete: () => {
          currentWord.classList.remove('is-active');
          gsap.set(currentWord, { visibility: 'hidden', position: 'absolute', yPercent: 100 });
        }
      });

      // Animate next in
      gsap.to(nextWord, {
        yPercent: 0,
        opacity: 1,
        duration: 0.45,
        ease: 'power2.out',
        delay: 0.1,
        onComplete: () => {
          nextWord.classList.add('is-active');
          gsap.set(nextWord, { position: 'relative' });
          isFlipping = false;
        }
      });
    }

    function startRoleTimer() {
      if (roleTimer) clearInterval(roleTimer);
      roleTimer = setInterval(showNextWord, 2600);
    }

    function stopRoleTimer() {
      if (roleTimer) {
        clearInterval(roleTimer);
        roleTimer = null;
      }
    }

    startRoleTimer();

    // Prevent background tab animation desync
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopRoleTimer();
      } else {
        startRoleTimer();
      }
    });
  }

  // --- 7. Showcase Tab Switcher (UI/UX Upgrade) ---
  const showcaseTabs = document.querySelectorAll('.showcase-nav__btn');
  const showcaseViews = document.querySelectorAll('.showcase-view');

  showcaseTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');

      // Update button active state
      showcaseTabs.forEach(b => {
        b.classList.remove('is-active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');

      // Switch views
      showcaseViews.forEach(view => {
        if (view.id === `view-${targetTab}`) {
          view.classList.add('is-active');
          gsap.fromTo(view, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' });
        } else {
          view.classList.remove('is-active');
        }
      });
    });
  });

  // --- 8. Skills Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').split(' ');
        if (filter === 'all' || categories.includes(filter)) {
          card.classList.remove('is-hidden');
          gsap.fromTo(card, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // --- 8.1 Recruiter Quick-Scan Modal Logic ---
  const recruiterModal = document.querySelector('#recruiter-modal');
  const openModalBtns = document.querySelectorAll('#open-recruiter-modal-btn, #nav-recruiter-btn');
  const closeModalBtns = document.querySelectorAll('#close-recruiter-modal-btn, #close-modal-footer-btn, #recruiter-modal-backdrop');
  const printDossierBtn = document.querySelector('#print-dossier-btn');

  function openRecruiterModal() {
    if (!recruiterModal) return;
    recruiterModal.classList.add('is-open');
    recruiterModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeRecruiterModal() {
    if (!recruiterModal) return;
    recruiterModal.classList.remove('is-open');
    recruiterModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  openModalBtns.forEach(btn => btn.addEventListener('click', openRecruiterModal));
  closeModalBtns.forEach(btn => btn.addEventListener('click', closeRecruiterModal));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && recruiterModal && recruiterModal.classList.contains('is-open')) {
      closeRecruiterModal();
    }
  });

  if (printDossierBtn) {
    printDossierBtn.addEventListener('click', () => {
      window.print();
    });
  }

  // --- 9. ScrollTrigger Animations ---
  if (typeof ScrollTrigger !== "undefined") {
    // Section header line draw
    document.querySelectorAll('.section__head').forEach(head => {
      ScrollTrigger.create({
        trigger: head,
        start: "top 88%",
        onEnter: () => head.style.setProperty('--draw', '1')
      });
    });

    // Reveal text words
    document.querySelectorAll('[data-reveal-words]').forEach(el => {
      const words = el.querySelectorAll('.word');
      gsap.to(words, {
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          end: "top 35%",
          scrub: 0.4
        },
        opacity: 1,
        stagger: 0.08
      });
    });

    // Split lines reveal
    document.querySelectorAll('.line-inner').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el.closest('.h2, .project__title, .research__title, .contact__title'), start: "top 85%" },
        yPercent: 100, duration: 0.8, ease: 'power3.out'
      });
    });

    // Stagger containers
    document.querySelectorAll('[data-stagger]').forEach(container => {
      gsap.from(container.children, {
        scrollTrigger: { trigger: container, start: "top 85%" },
        y: 25, opacity: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
      });
    });

    // Fade elements
    document.querySelectorAll('[data-fade]').forEach(el => {
      gsap.from(el, {
        scrollTrigger: { trigger: el, start: "top 85%" },
        y: 25, opacity: 0, duration: 0.7, ease: 'power2.out'
      });
    });

    // Parallax on photos
    document.querySelectorAll('[data-parallax-img]').forEach(img => {
      gsap.to(img, {
        scrollTrigger: { trigger: img.closest('.media'), start: "top bottom", end: "bottom top", scrub: true },
        yPercent: 12, ease: 'none'
      });
    });

    // Image reveal
    document.querySelectorAll('[data-img-reveal]').forEach(container => {
      gsap.fromTo(container, 
        { clipPath: 'inset(100% 0 0 0)' },
        { scrollTrigger: { trigger: container, start: "top 80%" }, clipPath: 'inset(0% 0 0 0)', duration: 1.1, ease: 'power3.inOut' }
      );
    });

    // Number counters
    document.querySelectorAll('[data-count]').forEach(el => {
      const target = parseFloat(el.getAttribute('data-count'));
      const decimals = parseInt(el.getAttribute('data-decimals')) || 0;
      const suffix = el.getAttribute('data-suffix') || '';

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 1.8,
            ease: 'power3.out',
            onUpdate: () => {
              el.textContent = obj.val.toFixed(decimals) + suffix;
            }
          });
        }
      });
    });

    // Marquee infinite loops
    document.querySelectorAll('[data-marquee]').forEach(el => {
      const direction = parseInt(el.getAttribute('data-marquee') || 1);
      const track = el.querySelector('.marquee__track');
      if (track) {
        track.innerHTML += track.innerHTML;
        gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: 22,
          repeat: -1
        }).timeScale(direction);
      }
    });

    // Horizontal Scroll Section (Desktop > 900px)
    const hscroll = document.querySelector('.hscroll');
    const hscrollTrack = document.querySelector('.hscroll__track');
    const hprogressBar = document.querySelector('.hscroll__progress span');

    if (hscroll && hscrollTrack && window.innerWidth > 900) {
      const getScrollDist = () => -(hscrollTrack.scrollWidth - window.innerWidth + 80);

      gsap.to(hscrollTrack, {
        x: getScrollDist,
        ease: "none",
        scrollTrigger: {
          trigger: hscroll,
          start: "top 12%",
          end: () => `+=${hscrollTrack.scrollWidth - window.innerWidth + 300}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          onUpdate: self => {
            if (hprogressBar) gsap.to(hprogressBar, { scaleX: self.progress, duration: 0.1 });
          }
        }
      });
    }
  }

  // --- 10. Card Radial Mouse Follow ---
  document.querySelectorAll('.panel, .skill-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mx', `${x}px`);
      card.style.setProperty('--my', `${y}px`);
    }, { passive: true });
  });

  // --- 11. Copy to Clipboard Interactions ---
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-copy');
      navigator.clipboard.writeText(text).then(() => {
        btn.classList.add('is-copied');
        setTimeout(() => btn.classList.remove('is-copied'), 2200);
      });
    });
  });

  // --- 12. Local Time Updater (Türkiye GMT+3) ---
  function updateTime() {
    const timeEls = document.querySelectorAll('[data-time]');
    if (!timeEls.length) return;

    try {
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Europe/Istanbul',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      const timeStr = formatter.format(new Date());
      timeEls.forEach(el => el.textContent = timeStr);
    } catch(err) {
      // Fallback
      timeEls.forEach(el => el.textContent = new Date().toLocaleTimeString());
    }
  }
  updateTime();
  setInterval(updateTime, 10000);

  // --- 13. Hero Canvas (Subtle Particle Mesh) ---
  function startHeroCanvas() {
    const canvas = document.querySelector('.hero__canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.opacity = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > width) this.x = 0;
        if (this.x < 0) this.x = width;
        if (this.y > height) this.y = 0;
        if (this.y < 0) this.y = height;
      }
      draw() {
        ctx.fillStyle = `rgba(237, 237, 234, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const count = Math.min(width > 768 ? 90 : 45, 90);
    for (let i = 0; i < count; i++) particles.push(new Particle());

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // --- 14. Research Mesh Simulation Canvas (Interactive BLE IDS) ---
  function startMeshCanvas() {
    const canvas = document.querySelector('.mesh');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height, nodes = [];
    let currentMode = 'normal'; // 'normal', 'flooding', 'spoofing', 'defense'

    function resize() {
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class MeshNode {
      constructor(isAttacker = false) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.isAttacker = isAttacker;
        this.radius = isAttacker ? 4.5 : 3;
        this.pulse = 0;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
        this.pulse = (this.pulse + 0.05) % (Math.PI * 2);
      }
    }

    function initNodes() {
      nodes = [];
      const total = width > 500 ? 36 : 22;
      for (let i = 0; i < total; i++) {
        nodes.push(new MeshNode(false));
      }
    }
    initNodes();

    // Simulator Interactive Buttons
    const simBtns = document.querySelectorAll('.mesh-btn');
    const statusEl = document.querySelector('[data-mesh-status]');
    const latencyEl = document.querySelector('#mesh-latency');

    simBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        simBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');

        currentMode = btn.getAttribute('data-sim');

        // Apply changes based on attack mode
        if (currentMode === 'normal') {
          nodes.forEach(n => { n.isAttacker = false; n.vx = (Math.random() - 0.5) * 0.6; });
          statusEl.textContent = "✓ Network stable — RF rules active";
          statusEl.className = "is-ok";
          if (latencyEl) latencyEl.textContent = "8.4 ms";
        } else if (currentMode === 'flooding') {
          nodes.slice(0, 5).forEach(n => { n.isAttacker = true; n.vx *= 2.2; n.vy *= 2.2; });
          statusEl.textContent = "⚠ Flooding Attack Detected — High Packet Density";
          statusEl.className = "is-alert";
          if (latencyEl) latencyEl.textContent = "42.8 ms";
        } else if (currentMode === 'spoofing') {
          nodes.slice(0, 3).forEach(n => { n.isAttacker = true; });
          statusEl.textContent = "⚡ Spoofing Attack Detected — Sequence Mismatch";
          statusEl.className = "is-alert";
          if (latencyEl) latencyEl.textContent = "18.2 ms";
        } else if (currentMode === 'defense') {
          nodes.forEach(n => { n.isAttacker = false; n.vx = (Math.random() - 0.5) * 0.3; });
          statusEl.textContent = "🛡 RF Engine Isolated Attack Nodes — Quorum Safe";
          statusEl.className = "is-ok";
          if (latencyEl) latencyEl.textContent = "6.1 ms";
        }
      });
    });

    function drawMesh() {
      ctx.clearRect(0, 0, width, height);

      // Connect nodes
      const maxDist = currentMode === 'flooding' ? 120 : 90;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const hasAttacker = nodes[i].isAttacker || nodes[j].isAttacker;
            const alpha = 1 - dist / maxDist;

            if (hasAttacker) {
              ctx.strokeStyle = `rgba(255, 82, 82, ${alpha * 0.8})`;
              ctx.lineWidth = 1.5;
            } else if (currentMode === 'defense') {
              ctx.strokeStyle = `rgba(85, 230, 165, ${alpha * 0.4})`;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(200, 255, 61, ${alpha * 0.25})`;
              ctx.lineWidth = 1;
            }

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(node => {
        node.update();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.isAttacker) {
          ctx.fillStyle = '#ff5252';
          ctx.fill();

          // Threat pulse
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.radius + Math.sin(node.pulse) * 6 + 6, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(255, 82, 82, 0.4)';
          ctx.stroke();
        } else if (currentMode === 'defense') {
          ctx.fillStyle = '#55e6a5';
          ctx.fill();
        } else {
          ctx.fillStyle = '#c8ff3d';
          ctx.fill();
        }
      });

      requestAnimationFrame(drawMesh);
    }

    if (typeof ScrollTrigger !== "undefined") {
      ScrollTrigger.create({
        trigger: canvas,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => requestAnimationFrame(drawMesh)
      });
    } else {
      drawMesh();
    }
  }
});
