/* =========================================================
   Apdulaziz Mohamed Karar — Portfolio Scripts
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 400);
  });
  setTimeout(() => preloader.classList.add('hidden'), 2500); // fallback

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav + back to top + active link ---------- */
  const navbar = document.getElementById('navbar');
  const toTop = document.getElementById('toTop');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);
    toTop.classList.toggle('visible', y > 600);

    let current = '';
    sections.forEach((sec) => {
      if (y >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinksBox = document.getElementById('navLinks');
  navToggle.addEventListener('click', () => {
    const open = navLinksBox.classList.toggle('open');
    navToggle.classList.toggle('active', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  navLinksBox.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      navLinksBox.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- Typing effect ---------- */
  const typedEl = document.querySelector('.typed');
  if (typedEl) {
    let words = [];
    try { words = JSON.parse(typedEl.getAttribute('data-text')); }
    catch (e) { words = [typedEl.textContent]; }
    let wordIdx = 0, charIdx = 0, deleting = false;
    const type = () => {
      const word = words[wordIdx];
      charIdx = deleting ? charIdx - 1 : charIdx + 1;
      typedEl.textContent = word.substring(0, charIdx);

      let speed = deleting ? 55 : 110;
      if (!deleting && charIdx === word.length) { speed = 1500; deleting = true; }
      else if (deleting && charIdx === 0) { deleting = false; wordIdx = (wordIdx + 1) % words.length; speed = 350; }
      setTimeout(type, speed);
    };
    type();
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- Skill bars ---------- */
  const skillBars = document.querySelectorAll('.skill__bar span');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.getAttribute('data-width');
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat__num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.getAttribute('data-count');
      const duration = 1600;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach((c) => counterObserver.observe(c));
  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach((item) => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.classList.toggle('hidden', !match);
      });
    });
  });

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = lightbox.querySelector('img');
  const lightboxCaption = lightbox.querySelector('.lightbox__caption');
  let currentImages = [];
  let currentIndex = 0;

  function updateLightbox() {
    const item = currentImages[currentIndex];
    const img = item.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    const title = item.querySelector('h3');
    lightboxCaption.textContent = title ? title.textContent : img.alt;
  }
  function openLightbox(index, list) {
    currentImages = list;
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const visible = Array.from(galleryItems).filter((g) => !g.classList.contains('hidden'));
      openLightbox(visible.indexOf(item), visible);
    });
  });

  lightbox.querySelector('.lightbox__close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox__prev').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + currentImages.length) % currentImages.length;
    updateLightbox();
  });
  lightbox.querySelector('.lightbox__next').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % currentImages.length;
    updateLightbox();
  });
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox__prev').click();
    if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox__next').click();
  });

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!name || !email || !subject || !message) {
      formNote.textContent = 'Please fill in all fields.';
      formNote.classList.add('error');
      return;
    }
    if (!emailOk) {
      formNote.textContent = 'Please enter a valid email address.';
      formNote.classList.add('error');
      return;
    }

    formNote.classList.remove('error');
    formNote.textContent = "Thanks, " + name + "! Your message has been sent — I'll get back to you soon.";
    form.reset();
  });
});

