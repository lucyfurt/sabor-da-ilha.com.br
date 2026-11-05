import './style.css';
import { restaurant } from './config.js';

const menuToggle = document.querySelector('#menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
const dialog = document.querySelector('#quote-dialog');
const form = document.querySelector('#quote-form');
const result = document.querySelector('#quote-result');
const closeDialog = document.querySelector('#close-dialog');
const whatsappNumber = String(restaurant.whatsapp ?? '').replace(/\D/g, '');
const hasWhatsapp = /^55\d{10,11}$/.test(whatsappNumber);
const kinds = {
  marmitas: 'Marmitas do dia',
  eventos: 'Evento',
  economica: 'Marmita econômica',
  volume: 'Fornecimento diário acima de 20 refeições',
};
let dialogTrigger = null;
let quoteText = '';
let lastSubmitTime = 0;
const currentYear = document.querySelector('#current-year');
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

function todayLocal() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function setMenuOpen(open) {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
}

menuToggle?.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
mobileNav?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => setMenuOpen(false));
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenuOpen(false);
});

const field = (name) => form?.elements.namedItem(name);

function updateQuantityMinimum() {
  const quantity = field('quantity');
  if (!quantity) return;
  quantity.min = field('kind')?.value === 'volume' ? '21' : '1';
  quantity.setCustomValidity('');
}

function openQuote(trigger, kind, eventName) {
  if (!dialog || !form) return;
  dialogTrigger = trigger;
  if (kind && Object.hasOwn(kinds, kind)) field('kind').value = kind;
  if (eventName) {
    field('kind').value = 'eventos';
    const details = field('details');
    if (details && !details.value.includes(eventName)) {
      details.value = [details.value.trim(), `Evento: ${eventName}`].filter(Boolean).join('\n');
    }
  }
  if (field('date')) field('date').min = todayLocal();
  updateQuantityMinimum();
  if (result) result.hidden = true;
  setMenuOpen(false);
  if (!dialog.open) dialog.showModal();
}

document.querySelectorAll('[data-quote]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openQuote(button, button.dataset.kind);
  });
});

document.querySelectorAll('[data-event]').forEach((button) => {
  button.addEventListener('click', (event) => {
    event.preventDefault();
    openQuote(button, 'eventos', button.dataset.event);
  });
});

document.querySelectorAll('[data-whatsapp]').forEach((link) => {
  if (hasWhatsapp) {
    let contextMessage = '';
    try { contextMessage = new URL(link.href, window.location.href).searchParams.get('text') || ''; } catch { /* Use the general greeting for an invalid link. */ }
    const message = contextMessage || `Olá! Gostaria de saber mais sobre o ${restaurant.name}.`;
    link.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  } else {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      openQuote(link);
    });
  }
});

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
for (const [selector, value] of [
  ['[data-economy-price]', restaurant.economyPrice],
  ['[data-volume-price]', restaurant.volumePrice],
]) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    document.querySelectorAll(selector).forEach((node) => { node.textContent = currency.format(value); });
  }
}

closeDialog?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) {
    dialog.close();
  }
});
dialog?.addEventListener('close', () => {
  if (dialogTrigger instanceof HTMLElement && dialogTrigger.isConnected) dialogTrigger.focus();
});

field('kind')?.addEventListener('change', updateQuantityMinimum);
form?.addEventListener('input', (event) => {
  if (typeof event.target.setCustomValidity === 'function') event.target.setCustomValidity('');
});
if (field('date')) field('date').min = todayLocal();
updateQuantityMinimum();

function buildQuote() {
  const name = field('name');
  const phone = field('phone');
  const kind = field('kind');
  const quantity = field('quantity');
  const date = field('date');
  const details = field('details');
  if (!name || !phone || !kind || !quantity || !date || !details) return null;

  for (const input of [name, phone, kind, quantity, date]) input.setCustomValidity('');
  if (name.value.trim().length < 2) name.setCustomValidity('Informe seu nome, com pelo menos 2 caracteres.');
  const phoneDigits = phone.value.replace(/\D/g, '');
  if (!/^\d{10,11}$/.test(phoneDigits)) phone.setCustomValidity('Informe um telefone com DDD e 10 ou 11 números.');
  if (!Object.hasOwn(kinds, kind.value)) kind.setCustomValidity('Escolha o tipo de pedido.');
  const minimum = kind.value === 'volume' ? 21 : 1;
  const amount = Number(quantity.value);
  if (!Number.isInteger(amount) || amount < minimum) {
    quantity.setCustomValidity(minimum === 21 ? 'O fornecimento em volume é para pelo menos 21 refeições por dia.' : 'Informe uma quantidade inteira de pelo menos 1 refeição.');
  }
  date.min = todayLocal();
  if (date.value && (!/^\d{4}-\d{2}-\d{2}$/.test(date.value) || date.value < todayLocal())) {
    date.setCustomValidity('Escolha hoje ou uma data futura.');
  }
  if (!form.reportValidity()) return null;
  const [year, month, day] = date.value.split('-');
  return [
    `Olá, ${restaurant.name}! Gostaria de solicitar um orçamento.`,
    '',
    `Nome: ${name.value.trim()}`,
    `Telefone: ${phone.value.trim()}`,
    `Pedido: ${kinds[kind.value]}`,
    `Quantidade: ${amount} ${amount === 1 ? 'refeição' : 'refeições'}${kind.value === 'volume' ? ' por dia' : ''}`,
    `Data: ${date.value ? `${day}/${month}/${year}` : 'A combinar'}`,
    ...(details.value.trim() ? [`Detalhes: ${details.value.trim()}`] : []),
  ].join('\n');
}

function showQuote(text, url) {
  if (!result) return;
  result.replaceChildren();
  const message = document.createElement('p');
  message.textContent = url
    ? 'Mensagem preparada! Continue no WhatsApp para enviar e combinar os detalhes.'
    : 'O número do restaurante ainda não está configurado. Copie o resumo abaixo para compartilhar quando o contato estiver disponível.';
  const summary = document.createElement('pre');
  summary.className = 'quote-summary';
  summary.textContent = text;
  const copy = document.createElement('button');
  copy.id = 'copy-quote';
  copy.type = 'button';
  copy.className = 'button button-secondary';
  copy.textContent = 'Copiar resumo';
  copy.addEventListener('click', copyQuote);
  result.append(message, summary, copy);
  if (url) {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'quote-whatsapp-link';
    link.textContent = 'Continuar no WhatsApp';
    result.append(link);
  }
  result.hidden = false;
}

function legacyCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('aria-label', 'Resumo do orçamento para copiar');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  (dialog?.open ? dialog : document.body).append(textarea);
  textarea.focus();
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { /* Manual copy remains available in the summary. */ }
  textarea.remove();
  return copied;
}

async function copyQuote(event) {
  const button = event.currentTarget;
  let copied = false;
  if (navigator.clipboard?.writeText) {
    try { await navigator.clipboard.writeText(quoteText); copied = true; } catch { /* Try the local selection fallback. */ }
  }
  if (!copied) copied = legacyCopy(quoteText);
  button.textContent = copied ? 'Resumo copiado!' : 'Não foi possível copiar. Selecione o resumo acima.';
  button.focus();
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = buildQuote();
  if (!text) return;
  const now = Date.now();
  if (text === quoteText && now - lastSubmitTime < 1500) return;
  lastSubmitTime = now;
  quoteText = text;
  const url = hasWhatsapp ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}` : null;
  showQuote(text, url);
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
});
