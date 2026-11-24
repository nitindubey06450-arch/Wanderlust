# 🌍 Wanderlust — Full-Stack MERN Travel Explorer & AI Companion

<p align="center">
  <img src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80" alt="Wanderlust Hero" width="100%" style="border-radius: 16px;" />
</p>

<p align="center">
  <strong>Discover incredible destinations across India • Plan journeys • Book trains • AI Travel Guide</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Stack-MERN-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991?style=for-the-badge&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
</p>

---

## 📖 Overview

**Wanderlust** is a production-quality, full-stack travel and property listing web application built with the **MERN stack (MongoDB, Express.js, React, Node.js)**. 

Focused 100% on India's diverse geography, Wanderlust features all **28 States and 8 Union Territories**, offering immersive travel discovery, an AI-powered state tourist advisor powered by **OpenAI (`gpt-4o-mini`)**, an interactive **Train Ticket booking engine**, full **Favorites & Bucket List management with multi-item bulk deletion**, and an **Adventure Video Hero** homepage with audio controls.

---

## ✨ Key Features

### 1. 🎥 Full-Screen Adventure Video Hero Section
- **Cinematic Travel Background**: Autoplays smoothly, loops seamlessly, muted by default.
- **Glassmorphic Floating Navbar**: Stays crisp and readable over video with light/dark backdrop blur.
- **Interactive Video Controls**: Real-time Sound/Mute toggle with accessible ARIA labels.
- **Category Filter Rail**: Quick-jump horizontal pills (*Adventure, Nature, Wildlife, Heritage, Spiritual, Beaches, Mountains*).
- **Graceful Fallback**: High-resolution travel poster displays instantly if video playback is restricted or `prefers-reduced-motion` is enabled.

### 2. 🇮🇳 100% Indian Destinations (All 28 States & 8 Union Territories)
- Pre-seeded with authentic tourist destinations across all Indian regions:
  - **States**: Rajasthan, Kerala, Himachal Pradesh, Goa, Uttar Pradesh, Uttarakhand, Tamil Nadu, Karnataka, Maharashtra, West Bengal, Sikkim, Assam, and more.
  - **Union Territories**: Ladakh, Jammu & Kashmir, Andaman & Nicobar Islands, Delhi, Puducherry, Lakshadweep, Chandigarh, Dadra and Nagar Haveli and Daman and Diu.
- Rich destination metadata: High-res galleries, estimated budget in INR, category tags, ratings, attractions, things to do, and best season to visit.

### 3. 🤖 OpenAI-Powered State Tourist Explorer (`/state-explorer`)
- **State Selection**: Choose any of India's 36 States or UTs or click popular Quick Picks (Rajasthan, Kerala, Goa, etc.).
- **In-Depth AI Travel Guide**: Generated via **OpenAI `gpt-4o-mini`** detailing:
  - 🏛️ State overview, nicknames, and best travel seasons
  - 🌟 Top 6–8 tourist hubs and key landmarks
  - 🌄 Categorized highlights (Heritage, Spiritual, Nature, Adventure)
  - 🍲 Local cuisines and signature dishes
  - 🚗 Transportation logistics (Airports, Railway junctions, Highways)
- **Direct Database Linking**: Matches and renders active Wanderlust place listings directly beneath the AI guide.
- **Wanderlust AI Assistant**: Floating AI companion chat widget for interactive personalized trip planning.

### 4. 🚆 Integrated Train Ticket Booking System (`/trains`)
- Built-in station search covering 30+ major Indian Railway terminals (*NDLS, CSTM, HWH, MAS, SBC, etc.*).
- Auto-prefill destination arrival when navigating from any place detail page.
- Direct booking links across top verified platforms without Akamai/IRCTC CDN referral blocks:
  - **RailYatri**: Live running status, PNR verification, train search
  - **ConfirmTkt**: Waitlist confirmation prediction & tatkal availability
  - **MakeMyTrip Trains**: Instant booking with rewards
  - **Paytm Trains**: Fast UPI checkout
  - **IRCTC Official Portal**: Official railways booking
- Quick utilities for **PNR Status Check**, **Live Train Tracking**, and **Seat Availability**.

### 5. ❤️ Favorites & Bucket List with Bulk Delete
- Interactive bookmarking synced with authenticated user accounts in MongoDB.
- **Select Mode**: Multi-select toggle with individual item checkboxes.
- **Bulk Actions**: Select All, Deselect All, and **"Delete Selected"** with custom confirmation dialog.
- **Clear All**: One-click wipe bucket list option with safe modal prompt.

### 6. 🏠 User Listings & Place Management (CRUD)
- Create new travel listings with image URLs, category, budget, and description.
- Edit and update owned destinations.
- Authorization protection: Only listing owners or platform administrators can modify/delete destinations.

