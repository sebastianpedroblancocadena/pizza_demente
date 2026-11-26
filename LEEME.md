# Demente — Pizza, Pan & Sándwiches Artesanales
## Documentación de Front-End, Dirección de Arte y Mantenimiento

Sitio web y landing page desarrollado con la metodología **Ruva Web Pro** para la pizzería artesanal **Demente** en La Paz, Bolivia.

---

### 1. Estructura de Archivos del Proyecto

```text
PIZZA DEMENTE/
├── index.html                  # Landing page completa con toda la carta y animaciones
├── direccion-de-arte.html      # Hoja de muestra interactiva aprobada
├── LEEME.md                    # Este documento técnico
├── css/
│   └── styles.css              # Sistema de diseño, tokens, responsive y estilos
├── js/
│   └── main.js                 # GSAP ScrollTrigger, Lenis smooth scroll y dial interactivo
├── vendor/                     # Librerías locales en versiones exactas
│   ├── gsap.min.js             # GSAP 3.13.0
│   ├── ScrollTrigger.min.js    # ScrollTrigger 3.13.0
│   ├── SplitText.min.js        # SplitText 3.13.0
│   └── lenis.min.js            # Lenis 1.3.11
├── img/                        # Fotografías y recursos optimizados en WebP
│   ├── logo-demente.png        # Logo original con fondo transparente
│   ├── pizza-pepperoni.webp    # Pizza artesanal recortada para el dial giratorio
│   ├── pizza-artesanal-leña.webp
│   ├── horno-leña.webp         # Horno de barro y leña encendido a 450°C
│   ├── chef-preparando.webp    # Acción de cocina y condimentos
│   ├── chefs-equipo.webp       # Equipo y fundadores de Demente
│   ├── equipo-demente-cutout.png # Foto de personal con chroma key recortado
│   ├── evento-pizza-vino.webp  # Cartel oficial Pizza y Vino con Vinalt
│   └── ilustracion-cajas.webp  # Ilustración oficial para pasantías
└── materiales/                 # Archivos originales de referencia y logos
```

---

### 2. Dirección de Arte & Tokens Técnicos

#### Paleta de Color
* `--brand: #21441B`: Verde bosque profundo. Color identitario principal en encabezados, portada y pie de página.
* `--accent: #E1FCAD`: Verde lima / pistacho eléctrico. Acento fresco y juvenil, etiquetas y palabras clave.
* `--bg: #F7F6EE`: Crema harina & masa madre. Fondo cálido que evoca panadería tradicional.
* `--bg-dark: #11200F`: Verde noche / carbón vegetal para la sección de cocina y horno.
* `--cta: #D62828`: Rojo brasa & salsa San Marzano. Color de acción exclusiva para botones de WhatsApp.
* `--cta-ink: #FFFFFF`: Letra blanca. Contraste WCAG comprobado: 4.65:1 (Pasa nivel AA).
* `--ink: #142211`: Tinta oscura para texto corrido con legibilidad óptima.
* `--muted: #53644F`: Texto secundario de alta legibilidad sobre crema.

#### Tipografías
* **Titulares:** `Bricolage Grotesque` (pesos 700 y 800) de Google Fonts. Curvas orgánicas, gruesas y setenteras que empatan con el logo "DE MENTE".
* **Lectura y UI:** `Plus Jakarta Sans` (pesos 400, 500, 600, 700) de Google Fonts. Geometría limpia y nítida en celulares a 375 px.

#### Movimiento & Animaciones (Arquitectura Nativa)
* **Tecnologías principales:**
  * **Intersection Observer API (`js/main.js`):** Orquesta el Scroll Reveal (`fade + slide` con retrasos escalonados), Image Reveal (`clip-path` + escala suave), contadores numéricos (`48h`, `450°C`, `90s`, `4.8★`) y estados del encabezado/barra móvil mediante sentinelas sin `scroll` listeners pesados.
  * **CSS Scroll-Driven Animations (`css/styles.css`):** Progreso superior de lectura (`animation-timeline: scroll()`), rotación sutil del dial hero al descender y parallax diferenciado (`animation-timeline: view()`) entre el logo DE MENTE de fondo y el recorte del personal al frente.
  * **Web Animations API + CSS Transitions:** Entradas secuenciales al cargar el Hero, intercambio táctil de especialidades en el dial y filtros instantáneos de la carta.
