# projects/

Carpeta para las **páginas de detalle** de cada proyecto: los casos de estudio
donde se explica un proyecto con más profundidad de la que cabe en una tarjeta
de la portada.

La sección `#proyectos` de `index.html` funciona perfectamente sin esta carpeta.
Úsala solo cuando un proyecto merezca su propia página.

## Cómo crear un caso de estudio

1. Copia `_template.html` y renómbralo con el nombre del proyecto:

   ```
   projects/copa-artropoda.html
   ```

2. Ábrelo y sustituye todo lo marcado con `[[ ]]`. Están todos juntos y son
   fáciles de encontrar buscando `[[` en el editor.

3. Enlázalo desde la tarjeta correspondiente en `index.html`:

   ```html
   <a class="btn btn--sm btn--primary" href="projects/copa-artropoda.html">
     Ver caso de estudio <i data-lucide="arrow-right" aria-hidden="true"></i>
   </a>
   ```

## Detalles a tener en cuenta

- Las rutas del template ya apuntan a `../css/`, `../js/` y `../assets/`.
  Si mueves el archivo de carpeta, habrá que ajustarlas.
- La plantilla reutiliza el mismo sistema de diseño que la portada: no hace
  falta escribir CSS nuevo. Las clases disponibles están documentadas en
  `css/style.css`, organizadas por secciones.
- El modo oscuro/claro, la navbar y las animaciones funcionan igual, porque
  se cargan los mismos archivos JavaScript.
- `js/video.js` y `js/data.js` no se incluyen en la plantilla: solo hacen falta
  si la página de detalle lleva galería de vídeo propia.

## Contenido sugerido para un caso de estudio

Un buen caso de estudio responde a estas preguntas, en este orden:

1. **Qué es** — una frase que lo resuma
2. **Por qué lo construí** — el problema o la motivación
3. **Cómo funciona** — decisiones técnicas y por qué se tomaron
4. **Qué aprendí** — la parte más valiosa para quien lee un portfolio junior
5. **Qué haría diferente** — honestidad, que vale más que aparentar perfección

Evita el listado de tecnologías sin contexto: es más interesante *por qué*
elegiste algo que *qué* elegiste.
