# Rabinson Photography Portfolio

A premium, high-end photography portfolio and travel filmmaking showcase. Built with a focus on editorial aesthetics, refined typography, and seamless user experiences.

![Portfolio Preview](https://via.placeholder.com/1200x600?text=Rabinson+Photography+Portfolio)

## 📸 Overview

This project is a modern, high-performance web application designed for photographers and filmmakers. It features a sophisticated monorepo architecture, leveraging a headless CMS for content management and a cutting-edge frontend for visual storytelling.

### Key Features

- **High-End Hero Carousel**: A 4-slide interactive hero section with hover-activated navigation and editorial-scale typography.
- **Dynamic Project Gallery**: Fluid masonry grid with category filtering and instant loading states.
- **Editorial About Page**: A staggered-reveal narrative about the photographer's journey, philosophy, and specializations.
- **Dual-Method Contact System**: A professional toggle allowing users to choose between structured Email inquiries (Nodemailer) or direct WhatsApp messaging.
- **Content-First Architecture**: Powered by Sanity.io for real-time portfolio management and site configuration.
- **Premium Aesthetics**: Sophisticated use of whitespace, refined typography (Poppins & Lato), and smooth micro-interactions.

---

## 🛠 Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js 14+](https://nextjs.org/) (App Router), React, Tailwind CSS |
| **Styling** | Vanilla CSS + Tailwind CSS for layout precision |
| **Animations** | Framer Motion for smooth transitions and reveals |
| **Content Management** | [Sanity.io](https://www.sanity.io/) (Headless CMS) |
| **Email Service** | Nodemailer with secure SMTP integration |
| **Icons** | Lucide React |

---

## 🏗 Project Structure

This is a monorepo managed with simple directory separation:

- `apps/web`: The Next.js application — the heart of the portfolio.
- `apps/studio`: The Sanity Studio — the engine for content management.
- `scripts`: Utility scripts for data migration and automated uploads.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Sanity.io account

### Installation

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Environment Variables:**
   Copy the example environment file and fill in your credentials.
   ```bash
   cp .env.example .env
   ```
   *Required variables include Sanity Project ID, Dataset, and SMTP credentials for email.*

3. **Launch the Development Servers:**

   **Start the Web Frontend:**
   ```bash
   npm run dev
   ```

   **Start the Sanity Studio:**
   ```bash
   npm run dev:studio
   ```

---

## ☁️ Deployment

### Frontend (Next.js)

Recommended deployment on **Vercel**:
1. Connect your repository.
2. Set the **Root Directory** to `apps/web`.
3. Add all environment variables from your `.env` to the Vercel project settings.

### CMS (Sanity Studio)

Deploy the studio either to Sanity's hosting or Vercel:
- **Sanity Hosting**: Run `npm run deploy` from the `apps/studio` directory.
- **Vercel**: Set the **Root Directory** to `apps/studio` and ensure the `SANITY_STUDIO_` variables are set.

---

## ✉️ Contact System Setup

To enable email delivery via the contact form:
1. Obtain a Gmail **App Password** (or equivalent for your SMTP provider).
2. Configure `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO_EMAIL` in your environment variables.

---

## 🎨 Design Philosophy

The portfolio follows an **Editorial Minimalism** aesthetic. Every element is designed to hero the imagery. We prioritize negative space, high-contrast typography, and purposeful motion to create a premium atmosphere that respects the viewer's attention.

---

© 2026 Rabinson Photography. All rights reserved.