### 7. 🔐 Authentication & Security
- **JWT (JSON Web Token)** based stateless authentication.
- Password hashing with **bcryptjs** (10 salt rounds).
- Optional **Email OTP Verification** with Nodemailer for authentic user registration.
- Role-based authorization (`user` vs `admin`).
- **Zero Frontend Secret Exposure**: OpenAI API keys, database connection strings, and JWT secrets reside exclusively on the server in `.env`.

### 8. 🌓 Dark Mode & Responsive Design
- System-aware and manual Dark / Light theme switcher with persistent local storage.
- Fully responsive across Desktop, Tablet, and Mobile devices using Tailwind CSS.

---

## 🛠️ Tech Stack Architecture

```
                   ┌──────────────────────────────────────┐
                   │           WANDERLUST CLIENT          │
                   │  React 18 + Vite + Tailwind CSS      │
                   │  Lucide Icons + React Router v6      │
                   └──────────────────┬───────────────────┘
                                      │  REST API Calls (Axios)
                                      ▼
                   ┌──────────────────────────────────────┐
                   │           EXPRESS.JS SERVER          │
                   │  Node.js + RESTful API Controllers   │
                   │  JWT Auth + Rate Limiting + CORS     │
                   └──────┬────────────────────────┬──────┘
                          │                        │
         Mongoose Models  │                        │  OpenAI API (gpt-4o-mini)
                          ▼                        ▼
               ┌─────────────────────┐   ┌─────────────────────┐
               │   MONGODB DATABASE  │   │     OPENAI API      │
               │  - Users            │   │  - State Guides     │
               │  - Destinations     │   │  - Travel Planning  │
               │  - SavedTrips       │   │  - Itinerary Chat   │
               │  - Reviews          │   └─────────────────────┘
               └─────────────────────┘
```

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, React Router v6, Axios, Lucide React, React Hot Toast |
| **Backend** | Node.js 18+, Express.js 4, Mongoose 8, JSON Web Tokens (JWT), bcryptjs, CORS, Dotenv |
| **Database** | MongoDB (Local `127.0.0.1:27017` or MongoDB Atlas) |
| **AI Integration** | OpenAI API (`gpt-4o-mini`), Google Gemini API (Backup Provider) |
| **Email Service** | Nodemailer (Gmail SMTP for OTP verification) |

---

## 📁 Project Directory Structure

```
wanderlust/
├── .gitignore                   # Root gitignore (Protects .env, node_modules, builds)
├── package.json                 # Monorepo root helper scripts
├── README.md                    # Comprehensive documentation
│
├── client/                      # React + Vite Frontend
│   ├── .env                     # Client environment variables (GITIGNORED)
│   ├── .env.example             # Client environment template
│   ├── index.html               # Entry HTML
│   ├── vite.config.js           # Vite configuration
│   ├── tailwind.config.js       # Tailwind CSS design system
│   └── src/
│       ├── App.jsx              # Main router & theme provider
│       ├── main.jsx             # React DOM root
│       ├── index.css            # Tailwind directives & custom CSS
│       ├── components/          # Reusable UI components
│       │   ├── Navbar.jsx       # Glassmorphic header with navigation
│       │   ├── VideoHero.jsx    # Full-screen video hero with sound controls
│       │   ├── DestinationCard.jsx # High-res destination card
│       │   ├── WanderlustAI.jsx # Floating AI travel companion
│       │   ├── ProtectedRoute.jsx # Auth guards
│       │   └── Footer.jsx       # Platform footer
│       ├── pages/               # Route pages
│       │   ├── Home.jsx         # Video Hero + Featured Indian Places
│       │   ├── Explore.jsx      # Search, filter & explore destinations
│       │   ├── DestinationDetails.jsx # Comprehensive place page + Train links
│       │   ├── StateTouristExplorer.jsx # AI Indian State Guide
│       │   ├── TrainTicket.jsx  # Multi-platform railway booking hub
│       │   ├── Favorites.jsx    # Bucket list with bulk delete
│       │   ├── AddPlace.jsx     # Create destination
│       │   ├── EditPlace.jsx    # Modify destination
│       │   ├── MyPlaces.jsx     # User-owned listings
│       │   ├── Login.jsx        # User login
│       │   ├── Register.jsx     # Registration with OTP
│       │   └── Profile.jsx      # User profile & saved AI trips
│       └── services/            # Axios API wrappers
│           ├── api.js           # Axios instance with auth interceptors
│           ├── authService.js   # Login, register, profile
│           ├── destinationService.js # Destinations & favorites API
│           └── aiService.js     # OpenAI & chatbot API
│
└── server/                      # Express.js Backend
    ├── .env                     # Server environment variables (GITIGNORED)
    ├── .env.example             # Server environment template
    ├── server.js                # Express app entry & DB connection
    ├── seed.js                  # Database seeder (28 States + 8 UTs)
    ├── models/                  # Mongoose Schemas
    │   ├── User.js              # User auth, favorites, role
    │   ├── Destination.js       # Indian destinations & categories
    │   ├── Review.js            # User ratings & comments
    │   ├── SavedTrip.js         # Saved AI itineraries
    │   └── ChatConversation.js # Chatbot conversation history
    ├── controllers/             # Business Logic
    │   ├── authController.js
    │   ├── destinationController.js
    │   ├── favoriteController.js # Add, remove, bulk-delete, clear
    │   └── aiController.js      # OpenAI state guides & chat
    ├── routes/                  # Express API Routes
    │   ├── authRoutes.js
    │   ├── destinationRoutes.js
    │   ├── favoriteRoutes.js
    │   └── aiRoutes.js
    ├── middleware/              # Auth & error handling
    │   └── auth.js              # JWT validation & role check
    └── services/                # Backend service layer
        ├── aiService.js         # AI orchestrator & prompt engineering
        └── ai/
            ├── openaiProvider.js # OpenAI Chat Completions caller
            └── geminiProvider.js # Google Gemini fallback caller
```

