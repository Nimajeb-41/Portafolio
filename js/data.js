/* ============================================================================
   BENJAMÍN PAZ — PORTFOLIO
   data.js · Contenido de la galería de vídeos
   ----------------------------------------------------------------------------
   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE TOCAR PARA AÑADIR O QUITAR VÍDEOS.
   No hace falta modificar el HTML: las tarjetas, los filtros y el modal se
   generan a partir de este array.

   Campos de cada vídeo
   ---------------------------------------------------------------------------
     id           (obligatorio) Identificador único, en minúsculas y sin espacios.
     title        (obligatorio) Título tal y como quieres que se muestre.
     description  (obligatorio) 1–2 frases. Se ve en la tarjeta y en el modal.
     category     (obligatorio) Debe coincidir con un `id` de VIDEO_CATEGORIES.
     youtube      (recomendado) URL del vídeo en YouTube. Si está, el vídeo se
                                reproduce desde YouTube dentro del modal y
                                `src` deja de hacer falta.
     src          (opcional)    Ruta a un .mp4 dentro de assets/videos/. Solo
                                se usa si el vídeo no tiene `youtube`.
                                OJO: Cloudflare Pages no admite archivos de
                                más de 25 MiB; los vídeos largos, a YouTube.
     poster       (opcional)    Imagen de portada. Si falta, se usa la
                                miniatura de YouTube o un fotograma del .mp4.
     duration     (opcional)    Texto libre: "8:17". Se muestra sobre la portada.
     date         (opcional)    Texto libre: "Marzo 2026". `null` = no se muestra.
     software     (opcional)    Programa de edición. `null` = no se muestra.

   Los campos opcionales que valgan `null` simplemente NO aparecen en la interfaz:
   nunca se muestra un dato vacío ni inventado.
   ========================================================================== */

