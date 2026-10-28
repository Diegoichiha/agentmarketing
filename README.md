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
La pestaña Plataforma tiene el botón "Ver preview del dashboard", que abre `dashboard/index.html`: el diseño del portal del cliente con la marca de SAM Digital. Usa un cliente ficticio (Café Alba) y datos de ejemplo. Los cambios que se hagan allí se guardan solo en el navegador.

## Archivos
- `index.html`: la página.
- `styles.css`: estilos.
- `app.js`: pestañas e interacciones.
- `data.js`: todo el contenido (textos, costos y funcionalidades). Es el archivo que se edita para cambiar el plan.
- `dashboard/`: vista previa del portal del cliente (`index.html`, `dash.css`, `app.js` y `data.js` con los datos de ejemplo).
- `assets/`: logo y favicon de SAM Digital.