---

## 🔒 Security & Gitignore Notice

> [!IMPORTANT]
> **API Keys and Secrets are strictly protected:**
> - The root `.gitignore` excludes all `.env`, `*.env`, and `.env.local` files across both `client` and `server`.
> - **OpenAI API Key (`OPENAI_API_KEY`)** and **MongoDB URI** are never tracked in Git or exposed to the browser.
> - Never commit real credentials to public repositories.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **MongoDB**: Community Server running locally at `127.0.0.1:27017` (or MongoDB Atlas connection string)
- **OpenAI API Key**: Obtain from [platform.openai.com](https://platform.openai.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/nitindubey06450-arch/Wanderlust.git
cd Wanderlust
```

---

### 2. Environment Configuration

#### Backend Configuration
Create a `.env` file in the `server` directory:

```bash
cp server/.env.example server/.env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/wanderlust
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development

# AI Configuration (OpenAI as primary)
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Optional Email Service for OTP verification (Can use dummy values in dev)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM="Wanderlust Explorer <noreply@wanderlust.com>"
```

#### Frontend Configuration
Create a `.env` file in the `client` directory:

```bash
cp client/.env.example client/.env
```

Edit `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Install Dependencies

```bash
# Install Server packages
cd server
npm install

# Install Client packages
cd ../client
npm install
```

---

### 4. Seed Database with Indian Destinations

Populate MongoDB with all **36 Indian States and Union Territories**:

```bash
cd server
node seed.js
```

*Output:*
```
MongoDB Connected: 127.0.0.1
Cleaned existing destinations and sample reviews.
Successfully inserted 36 Indian destinations!
Database successfully seeded!
```

---

### 5. Start Application

#### Terminal 1 — Backend Server
```bash
cd server
npm start
```
*Backend runs on: `http://localhost:5000`*

#### Terminal 2 — Frontend Client
```bash
cd client
npm run dev
```
*Frontend runs on: `http://localhost:3000`*

Open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Demo User Credentials

Pre-seeded accounts ready for immediate testing:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@wanderlust.com` | `Admin@123` | Full access, delete any listing, Admin console |
| **Normal User** | `user1@wanderlust.com` | `User@123` | Create listings, manage favorites, chat with AI |

---

## 📡 REST API Reference

### Destinations
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/destinations` | Get paginated destinations (filter, search, category) | No |
| `GET` | `/api/destinations/:id` | Get destination details by ID | No |
| `GET` | `/api/destinations/my-places` | Get current user's listings | Yes |
| `POST` | `/api/destinations` | Create a new destination listing | Yes |
| `PUT` | `/api/destinations/:id` | Update destination (Owner/Admin only) | Yes |
| `DELETE` | `/api/destinations/:id` | Delete destination (Owner/Admin only) | Yes |

### Favorites / Bucket List
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/users/favorites` | Get all saved favorites | Yes |
| `POST` | `/api/users/favorites/:id` | Add destination to favorites | Yes |
| `DELETE` | `/api/users/favorites/:id` | Remove destination from favorites | Yes |
| `POST` | `/api/users/favorites/bulk-delete` | Bulk remove selected favorites | Yes |
| `DELETE` | `/api/users/favorites-all` | Clear all favorites | Yes |

### AI Travel Assistant & Guides
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/ai/state-tourist-places` | OpenAI guide for any Indian State/UT | No |
| `POST` | `/api/ai/chat` | Interactive AI trip assistant message | Optional |
| `GET` | `/api/ai/conversations` | Get user's saved AI chats | Yes |
| `POST` | `/api/ai/saved-trips` | Save generated itinerary to profile | Yes |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ for incredible Indian travels by <strong><a href="https://github.com/nitindubey06450-arch">nitindubey06450-arch</a></strong>
</p>
