# SEGCOIN — Sitio web estático

Interfaz HTML/CSS/JavaScript inspirada en el mockup proporcionado.

## Archivos

```text
segcoin-web/
├── id-1.html      # Inicio / bienvenida
├── id-2.html      # Comprar boletos / verificación
├── id-3.html      # Calendario / premios
├── id-4.html      # Wallet / mis boletos
├── id-5.html      # Contacto / EmailJS
├── style.css      # Estilos globales y responsive
├── script.js      # Navegación, tickets, wallet y EmailJS
└── readme.md
```

## 1. Ejecutar

No necesitas Node.js para esta versión.

Puedes abrir `id-1.html` directamente en el navegador. Para una experiencia más estable, utiliza un servidor local, por ejemplo:

```bash
python -m http.server 5500
```

Después abre:

```text
http://localhost:5500/id-1.html
```

## 2. Navegación

Las cinco páginas están conectadas:

- Inicio → `id-1.html`
- Sorteo → `id-3.html`
- Comprar → `id-2.html`
- Wallet → `id-4.html`
- Contacto → `id-5.html`

## 3. EmailJS

El proyecto utiliza el SDK de EmailJS desde CDN.

En `script.js` encontrarás:

```javascript
const EMAILJS_CONFIG = {
  publicKey: "TU_PUBLIC_KEY",
  serviceId: "TU_SERVICE_ID",
  contactTemplateId: "TU_CONTACT_TEMPLATE_ID",
  purchaseTemplateId: "TU_PURCHASE_TEMPLATE_ID"
};
```

Sustituye esos cuatro valores por los de tu cuenta.

### Formulario de contacto

El formulario de `id-5.html` utiliza:

```javascript
emailjs.sendForm(
  EMAILJS_CONFIG.serviceId,
  EMAILJS_CONFIG.contactTemplateId,
  form
);
```

Los campos enviados son:

```text
name
email
subject
message
```

Tu plantilla de EmailJS debe utilizar esos nombres como variables, por ejemplo:

```text
Nombre: {{name}}
Correo: {{email}}
Asunto: {{subject}}
Mensaje: {{message}}
```

### Notificación de compra

`id-2.html` puede enviar una notificación mediante la plantilla:

```text
purchaseTemplateId
```

Variables utilizadas:

```text
{{order_number}}
{{quantity}}
{{total_seg}}
{{date}}
{{to_email}}
```

## 4. Importante sobre EmailJS

La Public Key de EmailJS está diseñada para utilizarse en el frontend.

No coloques en `script.js`:

- contraseñas
- claves privadas
- Secret Keys
- credenciales de un banco
- claves de una wallet
- claves privadas de blockchain

EmailJS debe utilizarse para comunicación/formularios. **No debe considerarse un sistema de procesamiento de pagos.**

## 5. Persistencia de boletos

Esta maqueta guarda los boletos en:

```javascript
localStorage
```

Clave:

```text
segcoin_demo_tickets
```

Esto es solamente para la demostración del frontend.

Para producción, los boletos, usuarios, órdenes, pagos y saldos deberían vivir en un backend/base de datos, por ejemplo Supabase/PostgreSQL, y el frontend debería consumir una API o funciones seguras.

## 6. Próximo paso recomendado

Para convertir esta maqueta en una aplicación real:

```text
React / HTML
       ↓
Supabase
       ↓
PostgreSQL
       ↓
users
orders
order_items
payments
tickets
wallets / balances
```

El navegador no debería ser la fuente de verdad para:

- saldo
- pagos
- premios
- boletos
- órdenes
- estados de transacción

## 7. Datos del mockup

Valores visuales utilizados:

```text
Precio por boleto: 4.000 SEG

1er premio: R$ 250.000
2do premio: R$ 100.000
3er premio: R$ 25.000

Fecha mostrada en el mockup:
30 de junio de 2025

Hora:
20:00 — Brasilia
```

Estos valores están pensados como contenido de demostración y pueden cambiarse en HTML/JS.

## 8. Aviso

Este proyecto es una interfaz/demo. No implementa un mecanismo real de sorteo, pago, blockchain, custodia de criptomonedas ni validación legal de una lotería o activo financiero.

Antes de publicar un sistema real con sorteos, premios o venta de criptoactivos, deben revisarse las obligaciones legales, fiscales, financieras y de protección al consumidor aplicables en cada país.
