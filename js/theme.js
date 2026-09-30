/* ============================================================================
   BENJAMÍN PAZ — PORTFOLIO
   theme.js · Modo oscuro / claro
   ----------------------------------------------------------------------------
   · El tema oscuro es el principal.
   · Si el usuario no ha elegido nada, se respeta la preferencia del sistema.
   · La elección se guarda en localStorage y sobrescribe al sistema.
   · El tema ya se aplica en un script inline dentro de <head> para evitar el
     "flash" al cargar; aquí solo gestionamos el cambio y la sincronización.
   ========================================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'bp-theme';
  var root   = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var media  = window.matchMedia('(prefers-color-scheme: light)');

  /* ── Acceso seguro a localStorage (puede estar bloqueado) ───────────── */

  function read() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function write(value) {
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* modo privado */ }
  }

  /* ── Aplicación del tema ────────────────────────────────────────────── */

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  function syncToggle(theme) {
    if (!toggle) return;
    var toLight = theme === 'dark';
    toggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    toggle.setAttribute('aria-label', toLight ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
    toggle.setAttribute('title',      toLight ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }

  /* La barra del navegador en móvil sigue el tema activo. El navegador usa
     la primera etiqueta theme-color cuyo `media` coincide, así que no basta
     con añadir otra al final: se actualizan las dos que ya hay en <head>. */
  function syncThemeColor(theme) {
    var color = theme === 'light' ? '#f6f7fa' : '#07080b';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute('content', color);
    });
  }

  /**
   * Aplica un tema.
   * @param {'dark'|'light'} theme
   * @param {boolean} animate  Suaviza la transición de colores del documento.
   */
  function apply(theme, animate) {
    if (animate) {
      root.classList.add('theme-transition');
      window.setTimeout(function () {
        root.classList.remove('theme-transition');
      }, 460);
    }

    root.setAttribute('data-theme', theme);
    syncToggle(theme);
    syncThemeColor(theme);

    // Otros módulos (por ejemplo el canvas del hero) pueden reaccionar al cambio.
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  /* ── Interacción ────────────────────────────────────────────────────── */

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = currentTheme() === 'dark' ? 'light' : 'dark';
      write(next);
      apply(next, true);
    });
  }

  /* Si el usuario no ha elegido tema manualmente, seguimos al sistema. */
  var onSystemChange = function (e) {
    if (read()) return;
    apply(e.matches ? 'light' : 'dark', true);
  };

  if (typeof media.addEventListener === 'function') {
    media.addEventListener('change', onSystemChange);
  } else if (typeof media.addListener === 'function') {
    media.addListener(onSystemChange);          // Safari antiguo
  }

  /* Estado inicial: el atributo ya viene puesto desde <head>. */
  syncToggle(currentTheme());
  syncThemeColor(currentTheme());

  /* API mínima para depurar desde la consola. */
  window.BPTheme = {
    get: currentTheme,
    set: function (theme) {
      var value = theme === 'light' ? 'light' : 'dark';
      write(value);
      apply(value, true);
    },
    reset: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* noop */ }
      apply(media.matches ? 'light' : 'dark', true);
    }
  };

})();
