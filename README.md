# 🌿 Avyan Prakriti (अव्यन प्रकृति)
> **Intelligent Circular Waste Management & Urban Environmental Telemetry Platform**

![Avyan Prakriti Banner](https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80)

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5%20%2F%202.0%20Flash-8E75B2?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Leaflet GIS](https://img.shields.io/badge/Leaflet-OpenStreetMap-green?style=for-the-badge&logo=leaflet)](https://leafletjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## 📖 Overview

**Avyan Prakriti** is an end-to-end circular economy platform that bridges the gap between everyday citizens, authorized waste collectors, and municipal environmental authorities. 

Powered by **Google Gemini Multimodal Vision AI**, real-time **OpenStreetMap GIS Mapping**, and **Open-Meteo Environmental Telemetry**, the platform gamifies recycling, streamlines logistics for bulk scrap haulers, and empowers municipal officers with actionable urban sanitation analytics.

---

## ✨ Core Pillars & Portals

### 1. 👤 Citizen & Recycler Portal
- **AI Waste Vision Scanner:** Instantly scans photos and physical item descriptions to classify recyclables (*IT Products, E-Waste, Transport/Metals, Furniture, Glass, Biodegradable*), calculates estimated weight, environmental CO2 offset, and awards instant **Green Credits**.
- **Marketplace Dispatch:** One-tap dispatching to authorized local collectors with pickup transaction IDs (`TXN-XXXXXX`).
- **Live Dispatch Tracker:** Real-time visibility into pickup statuses, assigned green route drivers, and pickup windows.
- **Green Officer Civic Reporter:** Enables citizens to photograph public restrooms, water points, and overflowing bins, grading cleanliness and logging civic incidents with geolocation tags.
- **Green Credit Rewards Bazaar:** Instant voucher exchange for verified recycling credits.

### 2. 🚛 Green Route Collector Portal
- **Real-Time Collection Queue:** Filter incoming dispatches by specialized categories (*IT Hardware, Heavy E-Waste, Bulk Metals, Wood/Furniture, Glass*).
- **Intelligent Dispatch Dispatcher:** Assign specific EV haulers, couriers, and scheduled pickup time windows.
- **Verification Workflow:** Inspection, acceptance, and rejection handling with compliance reason tags.

### 3. 🏛️ Municipal & Environmental Authority Portal
- **Live Interactive GIS Map:** Centered on active jurisdictions (defaulting to **NIT Rourkela, Odisha `[22.2531, 84.9011]`**) using free OpenStreetMap tiles with custom markers for public sanitation blocks (🚻), water replenishment stations (💧), and eco-compactors (🗑️).
- **Live Atmospheric Telemetry:** Real-time API integration measuring local **Temperature (°C)**, **Relative Humidity (%)**, **Air Quality Index (AQI)**, and **PM2.5 particulate levels**.
- **Smart Sensor Grid Fleet:** Connected smart bin fill-level alerts, automated telemetry recalibration, and compaction truck service logs.
- **Immutable Civic Audit Logs:** Chronological trail of municipal actions and resolution events.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router, Serverless Functions) |
| **Language & Types** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling & UI** | [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Artificial Intelligence** | [Google Gemini AI](https://ai.google.dev/) (`gemini-1.5-flash`, `gemini-2.0-flash` with 3-tier fallback) |
| **Maps & GIS** | [Leaflet](https://leafletjs.com/), [React Leaflet](https://react-leaflet.js.org/), [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) |
| **Weather & AQI API** | [Open-Meteo](https://open-meteo.com/) (Real-time Meteorological & Air Quality APIs) |
| **State & Persistence** | React Context API + LocalStorage Ledger synchronization |
| **Deployment** | [Vercel](https://vercel.com/) / [Firebase Hosting](https://firebase.google.com/docs/hosting) (`web.app`) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.17.0 or higher recommended)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/adarshofficial560-ux/avyan-prakriti.git
cd avyan-prakriti
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
# Google Gemini API Key
GEMINI_API_KEY=your_gemini_api_key_here
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Get a free API key at [Google AI Studio](https://aistudio.google.com/))*

### 4. Run Local Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 📦 Production Build & Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deploy to Vercel
1. Import the repository on [Vercel](https://vercel.com/).
2. Add `GEMINI_API_KEY` and `NEXT_PUBLIC_GEMINI_API_KEY` under **Project Settings ➔ Environment Variables**.
3. Deploy!

### Deploy to Firebase Hosting (`web.app`)
```bash
# 1. Login to Firebase
npx firebase login

# 2. Deploy hosting target
npx firebase deploy --only hosting
```

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👥 Acknowledgments & Mission
Built with 💚 for urban circular ecosystems, zero-landfill smart cities, and sustainable community empowerment.
