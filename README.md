## Galaria 🖼️📹

**The media vault is built for performance, privacy, and seamless sharing.**
Galaria is a modern web application that allows users to upload, compress, and securely share images and videos. It leverages cutting-edge technologies like Supabase/Cloudflare R2, OTP-based authentication, and smart media encoding to deliver a fast, efficient, and elegant experience.

---

## 💡 Motivation

As a group of friends, we often go out, click hundreds of photos, and shoot videos to capture memories. Sharing them used to mean dumping everything into Google Drive — until we all hit our 15GB limit 😅.

One evening, while watching Linus Torvalds talk about building Git to manage his kernel project, something clicked. Just like Git was born out of necessity, we thought:
**"Why not build our own media storage platform — tailored to our needs?"**

That’s how **Galaria** was born — a personal, high-performance media vault built to upload, optimize, store, and share content **without limits**.

---
## Approach
![image](https://github.com/user-attachments/assets/feacdce3-eb93-48da-be51-b4718422f2f9)

---

## 🚀 Key Features

* 🎥 **Smart Media Optimization**
  Compress and encode images (via Sharp) and videos (via FFmpeg) to minimize size and maximize quality.

* 🔐 **OTP-Based Auth**
  No passwords. Log in and sign up with email-based one-time passwords using Supabase + Resend.

* ☁️ **Cloud Object Storage**
  Media is stored on **Supabase** or **Cloudflare R2** – fast, reliable, and scalable.

* 📧 **Share via Email**
  Share uploaded images/videos directly with others through email links — just one click.

* 💻 **Modern Frontend**
  Fully responsive UI using React, Tailwind CSS, and ShadCN components.

* ⚙️ **Robust Backend**
  Type-safe backend with Express, Zod, FFmpeg, Sharp, and Prisma.

---

## 🛠 Tech Stack

| Layer       | Technology                         |
| ----------- | ---------------------------------- |
| Frontend    | React, Tailwind CSS, ShadCN UI     |
| Auth        | Supabase Auth + Resend OTP Email   |
| Backend     | Express.js, Zod, Prisma, FFmpeg    |
| Storage     | Supabase Storage / Cloudflare R2   |
| Media Tools | Sharp (images), FFmpeg (videos)    |
| DB          | PostgreSQL (via Prisma + Supabase) |

---

## 📦 Installation

```bash
git clone https://github.com/ronakmaheshwari/galaria.git
cd galaria
pnpm install
```

Set up your environment variables in `.env`:

```env
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
RESEND_API_KEY=your_resend_key
R2_BUCKET=...
```

---

## 💻 Development

```bash
pnpm dev
```

Visit `http://localhost:3000` to start using Galaria locally.

---

## 📁 Folder Structure

```
/app              - Frontend (React + Tailwind)
/server           - Backend API (Express + FFmpeg)
/lib              - Shared helpers, encoders, and utils
/public           - Static assets
.env              - Env config (Resend, Supabase, etc.)
```

---

## 🧼 Upload & Share Flow

1. User signs up via OTP
2. Upload an image or video
3. Backend compresses (WebP or MP4 H.264)
4. The file is pushed to Supabase/R2
5. Metadata saved via Prisma
6. Share the link generated and emailed via Resend

---

## 📧 Share via Email

Galaria uses **Resend** to email secure access links to uploaded content. Just type an email, hit share, and the recipient gets a link to view/download the file — no login required.

---

## 🛠️ Deployment

Supports deployment to:

* **Vercel** — Frontend
* **Render / Railway / Fly.io** — Backend
* **Cloudflare R2 or Supabase** — Object storage

Just add your `.env` keys and deploy ✨

---

## 🤝 Contributing

We’d love your help!

```bash
git checkout -b feature/amazing-feature
git commit -m "Add amazing feature"
git push origin feature/amazing-feature
```

Then open a PR 🎉

---

## 📄 License

MIT © [Ronak Maheshwari](https://github.com/ronakmaheshwari) , [Vedang Atre](https://github.com/vedang29)
