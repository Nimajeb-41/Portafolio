# Benjamín Paz — Portfolio

> **Web Developer & Video Editor** · Uruguay 🇺🇾

Portfolio personal de **Benjamín Paz**: un sitio web estático, hecho a mano con
HTML5, CSS3 y JavaScript, que reúne dos áreas de trabajo — el **desarrollo web**
y la **edición audiovisual**.

No es una plantilla. El diseño, el sistema de estilos, las animaciones y la
galería de vídeo están construidos desde cero para este proyecto.

---

## Índice

- [Sobre Benjamín Paz](#sobre-benjamín-paz)
- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo ejecutarlo](#cómo-ejecutarlo)
- [Cómo añadir un vídeo](#cómo-añadir-un-vídeo)
- [Cómo añadir un proyecto](#cómo-añadir-un-proyecto)
- [Cómo cambiar la información personal](#cómo-cambiar-la-información-personal)
- [Cómo cambiar imágenes y portadas](#cómo-cambiar-imágenes-y-portadas)
- [Cómo cambiar los colores y la tipografía](#cómo-cambiar-los-colores-y-la-tipografía)
- [Cómo desplegarlo](#cómo-desplegarlo)
- [Accesibilidad](#accesibilidad)
- [Decisiones técnicas](#decisiones-técnicas)
- [Pendiente de completar](#pendiente-de-completar)
- [Future Improvements](#future-improvements)
- [Licencia](#licencia)

---

## Sobre Benjamín Paz

Benjamín Paz tiene 18 años y es de Uruguay. Actualmente se está formando en el
área de **informática y tecnologías de la información**, y en paralelo desarrolla
proyectos propios mientras amplía sus conocimientos en programación, desarrollo
web, herramientas digitales y edición audiovisual.

Su objetivo profesional es seguir creciendo como desarrollador, avanzar hacia el
**Full Stack** y continuar creando proyectos donde la tecnología y la creatividad
se cruzan.

**Contacto**

| Canal | |
|---|---|
| WhatsApp | [+598 97 556 853](https://wa.me/59897556853) |
| Email | [nimajneb.zap.41@gmail.com](mailto:nimajneb.zap.41@gmail.com) |
| GitHub | [@Nimajeb-41](https://github.com/Nimajeb-41) |
| Behance | [BenjaminPaz123](https://www.behance.net/BenjaminPaz123) |
| YouTube | [@elaracnido515](https://www.youtube.com/@elaracnido515) |

---

## Características

**Diseño e interfaz**
- Estética oscura, tecnológica y cinematográfica, con un único color de acento
- **Dark / Light mode** con transición suave, guardado en `localStorage` y
  respeto por la preferencia del sistema cuando no hay elección previa
- Navbar sticky con `backdrop-filter`, estado compacto al hacer scroll y
  marcado automático de la sección activa (*scroll spy*)
- Menú móvil a pantalla completa con foco atrapado, cierre con `ESC` y `inert`
- Fondo con rejilla, auroras difuminadas y una capa de ruido muy sutil

**Animación**
- Revelado al entrar en el viewport con `IntersectionObserver`
- Terminal del hero con escritura animada (`developing… / creating… / learning… /
  building the future.`)
- Constelación de partículas en `<canvas>`, que **se detiene** cuando el hero
  sale de pantalla o la pestaña pasa a segundo plano
- Halo de cursor y hover magnético, ambos limitados a punteros finos
- Todo se desactiva con `prefers-reduced-motion: reduce`

**Contenido**
- Sección **Sobre mí** con datos rápidos y una *timeline* de recorrido
  profesional, sin fechas inventadas
- **Skills** agrupadas por categoría, sin barras de porcentaje falsas
- **Featured Projects** con proyectos reales y espacios reservados
  claramente marcados como *en desarrollo*
- **Video Editing** con galería filtrable por categoría y paginación
- **Modal de vídeo accesible**: `role="dialog"`, `aria-modal`, foco atrapado,
  cierre con `ESC` o clic fuera, navegación anterior/siguiente con flechas y
  botón de pantalla completa

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| **HTML5** | Estructura semántica (`header`, `nav`, `main`, `section`, `article`, `footer`) |
| **CSS3** | Sistema de diseño con *custom properties*, Grid, Flexbox, `color-mix()`, `backdrop-filter` |
| **JavaScript (ES6+)** | Módulos IIFE independientes, sin build ni empaquetador |
| **Lucide Icons** | Iconos de interfaz, vía CDN |
| Canvas API | Constelación animada del hero |
| IntersectionObserver | Revelado al hacer scroll y *scroll spy* |

Sin dependencias que instalar, sin `node_modules`, sin paso de compilación.

### Por qué no se usan Tailwind ni GSAP

Ambos estaban sobre la mesa y se descartaron por motivos concretos:

- **Tailwind CSS** solo puede usarse aquí a través del *Play CDN*, que compila
  las clases en el navegador en tiempo de ejecución. Eso añade ~300 KB de
  JavaScript, provoca un parpadeo de estilos sin aplicar al cargar y obliga a
  meter todo el diseño dentro del HTML — justo lo contrario de la separación de
  responsabilidades que pedía el proyecto. Un sistema de tokens en CSS puro
  cumple el mismo objetivo con menos peso y más control.
- **GSAP** es excelente, pero todo lo que anima este sitio (revelados,
  transiciones, escritura del terminal, partículas) se resuelve con
  `IntersectionObserver`, transiciones CSS y un único bucle `requestAnimationFrame`.
  Añadir una librería de animación habría sido peso sin beneficio.

**Lucide Icons sí se usa**, porque aporta un set de iconos consistente que sería
absurdo redibujar a mano. Los iconos de marca (GitHub, YouTube, Behance,
WhatsApp) van incrustados como *sprite* SVG propio: Lucide no los incluye y así
funcionan incluso sin conexión al CDN.

---

## Estructura del proyecto

```
miportafolioweb/
│
├── index.html                  Página única con todas las secciones
│
├── assets/
│   ├── images/                 Imágenes generales y og-image
│   ├── videos/                 Archivos .mp4 de la galería
│   │   └── posters/            Portadas .jpg de cada vídeo
│   └── icons/
│       └── favicon.svg         Monograma BP
│
├── css/
│   ├── style.css               Tokens, layout y componentes
│   ├── animations.css          Keyframes, revelados y microinteracciones
│   └── responsive.css          Media queries por dispositivo
│
├── js/
│   ├── data.js                 ← DATOS DE LOS VÍDEOS (editar aquí)
│   ├── theme.js                Dark / light mode + localStorage
│   ├── navigation.js           Navbar, scroll spy, menú móvil, back-to-top
│   ├── animations.js           IntersectionObserver, canvas, cursor, terminal
│   ├── video.js                Galería filtrable y modal accesible
│   └── main.js                 Inicialización general
│
├── projects/                   Páginas de detalle por proyecto (opcional)
│   ├── README.md
│   └── _template.html          Plantilla de caso de estudio
│
├── README.md
└── LICENSE
```

> **Nota sobre el orden de los `<script>`:** `data.js` debe cargarse antes que
> `video.js`. Todos usan `defer`, así que se ejecutan en el orden en que
> aparecen en el HTML.

---

## Cómo ejecutarlo

El proyecto es HTML estático, pero **no basta con abrir `index.html` haciendo
doble clic**: al usar el protocolo `file://`, algunos navegadores bloquean la
reproducción de los vídeos locales. Levanta un servidor local.

**Opción 1 — Python** (viene preinstalado en muchos sistemas):

```bash
cd C:/Users/Usuario/Documents/miportafolioweb && python -m http.server 5500
```

**Opción 2 — Node.js**:

```bash
npx serve C:/Users/Usuario/Documents/miportafolioweb -l 5500
```

**Opción 3 — VS Code**: instala la extensión *Live Server*, haz clic derecho
sobre `index.html` → **Open with Live Server**.

Después abre <http://localhost:5500> en el navegador.

---

## Cómo añadir un vídeo

Todo el contenido de la galería vive en **`js/data.js`**. No hay que tocar el
HTML: las tarjetas, los filtros, el contador y el modal se generan solos.

**1.** Copia el archivo `.mp4` a `assets/videos/`.
Usa un nombre sin espacios, tildes ni mayúsculas: `mi-nuevo-video.mp4`.

**2.** (Opcional) Coloca una portada en `assets/videos/posters/` con el mismo
nombre: `mi-nuevo-video.jpg`.
Si no la pones, la web extrae automáticamente un fotograma del propio vídeo.

**3.** Abre `js/data.js` y añade un objeto al array `VIDEOS`:

```js
{
  id: 'mi-nuevo-video',
  title: 'Título del vídeo',
  description: 'Una o dos frases sobre el vídeo.',
  category: 'naturaleza',                     // id de VIDEO_CATEGORIES
  src: 'assets/videos/mi-nuevo-video.mp4',
  poster: 'assets/videos/posters/mi-nuevo-video.jpg',
  duration: '10:00',
  date: 'Marzo 2026',                         // null si no la conoces
  software: 'DaVinci Resolve',                // null si prefieres no indicarlo
  youtube: 'https://youtu.be/XXXXXXXX'        // null si no aplica
}
```

Los campos con valor `null` **no se muestran**: nunca aparece un dato vacío.

**Para crear una categoría nueva**, añádela al array `VIDEO_CATEGORIES` del
mismo archivo:

```js
{ id: 'tutoriales', label: 'Tutoriales' }
```

Las categorías sin ningún vídeo no generan botón de filtro.

**Cuántas tarjetas se ven de inicio:** cambia `GALLERY_PAGE_SIZE` (por defecto
`6`); el resto aparece al pulsar *Ver todos los vídeos*.

---

## Cómo añadir un proyecto

Los proyectos están en `index.html`, dentro de `<section id="proyectos">`.
Copia un bloque `<article class="project">` completo y edítalo:

```html
<article class="project reveal" data-reveal-delay="80">
  <div class="project__visual">
    <div class="project__art project__art--empty" aria-hidden="true">
      <i data-lucide="layout-dashboard"></i>
    </div>
    <span class="project__badge project__badge--live">
      <i data-lucide="circle-check" aria-hidden="true"></i> Publicado
    </span>
  </div>
  <div class="project__body">
    <p class="project__idx">Proyecto 05</p>
    <h3 class="project__title">Nombre del proyecto</h3>
    <p class="project__desc">Qué hace y por qué lo construiste.</p>
    <ul class="project__tags" role="list">
      <li>HTML5</li><li>CSS3</li><li>JavaScript</li>
    </ul>
    <div class="project__actions">
      <a class="btn btn--sm btn--primary" href="URL_DEL_REPO" target="_blank" rel="noopener noreferrer">
        <svg class="brand-ic" aria-hidden="true"><use href="#i-github"></use></svg>
        Ver código
      </a>
      <a class="btn btn--sm btn--ghost" href="URL_DE_LA_DEMO" target="_blank" rel="noopener noreferrer">
        Ver demo <i data-lucide="arrow-up-right" aria-hidden="true"></i>
      </a>
    </div>
  </div>
</article>
```

**Modificadores disponibles**

| Clase | Efecto |
|---|---|
| `project--wide` | Ocupa las dos columnas, con la imagen a la izquierda |
| `project--placeholder` | Borde discontinuo, para un espacio aún reservado |
| `project__badge--live` | Etiqueta verde *Publicado* |
| `project__badge--wip` | Etiqueta naranja *En desarrollo* |
| `project__badge--soon` | Etiqueta gris *Proyecto en desarrollo* |

Para una **imagen real** en lugar del arte generado por CSS, sustituye
`<div class="project__art">…</div>` por:

```html
<img src="assets/images/mi-proyecto.jpg" alt="Captura de Nombre del proyecto" loading="lazy">
```

Si el proyecto merece una página propia, usa `projects/_template.html`
(ver `projects/README.md`).

---

## Cómo cambiar la información personal

| Qué | Dónde |
|---|---|
| Nombre, rol y descripción del hero | `index.html` → `<section class="hero">` |
| Texto de *Sobre mí* | `index.html` → `<section id="sobre-mi">` |
| Etapas de la timeline | `index.html` → `<ol class="timeline">` |
| Skills | `index.html` → `<section id="skills">`, listas `<ul class="chips">` |
| Enlaces de contacto | Buscar y reemplazar en `index.html` (aparecen en navbar, hero, contacto y footer) |
| Título y descripción SEO | `index.html` → `<head>` |

**Enlaces que se repiten en varios sitios** — si cambias uno, cámbialo en todos:

```
https://wa.me/59897556853
mailto:nimajneb.zap.41@gmail.com
https://github.com/Nimajeb-41
https://www.behance.net/BenjaminPaz123
https://www.youtube.com/@elaracnido515
```

**Añadir una skill nueva:**

```html
<li class="chip"><span class="chip__glyph" aria-hidden="true">TS</span>TypeScript</li>
```

---

## Cómo cambiar imágenes y portadas

| Imagen | Ruta | Notas |
|---|---|---|
| Favicon | `assets/icons/favicon.svg` | Monograma editable como texto |
| Imagen para redes (Open Graph) | `assets/images/og-image.jpg` | 1200 × 630 px |
| Portadas de vídeo | `assets/videos/posters/<id>.jpg` | 16:9, 1024 × 576 px |
| Capturas de proyecto | `assets/images/` | Referenciar con `<img>` en la tarjeta |

**Consejo de peso:** exporta las portadas en JPG a calidad ~75 y por debajo de
200 KB. Las etiquetas ya llevan `loading="lazy"` y `decoding="async"`.

---

## Cómo cambiar los colores y la tipografía

Todo el sistema visual son *custom properties* al principio de `css/style.css`.
Cambiar una variable actualiza el sitio entero.

```css
:root {
  --accent:   #00e0c6;   /* acento principal */
  --accent-2: #5b7cfa;   /* segundo color del gradiente */
  --warm:     #ff8a4c;   /* acento de la sección de vídeo */
  --bg:       #07080b;   /* fondo del tema oscuro */
}
```

El bloque `:root[data-theme="light"]`, justo debajo, define los mismos tokens
para el modo claro. **Si cambias el acento, ajusta también su versión clara**:
un color pensado para fondo oscuro pierde contraste sobre blanco.

Las tipografías se cargan desde Google Fonts en `<head>` y se asignan en
`--font-display` (Space Grotesk), `--font-body` (Inter) y `--font-mono`
(JetBrains Mono).

---

## Cómo desplegarlo

Al ser un sitio estático, funciona en cualquier hosting.

**GitHub Pages** (gratis, y encaja con el GitHub del portfolio):

```bash
git init && git add . && git commit -m "Portfolio inicial"
```

```bash
git branch -M main && git remote add origin https://github.com/Nimajeb-41/portfolio.git && git push -u origin main
```

Después: repositorio → **Settings → Pages → Source: `main` / `root`**.
El sitio queda en `https://nimajeb-41.github.io/portfolio/`.

**Netlify o Vercel:** arrastra la carpeta a su panel, o conecta el repositorio.
No hay comando de build; el directorio de publicación es la raíz.

> ⚠️ **Importante sobre los vídeos.** La carpeta `assets/videos/` pesa unos
> **280 MB**. GitHub avisa a partir de 50 MB por archivo y Pages tiene un límite
> recomendado de 1 GB por repositorio. Antes de publicar tienes dos opciones:
>
> 1. **Comprimir** los `.mp4` (por ejemplo con HandBrake a 1080p / ~2 Mbps),
>    lo que suele reducir el peso a una fracción; o
> 2. **Alojar los vídeos en YouTube** y usar el campo `youtube` de `data.js`,
>    dejando solo las portadas en el repositorio.
>
> La segunda opción es la más recomendable para producción: la carga es mucho
> más rápida y el repositorio se mantiene ligero.

---

## Accesibilidad

Lo que ya está resuelto:

- HTML semántico y un único `<h1>` por página
- Enlace *Saltar al contenido principal* al pulsar `Tab`
- `:focus-visible` visible y consistente en todos los elementos interactivos
- Navegación completa por teclado, incluidos el menú móvil y el modal
- Modal con `role="dialog"`, `aria-modal="true"`, `aria-labelledby`,
  `aria-describedby`, foco atrapado y devolución del foco al cerrar
- `aria-label` en todos los botones que solo muestran un icono
- Estados que **no dependen solo del color**: las etiquetas de proyecto llevan
  icono y texto, y los filtros usan `aria-pressed`
- Elementos decorativos marcados con `aria-hidden="true"`
- `prefers-reduced-motion: reduce` desactiva animaciones, partículas y el
  halo del cursor
- **Contraste verificado**: se midió el ratio real de cada estilo de texto
  sobre su fondo compuesto en ambos temas. El mínimo es **5.19:1** en oscuro y
  **5.20:1** en claro, por encima del 4.5:1 que exige WCAG AA.
  Por eso `--text-3` y los acentos del tema claro son más oscuros de lo que
  parecería "bonito" a simple vista: están calibrados, no elegidos al azar.

Pendiente de verificar con lectores de pantalla reales (NVDA / VoiceOver).

---

## Decisiones técnicas

**Un solo `index.html`.** El recorrido es una narrativa continua: quién soy →
qué sé → qué he hecho → cómo contactarme. Partirlo en páginas rompería la
lectura y añadiría cargas innecesarias.

**Vídeos generados desde datos, proyectos escritos en HTML.** La galería crece
constantemente y merece un array editable; los proyectos son pocos, son el
contenido principal y se benefician de estar en el HTML para SEO y para
funcionar sin JavaScript.

**Rendimiento cuidado en los detalles:** el `<canvas>` se detiene fuera de
pantalla y con la pestaña oculta, el scroll va a través de
`requestAnimationFrame`, `will-change` se libera cuando la animación termina, y
el modal descarta el búfer del vídeo al cerrarse.

**Nada de dependencias que instalar.** Se puede clonar el repositorio y abrirlo
con un servidor estático. Sin `npm install`, sin build, sin configuración.

---

## Pendiente de completar

Estos datos se dejaron deliberadamente vacíos para no publicar información
inventada. Rellénalos cuando quieras:

- [ ] **`uno-mas-uno.mp4` no tiene imagen.** El archivo decodifica correctamente,
      pero **todos sus fotogramas son negros**: solo contiene audio. Su portada
      es un marcador provisional que lo indica de forma explícita. Si vuelves a
      exportar ese vídeo con imagen, sustituye el `.mp4` y regenera la portada.
- [ ] **Fechas de los vídeos** — campo `date` en `js/data.js` (ahora `null`).
- [ ] **Software de edición** — campo `software` en `js/data.js` (ahora `null`).
- [ ] **Enlaces a YouTube por vídeo** — campo `youtube` en `js/data.js`.
- [ ] **Descripciones de los vídeos** — son un borrador redactado a partir del
      título de cada uno; sustitúyelas por tu propio texto.
- [ ] **Proyectos 03 y 04** — marcados como *Proyecto en desarrollo*.
- [ ] **Repositorio del portfolio** — la tarjeta indica *Repositorio próximamente*.

---

## Future Improvements

Ideas para las siguientes versiones, ordenadas por el aprendizaje que aportan:

**Corto plazo**
- Formulario de contacto real con validación y envío (Formspree, o backend propio)
- Comprimir los vídeos y generar portadas automáticamente con FFmpeg
- Página de detalle por proyecto usando `projects/_template.html`
- Versión en inglés con selector de idioma

**Medio plazo — hacia el Full Stack**
- **Backend** en Node.js + Express que sirva proyectos y vídeos vía API
- **Base de datos** (MySQL o PostgreSQL) para el catálogo de contenido
- **Sistema dinámico de proyectos**: alta, edición y borrado sin tocar código
- Panel de administración privado con autenticación

**Largo plazo**
- **CMS headless** (Strapi, Sanity o Directus) para editar el contenido desde
  el navegador
- **Integración con APIs**: repositorios y estadísticas desde la API de GitHub,
  últimos vídeos desde la API de YouTube
- Reescritura del front-end en **React** o **Astro**, reutilizando este mismo
  sistema de diseño
- Blog técnico con notas de aprendizaje
- Analítica respetuosa con la privacidad y tests automáticos de accesibilidad

---

## Licencia

El **código** de este proyecto se publica bajo licencia MIT — ver [LICENSE](LICENSE).

El **contenido personal** (textos, vídeos, imágenes, marca y nombre de Benjamín
Paz) **no** está cubierto por esa licencia y no puede reutilizarse sin permiso.
Los detalles están en el propio archivo `LICENSE`.

---

<div align="center">

**Benjamín Paz** · Web Developer & Video Editor · Uruguay 🇺🇾

[GitHub](https://github.com/Nimajeb-41) ·
[Behance](https://www.behance.net/BenjaminPaz123) ·
[YouTube](https://www.youtube.com/@elaracnido515) ·
[WhatsApp](https://wa.me/59897556853)

</div>
