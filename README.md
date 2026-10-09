# Mi Link — Liquid Glass · Astro SSG

Sitio estático con Astro, componentes React, TypeScript y Tailwind CSS. Conserva el diseño para móvil y PC.

## Ejecutar

Requiere Node.js 22.12 o superior.

```powershell
cd "$env:USERPROFILE\Documents\mi-link"
npm install
npm run dev -- --port 5174
```

## Personalizar

Edita `src/profile.ts`: nombre, biografía, redes, correo, WhatsApp y foto. Los enlaces vacíos muestran un aviso. Guarda una foto en `public/foto.jpg` y usa `photo: '/foto.jpg'`. Si publicas bajo una subcarpeta, adapta también las rutas de las imágenes al `base` configurado.

## Compilar y publicar

```powershell
npm run build
npm run preview
```

El build ejecuta `astro check` y genera `dist/index.html` y sus recursos. Publica **todo el contenido de dist/** en un alojamiento estático. No requiere servidor Node en producción ni adaptador SSR. `preview` permite revisar el resultado de producción localmente.

El perfil, las cartas/enlaces y los metadatos ya vienen en el HTML generado. No se hidrata toda la página. El fondo morado se renderiza durante el build y se anima con CSS, sin hidratar React. Un script pequeño maneja el diálogo y las entradas al aparecer en pantalla. Se conservan hover, teclado y movimiento reducido.

## Archivos

- `src/pages/index.astro`: página, metadatos y composición SSG.
- `src/App.tsx`: contenido React renderizado como HTML estático.
- `src/profile.ts`: datos y tipos del perfil.
- `src/scripts/page-ui.ts`: diálogo y animaciones de entrada con IntersectionObserver.
- `src/styles.css`: diseño responsive y estados hover.
- `src/components/VioletBackground/`: fondo reutilizable.
- `INTEGRACION_CMS_STRAPI.md`: integración propuesta al compilar, con secretos fuera del navegador.

Se guardó la versión previa en `respaldo-vite-antes-astro.zip`. Para recuperarla, extrae el ZIP en otra carpeta e instala sus dependencias.

Astro usa Vite internamente; el proyecto ya no utiliza una entrada SPA ni `createRoot`.
