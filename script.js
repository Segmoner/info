/* =========================================================
   SEGCOIN - JavaScript + EmailJS
   =========================================================
   IMPORTANTE:
   1. Reemplaza EMAILJS_CONFIG con tus credenciales.
   2. No pongas una Private Key/Secret Key en el navegador.
   3. EmailJS sirve para enviar formularios; no es un procesador de pagos.
   ========================================================= */

const EMAILJS_CONFIG = {
  publicKey: "TU_PUBLIC_KEY",
  serviceId: "TU_SERVICE_ID",
  contactTemplateId: "TU_CONTACT_TEMPLATE_ID",
  purchaseTemplateId: "TU_PURCHASE_TEMPLATE_ID"
};

const TICKET_PRICE = 4000;
const STORAGE_KEY = "segcoin_demo_tickets";

document.addEventListener("DOMContentLoaded", () => {
  initMenu();
  initPurchase();
  initContact();
  initWallet();
  initCalendar();
});

function emailjsReady() {
  return typeof emailjs !== "undefined" &&
    EMAILJS_CONFIG.publicKey !== "TU_PUBLIC_KEY" &&
    EMAILJS_CONFIG.serviceId !== "TU_SERVICE_ID";
}

function initEmailJS() {
  if (typeof emailjs === "undefined") return false;
  if (EMAILJS_CONFIG.publicKey === "TU_PUBLIC_KEY") return false;
  emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  return true;
}

function initMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("open"));
  nav.querySelectorAll("a").forEach(a => a.addEventListener("click", () => nav.classList.remove("open")));
}

function formatSeg(value) {
  return new Intl.NumberFormat("es-ES").format(value) + " SEG";
}

function initPurchase() {
  const form = document.querySelector("#purchaseForm");
  if (!form) return;

  const qtyInput = document.querySelector("#ticketQty");
  const total = document.querySelector("#ticketTotal");
  const orderQty = document.querySelector("#orderQty");
  const orderTotal = document.querySelector("#orderTotal");
  const orderNumber = document.querySelector("#orderNumber");
  const orderDate = document.querySelector("#orderDate");

  const updateTotal = () => {
    const qty = Math.max(1, Math.min(100, Number(qtyInput.value) || 1));
    qtyInput.value = qty;
    total.textContent = formatSeg(qty * TICKET_PRICE);
  };

  document.querySelectorAll("[data-qty]").forEach(btn => {
    btn.addEventListener("click", () => {
      qtyInput.value = Number(qtyInput.value) + Number(btn.dataset.qty);
      updateTotal();
    });
  });

  updateTotal();

  form.addEventListener("submit", async event => {
    event.preventDefault();
    const qty = Number(qtyInput.value);
    const amount = qty * TICKET_PRICE;
    const id = "#SEG" + Date.now().toString().slice(-10);
    const date = new Date().toLocaleString("es-BR");

    orderQty.textContent = qty;
    orderTotal.textContent = formatSeg(amount);
    orderNumber.textContent = id;
    orderDate.textContent = date;

    saveTickets(qty);

    const result = document.querySelector("#purchaseResult");
    result.classList.add("pulse");

    if (emailjsReady() && EMAILJS_CONFIG.purchaseTemplateId !== "TU_PURCHASE_TEMPLATE_ID") {
      try {
        await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.purchaseTemplateId, {
          order_number: id,
          quantity: qty,
          total_seg: formatSeg(amount),
          date: date,
          to_email: ""
        });
      } catch (error) {
        console.warn("EmailJS purchase notification failed:", error);
      }
    }

    setTimeout(() => result.classList.remove("pulse"), 700);
  });

  document.querySelector("#viewTickets")?.addEventListener("click", () => {
    window.location.href = "id-4.html";
  });
}

function saveTickets(quantity) {
  const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  const nextNumber = current.length ? Math.max(...current.map(t => Number(t.number))) + 1 : 123;
  for (let i = 0; i < quantity; i++) {
    current.push({ number: String(nextNumber + i).padStart(5, "0"), createdAt: Date.now() });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

function initWallet() {
  const list = document.querySelector("#ticketList");
  if (!list) return;

  let tickets = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  if (!tickets.length) {
    tickets = Array.from({ length: 10 }, (_, i) => ({
      number: String(123 + i).padStart(5, "0")
    }));
  }

  const count = document.querySelector("#ticketCount");
  if (count) count.textContent = tickets.length;

  list.innerHTML = tickets.slice(-50).map(t => `
    <div class="ticket">${t.number}<span>☆</span></div>
  `).join("");
}

function initContact() {
  const form = document.querySelector("#contactForm");
  if (!form) return;

  const status = document.querySelector("#contactStatus");

  form.addEventListener("submit", async event => {
    event.preventDefault();
    status.textContent = "Enviando mensaje...";
    status.style.color = "#f4b72b";

    if (!emailjsReady() || EMAILJS_CONFIG.contactTemplateId === "TU_CONTACT_TEMPLATE_ID") {
      status.textContent = "Modo demo: configura EmailJS para enviar el mensaje.";
      status.style.color = "#f4b72b";
      return;
    }

    try {
      await emailjs.sendForm(
        EMAILJS_CONFIG.serviceId,
        EMAILJS_CONFIG.contactTemplateId,
        form
      );
      status.textContent = "✓ Mensaje enviado correctamente.";
      status.style.color = "#60e97e";
      form.reset();
    } catch (error) {
      console.error(error);
      status.textContent = "No se pudo enviar. Revisa la configuración de EmailJS.";
      status.style.color = "#ff7b7b";
    }
  });
}

function initCalendar() {
  const button = document.querySelector("#calendarBtn");
  if (!button) return;

  button.addEventListener("click", () => {
    const start = "20250630T200000";
    const end = "20250630T220000";
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//SEGCOIN//Prize Draw//ES",
      "BEGIN:VEVENT",
      `DTSTART:${start}`,
      `DTEND:${end}`,
      "SUMMARY:Sorteo SEGCOIN",
      "DESCRIPTION:Día de premios SEGCOIN.",
      "END:VEVENT",
      "END:VCALENDAR"
    ].join("\r\n");

    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "segcoin-sorteo.ics";
    a.click();
    URL.revokeObjectURL(url);
  });
}