* **Tokens:**
  * Entrada: `--ease: cubic-bezier(0.16, 1, 0.3, 1)`.
  * Rebote sutil: `--ease-pop: cubic-bezier(0.34, 1.68, 0.68, 1)`.
  * Prioridad de propiedades en GPU: `transform`, `opacity` y `clip-path`.

---

### 3. Funcionalidades & Efectos Interactivos

1. **Dial Giratorio en el Hero (8 Pizzas Reales):**  
   Permite alternar e intercambiar en vivo entre las 8 especialidades (*Jamón Serrano, Chorizo Picante, Tocino & Papa, 4 Quesos, Salame, Hongos, Carnívora y Hawaiana*), acompañado de rotación vinculada al scroll mediante CSS Scroll-Driven Animations.
2. **Marquesina Dinámica:**  
   Cinta continua con los pilares de la casa y separadores en espiga de trigo.
3. **Ubicación Cañada Strongest:**  
   Tarjeta unificada para la casa de **Cañada Strongest #1862** con mapa interactivo, horarios y accesos directos a Google Maps y PedidosYa.
4. **Carta Oficial de 9 Pizzas & Filtro Instantáneo:**  
   Carta enfocada 100% en las 9 pizzas artesanales al horno de leña, con filtro en vivo (*Todas*, *Más Vendidas*, *Carnes & Picantes*, *Quesos & Veggie*), revelado progresivo de fotografías (`[data-img-reveal]`) y enlace directo a WhatsApp.
5. **Retrato del Equipo sobre Logo Demente:**  
   En la sección *Fermentación lenta, fuego vivo y mentes libres*, se exhibe la fotografía recortada del personal de Google Drive sin logo frontal sobre un fondo decorado con el logo DE MENTE con parallax por capas.
6. **Barra Fija Flotante para Celular:**  
   Activada por Intersection Observer al salir del Hero y ocultada automáticamente al llegar al footer.
7. **Accesibilidad Total:**  
   Si el usuario tiene activado *Reducir movimiento* (`prefers-reduced-motion`) o navega sin JavaScript, el contenido se muestra completo y sin bloqueos.

---

### 4. Fuentes de Datos Reales

* **Reseñas Google:** 4.8 / 5.0 con más de 205 opiniones reales.
* **Precios oficiales de la carta (9 Pizzas):**
  * Jamón Serrano: Bs 82
  * Pizza Salame: Bs 73
  * Pizza Carnívora: Bs 87
  * Chorizo Picante: Bs 80
  * Tocino y Papa: Bs 80
  * Cuatro Quesos: Bs 84
  * Hongos de Pino: Bs 74
  * Pizza Hawaiana: Bs 70
  * Pizza Vegana: Bs 72
* **Teléfono / WhatsApp:** 73211810.
* **Horarios:** Lunes a sábado de 16:00 a 22:00 (Domingos cerrado).

---

### 5. Decisiones Aplicadas

* [x] **Logo en header ampliado:** Se recortó el margen transparente de `logo-demente.png` y se amplió su altura visual sin agrandar la barra superior.
* [x] **Ubicación única:** Cañada Strongest #1862 sin etiqueta `(Principal)` ni sucursal San Miguel.
* [x] **Menú enfocado exclusivamente en pizzas:** Se retiraron sándwiches, cachete de res 14h, pan de ajo y gaseosas.
* [x] **Comunidad sin bloques fotográficos:** Se retiraron las tarjetas con fotos de pasantías, pizza y vino y catering (mencionados discretamente en texto bajo consulta).
* [x] **Sección Manifiesto:** Retrato único recortado del personal sobre el logo de Demente de fondo.

---

### 6. Cómo Publicar en Internet

1. **Netlify Drop (Gratis):**
   * Ingresa a [app.netlify.com/drop](https://app.netlify.com/drop) con sesión iniciada.
   * Arrastra la carpeta completa `PIZZA DEMENTE`.
   * En 15 segundos tendrás tu enlace público con HTTPS gratuito.
2. **Hosting Propio (cPanel / Hostinger / etc.):**
   * Sube los archivos a la carpeta `public_html/`.
   * Si actualizas el CSS o JS en el futuro, cambia el parámetro de versión `?v=...` para evitar caché en los navegadores de tus clientes.
