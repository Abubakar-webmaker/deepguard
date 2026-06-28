<div align="center">

# 🛡️ DeepGuard

### AI-Generated Content Detection Platform

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.11-3776AB?style=for-the-badge&logo=python)](https://python.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://typescriptlang.org/)

**Detect deepfakes, AI-generated images, audio, and text in seconds.**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

![DeepGuard Demo](https://via.placeholder.com/900x500/0a0a0f/4f8ef7?text=DeepGuard+AI+Detection+Platform)

</div>

---

## 📌 Table of Contents

- [About The Project](#about-the-project)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About The Project

DeepGuard is a full-stack AI content detection platform that helps users identify deepfakes, AI-generated images, synthetic audio, and AI-written text. Built with a modern tech stack, it provides real-time analysis with detailed confidence scores and signal breakdowns.

### The Problem

In 2026, AI-generated content has become indistinguishable from real content to the human eye:
- 🖼️ **Fake images** are used for misinformation, fraud, and harassment
- 🎙️ **Voice clones** are used in financial scams and identity theft
- 📝 **AI-written text** floods news sites, academic submissions, and social media
- ⚖️ **Legal evidence** can be tampered with using deepfake technology

### The Solution

DeepGuard provides a simple, fast, and accessible platform where anyone can verify content authenticity — no technical knowledge required.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🖼️ **Image Detection** | Detects GAN artifacts, facial inconsistencies, and metadata anomalies |
| 🎙️ **Audio Detection** | Identifies voice clones, synthetic speech, and unnatural patterns |
| 📝 **Text Detection** | Detects AI-written content from GPT, Claude, Gemini, and more |
| 🔐 **JWT Authentication** | Secure login/signup with token-based auth |
| 📊 **Dashboard** | Real-time stats, weekly scan chart, recent activity |
| 📋 **Scan History** | Full searchable and filterable history of all analyses |
| ⚙️ **Settings** | Profile management, notifications, security options |
| 📱 **Responsive UI** | Works on desktop and mobile |
| ⚡ **Fast Analysis** | Average detection time under 3 seconds |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| Next.js | 14 | React framework with App Router |
| TypeScript | 5.0 | Type safety |
| Tailwind CSS | 3.4 | Utility-first styling |
| Axios | 1.7 | HTTP client |
| Recharts | 2.x | Dashboard charts |
| React Dropzone | 14.x | File upload with drag & drop |
| Lucide React | 0.3 | Icon library |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| FastAPI | 0.111 | Python web framework |
| Python | 3.11 | Runtime |
| Motor | 3.4 | Async MongoDB driver |
| PyMongo | 4.7 | MongoDB operations |
| Python-Jose | 3.3 | JWT token handling |
| Passlib + Bcrypt | 1.7 | Password hashing |
| Httpx | 0.27 | Async HTTP client |
| Pydantic | 2.7 | Data validation |
| Uvicorn | 0.30 | ASGI server |

### Database & APIs
| Service | Purpose |
|---|---|
| MongoDB Atlas | Cloud database |
| Hive Moderation API | Image AI detection |
| Sapling AI API | Text AI detection |

---

## 🏗️ System Architecture

┌─────────────────────────────────────────────────────┐

│                   CLIENT BROWSER                     │

│                                                      │

│  ┌──────────────────────────────────────────────┐   │

│  │           Next.js Frontend (Vercel)          │   │

│  │                                              │   │

│  │  Landing  →  Auth  →  Dashboard  →  Detect  │   │

│  │                    ↓                         │   │

│  │            History  →  Settings              │   │

│  └──────────────────┬───────────────────────────┘   │

└─────────────────────┼───────────────────────────────┘

│ HTTP/REST (Axios)

│

┌─────────────────────┼───────────────────────────────┐

│                     ▼                               │

│  ┌──────────────────────────────────────────────┐   │

│  │          FastAPI Backend (Railway)           │   │

│  │                                              │   │

│  │  /auth  →  JWT Auth + Bcrypt                │   │

│  │  /detect → Image | Audio | Text             │   │

│  │  /history → CRUD + Stats                    │   │

│  └──────┬──────────────────────────────────────┘   │

│         │                                           │

│    ┌────┴─────┐  ┌──────────┐  ┌──────────────┐   │

│    │ MongoDB  │  │  Hive    │  │  Sapling AI  │   │

│    │  Atlas   │  │   API    │  │     API      │   │

│    └──────────┘  └──────────┘  └──────────────┘   │

└─────────────────────────────────────────────────────┘

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Python 3.11+
- MongoDB Atlas account (free tier works)
- Hive AI account
- Sapling AI account

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/deepguard.git
cd deepguard
```

**2. Frontend Setup**

```bash
npm install
```

Create `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run frontend:
```bash
npm run dev
```

Frontend runs on `http://localhost:3000`

**3. Backend Setup**

```bash
cd backend
python -m pip install -r requirements.txt
python -m pip install pydantic-settings
```

Create `.env`:
```env
MONGODB_URL=your-mongodb-atlas-url
DB_NAME=deepguard
SECRET_KEY=your-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=10080
HIVE_API_KEY=your-hive-api-key
SAPLING_API_KEY=your-sapling-api-key
```

Run backend:
```bash
python -m uvicorn main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`

---

## 📡 API Documentation

Full interactive docs available at `http://localhost:8000/docs`

### Auth Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login and get JWT token |
| GET | `/auth/me` | Get current user info |

### Detection Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/detect/image` | Analyze image file |
| POST | `/detect/audio` | Analyze audio file |
| POST | `/detect/text` | Analyze text content |

### History Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/history/` | Get scan history (paginated) |
| GET | `/history/stats` | Get user statistics |
| DELETE | `/history/{id}` | Delete a scan |

### Example Request

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"secret123"}'

# Detect image
curl -X POST http://localhost:8000/detect/image \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg"
```

---

## 📁 Project Structure

deepguard/

├── src/

│   ├── app/

│   │   ├── (auth)/

│   │   │   ├── login/

│   │   │   │   └── page.tsx

│   │   │   └── signup/

│   │   │       └── page.tsx

│   │   ├── (dashboard)/

│   │   │   ├── layout.tsx

│   │   │   ├── dashboard/

│   │   │   │   └── page.tsx

│   │   │   ├── detect/

│   │   │   │   └── page.tsx

│   │   │   ├── history/

│   │   │   │   └── page.tsx

│   │   │   └── settings/

│   │   │       └── page.tsx

│   │   ├── layout.tsx

│   │   ├── page.tsx

│   │   └── globals.css

│   ├── components/

│   │   └── Navbar.tsx

│   ├── context/

│   │   └── AuthContext.tsx

│   └── lib/

│       ├── api.ts

│       └── utils.ts

├── backend/

│   ├── main.py

│   ├── requirements.txt

│   ├── .env

│   ├── routers/

│   │   ├── auth.py

│   │   ├── detect.py

│   │   └── history.py

│   └── core/

│       ├── config.py

│       ├── database.py

│       ├── security.py

│       └── models.py

├── .gitignore

└── README.md

---

## 🔑 Environment Variables

### Frontend (.env.local)

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8000` |

### Backend (.env)

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URL` | MongoDB connection string | `mongodb+srv://...` |
| `DB_NAME` | Database name | `deepguard` |
| `SECRET_KEY` | JWT secret (min 32 chars) | `a3f8c2d1...` |
| `ALGORITHM` | JWT algorithm | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Token expiry | `10080` (7 days) |
| `HIVE_API_KEY` | Hive AI API key | `HcHqsfYx...` |
| `SAPLING_API_KEY` | Sapling AI API key | `D1RWNS4B...` |

---

## 🌐 Deployment

### Backend → Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

Add environment variables in Railway dashboard.

### Frontend → Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable
NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License.

---

## 👨‍💻 Author

**Abu Bakar**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Built with ❤️ by Abu Bakar

</div>
