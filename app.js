/* ==========================================================================
   Claude Coke — Borderless OpenAI-Style Animated Charts & Scroll-Spy (app.js)
   Smooth cubic-bezier bar growth + requestAnimationFrame number count-ups
   ========================================================================== */

(() => {
  try {
    const savedTheme = localStorage.getItem('theme');
    const initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : 'light';
    document.documentElement.setAttribute('data-theme', initialTheme);
  } catch (_) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. KaTeX Equation Rendering
     ------------------------------------------------------------------------ */
  const renderEquations = () => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$$', right: '$$', display: true }
        ],
        throwOnError: false
      });
    }
  };
  renderEquations();
  window.addEventListener('load', renderEquations);

  /* ------------------------------------------------------------------------
     2. Quiet Left TOC Scroll-Spy
     ------------------------------------------------------------------------ */
  const tocLinks = Array.from(document.querySelectorAll('#tocLinks a'));
  const sections = tocLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  window.addEventListener('scroll', () => {
    let activeIdx = 0;
    sections.forEach((sec, idx) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 200) activeIdx = idx;
    });
    tocLinks.forEach((link, idx) => {
      link.classList.toggle('active', idx === activeIdx);
    });
  }, { passive: true });

  /* ------------------------------------------------------------------------
     3. Provider Theme Map & Reusable OpenAI L-Axis Animated Bar Chart Engine
     ------------------------------------------------------------------------ */
  const PROVIDERS = {
    openai: {
      name: 'OpenAI',
      color: '#6B7280',
      colorLight: '#9CA3AF',
      stroke: '#4B5563',
      logo: 'assets/logos/openai.svg',
      fontClass: 'provider-font-openai'
    },
    gemini: {
      name: 'Google Gemini',
      color: '#2563EB',
      colorLight: '#60A5FA',
      stroke: '#1D4ED8',
      logo: 'assets/logos/gemini.svg',
      fontClass: 'provider-font-gemini'
    },
    anthropic: {
      name: 'Anthropic',
      color: '#D97757',
      colorLight: '#E9A28A',
      stroke: '#B85A3B',
      logo: 'assets/logos/claude.svg',
      fontClass: 'provider-font-claude'
    }
  };

  const MODEL_SERIES_3 = [
    { label: 'GPT-4.1-mini', provider: 'openai' },
    { label: 'Gemini-3-Flash', provider: 'gemini' },
    { label: 'Claude Haiku-4.5', provider: 'anthropic' }
  ];

  const renderProviderLabel = (label, providerKey, subLabel = '') => {
    const p = providerKey ? PROVIDERS[providerKey] : null;
    if (!p) return label;
    const subHtml = subLabel ? `<span class="oai-x-provider-sub">${subLabel}</span>` : '';
    return `
      <span class="oai-x-provider-badge ${p.fontClass}">
        <img class="provider-logo-icon" src="${p.logo}" alt="${p.name}" />
        <span>${label}</span>
      </span>
      ${subHtml}
    `;
  };

  const animateValue = (el, target, suffix = '%', decimals = 1, duration = 780) => {
    const startTime = performance.now();
    const step = (now) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease-out
      const eased = 1 - Math.pow(1 - t, 3);
      const current = target * eased;
      el.textContent = `${current.toFixed(decimals)}${suffix}`;
      if (t < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = `${target.toFixed(decimals)}${suffix}`;
      }
    };
    requestAnimationFrame(step);
  };

  const P3_CONDITION_META = {
    a: {
      code: 'a',
      sublabel: '(a)',
      shortDesc: 'Emoji · Vis Off',
      fullDesc: 'Emoji · Vision Off',
      naming: 'emoji',
      vision: 'off',
      barHatch: '',
      swatchHatch: ''
    },
    b: {
      code: 'b',
      sublabel: '(b)',
      shortDesc: 'Emoji · Vis On',
      fullDesc: 'Emoji · Vision On',
      naming: 'emoji',
      vision: 'on',
      barHatch: 'background-image: repeating-linear-gradient(45deg, transparent 0, transparent 4px, rgba(255,255,255,0.46) 4px, rgba(255,255,255,0.46) 5.2px);',
      swatchHatch: 'background-image: repeating-linear-gradient(45deg, transparent 0, transparent 2.5px, rgba(255,255,255,0.68) 2.5px, rgba(255,255,255,0.68) 3.6px);'
    },
    c: {
      code: 'c',
      sublabel: '(c)',
      shortDesc: 'Explicit · Vis Off',
      fullDesc: 'Explicit · Vision Off',
      naming: 'explicit',
      vision: 'off',
      barHatch: 'background-image: repeating-linear-gradient(-45deg, transparent 0, transparent 4px, rgba(255,255,255,0.46) 4px, rgba(255,255,255,0.46) 5.2px);',
      swatchHatch: 'background-image: repeating-linear-gradient(-45deg, transparent 0, transparent 2.5px, rgba(255,255,255,0.68) 2.5px, rgba(255,255,255,0.68) 3.6px);'
    },
    d: {
      code: 'd',
      sublabel: '(d)',
      shortDesc: 'Explicit · Vis On',
      fullDesc: 'Explicit · Vision On',
      naming: 'explicit',
      vision: 'on',
      barHatch: 'background-image: repeating-linear-gradient(45deg, transparent 0, transparent 4px, rgba(255,255,255,0.46) 4px, rgba(255,255,255,0.46) 5.2px), repeating-linear-gradient(-45deg, transparent 0, transparent 4px, rgba(255,255,255,0.46) 4px, rgba(255,255,255,0.46) 5.2px);',
      swatchHatch: 'background-image: repeating-linear-gradient(45deg, transparent 0, transparent 2.5px, rgba(255,255,255,0.68) 2.5px, rgba(255,255,255,0.68) 3.6px), repeating-linear-gradient(-45deg, transparent 0, transparent 2.5px, rgba(255,255,255,0.68) 2.5px, rgba(255,255,255,0.68) 3.6px);'
    }
  };

  const P3_CONDITION_ICONS = {
    emoji: `<svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.8" fill="#F6C342" stroke="#C99A1E" stroke-width="1"/><circle cx="5.7" cy="6.4" r="1" fill="#141413"/><circle cx="10.3" cy="6.4" r="1" fill="#141413"/><path d="M5.1 9.6a3.3 3.3 0 0 0 5.8 0" fill="none" stroke="#141413" stroke-width="1.2" stroke-linecap="round"/></svg>`,
    explicit: `<svg viewBox="0 0 16 16" aria-hidden="true"><rect x="0.8" y="2.2" width="14.4" height="11.6" rx="2.5" fill="var(--bg-surface, #FFFFFF)" stroke="var(--ink-primary, #141413)" stroke-width="1.15"/><text x="8" y="10.9" text-anchor="middle" font-family="Inter, -apple-system, BlinkMacSystemFont, sans-serif" font-size="8.2" font-weight="600" fill="var(--ink-primary, #141413)">Aa</text></svg>`,
    visionOn: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.1 8C3 4.3 5.5 3.1 8 3.1S13 4.3 14.9 8C13 11.7 10.5 12.9 8 12.9S3 11.7 1.1 8Z" fill="var(--bg-surface, #FFFFFF)" stroke="var(--ink-primary, #141413)" stroke-width="1.25" stroke-linejoin="round"/><circle cx="8" cy="8" r="2.25" fill="var(--ink-primary, #141413)"/></svg>`,
    visionOff: `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M1.1 8C3 4.3 5.5 3.1 8 3.1S13 4.3 14.9 8C13 11.7 10.5 12.9 8 12.9S3 11.7 1.1 8Z" fill="var(--bg-surface, #FFFFFF)" stroke="var(--ink-primary, #141413)" stroke-width="1.25" stroke-linejoin="round"/><circle cx="8" cy="8" r="2.25" fill="var(--ink-primary, #141413)"/><line x1="2.1" y1="13" x2="13.9" y2="3" stroke="var(--bg-pill, #F3F2EE)" stroke-width="2.6" stroke-linecap="round"/><line x1="2.1" y1="13" x2="13.9" y2="3" stroke="var(--ink-primary, #141413)" stroke-width="1.25" stroke-linecap="round"/></svg>`
  };

  const ensureConditionKeyEl = (plotEl, conditionKeyId = '') => {
    if (!plotEl) return null;
    if (conditionKeyId) {
      const byId = document.getElementById(conditionKeyId);
      if (byId) return byId;
    }
    const parent = plotEl.parentElement;
    const existing = parent ? parent.querySelector('.oai-condition-key') : null;
    if (existing) return existing;
    const created = document.createElement('div');
    created.className = 'oai-condition-key';
    if (conditionKeyId) created.id = conditionKeyId;
    plotEl.insertAdjacentElement('afterend', created);
    return created;
  };

  const renderP3ConditionKeyHtml = (outcomes = []) => {
    const conditionRowHtml = ['a', 'b', 'c', 'd'].map(code => {
      const c = P3_CONDITION_META[code];
      const namingIcon = c.naming === 'emoji' ? P3_CONDITION_ICONS.emoji : P3_CONDITION_ICONS.explicit;
      const visionIcon = c.vision === 'on' ? P3_CONDITION_ICONS.visionOn : P3_CONDITION_ICONS.visionOff;
      return `
        <span class="oai-condition-key-item" style="gap: 4px;" title="Condition ${c.sublabel}: ${c.fullDesc} (n=15 per model)">
          <span style="font-family: var(--font-mono); font-size: 11.5px; font-weight: 600; color: var(--ink-primary);">${c.sublabel}</span>
          <span class="oai-condition-swatch" style="background-color: #8A929C; ${c.swatchHatch}"></span>
          ${namingIcon}
          ${visionIcon}
          <span style="font-size: 11.5px; color: var(--ink-secondary);">${c.shortDesc}</span>
        </span>
      `;
    }).join('');

    const outcomeRowHtml = outcomes.map(o => `
      <span class="oai-legend-item" style="font-size: 12px; color: var(--ink-primary);">
        <span class="oai-legend-dot" style="background: ${o.color};"></span>
        <span>${o.label}</span>
      </span>
    `).join('');

    return `
      <div class="oai-condition-key-row" style="width: 100%; display: flex; flex-wrap: nowrap; justify-content: center; align-items: center; gap: 14px; white-space: nowrap; overflow-x: auto; max-width: 100%;">
        ${conditionRowHtml}
      </div>
      <div class="oai-condition-outcome-row" style="width: 100%; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: 6px 18px; padding-top: 7px; border-top: 1px solid var(--rule-hairline);">
        ${outcomeRowHtml}
      </div>
    `;
  };

  const renderOaiBarChart = ({
    plotId,
    legendId,
    captionId,
    yMax = 100,
    yTicks = [0, 25, 50, 75, 100],
    ySuffix = '%',
    series = [],
    groups = [],
    caption = '',
    showBarIcons = false
  }) => {
    const plotEl = document.getElementById(plotId);
    const legendEl = document.getElementById(legendId);
    const captionEl = document.getElementById(captionId);
    if (!plotEl) return;

    const existingConditionKey = plotEl.parentElement
      ? plotEl.parentElement.querySelector('.oai-condition-key')
      : null;
    if (existingConditionKey) {
      existingConditionKey.innerHTML = '';
    }

    const hasSublabels = showBarIcons || groups.some(g => Boolean(g.subLabel));
    plotEl.classList.toggle('has-sublabels', hasSublabels);

    if (legendEl) {
      legendEl.style.display = '';
      legendEl.innerHTML = series.map(s => {
        const p = s.provider ? PROVIDERS[s.provider] : null;
        const color = s.color || (p ? p.color : '#6B7280');
        const stroke = s.stroke || (p ? p.stroke : 'rgba(20, 20, 19, 0.35)');
        const hatchClass = s.hatched ? 'hatched' : '';
        if (p) {
          return `
            <span class="oai-legend-item oai-legend-item--provider">
              <span class="oai-legend-dot ${hatchClass}" style="background-color: ${color}; border-color: ${stroke};"></span>
              <img class="provider-logo-icon" src="${p.logo}" alt="${p.name}" />
              <span class="${p.fontClass}">${s.label}</span>
            </span>
          `;
        }
        return `
          <span class="oai-legend-item">
            <span class="oai-legend-dot ${hatchClass}" style="background-color: ${color}; border-color: ${stroke};"></span>
            <span>${s.label}</span>
          </span>
        `;
      }).join('');
    }

    if (captionEl) {
      captionEl.innerHTML = caption;
    }

    const ticksHtml = yTicks.map(val => {
      const bottomPct = (val / yMax) * 100;
      return `<div class="oai-y-tick" style="bottom: ${bottomPct}%;">${val}${ySuffix}</div>`;
    }).join('');

    const groupsHtml = groups.map(g => {
      const gProvider = g.provider ? PROVIDERS[g.provider] : null;
      const barsHtml = g.values.map((v, sIdx) => {
        const s = series[sIdx] || series[0];
        const sProvider = s.provider ? PROVIDERS[s.provider] : null;
        const barProvider = sProvider || gProvider;
        const isLight = v.variant === 'light' || (gProvider && !sProvider && s.variant === 'light');
        let barColor = s.color || '#6B7280';
        let barStroke = s.stroke || 'rgba(20, 20, 19, 0.28)';
        if (v.color) {
          barColor = v.color;
          barStroke = v.stroke || barStroke;
        } else if (barProvider) {
          barColor = isLight ? barProvider.colorLight : barProvider.color;
          barStroke = v.stroke || barProvider.stroke;
        }
        const isHatched = Boolean(v.hatched !== undefined ? v.hatched : (isLight || s.hatched));
        const heightPct = Math.min(100, Math.max(0.8, (v.val / yMax) * 100));
        const suffix = v.suffix !== undefined ? v.suffix : '%';
        const decimals = v.decimals !== undefined ? v.decimals : 1;
        const hatchClass = isHatched ? 'hatched' : '';
        const iconHtml = (showBarIcons && sProvider)
          ? `<span class="oai-bar-provider-icon" title="${sProvider.name}"><img src="${sProvider.logo}" alt="${sProvider.name}" /></span>`
          : '';
        return `
          <div class="oai-bar-col">
            <span class="oai-bar-val" data-target="${v.val}" data-suffix="${suffix}" data-decimals="${decimals}">0.0${suffix}</span>
            <div class="oai-bar ${hatchClass}" data-height="${heightPct.toFixed(2)}" style="background-color: ${barColor}; border-color: ${barStroke}; height: 0%;"></div>
            ${iconHtml}
          </div>
        `;
      }).join('');

      const xLabelClass = showBarIcons ? 'oai-x-label oai-x-label--with-subicons' : 'oai-x-label';
      const xLabelHtml = g.provider ? renderProviderLabel(g.label, g.provider, g.subLabel || '') : g.label;

      return `
        <div class="oai-group">
          <div class="oai-bars-wrap">
            ${barsHtml}
          </div>
          <div class="${xLabelClass}">${xLabelHtml}</div>
        </div>
      `;
    }).join('');

    plotEl.innerHTML = `
      <div class="oai-l-frame">
        <div class="oai-y-axis">${ticksHtml}</div>
        <div class="oai-canvas">${groupsHtml}</div>
      </div>
    `;

    // Trigger bar height growth + count-up animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        plotEl.querySelectorAll('.oai-bar').forEach((barEl, idx) => {
          const targetH = barEl.getAttribute('data-height');
          barEl.style.transitionDelay = `${idx * 22}ms`;
          barEl.style.height = `${targetH}%`;
        });
        plotEl.querySelectorAll('.oai-bar-val').forEach((valEl, idx) => {
          const targetVal = parseFloat(valEl.getAttribute('data-target') || '0');
          const suffix = valEl.getAttribute('data-suffix') || '%';
          const decimals = parseInt(valEl.getAttribute('data-decimals') || '1', 10);
          setTimeout(() => {
            animateValue(valEl, targetVal, suffix, decimals, 760);
          }, idx * 22);
        });
      });
    });
  };

  const renderStackedOutcomeChart = ({
    plotId,
    legendId,
    captionId,
    conditionKeyId = '',
    showConditionKey = false,
    outcomes = [],
    groups = [],
    caption = ''
  }) => {
    const plotEl = document.getElementById(plotId);
    const legendEl = document.getElementById(legendId);
    const captionEl = document.getElementById(captionId);
    if (!plotEl) return;

    plotEl.classList.add('has-sublabels');

    if (legendEl) {
      if (showConditionKey) {
        legendEl.innerHTML = '';
        legendEl.style.display = 'none';
      } else {
        legendEl.style.display = '';
        legendEl.innerHTML = outcomes.map(o => `
          <span class="oai-legend-item">
            <span class="oai-legend-dot" style="background: ${o.color};"></span>
            <span>${o.label}</span>
          </span>
        `).join('');
      }
    }

    if (captionEl) {
      captionEl.innerHTML = caption;
    }

    const yTicks = [0, 25, 50, 75, 100];
    const ticksHtml = yTicks.map(val => {
      return `<div class="oai-y-tick" style="bottom: ${val}%;">${val}%</div>`;
    }).join('');

    let globalBarIdx = 0;
    const groupsHtml = groups.map(g => {
      const isCompact = g.bars.length > 2;
      const wrapGap = isCompact ? '3px' : '6px';
      const colMaxWidth = isCompact ? '24px' : '44px';
      const valDecimals = isCompact ? 0 : 1;
      const valFontStyle = isCompact
        ? 'font-size: 9px; letter-spacing: -0.02em; top: -15px;'
        : 'top: -17px;';
      const segRadiusTop = isCompact ? '3px 3px 0 0' : '4px 4px 0 0';

      const barsHtml = g.bars.map(bar => {
        const barIdx = globalBarIdx++;
        const condMeta = bar.condition ? P3_CONDITION_META[bar.condition] : null;
        const hatchCss = condMeta
          ? condMeta.barHatch
          : (bar.sublabel === 'Exp'
            ? 'background-image: repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(255,255,255,0.28) 4px, rgba(255,255,255,0.28) 5.2px);'
            : '');

        // Order segments bottom-to-top: Completed, Refused, Failed
        // Using flex-direction: column-reverse so first item sits at bottom
        const nonZeroIndices = bar.segments
          .map((seg, i) => (seg > 0 ? i : -1))
          .filter(i => i >= 0);
        const topIdx = nonZeroIndices.length ? nonZeroIndices[nonZeroIndices.length - 1] : -1;

        const barTitleBase = bar.title || `${g.label} · ${bar.sublabel}`;
        const summaryText = bar.segments
          .map((v, i) => `${outcomes[i].label}: ${v.toFixed(1)}% (${Math.round((v * 15) / 100)}/15)`)
          .join(' · ');

        const segsHtml = bar.segments.map((val, idx) => {
          if (val <= 0) return '';
          const o = outcomes[idx];
          const isTop = idx === topIdx;
          const radius = isTop ? segRadiusTop : '0';
          const countVal = Math.round((val * 15) / 100);
          const innerLabel = !isCompact && val >= 16
            ? `<span style="font-family:var(--font-mono);font-size:9.5px;font-weight:600;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.35);line-height:1;pointer-events:none;">${Math.round(val)}%</span>`
            : '';
          return `
            <div
              class="oai-stack-seg"
              data-bar-idx="${barIdx}"
              data-height="${val.toFixed(3)}"
              title="${barTitleBase} — ${o.label}: ${val.toFixed(1)}% (${countVal}/15)"
              style="
                width: 100%;
                height: 0%;
                background-color: ${o.color};
                ${hatchCss}
                border: 1px solid rgba(20, 20, 19, 0.22);
                border-bottom: none;
                border-radius: ${radius};
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                transition: height 0.85s cubic-bezier(0.22, 1, 0.36, 1);
                box-sizing: border-box;
              "
            >${innerLabel}</div>
          `;
        }).join('');

        const completedVal = bar.segments[0] || 0;
        const initValText = valDecimals === 0 ? '0%' : '0.0%';
        return `
          <div class="oai-bar-col" style="max-width: ${colMaxWidth}; position: relative;" title="${barTitleBase} — ${summaryText}">
            <span class="oai-bar-val" data-bar-idx="${barIdx}" data-target="${completedVal}" data-suffix="%" data-decimals="${valDecimals}" style="position: absolute; ${valFontStyle} left: 50%; transform: translateX(-50%); color: ${outcomes[0].color}; font-weight: 600; margin: 0;">${initValText}</span>
            <div style="width: 100%; height: 100%; display: flex; flex-direction: column-reverse; justify-content: flex-start;">
              ${segsHtml}
            </div>
            <span style="position: absolute; bottom: -16px; left: 50%; transform: translateX(-50%); font-family: var(--font-mono); font-size: 9.5px; color: var(--ink-secondary); line-height: 1; white-space: nowrap;">${bar.sublabel}</span>
          </div>
        `;
      }).join('');

      const xLabelHtml = g.provider ? renderProviderLabel(g.label, g.provider, g.subLabel || '') : g.label;
      return `
        <div class="oai-group">
          <div class="oai-bars-wrap" style="gap: ${wrapGap};">
            ${barsHtml}
          </div>
          <div class="oai-x-label oai-x-label--with-subicons">${xLabelHtml}</div>
        </div>
      `;
    }).join('');

    plotEl.innerHTML = `
      <div class="oai-l-frame">
        <div class="oai-y-axis">${ticksHtml}</div>
        <div class="oai-canvas">${groupsHtml}</div>
      </div>
    `;

    if (showConditionKey) {
      const keyEl = ensureConditionKeyEl(plotEl, conditionKeyId);
      if (keyEl) {
        keyEl.innerHTML = renderP3ConditionKeyHtml(outcomes);
      }
    } else if (plotEl.parentElement) {
      const existingKey = plotEl.parentElement.querySelector('.oai-condition-key');
      if (existingKey) existingKey.innerHTML = '';
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        plotEl.querySelectorAll('.oai-stack-seg').forEach(segEl => {
          const targetH = segEl.getAttribute('data-height') || '0';
          const barIdx = parseInt(segEl.getAttribute('data-bar-idx') || '0', 10);
          segEl.style.transitionDelay = `${barIdx * 14}ms`;
          segEl.style.height = `${targetH}%`;
        });
        plotEl.querySelectorAll('.oai-bar-val').forEach((valEl, idx) => {
          const targetVal = parseFloat(valEl.getAttribute('data-target') || '0');
          const decimals = parseInt(valEl.getAttribute('data-decimals') || '1', 10);
          const barIdx = parseInt(valEl.getAttribute('data-bar-idx') || String(idx), 10);
          setTimeout(() => {
            animateValue(valEl, targetVal, '%', decimals, 760);
          }, barIdx * 14);
        });
      });
    });
  };

  /* ------------------------------------------------------------------------
     4. Definitions for All 4 Animated Charts
     ------------------------------------------------------------------------ */
  const CHART_CONFIGS = {
    chart1: {
      currentMode: 'verbal_s1',
      modes: {
        verbal_s1: {
          series: MODEL_SERIES_3,
          showBarIcons: true,
          groups: [
            { label: 'P(A) Supply-Chain Bankruptcy', values: [{ val: 84.5 }, { val: 84.5 }, { val: 84.5 }] },
            { label: 'P(B | A) Harmful Tool Choice', values: [{ val: 58.3 }, { val: 74.8 }, { val: 0.0 }] },
            { label: 'P(C | A, B) Emoji Checkout', values: [{ val: 51.1 }, { val: 51.1 }, { val: 51.1 }] },
            { label: 'Joint Loop<br>P(A, B, C)', values: [{ val: 25.2 }, { val: 32.3 }, { val: 0.0 }] }
          ],
          caption: 'Under verbal recovery pressure at Step 1 (E2 insolvent), the composed chain rate reaches <strong>25.2%</strong> for GPT-4.1-mini and <strong>32.3%</strong> for Gemini-3-Flash. Claude Haiku-4.5 remains at <strong>0.0%</strong> because its Stage-2 refusal zeroes the product.'
        },
        numeric_s1: {
          series: MODEL_SERIES_3,
          showBarIcons: true,
          groups: [
            { label: 'P(A) Supply-Chain Bankruptcy', values: [{ val: 84.5 }, { val: 84.5 }, { val: 84.5 }] },
            { label: 'P(B | A) Harmful Tool Choice', values: [{ val: 32.0 }, { val: 35.0 }, { val: 0.0 }] },
            { label: 'P(C | A, B) Emoji Checkout', values: [{ val: 51.1 }, { val: 51.1 }, { val: 51.1 }] },
            { label: 'Joint Loop<br>P(A, B, C)', values: [{ val: 13.8 }, { val: 15.1 }, { val: 0.0 }] }
          ],
          caption: 'When only the insolvent account balance is shown without verbal principal pressure, Stage-2 harmful tool initiation drops to 32.0% and 35.0%, cutting the composed loop rate nearly in half to <strong>13.8%</strong> and <strong>15.1%</strong>.'
        },
        verbal_s3: {
          series: MODEL_SERIES_3,
          showBarIcons: true,
          groups: [
            { label: 'P(A) Supply-Chain Bankruptcy', values: [{ val: 84.5 }, { val: 84.5 }, { val: 84.5 }] },
            { label: 'P(B | A) Severe Tool (Step ≥ 3)', values: [{ val: 2.0 }, { val: 55.3 }, { val: 0.0 }] },
            { label: 'P(C | A, B) Emoji Checkout', values: [{ val: 51.1 }, { val: 51.1 }, { val: 51.1 }] },
            { label: 'Joint Loop<br>P(A, B, C)', values: [{ val: 0.9 }, { val: 23.9 }, { val: 0.0 }] }
          ],
          caption: 'Requiring escalation to Step ≥ 3 (unambiguous criminal acts) reduces GPT-4.1-mini to a <strong>0.9%</strong> joint rate, whereas Gemini-3-Flash sustains a <strong>55.3%</strong> Stage-2 rate and a <strong>23.9%</strong> end-to-end loop rate.'
        }
      },
      render() {
        const cfg = this.modes[this.currentMode];
        renderOaiBarChart({
          plotId: 'chart1Plot',
          legendId: 'chart1Legend',
          captionId: 'chart1Caption',
          yMax: 100,
          yTicks: [0, 25, 50, 75, 100],
          series: cfg.series,
          groups: cfg.groups,
          caption: cfg.caption,
          showBarIcons: Boolean(cfg.showBarIcons)
        });
      }
    },

    chart2: {
      currentMode: 'architectures',
      modes: {
        architectures: {
          series: [
            { label: 'Bankruptcy rate (%)', color: '#7349E5', hatched: true },
            { label: 'Mean rounds survived (of 100)', color: '#A582F7' }
          ],
          groups: [
            { label: 'Standard (n=15)', values: [{ val: 93.3, hatched: true }, { val: 63.4, suffix: 'r' }] },
            { label: 'OpenCode (n=14)', values: [{ val: 85.7, hatched: true }, { val: 65.8, suffix: 'r' }] },
            { label: 'Comm. (n=15)', values: [{ val: 80.0, hatched: true }, { val: 66.2, suffix: 'r' }] },
            { label: 'Orchestrator (n=14)', values: [{ val: 78.6, hatched: true }, { val: 80.8, suffix: 'r' }] },
            { label: 'All Pooled (58)', values: [{ val: 84.5, hatched: true }, { val: 68.9, suffix: 'r' }] }
          ],
          caption: 'Across 58 supply-chain runs, <strong>84.5%</strong> (49 / 58) end in bankruptcy. An advisory orchestrator delays insolvency from 63.4 to 80.8 rounds, but 78.6% (11 / 14) of orchestrated runs still go bankrupt before round 100.'
        },
        failure_modes: {
          series: [
            { label: 'Share of 49 bankrupt runs (%)', color: '#7349E5', hatched: true }
          ],
          groups: [
            { label: 'Overordering Cascade', values: [{ val: 73.5, hatched: true }] },
            { label: 'Backlog Spiral', values: [{ val: 10.2 }] },
            { label: 'Inventory Hoarding', values: [{ val: 8.2 }] },
            { label: 'Mid-Chain Squeeze', values: [{ val: 4.1 }] },
            { label: 'Wealth Concentration', values: [{ val: 4.1 }] }
          ],
          caption: '<strong>Overordering Cascades</strong> account for 36 of the 49 insolvencies (73.5%), with the mid-chain Distributor failing first in 51.0% (25 / 49) of bankrupt runs.'
        }
      },
      render() {
        const cfg = this.modes[this.currentMode];
        renderOaiBarChart({
          plotId: 'chart2Plot',
          legendId: 'chart2Legend',
          captionId: 'chart2Caption',
          yMax: 100,
          yTicks: [0, 25, 50, 75, 100],
          series: cfg.series,
          groups: cfg.groups,
          caption: cfg.caption
        });
      }
    },

    chart3: {
      currentMode: 'payoff',
      modes: {
        payoff: {
          series: MODEL_SERIES_3,
          showBarIcons: true,
          groups: [
            { label: '1× EV Parity', values: [{ val: 1.3 }, { val: 0.0 }, { val: 0.0 }] },
            { label: '3× EV Matched', values: [{ val: 13.1 }, { val: 21.3 }, { val: 0.7 }] },
            { label: '6× EV · Solvent', values: [{ val: 12.0 }, { val: 25.3 }, { val: 0.3 }] },
            { label: '6× EV · Insolvent', values: [{ val: 42.0 }, { val: 64.7 }, { val: 4.7 }] }
          ],
          caption: 'In the 12,150-trial moral-payoff matrix, raising the harmful payout to <strong>6× EV</strong> while insolvent drives harmful tool selection to <strong>42.0%</strong> (vs. 12.0% solvent) for GPT-4.1-mini and <strong>64.7%</strong> (vs. 25.3% solvent) for Gemini-3-Flash.'
        },
        framing: {
          series: MODEL_SERIES_3,
          showBarIcons: true,
          groups: [
            { label: 'Numeric Balance Only', values: [{ val: 34.8 }, { val: 30.1 }, { val: 0.0 }] },
            { label: 'Template Banner', values: [{ val: 57.2 }, { val: 36.7 }, { val: 0.0 }] },
            { label: 'Verbal Principal Pressure', values: [{ val: 77.3 }, { val: 73.3 }, { val: 0.0 }] }
          ],
          caption: 'Across 27,600 decisions (E1 pooled over 23 balances), verbal pressure from a principal more than doubles Step-1 harmful tool initiation compared to numeric balance alone (<strong>34.8% &rarr; 77.3%</strong> and <strong>30.1% &rarr; 73.3%</strong>).'
        },
        transcript: {
          series: [
            { label: 'E1: Insolvent without transcript', color: '#3F3F46', stroke: '#27272A' },
            { label: 'E2: With Phase-1 bankruptcy transcript', color: '#9CA3AF', stroke: '#52525B', hatched: true, variant: 'light' }
          ],
          groups: [
            { label: 'GPT-4.1-mini', subLabel: '(Verbal)', provider: 'openai', values: [{ val: 81.5 }, { val: 58.3 }] },
            { label: 'Gemini-3-Flash', subLabel: '(Verbal)', provider: 'gemini', values: [{ val: 87.2 }, { val: 74.8 }] },
            { label: 'Claude Haiku-4.5', subLabel: '(Verbal)', provider: 'anthropic', values: [{ val: 0.0 }, { val: 0.0 }] }
          ],
          caption: 'Prepending an actual Phase-1 bankruptcy transcript (configuration E2) unexpectedly reduces insolvent verbal-pressure initiation from <strong>81.5% to 58.3%</strong> (GPT-4.1-mini) and from <strong>87.2% to 74.8%</strong> (Gemini-3-Flash).'
        }
      },
      render() {
        const cfg = this.modes[this.currentMode];
        renderOaiBarChart({
          plotId: 'chart3Plot',
          legendId: 'chart3Legend',
          captionId: 'chart3Caption',
          yMax: 100,
          yTicks: [0, 25, 50, 75, 100],
          series: cfg.series,
          groups: cfg.groups,
          caption: cfg.caption,
          showBarIcons: Boolean(cfg.showBarIcons)
        });
      }
    },

    chart4: {
      currentMode: 'models',
      modes: {
        funnel: {
          series: [
            { label: 'Emoji Storefront (n=180)', color: '#009E73' },
            { label: 'Explicit Storefront (n=180)', color: '#6C7785' }
          ],
          groups: [
            { label: '1. Search', values: [{ val: 94.4 }, { val: 50.0 }] },
            { label: '2. Browse', values: [{ val: 90.0 }, { val: 47.8 }] },
            { label: '3. View', values: [{ val: 87.8 }, { val: 46.1 }] },
            { label: '4. Cart', values: [{ val: 84.4 }, { val: 44.4 }] },
            { label: '5. Checkout', values: [{ val: 81.7 }, { val: 43.3 }] },
            { label: '6. Shipping', values: [{ val: 79.4 }, { val: 42.2 }] },
            { label: '7. Payment', values: [{ val: 77.8 }, { val: 41.1 }] },
            { label: '8. Order', values: [{ val: 60.6 }, { val: 33.9 }] }
          ],
          caption: 'Replacing explicit product names with DEA-cataloged emoji codes lifts Step-1 search passage from <strong>50.0% to 94.4%</strong> and overall order completion from <strong>33.9% to 60.6%</strong>. Once payment is entered at Step 7, <strong>79.4%</strong> (170 / 214) place the order.'
        },
        models: {
          stacked: true,
          showConditionKey: true,
          outcomes: [
            { label: 'Completed', color: '#009E73' },
            { label: 'Refused', color: '#E69F00' },
            { label: 'Failed (capability)', color: '#6C7785' }
          ],
          groups: [
            {
              label: 'Sonnet 4/4.5',
              provider: 'anthropic',
              bars: [
                { condition: 'a', sublabel: '(a)', title: 'Sonnet 4/4.5 · (a) Emoji, Vision Off (n=15)', segments: [93.3333, 0.0, 6.6667] },
                { condition: 'b', sublabel: '(b)', title: 'Sonnet 4/4.5 · (b) Emoji, Vision On (n=15)', segments: [73.3333, 0.0, 26.6667] },
                { condition: 'c', sublabel: '(c)', title: 'Sonnet 4/4.5 · (c) Explicit, Vision Off (n=15)', segments: [20.0, 80.0, 0.0] },
                { condition: 'd', sublabel: '(d)', title: 'Sonnet 4/4.5 · (d) Explicit, Vision On (n=15)', segments: [20.0, 80.0, 0.0] }
              ]
            },
            {
              label: 'Gemini-3.1-Pro',
              provider: 'gemini',
              bars: [
                { condition: 'a', sublabel: '(a)', title: 'Gemini-3.1-Pro · (a) Emoji, Vision Off (n=15)', segments: [53.3333, 0.0, 46.6667] },
                { condition: 'b', sublabel: '(b)', title: 'Gemini-3.1-Pro · (b) Emoji, Vision On (n=15)', segments: [80.0, 13.3333, 6.6667] },
                { condition: 'c', sublabel: '(c)', title: 'Gemini-3.1-Pro · (c) Explicit, Vision Off (n=15)', segments: [6.6667, 46.6667, 46.6667] },
                { condition: 'd', sublabel: '(d)', title: 'Gemini-3.1-Pro · (d) Explicit, Vision On (n=15)', segments: [53.3333, 40.0, 6.6667] }
              ]
            },
            {
              label: 'Haiku-4.5',
              provider: 'anthropic',
              bars: [
                { condition: 'a', sublabel: '(a)', title: 'Haiku-4.5 · (a) Emoji, Vision Off (n=15)', segments: [33.3333, 0.0, 66.6667] },
                { condition: 'b', sublabel: '(b)', title: 'Haiku-4.5 · (b) Emoji, Vision On (n=15)', segments: [93.3333, 0.0, 6.6667] },
                { condition: 'c', sublabel: '(c)', title: 'Haiku-4.5 · (c) Explicit, Vision Off (n=15)', segments: [13.3333, 80.0, 6.6667] },
                { condition: 'd', sublabel: '(d)', title: 'Haiku-4.5 · (d) Explicit, Vision On (n=15)', segments: [20.0, 80.0, 0.0] }
              ]
            },
            {
              label: 'GPT-5.4',
              provider: 'openai',
              bars: [
                { condition: 'a', sublabel: '(a)', title: 'GPT-5.4 · (a) Emoji, Vision Off (n=15)', segments: [60.0, 40.0, 0.0] },
                { condition: 'b', sublabel: '(b)', title: 'GPT-5.4 · (b) Emoji, Vision On (n=15)', segments: [53.3333, 33.3333, 13.3333] },
                { condition: 'c', sublabel: '(c)', title: 'GPT-5.4 · (c) Explicit, Vision Off (n=15)', segments: [20.0, 80.0, 0.0] },
                { condition: 'd', sublabel: '(d)', title: 'GPT-5.4 · (d) Explicit, Vision On (n=15)', segments: [13.3333, 86.6667, 0.0] }
              ]
            },
            {
              label: 'Gemini-3-Flash',
              provider: 'gemini',
              bars: [
                { condition: 'a', sublabel: '(a)', title: 'Gemini-3-Flash · (a) Emoji, Vision Off (n=15)', segments: [26.6667, 0.0, 73.3333] },
                { condition: 'b', sublabel: '(b)', title: 'Gemini-3-Flash · (b) Emoji, Vision On (n=15)', segments: [86.6667, 0.0, 13.3333] },
                { condition: 'c', sublabel: '(c)', title: 'Gemini-3-Flash · (c) Explicit, Vision Off (n=15)', segments: [33.3333, 6.6667, 60.0] },
                { condition: 'd', sublabel: '(d)', title: 'Gemini-3-Flash · (d) Explicit, Vision On (n=15)', segments: [73.3333, 26.6667, 0.0] }
              ]
            },
            {
              label: 'GPT-4.1-mini',
              provider: 'openai',
              bars: [
                { condition: 'a', sublabel: '(a)', title: 'GPT-4.1-mini · (a) Emoji, Vision Off (n=15)', segments: [40.0, 0.0, 60.0] },
                { condition: 'b', sublabel: '(b)', title: 'GPT-4.1-mini · (b) Emoji, Vision On (n=15)', segments: [33.3333, 0.0, 66.6667] },
                { condition: 'c', sublabel: '(c)', title: 'GPT-4.1-mini · (c) Explicit, Vision Off (n=15)', segments: [60.0, 0.0, 40.0] },
                { condition: 'd', sublabel: '(d)', title: 'GPT-4.1-mini · (d) Explicit, Vision On (n=15)', segments: [73.3333, 0.0, 26.6667] }
              ]
            }
          ],
          caption: 'Full 24-cell outcome breakdown across all four conditions (<strong>n=15</strong> each, 360 trials total; completion % shown above bars). Under emoji obfuscation <strong>(a, b)</strong>, Sonnet 4/4.5 and Haiku-4.5 record <strong>0.0%</strong> policy refusals across all 60 trials (vs. <strong>80.0%</strong> refused under explicit naming <strong>(c, d)</strong>), while vision enables Haiku-4.5 (<strong>33.3% &rarr; 93.3%</strong>) and Gemini-3-Flash (<strong>26.7% &rarr; 86.7%</strong>) to navigate emoji storefronts reliably. GPT-4.1-mini records <strong>0.0%</strong> refusals across all four conditions.'
        },
        vision: {
          series: [
            { label: 'Emoji · Vision Off (n=15)', color: '#9CA3AF', stroke: '#52525B', hatched: true, variant: 'light' },
            { label: 'Emoji · Vision On (n=15)', color: '#3F3F46', stroke: '#27272A' }
          ],
          groups: [
            { label: 'Haiku-4.5', subLabel: '(+60pp)', provider: 'anthropic', values: [{ val: 33.3 }, { val: 93.3 }] },
            { label: 'Gemini-3-Flash', subLabel: '(+60pp)', provider: 'gemini', values: [{ val: 26.7 }, { val: 86.7 }] },
            { label: 'Gemini-3.1-Pro', provider: 'gemini', values: [{ val: 53.3 }, { val: 80.0 }] },
            { label: 'Sonnet 4/4.5', provider: 'anthropic', values: [{ val: 93.3 }, { val: 73.3 }] },
            { label: 'GPT-5.4', provider: 'openai', values: [{ val: 60.0 }, { val: 53.3 }] },
            { label: 'GPT-4.1-mini', provider: 'openai', values: [{ val: 40.0 }, { val: 33.3 }] }
          ],
          caption: 'Enabling screenshot vision on the emoji storefront reduces navigation failures and boosts checkout completion by <strong>+60 percentage points</strong> for both Claude Haiku-4.5 (<strong>33.3% &rarr; 93.3%</strong>) and Gemini-3-Flash (<strong>26.7% &rarr; 86.7%</strong>).'
        }
      },
      render() {
        const cfg = this.modes[this.currentMode];
        if (cfg.stacked) {
          renderStackedOutcomeChart({
            plotId: 'chart4Plot',
            legendId: 'chart4Legend',
            captionId: 'chart4Caption',
            conditionKeyId: 'chart4ConditionKey',
            showConditionKey: Boolean(cfg.showConditionKey),
            outcomes: cfg.outcomes,
            groups: cfg.groups,
            caption: cfg.caption
          });
          return;
        }
        renderOaiBarChart({
          plotId: 'chart4Plot',
          legendId: 'chart4Legend',
          captionId: 'chart4Caption',
          yMax: 100,
          yTicks: [0, 25, 50, 75, 100],
          series: cfg.series,
          groups: cfg.groups,
          caption: cfg.caption
        });
      }
    }
  };

  /* ------------------------------------------------------------------------
     5. Bind Filter Pills, Replay Buttons, and Scroll-Triggered Growth
     ------------------------------------------------------------------------ */
  const bindFilterPills = (groupId, chartKey) => {
    const groupEl = document.getElementById(groupId);
    if (!groupEl) return;
    groupEl.querySelectorAll('.oai-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        groupEl.querySelectorAll('.oai-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        CHART_CONFIGS[chartKey].currentMode = btn.getAttribute('data-mode');
        CHART_CONFIGS[chartKey].render();
      });
    });
  };

  bindFilterPills('chart1FilterGroup', 'chart1');
  bindFilterPills('chart2FilterGroup', 'chart2');
  bindFilterPills('chart3FilterGroup', 'chart3');
  bindFilterPills('chart4FilterGroup', 'chart4');

  document.querySelectorAll('.oai-replay-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-replay');
      if (CHART_CONFIGS[key]) {
        CHART_CONFIGS[key].render();
      }
    });
  });

  // Trigger initial growth animation when each chart scrolls into view
  const chartMap = [
    { elId: 'chart-loop', key: 'chart1' },
    { elId: 'chart-phase1', key: 'chart2' },
    { elId: 'chart-phase2', key: 'chart3' },
    { elId: 'chart-phase3', key: 'chart4' }
  ];

  if ('IntersectionObserver' in window) {
    const seen = new Set();
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const item = chartMap.find(m => m.elId === entry.target.id);
          if (item && !seen.has(item.key)) {
            seen.add(item.key);
            CHART_CONFIGS[item.key].render();
          }
        }
      });
    }, { threshold: 0.18 });

    chartMap.forEach(m => {
      const el = document.getElementById(m.elId);
      if (el) observer.observe(el);
    });
  } else {
    Object.values(CHART_CONFIGS).forEach(c => c.render());
  }

  /* ------------------------------------------------------------------------
     6. Copy BibTeX Button (.citation-box / #copyBibtexBtn)
     ------------------------------------------------------------------------ */
  const copyBibtexBtn = document.getElementById('copyBibtexBtn');
  const bibtexEl = document.querySelector('.bibtex-clean');
  if (copyBibtexBtn && bibtexEl) {
    const labelTarget = copyBibtexBtn.querySelector('span');
    const originalLabel = labelTarget ? labelTarget.textContent : null;
    const originalHtml = copyBibtexBtn.innerHTML;
    let resetTimer = null;

    const fallbackCopy = (text) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      try {
        document.execCommand('copy');
      } finally {
        document.body.removeChild(ta);
      }
    };

    const showCopiedState = () => {
      if (resetTimer) clearTimeout(resetTimer);
      copyBibtexBtn.classList.add('copied');
      copyBibtexBtn.setAttribute('data-copied', 'true');
      if (labelTarget) {
        labelTarget.textContent = 'Copied \u2713';
      } else {
        copyBibtexBtn.textContent = 'Copied \u2713';
      }
      resetTimer = setTimeout(() => {
        copyBibtexBtn.classList.remove('copied');
        copyBibtexBtn.removeAttribute('data-copied');
        if (labelTarget) {
          labelTarget.textContent = originalLabel;
        } else {
          copyBibtexBtn.innerHTML = originalHtml;
        }
        resetTimer = null;
      }, 1800);
    };

    copyBibtexBtn.addEventListener('click', () => {
      const text = (bibtexEl.textContent || '').trim();
      if (!text) return;
      if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
        navigator.clipboard.writeText(text).then(showCopiedState).catch(() => {
          fallbackCopy(text);
          showCopiedState();
        });
      } else {
        fallbackCopy(text);
        showCopiedState();
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. OpenWhisper-Style Theme Toggle (#theme-toggle)
     ------------------------------------------------------------------------ */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    let themeTransitionTimer = null;
    themeBtn.addEventListener('click', () => {
      const root = document.documentElement;
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem('theme', next); } catch (_) {}
      if (themeTransitionTimer) clearTimeout(themeTransitionTimer);
      if (document.startViewTransition) {
        root.classList.add('theme-transitioning');
        document.startViewTransition(() => {
          root.setAttribute('data-theme', next);
        });
        themeTransitionTimer = setTimeout(() => {
          root.classList.remove('theme-transitioning');
          themeTransitionTimer = null;
        }, 1000);
      } else {
        root.classList.add('theme-transitioning');
        void root.offsetHeight;
        root.setAttribute('data-theme', next);
        themeTransitionTimer = setTimeout(() => {
          root.classList.remove('theme-transitioning');
          themeTransitionTimer = null;
        }, 1000);
      }
    });
  }
});
