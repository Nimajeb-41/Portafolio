/* ============================================================================
   BENJAMÍN PAZ — PORTFOLIO
   animations.js · Revelado al hacer scroll y efectos visuales
   ----------------------------------------------------------------------------
   Responsabilidades
     · Revelado de elementos al entrar en el viewport (IntersectionObserver)
     · Escritura animada del terminal del hero
     · Constelación del hero en <canvas>
     · Halo del cursor y hover magnético (solo puntero fino)
     · Brillo que sigue al puntero dentro de las tarjetas
     · Duplicado del marquee para un bucle continuo

   Todo se desactiva o se simplifica si el sistema pide reducir el movimiento,
   si la pestaña está en segundo plano o si el elemento no está en pantalla.
   ========================================================================== */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)');


  /* ══════════════════ 1 · REVELADO AL HACER SCROLL ══════════════════ */

  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!items.length) return;

    // Cada elemento puede declarar su propio retardo con data-reveal-delay="120"
    items.forEach(function (el) {
      var delay = el.getAttribute('data-reveal-delay');
      if (delay) el.style.setProperty('--reveal-delay', delay + 'ms');
    });

    // Sin soporte o sin movimiento: se muestran directamente.
    if (!('IntersectionObserver' in window) || reduceMotion.matches) {
      items.forEach(function (el) { el.classList.add('is-visible', 'is-done'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        var el = entry.target;
        el.classList.add('is-visible');
        observer.unobserve(el);

        // Liberamos will-change cuando la transición ha terminado.
        window.setTimeout(function () { el.classList.add('is-done'); }, 1100);
      });
    }, {
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.12
    });

    items.forEach(function (el) { observer.observe(el); });

    // Red de seguridad: lo que ya esté en pantalla al cargar se revela igual.
    window.requestAnimationFrame(function () {
      items.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) el.classList.add('is-visible');
      });
    });
  }


  /* ══════════════════ 2 · TERMINAL DEL HERO ══════════════════ */

  function initTerminal() {
    var out = document.getElementById('terminal-type');
    if (!out) return;

    var LINES = [
      'developing...',
      'creating...',
      'learning...',
      'building the future.'
    ];

    if (reduceMotion.matches) {
      out.textContent = LINES[LINES.length - 1];
      return;
    }

    var lineIndex = 0;
    var charIndex = 0;
    var deleting  = false;
    var timer     = null;
    var paused    = false;

    function tick() {
      if (paused) { timer = window.setTimeout(tick, 400); return; }

      var line = LINES[lineIndex];

      if (!deleting) {
        charIndex++;
        out.textContent = line.slice(0, charIndex);

        if (charIndex === line.length) {
          // La última frase se queda más tiempo: es la conclusión.
          var hold = lineIndex === LINES.length - 1 ? 2600 : 1400;
          deleting = true;
          timer = window.setTimeout(tick, hold);
          return;
        }
        timer = window.setTimeout(tick, 62 + Math.random() * 55);

      } else {
        charIndex--;
        out.textContent = line.slice(0, charIndex);

        if (charIndex === 0) {
          deleting = false;
          lineIndex = (lineIndex + 1) % LINES.length;
          timer = window.setTimeout(tick, 320);
          return;
        }
        timer = window.setTimeout(tick, 26);
      }
    }

    // No malgastamos ciclos si la pestaña está oculta.
    document.addEventListener('visibilitychange', function () {
      paused = document.hidden;
    });

    timer = window.setTimeout(tick, 900);
  }


  /* ══════════════════ 3 · CONSTELACIÓN DEL HERO ══════════════════ */

  function initHeroCanvas() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas || reduceMotion.matches) return;

    var ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    var particles = [];
    var width = 0, height = 0, dpr = 1;
    var running = false;
    var frame = null;
    var accent = 'rgba(0, 224, 198, ';

    function readAccent() {
      var theme = document.documentElement.getAttribute('data-theme');
      accent = theme === 'light' ? 'rgba(0, 120, 106, ' : 'rgba(0, 224, 198, ';
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width  = rect.width;
      height = rect.height;

      canvas.width  = Math.round(width  * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      build();
    }

    function build() {
      // Densidad proporcional al área, con techo para no castigar equipos lentos.
      var count = Math.min(Math.round((width * height) / 17000), 68);
      particles = [];

      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.5 + 0.6
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      var maxDist = 132;

      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = accent + '0.55)';
        ctx.fill();

        // Líneas solo hacia partículas posteriores: evita dibujar dos veces.
        for (var j = i + 1; j < particles.length; j++) {
          var q  = particles[j];
          var dx = p.x - q.x;
          var dy = p.y - q.y;
          var d2 = dx * dx + dy * dy;

          if (d2 < maxDist * maxDist) {
            var alpha = (1 - Math.sqrt(d2) / maxDist) * 0.22;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = accent + alpha.toFixed(3) + ')';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      frame = window.requestAnimationFrame(draw);
    }

    function start() {
      if (running) return;
      running = true;
      frame = window.requestAnimationFrame(draw);
    }

    function stop() {
      running = false;
      if (frame) window.cancelAnimationFrame(frame);
      frame = null;
    }

    readAccent();
    resize();
    start();

    // Solo animamos mientras el hero está visible y la pestaña activa.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        entries[0].isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(canvas);
    }

    document.addEventListener('visibilitychange', function () {
      document.hidden ? stop() : start();
    });

    document.addEventListener('themechange', readAccent);

    var resizeTimer = null;
    window.addEventListener('resize', function () {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(resize, 180);
    }, { passive: true });
  }


  /* ══════════════════ 4 · HALO DEL CURSOR ══════════════════ */

  function initCursorGlow() {
    var glow = document.getElementById('cursor-glow');
    if (!glow || !finePointer.matches || reduceMotion.matches) return;

    var targetX = 0, targetY = 0;
    var x = 0, y = 0;
    var active = false;
    var raf = null;

    function loop() {
      // Interpolación suave: el halo persigue al cursor con retardo.
      x += (targetX - x) * 0.13;
      y += (targetY - y) * 0.13;
      glow.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
      raf = window.requestAnimationFrame(loop);
    }

    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;

      targetX = e.clientX;
      targetY = e.clientY;

      if (!active) {
        active = true;
        x = targetX; y = targetY;
        glow.classList.add('is-visible');
        raf = window.requestAnimationFrame(loop);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      glow.classList.remove('is-visible');
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden && raf) {
        window.cancelAnimationFrame(raf);
        raf = null;
        active = false;
        glow.classList.remove('is-visible');
      }
    });
  }


  /* ══════════════════ 5 · HOVER MAGNÉTICO ══════════════════ */

  function initMagnetic() {
    if (!finePointer.matches || reduceMotion.matches) return;

    var items = document.querySelectorAll('[data-magnetic]');
    var STRENGTH = 0.22;   // deliberadamente sutil
    var MAX = 7;           // píxeles máximos de desplazamiento

    items.forEach(function (el) {
      el.addEventListener('pointermove', function (e) {
        var rect = el.getBoundingClientRect();
        var dx = (e.clientX - (rect.left + rect.width  / 2)) * STRENGTH;
        var dy = (e.clientY - (rect.top  + rect.height / 2)) * STRENGTH;

        dx = Math.max(-MAX, Math.min(MAX, dx));
        dy = Math.max(-MAX, Math.min(MAX, dy));

        el.style.transform = 'translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px)';
      });

      var reset = function () { el.style.transform = ''; };
      el.addEventListener('pointerleave', reset);
      el.addEventListener('blur', reset);
    });
  }


  /* ══════════════════ 6 · BRILLO EN TARJETAS ══════════════════ */

  function initCardGlow() {
    if (!finePointer.matches) return;

    var cards = document.querySelectorAll('.skill-group, .platform');

    cards.forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
        card.style.setProperty('--my', (e.clientY - rect.top)  + 'px');
      }, { passive: true });
    });
  }


  /* ══════════════════ 7 · MARQUEE CONTINUO ══════════════════ */

  function initMarquee() {
    var track = document.getElementById('marquee-track');
    if (!track) return;

    var group = track.querySelector('.marquee__group');
    if (!group) return;

    // El keyframe desplaza un -50%: hace falta exactamente una copia.
    var clone = group.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  }


  /* ══════════════════ ARRANQUE ══════════════════ */

  function init() {
    initReveal();
    initTerminal();
    initHeroCanvas();
    initCursorGlow();
    initMagnetic();
    initCardGlow();
    initMarquee();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // La galería se genera después: hay que observar sus elementos revelables.
  document.addEventListener('gallery:rendered', function () {
    if (reduceMotion.matches) return;
    document.querySelectorAll('.gallery__grid .reveal:not(.is-visible)').forEach(function (el) {
      el.classList.add('is-visible');
    });
  });

})();
