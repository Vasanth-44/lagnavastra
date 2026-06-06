# Lagna Vastra — The Grandeur Collection

Lagna Vastra is a premium, luxury wedding menswear couture brand. This repository contains the complete website codebase, structured as a multi-stage project including a high-performance static frontend, a Sanity CMS studio, and a Next.js web application.

---

## 📂 Repository Structure

The project is structured into three main components:

1. **Static Frontend (Root)**
   * Built with semantic HTML5, vanilla CSS (`style.css`, `collection.css`), and lightweight interactive JS (`script.js`, `lightbox.js`).
   * Houses the live user-facing site showcasing collections like Sherwanis, Jodhpuris, Indo-Westerns, Waistcoats, Kurtas, Suits, and accessories.
   * Leverages a custom-built, CORS-safe Google Apps Script lead capture pipeline.

2. **Sanity Studio (`/studio-lagna-vastra`)**
   * Configured using Sanity v3, React 19, and Styled Components.
   * Serves as the Content Management System (CMS) hosting the schemas for groom ensembles, collections, and custom blog/news stories.

3. **Next.js Application (`/nextjs-lagna-vastra`)**
   * Built with Next.js 16, Tailwind CSS v4, and the `@tailwindcss/typography` plugin.
   * Integrates the `@sanity/client` to fetch and display dynamic content with server-side rendering.

---

## ✨ Key Features

* **Premium Luxury Aesthetics:** Tailored color palette (Royal Ivory, Charcoal Ink, Metallic Gold) featuring high-definition hero videos, parallax scrolling, and smooth CSS micro-animations.
* **Interactive Multi-View Lightbox:** Grooms can view garments from multiple angles (front, side, back) in high-resolution detail with smooth slider tabs.
* **Intelligent Lead Capture Form:** Custom validation on contact numbers, names, and emails. Safely transmits submissions directly to a Google Sheets database with local fail-safe logs.
* **Responsive Layouts:** Extensively optimized mobile layouts with native-feeling drawer menus, fluid typography, and touch-friendly interactive cards.
* **Stateless & Serverless Deployment:** Optimized for Vercel functions, utilizing Edge configs and stateless APIs where needed.

---

## 🛠️ Local Development Setup

### 1. Running the Main Website Locally
For the static site, a local development server is included to mock and inspect lead submissions without calling live API triggers:

```bash
# Start the Python local dev server from the root directory
python server.py
```
Visit `http://localhost:8000` in your browser. Any submitted forms will be saved locally to `enquiries.json`.

### 2. Running Sanity Studio
To manage content, launch the CMS studio dashboard:

```bash
cd studio-lagna-vastra
npm install
npm run dev
```
Visit `http://localhost:3333` to add/edit products or posts.

### 3. Running the Next.js App
To run the modern Next.js client application:

```bash
cd nextjs-lagna-vastra
npm install
npm run dev
```
Visit `http://localhost:3000` in your browser.

---

## 🚀 Deployment

The main website is connected to GitHub and automatically deploys to **Vercel** on every push to the `main` branch.

* **Production URL:** [https://lagnavastra.vercel.app](https://lagnavastra.vercel.app)
* **Hosting Platform:** Vercel (Fluid Serverless Architecture)
* **Sanity Studio Host:** `lagnavastra`

---

## 📝 Contact & Styling Appointments

For bespoke customization or to book a styling session:
* **Address:** Hyderabad Atelier
* **WhatsApp:** [+91 6302635460](https://wa.me/916302635460?text=Hi%20Lagna%20Vastra%2C%20I%27m%20interested%20in%20your%20collection%21)
