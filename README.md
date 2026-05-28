# 🎨 AiResume Craft
### *Sprint 04 // AI Cover Letter Generator SaaS Utility*

AiResume Craft is a premium, serverless Software-as-a-Service (SaaS) utility engineered for the **Prodesk IT Engineering Division**. It ingests professional candidate parameters and leverages the Google Gemini API (or a robust mock simulator) to generate tailored, high-converting cover letters. 

The application utilizes a warm pastel light-mode theme inspired by the elegant **Billey** layout, featuring rich indigo headings, white paper cards with organic drop-shadows, soft background radial glow points, and coral-to-sunset action gradients.

---

## 🌟 Key Engineering Features

### 🧠 1. Live Google Gemini API Integration
* Powered by the **official `@google/generative-ai` SDK** for standard endpoint resolution.
* Programmatically structures optimized prompt contexts by blending candidate skills, target role duties, company culture, and uploaded resume text.
* Utilizes the high-performance **Gemini 1.5 Flash** model to generate persuasive, metrics-focused professional narratives.

### 📄 2. Client-Side in-Memory PDF Text Parsing
* Implements in-browser text extraction using **`pdfjs-dist`** (v5.7.284) with matching version-aligned worker CDN allocations.
* Enables complete privacy (no candidate resumes are sent to third-party file servers) and zero-latency client-side execution.

### 🛡️ 3. Safe Environment Security Architecture
* Enforces strict environment separation using root-level `.env` properties.
* Features rigid `.gitignore` anti-leak protocols preventing API credentials from staging or leaking onto public GitHub repositories.

### 🕹️ 4. High-Fidelity Simulation Fallback
* Automatically routes users through a custom, keyword-matching simulator fallback if the Gemini API key is absent.
* **Smart Details Extractor**: The simulator scans the uploaded resume text for your **real projects** (e.g. 55Carat CRM, React.js responsive interface optimization, Dental Chatbot n8n, Drone Surveillance) and **former companies** (e.g. Penthara Technologies, 55 Carat, Prodesk IT) to dynamically weave your real accomplishments into the simulated letters.

### ✍️ 5. SaaS Rich Action Controls
* **Markdown Element Parser**: Translates Markdown headers, bullet lists, bold text, and line rules into clean HTML elements (`<p>`, `<ul>`, `<li>`, `<h2>`/`<h3>`, `<strong>`) instead of a raw text block.
* **TXT Downloader**: Instantly bundles and triggers a `.txt` file download of the letter.
* **Manual Editor**: Interactive textarea toggle permitting direct manual updates and final touchups.
* **Tactile Copy Utility**: Visual success banners and clipboard copy triggers.

---

## 📂 Project Architecture & Code Links

* [index.html](file:///w:/Prodesk_Assignemnt-4/index.html) — Optimized semantic document headers and custom page viewport meta.
* [src/index.css](file:///w:/Prodesk_Assignemnt-4/src/index.css) — Custom Outfit/Inter typography, pastel radial gradients, Billey styling, and sunset action buttons.
* [src/App.jsx](file:///w:/Prodesk_Assignemnt-4/src/App.jsx) — Main SaaS controller, layout shell, and Markdown-to-HTML parser.
* [src/services/geminiService.js](file:///w:/Prodesk_Assignemnt-4/src/services/geminiService.js) — Live Gemini SDK integration client and refined keyword-matching simulator fallback.
* [src/utils/pdfParser.js](file:///w:/Prodesk_Assignemnt-4/src/utils/pdfParser.js) — Version-locked client-side PDF text scanner.
* [Prompts.md](file:///w:/Prodesk_Assignemnt-4/Prompts.md) — Technical instructions, system design charts, and QA FAQ manuals.

---

## 🛠️ Quick Start Guide

### 1. Clone & Install Dependencies
First, initialize and install the package modules:
```bash
npm install
```

### 2. Configure Your Environment Keys
Create a `.env` file at the root of the project and populate it with your Google Gemini API key:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```
*(If no API key is specified, the application will automatically fall back to Simulation Mode seamlessly, letting you test using your uploaded resume.)*

### 3. Launch Development Server
Boot up the local Vite hot-reload server:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to interact with the SaaS.

### 4. Build Production Bundle
Run standard production bundler checks:
```bash
npm run build
```

---

## 🎓 Corporate QA Metadata
* **Candidate Developer**: Shivansh Sharma
* **Sprint Milestone**: Sprint 04 — AI Cover Letter Generator SaaS
* **QA Deadline**: 6 Days from Assignment Receipt
* **Engineering Objective**: Secure API Key Management & Client-Side Generative AI Integrations.
