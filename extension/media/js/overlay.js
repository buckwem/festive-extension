// Copyright (C) 2026 Mark Buckwell. Licence: GPL-2.0-or-later.
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  const updateLayer = () => {
    const existing = document.getElementById('festive-overlay');

    if (reducedMotion.matches) {
      existing?.remove();
      return;
    }

    if (existing) return;

    const layer = document.createElement('div');
    layer.id = 'festive-overlay';
    layer.setAttribute('aria-hidden', 'true');
    // Add decorative effects here when their behaviour has been specified.
    document.body.append(layer);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateLayer, { once: true });
  } else {
    updateLayer();
  }

  reducedMotion.addEventListener('change', updateLayer);
})();
