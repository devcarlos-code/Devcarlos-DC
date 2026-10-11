# DevCarlos — Portafolio web

Portafolio personal de proyectos web interactivos, construido con HTML, CSS y JavaScript vanilla. La interfaz utiliza una estética oscura inspirada en un sistema de videojuego, con detalles azul eléctrico, animaciones y un catálogo filtrable.

## Vista previa y demo

- **Sitio publicado:** https://devcarlos-tech.netlify.app/
- **Repositorio:** https://github.com/devcarlos-code/Devcarlos-DC

## Funciones

- Catálogo de proyectos cargado desde `proyectos.json`.
- Filtros por categoría y accesos directos a cada proyecto.
- Diseño adaptable a móviles, tabletas y escritorio.
- Navegación móvil y enlaces a contacto/redes.
- Efectos visuales, animaciones de aparición y preferencias de movimiento reducido.
- Ventanas de información legal y una interfaz temática inspirada en videojuegos.

## Estructura principal

- `index.html`: estructura y contenido de la página principal.
- `styles.css`: tema visual, componentes, animaciones y estilos responsivos.
- `main.js`: catálogo, filtros, navegación, modales, estado de scroll y utilidades.
- `sl-effects.js`: efectos temáticos adicionales.
- `proyectos.json`: catálogo manual de proyectos.
- `assets/`: imágenes y recursos visuales.
- `proyectos-nuevos/`: proyectos independientes.

## Ejecutar localmente

Este sitio utiliza `fetch()` para cargar el catálogo, así que debe abrirse mediante un servidor HTTP y no directamente como `file://`.

### Opción rápida con Python

Desde la carpeta raíz del repositorio:

```bash
python -m http.server 8080
```

Después abre `http://localhost:8080` en el navegador.

### Opción con Node.js

Si ya tienes Node.js instalado:

```bash
npx serve .
```

## Añadir un proyecto

Agrega una entrada a `proyectos.json`:

```json
{
  "titulo": "Nombre del proyecto",
  "descripcion": "Una descripción breve y concreta.",
  "imagen": "assets/img/preview.webp",
  "ruta": "proyectos-nuevos/mi-proyecto/index.html",
  "categorias": ["Interactivos"],
  "tecnologias": ["HTML", "CSS", "JavaScript"]
}
```

Comprueba que la ruta y la imagen existan, y que los nombres de carpetas coincidan exactamente en mayúsculas y minúsculas. Usa capturas propias y optimizadas, preferiblemente WebP o AVIF cuando sea compatible.

## Antes de publicar

- Prueba anchos de 320, 360, 390, 600, 768 y 1024 píxeles.
- Comprueba navegación por teclado, foco visible y zoom del navegador.
- Prueba los enlaces y recursos con rutas relativas.
- Verifica el funcionamiento de los filtros, ventanas y botón de copiar enlace.
- Mantén actualizados los textos legales, los niveles de habilidad y los datos de contacto.
- Evita subir archivos multimedia innecesariamente pesados.

## Accesibilidad y rendimiento

Se incluyen estilos para movimiento reducido y dispositivos táctiles, además de un diseño de cuadrícula flexible. Los efectos decorativos deben seguir siendo secundarios al contenido y a la navegación.

## Licencia

No se especifica una licencia de reutilización en este repositorio. Si quieres permitir que otras personas reutilicen el código, añade una licencia explícita y comprueba que los recursos incluidos puedan redistribuirse.
