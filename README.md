# Transportes Portillo — Manifiesto de Carga

Formulario web (React + Tailwind CSS + daisyUI) para capturar los datos de
cada contenedor despachado:

- Nombre del contenedor
- Fecha
- Nombre de la empresa
- Contacto
- Teléfono
- Operador
- Placas
- Plazo
- Costo

Cada registro guardado se muestra abajo como una "ficha" (folio) con número
consecutivo. Los datos se guardan en el navegador (localStorage), así que
persisten al recargar la página, pero **no se comparten entre dispositivos**
— si necesitas que todo tu equipo vea los mismos registros desde una base de
datos central, dímelo y lo conectamos a un backend (por ejemplo Firebase,
Supabase o Airtable).

## Desarrollo local

```bash
npm install
npm run dev
```

Abre la URL que muestre la terminal (normalmente http://localhost:5173).

## Compilar para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` lista para publicar.

## Publicar en Netlify

**Opción A — arrastrar y soltar (más rápida, sin cuenta de Git):**
1. Corre `npm run build` localmente.
2. Entra a https://app.netlify.com/drop
3. Arrastra la carpeta `dist/` generada a la página.
4. Netlify te da una URL pública al instante (puedes cambiarla luego en
   "Site settings → Change site name").

**Opción B — conectar un repositorio de Git (recomendada para poder seguir
editando):**
1. Sube este proyecto a un repositorio de GitHub/GitLab.
2. En Netlify: "Add new site" → "Import an existing project" → elige el
   repositorio.
3. Netlify detecta automáticamente la configuración gracias al archivo
   `netlify.toml` incluido:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Haz clic en "Deploy site". Cada vez que subas cambios al repositorio,
   Netlify volverá a publicar automáticamente.

## Estructura del proyecto

```
src/
  components/
    Header.jsx        Encabezado con la marca
    RouteDivider.jsx   Elemento decorativo entre folio y plazo
    ManifestForm.jsx   El formulario con los 9 campos
    FolioCard.jsx      Tarjeta tipo "ticket" para cada registro guardado
  utils/
    storage.js         Guardar/leer los registros en localStorage
  App.jsx              Une todo y maneja el estado de los folios
tailwind.config.js     Paleta de marca (navy/verde) y tema daisyUI
netlify.toml           Configuración de build para Netlify
```
