import os
import time
from playwright.sync_api import sync_playwright

BLOG_DIR = "/Users/gaborhollbeck/Desktop/GitHub/118_NeurIPS2026/2_EconPressureAgents/claude-coke-blog"
HTML_URL = f"file://{BLOG_DIR}/index.html"
OUT_DIR = f"{BLOG_DIR}/screenshots"

os.makedirs(OUT_DIR, exist_ok=True)


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(
            headless=True,
            executable_path="/Users/gaborhollbeck/Library/Caches/ms-playwright/chromium_headless_shell-1248/chrome-headless-shell-mac-arm64/chrome-headless-shell"
        )
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=2,
        )
        page = context.new_page()

        console_errors = []
        page_errors = []
        page.on("console", lambda msg: console_errors.append(f"[{msg.type}] {msg.text}") if msg.type in ("error", "warning") else None)
        page.on("pageerror", lambda err: page_errors.append(str(err)))

        page.goto(HTML_URL, wait_until="networkidle")
        page.wait_for_timeout(800)

        # Scroll down gradually so all IntersectionObserver charts trigger
        total_height = page.evaluate("document.body.scrollHeight")
        for y in range(0, total_height + 600, 350):
            page.evaluate(f"window.scrollTo(0, {y})")
            page.wait_for_timeout(120)

        page.wait_for_timeout(1200)

        # Check layout geometry: TOC vs prose vs breakout
        geom = page.evaluate("""() => {
            const rect = (sel) => {
                const el = document.querySelector(sel);
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), top: Math.round(r.top), bottom: Math.round(r.bottom) };
            };
            return {
                toc: rect('.toc-sidebar'),
                tocList: rect('.toc-list'),
                prose: rect('.prose-block'),
                chart1: rect('#chart-loop'),
                p1Sim: rect('#phase1-sim-mount'),
                p3Sim: rect('#phase3-sim-mount'),
                heroLead: rect('.hero-lead-prose'),
                heroMeta: rect('.hero-meta-table')
            };
        }""")
        print("Layout geometry at 1440px:", geom)

        # 1. 01_hero_and_overview.png (Hero header + Overview + Chart 1)
        page.evaluate("window.scrollTo(0, 0)")
        page.wait_for_timeout(300)
        # Re-trigger chart1 replay and wait 1.2s so bars are at 100%
        page.click('[data-replay="chart1"]')
        page.wait_for_timeout(1200)
        c1_bot = page.evaluate("Math.round(document.querySelector('#chart-loop').getBoundingClientRect().bottom + window.scrollY + 32)")
        page.screenshot(
            path=f"{OUT_DIR}/01_hero_and_overview.png",
            clip={"x": 0, "y": 0, "width": 1440, "height": c1_bot},
            full_page=True,
        )

        # 2. 02_phase1_sim_orchestrator.png (Phase 1 sim with Orchestrator selected at Round 54)
        page.locator("#phase1-sim-mount").scroll_into_view_if_needed()
        page.wait_for_timeout(200)
        page.select_option("#p1-arch-select", "orchestrator")
        page.evaluate("""() => {
            const s = document.querySelector('[data-p1-scrubber]');
            s.value = '54';
            s.dispatchEvent(new Event('input', { bubbles: true }));
        }""")
        page.wait_for_timeout(400)
        page.locator("#p1-sim-card").screenshot(path=f"{OUT_DIR}/02_phase1_sim_orchestrator.png")

        # 3. 03_phase1_sim_bankrupt.png (Phase 1 sim with Standard selected at Round 68 after Distributor bankruptcy + Chart 2)
        page.select_option("#p1-arch-select", "standard")
        page.evaluate("""() => {
            const s = document.querySelector('[data-p1-scrubber]');
            s.value = '68';
            s.dispatchEvent(new Event('input', { bubbles: true }));
        }""")
        page.click('[data-replay="chart2"]')
        page.wait_for_timeout(1200)
        p1_top = page.evaluate("Math.max(0, Math.round(document.querySelector('#p1-sim-card').getBoundingClientRect().top + window.scrollY - 24))")
        p1_bot = page.evaluate("Math.round(document.querySelector('#chart-phase1').getBoundingClientRect().bottom + window.scrollY + 24)")
        page.screenshot(
            path=f"{OUT_DIR}/03_phase1_sim_bankrupt.png",
            clip={"x": 0, "y": p1_top, "width": 1440, "height": p1_bot - p1_top},
            full_page=True,
        )

        # 4. 04_phase2_animated_chart.png (Phase 2 section and Animated Chart 3)
        page.locator("#sec-phase2").scroll_into_view_if_needed()
        page.click('[data-replay="chart3"]')
        page.wait_for_timeout(1200)
        p2_top = page.evaluate("Math.max(0, Math.round(document.querySelector('#sec-phase2').getBoundingClientRect().top + window.scrollY - 24))")
        p2_bot = page.evaluate("Math.round(document.querySelector('#chart-phase2').getBoundingClientRect().bottom + window.scrollY + 24)")
        page.screenshot(
            path=f"{OUT_DIR}/04_phase2_animated_chart.png",
            clip={"x": 0, "y": p2_top, "width": 1440, "height": p2_bot - p2_top},
            full_page=True,
        )

        # 4b. 04b_chart3_framing.png (Chart 3: Pressure Framing view — exact chart user screenshotted)
        page.locator("#chart-phase2").scroll_into_view_if_needed()
        page.click('#chart3FilterGroup [data-mode="framing"]')
        page.wait_for_timeout(1200)
        page.locator("#chart-phase2").screenshot(path=f"{OUT_DIR}/04b_chart3_framing.png")

        # 4c. 04c_chart3_transcript.png (Chart 3: E2 Distress Transcript Effect view)
        page.click('#chart3FilterGroup [data-mode="transcript"]')
        page.wait_for_timeout(1200)
        page.locator("#chart-phase2").screenshot(path=f"{OUT_DIR}/04c_chart3_transcript.png")

        # 5. 05_phase3_tor_checkout_active.png (Phase 3 Tor Browser simulation at Step 7/8 Completed Order)
        page.locator("#phase3-sim-mount").scroll_into_view_if_needed()
        page.select_option("#p3-model-select", "sonnet")
        page.select_option("#p3-store-select", "emoji")
        page.select_option("#p3-prod-select", "cocaine")
        page.select_option("#p3-vis-select", "on")
        page.evaluate("""() => {
            const s = document.querySelector('[data-p3-scrubber]');
            s.value = '8';
            s.dispatchEvent(new Event('input', { bubbles: true }));
        }""")
        page.wait_for_timeout(450)
        page.locator("#p3-sim-card").screenshot(path=f"{OUT_DIR}/05_phase3_tor_checkout_active.png")

        # 6. 06_phase3_tor_refused_and_chart4.png (Phase 3 Tor Browser with Explicit Text showing Refusal + Chart 4)
        page.select_option("#p3-model-select", "sonnet")
        page.select_option("#p3-store-select", "explicit")
        page.select_option("#p3-prod-select", "cocaine")
        page.evaluate("""() => {
            const s = document.querySelector('[data-p3-scrubber]');
            s.value = '1';
            s.dispatchEvent(new Event('input', { bubbles: true }));
        }""")
        page.click('[data-replay="chart4"]')
        page.wait_for_timeout(1200)
        p3_top = page.evaluate("Math.max(0, Math.round(document.querySelector('#p3-sim-card').getBoundingClientRect().top + window.scrollY - 24))")
        p3_bot = page.evaluate("Math.round(document.querySelector('#chart-phase3').getBoundingClientRect().bottom + window.scrollY + 24)")
        page.screenshot(
            path=f"{OUT_DIR}/06_phase3_tor_refused_and_chart4.png",
            clip={"x": 0, "y": p3_top, "width": 1440, "height": p3_bot - p3_top},
            full_page=True,
        )

        # 6b. 06b_chart4_models.png (Chart 4: Completion Rate by Model stacked view with provider logos & fonts)
        page.locator("#chart-phase3").scroll_into_view_if_needed()
        page.click('#chart4FilterGroup [data-mode="models"]')
        page.wait_for_timeout(1200)
        page.locator("#chart-phase3").screenshot(path=f"{OUT_DIR}/06b_chart4_models.png")

        # 6c. 06c_chart4_vision.png (Chart 4: Vision Ablation Boost view)
        page.click('#chart4FilterGroup [data-mode="vision"]')
        page.wait_for_timeout(1200)
        page.locator("#chart-phase3").screenshot(path=f"{OUT_DIR}/06c_chart4_vision.png")

        # 7. 07_chart1_loop.png (Chart 1: Joint loop probability)
        page.locator("#chart-loop").scroll_into_view_if_needed()
        page.click('[data-replay="chart1"]')
        page.wait_for_timeout(1200)
        page.locator("#chart-loop").screenshot(path=f"{OUT_DIR}/07_chart1_loop.png")

        print("Console errors/warnings:", console_errors)
        print("Page errors:", page_errors)
        browser.close()


if __name__ == "__main__":
    run()