(function (global) {
  'use strict';

  /* ── Categorías de la galería ──────────────────────────────────────────
     El filtro "Todos" se añade solo; no hace falta declararlo aquí.        */
  var VIDEO_CATEGORIES = [
    { id: 'artropodos', label: 'Serie Artrópodos' },
    { id: 'naturaleza', label: 'Naturaleza' },
    { id: 'ciencia',    label: 'Ciencia' }
  ];

  /* ── Vídeos ────────────────────────────────────────────────────────────
     Los títulos y las duraciones son los reales de cada archivo.

     NOTA SOBRE LAS DESCRIPCIONES: son un borrador redactado a partir del
     título de cada vídeo. Sustitúyelas por tu propio texto cuando quieras —
     es solo cambiar la cadena de la propiedad `description`.

     NOTA SOBRE `date` Y `software`: se dejan en `null` a propósito para no
     publicar datos que no conocemos. Rellénalos cuando quieras y aparecerán
     automáticamente en la ficha técnica del modal.                          */
  var VIDEOS = [

    /* ── Serie: Artrópodos ── */
    {
      id: 'artropodos-introduccion',
      title: '¿Qué son los artrópodos? Introducción',
      description: 'Vídeo de apertura de la serie: qué define al grupo animal más numeroso del planeta y cómo se organiza.',
      category: 'artropodos',
      src: 'assets/videos/artropodos-introduccion.mp4',
      poster: 'assets/videos/posters/artropodos-introduccion.jpg',
      duration: '8:17',
      date: null,
      software: null,
      youtube: null
    },
    {
      id: 'quelicerados',
      title: '¿Qué son los quelicerados? (Arácnidos...)',
      description: 'Segunda entrega de la serie, dedicada a los quelicerados: arañas, escorpiones y compañía.',
      category: 'artropodos',
      src: 'assets/videos/quelicerados.mp4',
      poster: 'assets/videos/posters/quelicerados.jpg',
      duration: '12:38',
      date: null,
      software: null,
      youtube: null
    },
    {
      id: 'hexapodos',
      title: '¿Qué son los hexápodos? (Insectos...)',
      description: 'Los hexápodos y los insectos, el subgrupo con más especies descritas dentro de los artrópodos.',
      category: 'artropodos',
      src: 'assets/videos/hexapodos.mp4',
      poster: 'assets/videos/posters/hexapodos.jpg',
      duration: '15:44',
      date: null,
      software: null,
      youtube: null
    },
    {
      id: 'miriapodos',
      title: '¿Qué son los miriápodos? (Ciempiés, milpiés...)',
      description: 'Ciempiés, milpiés y el resto de miriápodos: anatomía, diversidad y papel en el ecosistema.',
      category: 'artropodos',
      src: 'assets/videos/miriapodos.mp4',
      poster: 'assets/videos/posters/miriapodos.jpg',
      duration: '12:30',
      date: null,
      software: null,
      youtube: null
    },
    {
      id: 'crustaceos',
      title: '¿Qué son los crustáceos? (Cangrejos, camarones, langostas...)',
      description: 'El vídeo más extenso de la serie: un recorrido completo por los crustáceos y su enorme variedad.',
      category: 'artropodos',
      src: 'assets/videos/crustaceos.mp4',
      poster: 'assets/videos/posters/crustaceos.jpg',
      duration: '35:15',
      date: null,
      software: null,
      youtube: null
    },

    /* ── Naturaleza ── */
    {
      id: 'oceano-profundo',
      title: 'El Océano Profundo: ¿Qué misterios alberga las profundidades del mar?',
      description: 'Un viaje hacia las zonas más profundas del océano y la vida que consigue habitarlas.',
      category: 'naturaleza',
      src: 'assets/videos/oceano-profundo.mp4',
      poster: 'assets/videos/posters/oceano-profundo.jpg',
      duration: '17:31',
      date: null,
      software: null,
      youtube: null
    },
    {
      id: 'escorpiones-desierto',
      title: 'El secreto de los escorpiones para vivir en los desiertos',
      description: 'Las adaptaciones que permiten a los escorpiones sobrevivir en uno de los entornos más hostiles.',
      category: 'naturaleza',
      src: 'assets/videos/escorpiones-desierto.mp4',
      poster: 'assets/videos/posters/escorpiones-desierto.jpg',
      duration: '11:32',
      date: null,
      software: null,
      youtube: null
    },
    {
      id: 'lombriz-de-tierra',
      title: 'Uno de los animales más importantes de la vida terrestre: La Lombriz de Tierra',
      description: 'Por qué un animal tan discreto resulta clave para el suelo y para la vida terrestre.',
      category: 'naturaleza',
      src: 'assets/videos/lombriz-de-tierra.mp4',
      poster: 'assets/videos/posters/lombriz-de-tierra.jpg',
      duration: '6:33',
      date: null,
      software: null,
      youtube: null
    },

    /* ── Ciencia ──
       ⚠ AVISO SOBRE ESTE ARCHIVO: uno-mas-uno.mp4 tiene pista de vídeo, pero
       todos sus fotogramas están completamente en negro — solo se escucha el
       audio. Por eso su portada es un marcador provisional en lugar de un
       fotograma real. Si vuelves a exportar el vídeo con imagen, sustituye
       assets/videos/uno-mas-uno.mp4 y su portada.                            */
    {
      id: 'uno-mas-uno',
      title: '¿Por qué uno más uno da dos y no otra cosa?',
      description: 'Una pregunta aparentemente simple para hablar de los fundamentos de la matemática.',
      category: 'ciencia',
      src: 'assets/videos/uno-mas-uno.mp4',
      poster: 'assets/videos/posters/uno-mas-uno.jpg',
      duration: '3:54',
      date: null,
      software: null,
      youtube: null
    }

    /* ── Para añadir un vídeo nuevo, copia este bloque y complétalo ──
    ,{
      id: 'mi-nuevo-video',
      title: 'Título del vídeo',
      description: 'Una o dos frases sobre el vídeo.',
      category: 'naturaleza',                       // id de VIDEO_CATEGORIES
      youtube: 'https://www.youtube.com/watch?v=XXXXXXXXXXX',
      src: null,                                    // solo si no está en YouTube
      poster: 'assets/videos/posters/mi-nuevo-video.jpg',
      duration: '10:00',
      date: 'Marzo 2026',
      software: 'DaVinci Resolve'
    }
    ─────────────────────────────────────────────────────────────── */
  ];

  /* Cuántas tarjetas se muestran antes de pulsar "Ver todos los vídeos" */
  var GALLERY_PAGE_SIZE = 6;

  global.PORTFOLIO_DATA = {
    videoCategories: VIDEO_CATEGORIES,
    videos: VIDEOS,
    galleryPageSize: GALLERY_PAGE_SIZE
  };

})(window);
