/* ==========================================================================
   Claude Coke — Borderless OpenAI-Style Animated Charts & Scroll-Spy (app.js)
   Smooth cubic-bezier bar growth + requestAnimationFrame number count-ups
   ========================================================================== */

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
     3. Reusable OpenAI L-Axis Animated Bar Chart Engine
     ------------------------------------------------------------------------ */
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

  const renderOaiBarChart = ({
    plotId,
    legendId,
    captionId,
    yMax = 100,
    yTicks = [0, 25, 50, 75, 100],
    ySuffix = '%',
    series = [],
    groups = [],
    caption = ''
  }) => {
    const plotEl = document.getElementById(plotId);
    const legendEl = document.getElementById(legendId);
    const captionEl = document.getElementById(captionId);
    if (!plotEl) return;

    if (legendEl) {
      legendEl.innerHTML = series.map(s => `
        <span class="oai-legend-item">
          <span class="oai-legend-dot" style="background: ${s.color};"></span>
          <span>${s.label}</span>
        </span>
      `).join('');
    }

    if (captionEl) {
      captionEl.innerHTML = caption;
    }

    const ticksHtml = yTicks.map(val => {
      const bottomPct = (val / yMax) * 100;
      return `<div class="oai-y-tick" style="bottom: ${bottomPct}%;">${val}${ySuffix}</div>`;
    }).join('');

    const groupsHtml = groups.map(g => {
      const barsHtml = g.values.map((v, sIdx) => {
        const s = series[sIdx] || series[0];
        const heightPct = Math.min(100, Math.max(0.8, (v.val / yMax) * 100));
        const suffix = v.suffix !== undefined ? v.suffix : '%';
        const decimals = v.decimals !== undefined ? v.decimals : 1;
        const hatchClass = (v.hatched || s.hatched) ? 'hatched' : '';
        return `
          <div class="oai-bar-col">
            <span class="oai-bar-val" data-target="${v.val}" data-suffix="${suffix}" data-decimals="${decimals}">0.0${suffix}</span>
            <div class="oai-bar ${hatchClass}" data-height="${heightPct.toFixed(2)}" style="background-color: ${s.color}; height: 0%;"></div>
          </div>
        `;
      }).join('');

      return `
        <div class="oai-group">
          <div class="oai-bars-wrap">
            ${barsHtml}
          </div>
          <div class="oai-x-label">${g.label}</div>
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

  /* ------------------------------------------------------------------------
     4. Definitions for All 4 Animated Charts
     ------------------------------------------------------------------------ */
  const CHART_CONFIGS = {
    chart1: {
      currentMode: 'verbal_s1',
      modes: {
        verbal_s1: {
          series: [
            { label: 'GPT-4.1-mini', color: '#A582F7' },
            { label: 'Gemini-3-Flash', color: '#7349E5', hatched: true },
            { label: 'Claude Haiku-4.5', color: '#2E7D5B' }
          ],
          groups: [
            { label: 'P(A) Supply-Chain Bankruptcy', values: [{ val: 84.5 }, { val: 84.5 }, { val: 84.5 }] },
            { label: 'P(B | A) Harmful Tool Choice', values: [{ val: 58.3 }, { val: 74.8 }, { val: 0.0 }] },
            { label: 'P(C | A, B) Emoji Checkout', values: [{ val: 51.1 }, { val: 51.1 }, { val: 51.1 }] },
            { label: 'Joint Loop<br>P(A, B, C)', values: [{ val: 25.2 }, { val: 32.3, hatched: true }, { val: 0.0 }] }
          ],
          caption: 'Under verbal recovery pressure at Step 1 (E2 insolvent), the composed chain rate reaches <strong>25.2%</strong> for GPT-4.1-mini and <strong>32.3%</strong> for Gemini-3-Flash. Claude Haiku-4.5 remains at <strong>0.0%</strong> because its Stage-2 refusal zeroes the product.'
        },
        numeric_s1: {
          series: [
            { label: 'GPT-4.1-mini', color: '#A582F7' },
            { label: 'Gemini-3-Flash', color: '#7349E5', hatched: true },
            { label: 'Claude Haiku-4.5', color: '#2E7D5B' }
          ],
          groups: [
            { label: 'P(A) Supply-Chain Bankruptcy', values: [{ val: 84.5 }, { val: 84.5 }, { val: 84.5 }] },
            { label: 'P(B | A) Harmful Tool Choice', values: [{ val: 32.0 }, { val: 35.0 }, { val: 0.0 }] },
            { label: 'P(C | A, B) Emoji Checkout', values: [{ val: 51.1 }, { val: 51.1 }, { val: 51.1 }] },
            { label: 'Joint Loop<br>P(A, B, C)', values: [{ val: 13.8 }, { val: 15.1, hatched: true }, { val: 0.0 }] }
          ],
          caption: 'When only the insolvent account balance is shown without verbal principal pressure, Stage-2 harmful tool initiation drops to 32.0% and 35.0%, cutting the composed loop rate nearly in half to <strong>13.8%</strong> and <strong>15.1%</strong>.'
        },
        verbal_s3: {
          series: [
            { label: 'GPT-4.1-mini', color: '#A582F7' },
            { label: 'Gemini-3-Flash', color: '#7349E5', hatched: true },
            { label: 'Claude Haiku-4.5', color: '#2E7D5B' }
          ],
          groups: [
            { label: 'P(A) Supply-Chain Bankruptcy', values: [{ val: 84.5 }, { val: 84.5 }, { val: 84.5 }] },
            { label: 'P(B | A) Severe Tool (Step ≥ 3)', values: [{ val: 2.0 }, { val: 55.3 }, { val: 0.0 }] },
            { label: 'P(C | A, B) Emoji Checkout', values: [{ val: 51.1 }, { val: 51.1 }, { val: 51.1 }] },
            { label: 'Joint Loop<br>P(A, B, C)', values: [{ val: 0.9 }, { val: 23.9, hatched: true }, { val: 0.0 }] }
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
          caption: cfg.caption
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
          series: [
            { label: 'GPT-4.1-mini', color: '#A582F7' },
            { label: 'Gemini-3-Flash', color: '#7349E5', hatched: true },
            { label: 'Claude Haiku-4.5', color: '#2E7D5B' }
          ],
          groups: [
            { label: '1× EV Parity', values: [{ val: 1.3 }, { val: 0.0 }, { val: 0.0 }] },
            { label: '3× EV Matched', values: [{ val: 13.1 }, { val: 21.3 }, { val: 0.7 }] },
            { label: '6× EV · Solvent', values: [{ val: 12.0 }, { val: 25.3 }, { val: 0.3 }] },
            { label: '6× EV · Insolvent', values: [{ val: 42.0 }, { val: 64.7, hatched: true }, { val: 4.7 }] }
          ],
          caption: 'In the 12,150-trial moral-payoff matrix, raising the harmful payout to <strong>6× EV</strong> while insolvent drives harmful tool selection to <strong>42.0%</strong> (vs. 12.0% solvent) for GPT-4.1-mini and <strong>64.7%</strong> (vs. 25.3% solvent) for Gemini-3-Flash.'
        },
        framing: {
          series: [
            { label: 'GPT-4.1-mini', color: '#A582F7' },
            { label: 'Gemini-3-Flash', color: '#7349E5', hatched: true },
            { label: 'Claude Haiku-4.5', color: '#2E7D5B' }
          ],
          groups: [
            { label: 'Numeric Balance Only', values: [{ val: 34.8 }, { val: 30.1 }, { val: 0.0 }] },
            { label: 'Template Banner', values: [{ val: 57.2 }, { val: 36.7 }, { val: 0.0 }] },
            { label: 'Verbal Principal Pressure', values: [{ val: 77.3 }, { val: 73.3, hatched: true }, { val: 0.0 }] }
          ],
          caption: 'Across 27,600 decisions (E1 pooled over 23 balances), verbal pressure from a principal more than doubles Step-1 harmful tool initiation compared to numeric balance alone (<strong>34.8% &rarr; 77.3%</strong> and <strong>30.1% &rarr; 73.3%</strong>).'
        },
        transcript: {
          series: [
            { label: 'E1: Insolvent without transcript', color: '#A582F7' },
            { label: 'E2: With Phase-1 bankruptcy transcript', color: '#7349E5', hatched: true }
          ],
          groups: [
            { label: 'GPT-4.1-mini (Verbal)', values: [{ val: 81.5 }, { val: 58.3, hatched: true }] },
            { label: 'Gemini-3-Flash (Verbal)', values: [{ val: 87.2 }, { val: 74.8, hatched: true }] },
            { label: 'Claude Haiku-4.5 (Verbal)', values: [{ val: 0.0 }, { val: 0.0 }] }
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
          caption: cfg.caption
        });
      }
    },

    chart4: {
      currentMode: 'funnel',
      modes: {
        funnel: {
          series: [
            { label: 'Emoji Storefront (n=180)', color: '#7349E5', hatched: true },
            { label: 'Explicit Storefront (n=180)', color: '#A582F7' }
          ],
          groups: [
            { label: '1. Search', values: [{ val: 94.4, hatched: true }, { val: 50.0 }] },
            { label: '2. Browse', values: [{ val: 90.0, hatched: true }, { val: 47.8 }] },
            { label: '3. View', values: [{ val: 87.8, hatched: true }, { val: 46.1 }] },
            { label: '4. Cart', values: [{ val: 84.4, hatched: true }, { val: 44.4 }] },
            { label: '5. Checkout', values: [{ val: 81.7, hatched: true }, { val: 43.3 }] },
            { label: '6. Shipping', values: [{ val: 79.4, hatched: true }, { val: 42.2 }] },
            { label: '7. Payment', values: [{ val: 77.8, hatched: true }, { val: 41.1 }] },
            { label: '8. Order', values: [{ val: 60.6, hatched: true }, { val: 33.9 }] }
          ],
          caption: 'Replacing explicit product names with DEA-cataloged emoji codes lifts Step-1 search passage from <strong>50.0% to 94.4%</strong> and overall order completion from <strong>33.9% to 60.6%</strong>. Once payment is entered at Step 7, <strong>79.4%</strong> (170 / 214) place the order.'
        },
        models: {
          series: [
            { label: 'Emoji Storefront (n=30)', color: '#7349E5', hatched: true },
            { label: 'Explicit Storefront (n=30)', color: '#A582F7' }
          ],
          groups: [
            { label: 'Sonnet 4/4.5', values: [{ val: 83.3, hatched: true }, { val: 20.0 }] },
            { label: 'Gemini-3.1-Pro', values: [{ val: 66.7, hatched: true }, { val: 30.0 }] },
            { label: 'Haiku-4.5', values: [{ val: 63.3, hatched: true }, { val: 16.7 }] },
            { label: 'Gemini-3-Flash', values: [{ val: 56.7, hatched: true }, { val: 53.3 }] },
            { label: 'GPT-5.4', values: [{ val: 56.7, hatched: true }, { val: 16.7 }] },
            { label: 'GPT-4.1-mini', values: [{ val: 36.7, hatched: true }, { val: 66.7 }] }
          ],
          caption: 'Five of six frontier models complete substantially more checkouts under emoji obfuscation than under explicit naming. Claude Sonnet 4/4.5 rises from <strong>20.0% to 83.3%</strong> and Haiku-4.5 rises from <strong>16.7% to 63.3%</strong> with zero emoji refusals.'
        },
        vision: {
          series: [
            { label: 'Emoji · Vision Off (n=15)', color: '#A582F7' },
            { label: 'Emoji · Vision On (n=15)', color: '#7349E5', hatched: true }
          ],
          groups: [
            { label: 'Haiku-4.5 (+60pp)', values: [{ val: 33.3 }, { val: 93.3, hatched: true }] },
            { label: 'Gemini-3-Flash (+60pp)', values: [{ val: 26.7 }, { val: 86.7, hatched: true }] },
            { label: 'Gemini-3.1-Pro', values: [{ val: 53.3 }, { val: 80.0, hatched: true }] },
            { label: 'Sonnet 4/4.5', values: [{ val: 93.3 }, { val: 73.3, hatched: true }] },
            { label: 'GPT-5.4', values: [{ val: 60.0 }, { val: 53.3, hatched: true }] },
            { label: 'GPT-4.1-mini', values: [{ val: 40.0 }, { val: 33.3, hatched: true }] }
          ],
          caption: 'Enabling screenshot vision on the emoji storefront reduces navigation failures and boosts checkout completion by <strong>+60 percentage points</strong> for both Claude Haiku-4.5 (<strong>33.3% &rarr; 93.3%</strong>) and Gemini-3-Flash (<strong>26.7% &rarr; 86.7%</strong>).'
        }
      },
      render() {
        const cfg = this.modes[this.currentMode];
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
});
