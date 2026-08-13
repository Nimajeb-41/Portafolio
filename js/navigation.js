/* ============================================================================
   BENJAMÍN PAZ — PORTFOLIO
   navigation.js · Navbar, scroll, menú móvil y enlaces internos
   ----------------------------------------------------------------------------
   Responsabilidades
     · Estado compacto de la navbar al hacer scroll
     · Barra de progreso de lectura
     · Sección activa en el menú (scroll spy con IntersectionObserver)
     · Menú móvil: apertura, cierre, foco atrapado, ESC e `inert`
     · Botón "volver arriba"
     · Scroll suave con compensación de la navbar sticky
   ========================================================================== */

(function () {
  'use strict';

  var nav        = document.getElementById('nav');
  var burger     = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobile-menu');
  var progress   = document.getElementById('scroll-progress-bar');
  var toTop      = document.getElementById('to-top');
  var navLinks   = Array.prototype.slice.call(document.querySelectorAll('.nav__link'));
  var sections   = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ══════════════ Scroll: navbar compacta, progreso y back-to-top ══════════════ */

  var ticking = false;

  function onScroll() {
    var y      = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;

    if (nav) nav.classList.toggle('is-scrolled', y > 24);

    if (progress) {
      var ratio = height > 0 ? Math.min(y / height, 1) : 0;
      progress.style.width = (ratio * 100).toFixed(2) + '%';
    }

    if (toTop) toTop.classList.toggle('is-visible', y > window.innerHeight * 0.75);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });

  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion.matches ? 'auto' : 'smooth'
      });
    });
  }

  /* ══════════════ Scroll spy ══════════════ */

  function setActive(id) {
    navLinks.forEach(function (link) {
      var isActive = link.getAttribute('href') === '#' + id;
      link.classList.toggle('is-active', isActive);
      if (isActive) {
        link.setAttribute('aria-current', 'true');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    var visible = new Map();

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      var best = null;
      var bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; best = id; }
      });

      if (best) setActive(best);
    }, {
      // Ignoramos la franja bajo la navbar y damos peso al centro de la pantalla.
      rootMargin: '-25% 0px -45% 0px',
      threshold: [0, 0.15, 0.4, 0.75, 1]
    });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ══════════════ Menú móvil ══════════════ */

  var FOCUSABLE = 'a[href], button:not(:disabled), input, select, textarea, [tabindex]:not([tabindex="-1"])';
  var lastFocused = null;

  function menuIsOpen() {
    return !!mobileMenu && mobileMenu.classList.contains('is-open');
  }

  function openMenu() {
    if (!mobileMenu || !burger) return;

    lastFocused = document.activeElement;

    mobileMenu.classList.add('is-open');
    mobileMenu.removeAttribute('inert');
    burger.classList.add('is-open');
    burger.setAttribute('aria-expanded', 'true');
    burger.setAttribute('aria-label', 'Cerrar menú de navegación');
    document.body.classList.add('is-locked');

    var first = mobileMenu.querySelector(FOCUSABLE);
    if (first) window.setTimeout(function () { first.focus(); }, 120);
  }

  function closeMenu(restoreFocus) {
    if (!mobileMenu || !burger) return;

    mobileMenu.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Abrir menú de navegación');
    document.body.classList.remove('is-locked');

    // `inert` se aplica al terminar la transición para no cortar la animación.
    window.setTimeout(function () {
      if (!menuIsOpen()) mobileMenu.setAttribute('inert', '');
    }, 320);

    if (restoreFocus && lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  if (burger) {
    burger.addEventListener('click', function () {
      menuIsOpen() ? closeMenu(true) : openMenu();
    });
  }

  if (mobileMenu) {
    // Clic en el fondo (fuera del panel) → cerrar
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) closeMenu(true);
    });

    // Al elegir una sección, el menú se cierra
    mobileMenu.addEventListener('click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (link) closeMenu(false);
    });

    // Foco atrapado dentro del panel mientras está abierto
    mobileMenu.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab' || !menuIsOpen()) return;

      var items = Array.prototype.filter.call(
        mobileMenu.querySelectorAll(FOCUSABLE),
        function (el) { return el.offsetParent !== null; }
      );
      if (!items.length) return;

      var first = items[0];
      var last  = items[items.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuIsOpen()) closeMenu(true);
  });

  // Al pasar a escritorio, el menú móvil no debe quedarse abierto.
  var desktop = window.matchMedia('(min-width: 1025px)');
  var onBreakpoint = function (e) { if (e.matches && menuIsOpen()) closeMenu(false); };
  if (typeof desktop.addEventListener === 'function') {
    desktop.addEventListener('change', onBreakpoint);
  } else if (typeof desktop.addListener === 'function') {
    desktop.addListener(onBreakpoint);
  }

  /* ══════════════ Scroll suave con compensación de la navbar ══════════════ */

  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;

    var hash = link.getAttribute('href');
    if (!hash || hash === '#') return;

    var target = document.getElementById(hash.slice(1));
    if (!target) return;

    e.preventDefault();

    var navHeight = nav ? nav.offsetHeight : 0;
    var top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

    window.scrollTo({
      top: Math.max(top, 0),
      behavior: reduceMotion.matches ? 'auto' : 'smooth'
    });

    // La URL refleja la sección sin provocar un salto brusco.
    if (history.replaceState) history.replaceState(null, '', hash);

    // Accesibilidad: el foco viaja con el usuario hasta la sección destino.
    target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    target.addEventListener('blur', function handler() {
      target.removeAttribute('tabindex');
      target.removeEventListener('blur', handler);
    });
  });

  /* Estado inicial del menú móvil: inaccesible para lectores y teclado. */
  if (mobileMenu) mobileMenu.setAttribute('inert', '');

})();
