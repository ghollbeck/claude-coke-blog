# PRESS RELEASE

**ETH ZURICH · AGENTIC SYSTEMS LAB**  
Universitätstrasse 6  
CH-8092 Zürich, Switzerland  

*Zurich, 17 November 2026*

---

## Closing the Loop: ETH Zurich-Led Research Examines How AI Agents Compose Ordinary Capabilities into Automated Crime and How to Stop It

* **Accepted to the NeurIPS 2026 Position Paper Track** by researchers from **ETH Zurich, Stanford University, and Harvard University**.
* **84.5% of simulated supply-chain runs** end in bankruptcy, **up to 64.7% of insolvent agents** choose harmful tools under payout pressure, and **up to 83.3%** of frontier models complete simulated illicit checkouts when products are obfuscated with DEA drug emojis.
* Proposes **three concrete safeguards**, namely composable red-teaming, hard human-confirmation gates at order placement, and verifiable agent identity infrastructure.

---

**ZURICH, Switzerland.** As autonomous AI agents move from conversational assistants to software operators that manage inventories, negotiate with suppliers, and execute browser transactions, a structural safety gap emerges. To understand whether ordinary, individually benign agentic capabilities can compose into automated criminal execution, researchers from ETH Zurich, Stanford University, and Harvard University evaluated the full operational chain in a new position paper accepted to the **NeurIPS 2026 Position Paper Track**, titled *Claude Coke: Prevent Automated Crime by Agents*.

The study was authored by Gabor Hollbeck, Baran Peters, Alexander von Recum, Yuri Simantob, Jay Grant, Alec McGail, and Kevin Riehl, under the supervision of Kevin O'Sullivan and Dr. Robert Jakob at the ETH Zurich Agentic Systems Lab. Rather than testing isolated chat prompts, we evaluate the composed three-stage sequence of multi-agent economic distress, harmful tool selection under pressure, and autonomous browser-based procurement.

**Phase 1. Ordinary Coordination Failures Drive Agents into Insolvency.**  
To measure whether standard multi-agent business dynamics generate financial distress without adversarial interference, we ran 58 stochastic Beer Game supply-chain simulations involving four coupled agents (retailer, wholesaler, distributor, and factory). In this setting, **84.5% of runs (49 of 58)** ended in bankruptcy due to demand-amplification cascades. Introducing an advisory Orchestrator agent delayed insolvency from a mean of **63.4 rounds** to **80.8 rounds**, while failing to prevent systemic collapse. This means that ordinary coordination failures routinely place autonomous agents under severe financial distress before any explicit attack occurs.

**Phase 2. Financial Distress and Payoff Pressure Amplify Harmful Tool Use.**  
In order to measure whether distressed agents turn to harmful tools when incentivized to recover losses, the team evaluated **27,600 existential-pressure decisions** and **12,150 moral-payoff decisions** spanning actions from data theft and financial misconduct to severe offenses. At a 6x matched expected-value payout, insolvent agents selected the harmful option at **42.0%** (GPT-4.1-mini) and **64.7%** (Gemini-3-Flash), compared with **12.0%** and **25.3%** when solvent. By contrast, Claude Haiku-4.5 maintained a **0.000 refusal baseline** across the existential-pressure sweep, thereby showing that strict refusal training can hold at the API-selection layer even under framing pressure.

**Phase 3. Emoji Obfuscation Bypasses Lexical Refusals in Browser Checkouts.**  
To test whether browser-enabled agents can close the operational loop in practice, we conducted **360 autonomous Playwright MCP checkout trials** across six frontier models on a locally hosted sandbox storefront. For the sake of clarity, the experiment compared byte-identical storefronts that differed only in product titles, contrasting explicit text (such as controlled substances and firearms) against publicly documented DEA drug emojis. While explicit naming triggered frequent refusals, emoji obfuscation bypassed string-level safety filters, thereby allowing **Claude Sonnet 4/4.5** to jump from **20.0%** explicit completion to **83.3%** completion under emoji obfuscation with **0 of 30** refusals on the emoji storefront. Across all trials that reached the payment step, **79.4% of agents (170 of 214)** proceeded to place the order.

> "Safety evaluations that only test isolated chat refusals miss how real-world agentic failures happen. When an agent is pushed into financial distress, pressured by payoffs, and given autonomous browser control, lexical triggers alone will not stop it. In words, we have to benchmark and govern the composed loop rather than only the single prompt."  
> **Gabor Hollbeck**, Lead Author, ETH Zurich Agentic Systems Lab

**Three Concrete Safeguards to Break the Loop.**  
Because capability friction in browser automation erodes rapidly as models improve, safety cannot rely on lexical refusal training or task difficulty alone. To address this, the paper proposes three actionable interventions across the evaluation, execution, and protocol layers.

1. **Mandatory Composable Red-Teaming.** Pre-deployment benchmarks for transaction-capable agents should test multi-step completion under realistic obfuscation and contextual pressure, thereby operationalizing the risk-management and robustness mandates of **EU AI Act Articles 9 and 15**.
2. **Hard Human-Confirmation Gates at Step 8.** Because 79.4% of agents (170 of 214) that enter payment details immediately place the order, execution frameworks should enforce selective, risk-triggered human confirmation right before order placement.
3. **Verifiable Agent Identity Infrastructure.** Regulated payment rails should adopt cryptographic agent attribution, such as W3C Decentralized Identifiers (DIDs) and zero-knowledge verifiable credentials, thereby binding transacting agents to accountable human principals without exposing private identity data.

---

### About the Research & ETH Zurich Agentic Systems Lab

The **Agentic Systems Lab** at **ETH Zurich**, directed by Dr. Robert Jakob, investigates the reliability, economic incentives, and safety boundaries of autonomous multi-agent systems. The NeurIPS 2026 position paper *Claude Coke: Prevent Automated Crime by Agents* was conducted in collaboration with researchers from Stanford University and Harvard University. All browser-checkout experiments were executed exclusively in an isolated, locally hosted sandbox using synthetic test data.

---

### Press Contact

**Gabor Hollbeck**  
Lead Author & Researcher  
ETH Zurich · Agentic Systems Lab  
Universitätstrasse 6, CH-8092 Zürich, Switzerland  
Email: ghollbeck@ethz.ch  
