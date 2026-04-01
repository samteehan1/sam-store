import './style.css';
import { inject } from '@vercel/analytics';
import './hero-entry.tsx';
import { initViewer } from './three-viewer.js';

inject();

// --- 3D Viewer (defer so hero R3F canvas claims WebGL first; avoids blank / lost context) ---
requestAnimationFrame(() => {
  const canvas = document.getElementById('three-canvas');
  if (canvas) initViewer(canvas);
});

// --- Tab Switching ---
const tabs = document.querySelectorAll('.tab');
const tabContents = {
  description: document.getElementById('tab-description'),
  specifications: document.getElementById('tab-specifications'),
};

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');

    Object.entries(tabContents).forEach(([key, el]) => {
      el.classList.toggle('hidden', key !== target);
    });
  });
});

// --- Size Selector ---
const sizePills = document.querySelectorAll('.size-pill');

sizePills.forEach((pill) => {
  pill.addEventListener('click', () => {
    sizePills.forEach((p) => p.classList.remove('selected'));
    pill.classList.toggle('selected');
  });
});

// --- Notify Me CTA ---
const notifyBtn = document.getElementById('notify-btn');
const notifyForm = document.getElementById('notify-form');
const notifyConfirmation = document.getElementById('notify-confirmation');

notifyBtn.addEventListener('click', () => {
  notifyBtn.classList.add('hidden');
  notifyForm.classList.remove('hidden');
  notifyForm.querySelector('.notify-input').focus();
});

notifyForm.addEventListener('submit', (e) => {
  e.preventDefault();
  notifyForm.classList.add('hidden');
  notifyConfirmation.classList.remove('hidden');
  requestAnimationFrame(() => {
    notifyConfirmation.classList.add('visible');
  });
});
