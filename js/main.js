/* ============================================================================
   BENJAMÍN PAZ — PORTFOLIO
   main.js · Inicialización general
   ----------------------------------------------------------------------------
   Este archivo NO contiene lógica de secciones concretas. Solo se ocupa de:
     · Marcar que JavaScript está disponible
     · Hidratar los iconos de Lucide (y avisar si el CDN no responde)
     · Año del pie de página
     · Ajustes globales de rendimiento y accesibilidad

   El resto vive en módulos independientes:
     theme.js · navigation.js · animations.js · video.js · data.js
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ── 1 · JavaScript disponible ──────────────────────────────────────── */
  /* La clase `no-js` ya se retira en el script inline de <head>; aquí solo
     dejamos constancia de que los módulos han llegado a ejecutarse.        */
  root.classList.add('js');


  /* ── 2 · Iconos de Lucide ───────────────────────────────────────────── */

  function renderIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      try {
        window.lucide.createIcons();
        root.classList.add('icons-ready');
        return true;
      } catch (err) {
        console.warn('[portfolio] Lucide no pudo generar los iconos:', err);
      }
    }
    return false;
  }

  if (!renderIcons()) {
    // Lucide llega por CDN con `defer`: puede no estar listo todavía.
    var attempts = 0;
    var retry = window.setInterval(function () {
      attempts++;
      if (renderIcons() || attempts > 20) {
        window.clearInterval(retry);
        if (attempts > 20) {
          console.warn(
            '[portfolio] No se pudo cargar Lucide Icons desde el CDN. ' +
            'La web sigue siendo funcional; solo faltarán algunos iconos de interfaz.'
          );
        }
      }
    }, 150);
  }


  /* ── 3 · Año dinámico en el pie ─────────────────────────────────────── */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();


  /* ── 4 · Ajuste fino de la altura real en móvil ─────────────────────── */
  /* Algunos navegadores móviles mienten con 100vh; guardamos el valor real. */

  function setViewportUnit() {
    root.style.setProperty('--vh', (window.innerHeight * 0.01).toFixed(2) + 'px');
  }
  setViewportUnit();

  var vhTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(vhTimer);
    vhTimer = window.setTimeout(setViewportUnit, 150);
  }, { passive: true });


  /* ── 5 · Enlaces externos: seguridad por defecto ────────────────────── */
  /* Refuerzo por si algún enlace nuevo se añade sin rel="noopener".       */

  document.querySelectorAll('a[target="_blank"]').forEach(function (link) {
    var rel = link.getAttribute('rel') || '';
    if (rel.indexOf('noopener') === -1) {
      link.setAttribute('rel', (rel + ' noopener noreferrer').trim());
    }
  });


  /* ── 6 · Nota de cortesía en consola ────────────────────────────────── */

  if (!window.matchMedia('(max-width: 640px)').matches) {
    console.log(
      '%c BENJAMÍN PAZ %c Web Developer & Content Creator ',
      'background:#00e0c6;color:#04060a;font-weight:700;padding:4px 8px;border-radius:4px 0 0 4px',
      'background:#0f1219;color:#a8b0c0;padding:4px 8px;border-radius:0 4px 4px 0',
      '\n\n¿Curioseando el código? Me parece bien.\nHablemos: https://github.com/Nimajeb-41\n'
    );
  }

})();
