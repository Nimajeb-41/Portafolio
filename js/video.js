/* ============================================================================
   BENJAMÍN PAZ — PORTFOLIO
   video.js · Galería de vídeos y modal del reproductor
   ----------------------------------------------------------------------------
   Responsabilidades
     · Construir los filtros por categoría a partir de js/data.js
     · Construir las tarjetas de la galería (con paginación "ver todos")
     · Portadas: imagen si existe; si no, la miniatura de YouTube o un
       fotograma del propio vídeo
     · Reproducción: desde YouTube si el vídeo tiene enlace; si no, el .mp4
     · Modal accesible: foco atrapado, ESC, clic fuera, anterior/siguiente
     · Pantalla completa opcional desde el botón "Ampliar"

   Para añadir vídeos NO hay que tocar este archivo: se editan en js/data.js.
   ========================================================================== */

(function () {
  'use strict';

  var DATA = window.PORTFOLIO_DATA;
  if (!DATA || !Array.isArray(DATA.videos)) return;

  var VIDEOS     = DATA.videos;
  var CATEGORIES = DATA.videoCategories || [];
  var PAGE_SIZE  = DATA.galleryPageSize || 6;

  /* ── Referencias del DOM ────────────────────────────────────────────── */
  var grid       = document.getElementById('gallery-grid');
  var filtersBox = document.getElementById('gallery-filters');
  var countEl    = document.getElementById('gallery-count');
  var emptyEl    = document.getElementById('gallery-empty');
  var moreBtn    = document.getElementById('gallery-more');
  var moreWrap   = moreBtn ? moreBtn.parentElement : null;

  var modal      = document.getElementById('video-modal');
  var dialog     = modal ? modal.querySelector('.modal__dialog') : null;
  var player     = document.getElementById('modal-video');
  var embed      = document.getElementById('modal-embed');
  var mTitle     = document.getElementById('modal-title');
  var mDesc      = document.getElementById('modal-desc');
  var mCat       = document.getElementById('modal-cat');
  var mMeta      = document.getElementById('modal-meta');
  var mPos       = document.getElementById('modal-pos');
  var mPrev      = document.getElementById('modal-prev');
  var mNext      = document.getElementById('modal-next');
  var mClose     = document.getElementById('modal-close');

  if (!grid) return;

  /* ── Estado ─────────────────────────────────────────────────────────── */
  var activeFilter = 'all';
  var expanded     = false;   // ¿se están mostrando todos los vídeos?
  var visibleList  = [];      // vídeos actualmente pintados (orden del modal)
  var currentIndex = -1;
  var lastFocused  = null;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');


  /* ══════════════════ UTILIDADES ══════════════════ */

  function categoryLabel(id) {
    for (var i = 0; i < CATEGORIES.length; i++) {
      if (CATEGORIES[i].id === id) return CATEGORIES[i].label;
    }
    return id;
  }

  function filtered() {
    if (activeFilter === 'all') return VIDEOS.slice();
    return VIDEOS.filter(function (v) { return v.category === activeFilter; });
  }

  /** Vuelve a hidratar los iconos de Lucide tras inyectar HTML. */
  function refreshIcons(scope) {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons(scope ? { nameAttr: 'data-lucide' } : undefined);
    }
  }

  /**
   * Extrae el id de 11 caracteres de un enlace de YouTube. Acepta las formas
   * habituales: youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID y
   * /live/ID. Devuelve null si el enlace no es de YouTube.
   */
  function youtubeId(url) {
    if (!url) return null;
    var m = String(url).match(
      /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/))([\w-]{11})/
    );
    return m ? m[1] : null;
  }

  /** Escapa texto antes de insertarlo como HTML. */
  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }


  /* ══════════════════ FILTROS ══════════════════ */

  function buildFilters() {
    if (!filtersBox) return;

    var items = [{ id: 'all', label: 'Todos' }].concat(CATEGORIES);
    var html = '';

    items.forEach(function (cat) {
      var total = cat.id === 'all'
        ? VIDEOS.length
        : VIDEOS.filter(function (v) { return v.category === cat.id; }).length;

      if (!total) return;   // No mostramos categorías vacías.

      html += '<button class="filter-btn" type="button" data-filter="' + esc(cat.id) + '" ' +
              'aria-pressed="' + (cat.id === activeFilter ? 'true' : 'false') + '">' +
              esc(cat.label) + ' <span aria-hidden="true">(' + total + ')</span>' +
              '</button>';
    });

    filtersBox.innerHTML = html;

    filtersBox.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-filter]');
      if (!btn) return;

      activeFilter = btn.getAttribute('data-filter');
      expanded = false;

      Array.prototype.forEach.call(filtersBox.querySelectorAll('[data-filter]'), function (b) {
        b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
      });

      renderGallery();
    });
  }


  /* ══════════════════ TARJETAS ══════════════════ */

  function cardHTML(video, index) {
    var meta = [];
    if (video.date)     meta.push('<span><i data-lucide="calendar" aria-hidden="true"></i>' + esc(video.date) + '</span>');
    if (video.software) meta.push('<span><i data-lucide="sliders-horizontal" aria-hidden="true"></i>' + esc(video.software) + '</span>');
    if (!meta.length)   meta.push('<span><i data-lucide="film" aria-hidden="true"></i>Proyecto propio</span>');

    // Portada, por orden de preferencia: imagen propia → miniatura de YouTube
    // → fotograma del .mp4. Si la imagen falla, se prueba con el .mp4.
    var ytId = youtubeId(video.youtube);
    var image = video.poster || (ytId ? 'https://i.ytimg.com/vi/' + ytId + '/hqdefault.jpg' : null);
    var fallback = video.src ? ' data-fallback="' + esc(video.src) + '"' : ' data-fallback=""';
    var poster = image
      ? '<img src="' + esc(image) + '" alt="" width="1024" height="576" loading="lazy" decoding="async"' + fallback + '>'
      : video.src
        ? '<video src="' + esc(video.src) + '#t=3" preload="metadata" muted playsinline aria-hidden="true"></video>'
        : '<span class="vcard__fallback"><i data-lucide="film"></i></span>';

    return '' +
      '<article class="vcard reveal" data-index="' + index + '">' +
        '<div class="vcard__thumb">' +
          poster +
          '<span class="vcard__play" aria-hidden="true">' +
            '<span class="vcard__play-btn"><i data-lucide="play"></i></span>' +
          '</span>' +
          (video.duration ? '<span class="vcard__duration">' + esc(video.duration) + '</span>' : '') +
        '</div>' +
        '<div class="vcard__body">' +
          '<span class="vcard__cat">' + esc(categoryLabel(video.category)) + '</span>' +
          '<h4 class="vcard__title">' +
            '<button class="vcard__open" type="button" data-open="' + index + '">' +
              esc(video.title) +
            '</button>' +
          '</h4>' +
          '<p class="vcard__desc">' + esc(video.description) + '</p>' +
          '<div class="vcard__foot">' +
            meta.join('') +
            '<button class="vcard__expand" type="button" data-expand="' + index + '" ' +
                    'aria-label="Ver a pantalla completa: ' + esc(video.title) + '">' +
              '<i data-lucide="maximize-2" aria-hidden="true"></i> Ampliar' +
            '</button>' +
          '</div>' +
        '</div>' +
      '</article>';
  }

  function renderGallery() {
    var list = filtered();
    visibleList = expanded ? list : list.slice(0, PAGE_SIZE);

    grid.innerHTML = visibleList.map(cardHTML).join('');

    // Contador y estados vacíos
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' vídeo' : ' vídeos');
    if (emptyEl) emptyEl.hidden = list.length !== 0;

    // Botón "ver todos"
    if (moreWrap) {
      var needsMore = list.length > PAGE_SIZE;
      moreWrap.hidden = !needsMore;
      if (needsMore && moreBtn) {
        moreBtn.innerHTML = expanded
          ? 'Mostrar menos <i data-lucide="chevron-up" aria-hidden="true"></i>'
          : 'Ver todos los vídeos (' + list.length + ') <i data-lucide="chevron-down" aria-hidden="true"></i>';
      }
    }

    setupPosterFallbacks();
    refreshIcons();

    // El módulo de animaciones se encarga del revelado de las tarjetas nuevas.
    document.dispatchEvent(new CustomEvent('gallery:rendered'));
  }

  /**
   * Si la imagen de portada no existe todavía, usamos un fotograma del propio
   * vídeo (fragmento temporal #t=3) para que la tarjeta nunca quede vacía.
   * Si tampoco hay .mp4 (vídeo solo en YouTube), dejamos un marcador.
   */
  function setupPosterFallbacks() {
    Array.prototype.forEach.call(grid.querySelectorAll('img[data-fallback]'), function (img) {
      img.addEventListener('error', function () {
        var src = img.getAttribute('data-fallback');
        var thumb = img.parentElement;

        if (!src) {
          img.remove();
          thumb.insertAdjacentHTML('afterbegin', '<span class="vcard__fallback"><i data-lucide="film"></i></span>');
          refreshIcons();
          return;
        }

        var video = document.createElement('video');

        video.src = src + '#t=3';
        video.preload = 'metadata';
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('aria-hidden', 'true');

        video.addEventListener('error', function () {
          // Ni portada ni vídeo: dejamos un marcador visual honesto.
          thumb.innerHTML = '<span class="vcard__fallback"><i data-lucide="film"></i></span>' + thumb.innerHTML;
          refreshIcons();
        });

        thumb.replaceChild(video, img);
      }, { once: true });
    });
  }

  if (moreBtn) {
    moreBtn.addEventListener('click', function () {
      expanded = !expanded;
      renderGallery();

      if (!expanded) {
        var gallery = document.getElementById('gallery');
        if (gallery) {
          gallery.scrollIntoView({
            behavior: reduceMotion.matches ? 'auto' : 'smooth',
            block: 'start'
          });
        }
      }
    });
  }

  /* Delegación: abrir el modal desde la tarjeta o desde "Ampliar". */
  grid.addEventListener('click', function (e) {
    var expand = e.target.closest('[data-expand]');
    if (expand) {
      openModal(parseInt(expand.getAttribute('data-expand'), 10), true);
      return;
    }

    var open = e.target.closest('[data-open]');
    if (open) openModal(parseInt(open.getAttribute('data-open'), 10), false);
  });


  /* ══════════════════ MODAL ══════════════════ */

  var FOCUSABLE = 'button:not(:disabled), [href], video[controls], iframe, input, select, textarea, [tabindex]:not([tabindex="-1"])';

  function fillMeta(video) {
    if (!mMeta) return;

    var rows = '';
    if (video.duration) rows += '<dt>Duración</dt><dd>' + esc(video.duration) + '</dd>';
    if (video.date)     rows += '<dt>Fecha</dt><dd>'    + esc(video.date) + '</dd>';
    if (video.software) rows += '<dt>Software</dt><dd>' + esc(video.software) + '</dd>';
    rows += '<dt>Categoría</dt><dd>' + esc(categoryLabel(video.category)) + '</dd>';

    if (video.youtube) {
      rows += '<dt>Ver en</dt><dd><a href="' + esc(video.youtube) + '" target="_blank" ' +
              'rel="noopener noreferrer">YouTube</a></dd>';
    }

    mMeta.innerHTML = rows;
  }

  function load(index) {
    var video = visibleList[index];
    if (!video) return;

    currentIndex = index;

    if (mCat)   mCat.textContent   = categoryLabel(video.category);
    if (mTitle) mTitle.textContent = video.title;
    if (mDesc)  mDesc.textContent  = video.description;
    fillMeta(video);

    // Reproductor: YouTube si el vídeo tiene enlace; si no, el .mp4 local.
    var ytId = youtubeId(video.youtube);

    if (player) {
      player.pause();
      if (ytId || !video.src) {
        player.removeAttribute('src');
      } else {
        player.setAttribute('src', video.src);
      }
      if (video.poster) player.setAttribute('poster', video.poster);
      else player.removeAttribute('poster');
      player.setAttribute('aria-label', 'Reproductor de vídeo: ' + video.title);
      player.load();
      player.hidden = !!ytId;
    }

    if (embed) {
      // youtube-nocookie: YouTube no guarda cookies hasta que se pulsa play.
      embed.innerHTML = ytId
        ? '<iframe src="https://www.youtube-nocookie.com/embed/' + ytId + '?rel=0" ' +
            'title="' + esc(video.title) + '" ' +
            'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
            'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>'
        : '';
      embed.hidden = !ytId;
    }

    if (mPos) mPos.textContent = (index + 1) + ' / ' + visibleList.length;
    if (mPrev) mPrev.disabled = index === 0;
    if (mNext) mNext.disabled = index === visibleList.length - 1;
  }

  function openModal(index, fullscreen) {
    if (!modal || isNaN(index)) return;

    lastFocused = document.activeElement;

    modal.hidden = false;
    document.body.classList.add('is-locked');

    // Forzamos un reflow para que la transición de entrada se ejecute.
    void modal.offsetWidth;
    modal.classList.add('is-open');

    load(index);

    if (mClose) mClose.focus();

    if (!fullscreen) return;

    var frame = embed && !embed.hidden ? embed.querySelector('iframe') : null;

    if (frame) {
      // El iframe de YouTube puede ponerse a pantalla completa en el mismo clic.
      requestFullscreen(frame);
    } else if (player) {
      // Esperamos a que haya metadatos para que el navegador no rechace la petición.
      var go = function () {
        requestFullscreen(player);
        player.removeEventListener('loadedmetadata', go);
      };
      if (player.readyState >= 1) go();
      else player.addEventListener('loadedmetadata', go);
    }
  }

  function requestFullscreen(el) {
    var request = el.requestFullscreen || el.webkitRequestFullscreen || el.webkitEnterFullscreen;
    if (!request) return;
    try {
      var result = request.call(el);
      // Si el navegador lo bloquea, la promesa se rechaza: lo ignoramos.
      if (result && typeof result.catch === 'function') result.catch(function () {});
    } catch (err) { /* el navegador puede bloquearlo */ }
  }

  function closeModal() {
    if (!modal || modal.hidden) return;

    if (player) {
      player.pause();
      player.removeAttribute('src');
      player.load();                  // libera el buffer descargado
    }

    if (embed) {
      embed.innerHTML = '';           // quitar el iframe detiene YouTube
      embed.hidden = true;
    }

    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');

    var hide = function () {
      modal.hidden = true;
      modal.removeEventListener('transitionend', hide);
    };

    if (reduceMotion.matches) hide();
    else {
      modal.addEventListener('transitionend', hide);
      window.setTimeout(hide, 420);   // por si transitionend no llega
    }

    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    currentIndex = -1;
  }

  function step(delta) {
    var next = currentIndex + delta;
    if (next < 0 || next >= visibleList.length) return;
    load(next);
  }

  if (mClose) mClose.addEventListener('click', closeModal);
  if (mPrev)  mPrev.addEventListener('click', function () { step(-1); });
  if (mNext)  mNext.addEventListener('click', function () { step(1); });

  if (modal) {
    // Clic fuera del diálogo (sobre el fondo)
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close-modal')) closeModal();
    });

    // Teclado: ESC cierra, flechas navegan, TAB queda atrapado
    document.addEventListener('keydown', function (e) {
      if (modal.hidden) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        closeModal();
        return;
      }

      if (e.key === 'ArrowLeft'  && document.activeElement !== player) { step(-1); return; }
      if (e.key === 'ArrowRight' && document.activeElement !== player) { step(1);  return; }

      if (e.key === 'Tab' && dialog) {
        var items = Array.prototype.filter.call(
          dialog.querySelectorAll(FOCUSABLE),
          function (el) { return !el.disabled && el.offsetParent !== null; }
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
  }


  /* ══════════════════ ARRANQUE ══════════════════ */

  function init() {
    buildFilters();
    renderGallery();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
