/* ============================================================================
   BENJAMÍN PAZ — PORTFOLIO
   lightbox.js · Vista ampliada de las capturas de proyecto
   ----------------------------------------------------------------------------
   Cualquier elemento con `data-gallery="<nombre>"` y `data-src` entra en el
   lightbox. Los que comparten el mismo `data-gallery` forman una galería y se
   recorren con las flechas o con los botones anterior / siguiente.

   Para añadir una captura nueva basta con el marcado; este archivo no cambia:

     <button type="button"
             data-gallery="prisma"
             data-src="assets/images/projects/prisma-x.png"
             data-caption="Texto que se muestra debajo">…</button>

   Accesibilidad: role="dialog", aria-modal, foco atrapado, cierre con ESC o
   clic fuera, y devolución del foco al elemento que lo abrió.
   ========================================================================== */

(function () {
  'use strict';

  var box     = document.getElementById('lightbox');
  if (!box) return;

  var dialog  = box.querySelector('.lightbox__dialog');
  var img     = document.getElementById('lightbox-img');
  var caption = document.getElementById('lightbox-caption');
  var pos     = document.getElementById('lightbox-pos');
  var btnPrev = document.getElementById('lightbox-prev');
  var btnNext = document.getElementById('lightbox-next');
  var btnClose = document.getElementById('lightbox-close');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  var group = [];        // botones de la galería activa
  var index = -1;
  var lastFocused = null;

  // Píxel transparente: al cerrar se restaura para liberar la imagen sin
  // dejar un src vacío (que haría al navegador recargar la propia página).
  var BLANK = img.getAttribute('src');

  var FOCUSABLE = 'button:not(:disabled), [href], [tabindex]:not([tabindex="-1"])';

  /* ── Carga de una captura ───────────────────────────────────────────── */

  function show(i) {
    var trigger = group[i];
    if (!trigger) return;

    index = i;

    var src = trigger.getAttribute('data-src');
    var text = trigger.getAttribute('data-caption') || '';
    var inner = trigger.querySelector('img');

    img.setAttribute('src', src);
    // El alt real vive en la miniatura; si no lo hay, usamos el pie.
    img.setAttribute('alt', inner ? inner.getAttribute('alt') || text : text);
    caption.textContent = text;

    var many = group.length > 1;
    btnPrev.hidden = !many;
    btnNext.hidden = !many;
    pos.hidden = !many;

    if (many) {
      pos.textContent = (i + 1) + ' / ' + group.length;
      btnPrev.disabled = i === 0;
      btnNext.disabled = i === group.length - 1;
    }
  }

  function step(delta) {
    var next = index + delta;
    if (next < 0 || next >= group.length) return;
    show(next);
  }

  /* ── Apertura y cierre ──────────────────────────────────────────────── */

  function open(trigger) {
    var name = trigger.getAttribute('data-gallery');

    group = name
      ? Array.prototype.slice.call(document.querySelectorAll('[data-gallery="' + name + '"][data-src]'))
      : [trigger];

    var start = group.indexOf(trigger);
    if (start < 0) { group = [trigger]; start = 0; }

    lastFocused = document.activeElement;

    box.hidden = false;
    document.body.classList.add('is-locked');
    void box.offsetWidth;                 // fuerza reflow para la transición
    box.classList.add('is-open');

    show(start);
    btnClose.focus();
  }

  function close() {
    if (box.hidden) return;

    box.classList.remove('is-open');
    document.body.classList.remove('is-locked');

    var hide = function () {
      box.hidden = true;
      img.setAttribute('src', BLANK);
      img.setAttribute('alt', '');
      box.removeEventListener('transitionend', hide);
    };

    if (reduceMotion.matches) hide();
    else {
      box.addEventListener('transitionend', hide);
      window.setTimeout(hide, 420);       // por si transitionend no llega
    }

    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    index = -1;
  }

  /* ── Eventos ────────────────────────────────────────────────────────── */

  // Delegación: sirve también para capturas añadidas después.
  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-gallery][data-src]');
    if (!trigger) return;
    e.preventDefault();
    open(trigger);
  });

  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { step(-1); });
  btnNext.addEventListener('click', function () { step(1); });

  box.addEventListener('click', function (e) {
    if (e.target.hasAttribute('data-close-lightbox')) close();
  });

  document.addEventListener('keydown', function (e) {
    if (box.hidden) return;

    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'ArrowLeft')  { step(-1); return; }
    if (e.key === 'ArrowRight') { step(1);  return; }

    if (e.key === 'Tab' && dialog) {
      var items = Array.prototype.filter.call(
        dialog.querySelectorAll(FOCUSABLE),
        function (el) { return !el.disabled && !el.hidden && el.offsetParent !== null; }
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
    }
  });

})();
