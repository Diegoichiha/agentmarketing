# Plan de Agentes

Infografía interactiva del plan para crear y vender un producto de agentes de IA por suscripción. Tiene tres pestañas:

1. **Agente inteligente**: todo lo que se necesita para el agente.
2. **Plataforma**: servidor, cuentas, presupuesto, cobros, legal y hoja de ruta.
3. **Paquetes**: catálogo de funcionalidades y un armador para definir paquetes y ver su precio sugerido.

Documento de trabajo y confidencial. Los precios son estimaciones de octubre de 2026 y se verifican antes de contratar. Los costos y horas del armador son supuestos, no cifras medidas.

## Cómo verlo
- Abre `index.html` en el navegador. No necesita instalar nada.
- Los pendientes y el armador se guardan en el navegador de cada persona.

## Vista previa del dashboard
La pestaña Plataforma tiene el botón "Ver preview del dashboard", que abre `dashboard/index.html`: el diseño del portal del cliente con la marca de SAM Digital. Toma como ejemplo a un cliente de SAM Digital, Tapetes y Pisos del Pacífico: su marca y los datos públicos de su sitio e Instagram son reales; las publicaciones nuevas y las cifras son de ejemplo. Los cambios que se hagan allí se guardan solo en el navegador.

Además de aprobar publicaciones, el panel tiene espacios para gestionar: Campañas, Sitio web, Correo (audiencias, boletines y respuestas), Prospectos (tablero y lista) y Google (palabras que se siguen). En cada uno se busca, filtra, crea, edita, pausa y mueve. La estructura del sitio, los prospectos y las cifras de esas secciones son de ejemplo.

## Archivos
- `index.html`: la página.
- `styles.css`: estilos.
- `app.js`: pestañas e interacciones.
- `data.js`: todo el contenido (textos, costos y funcionalidades). Es el archivo que se edita para cambiar el plan.
- `dashboard/`: vista previa del portal del cliente (`index.html`, `dash.css`, `icons.css`, `gestion.css`, `app.js`, `gestion.js` y `data.js` con los datos de ejemplo).
- `assets/`: logo y favicon de SAM Digital.
