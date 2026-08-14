# AI Prompt Library — Full-Stack Web Application

A full-stack React + TypeScript + Express + MongoDB web application designed to create, organize, search, filter, reorder, and manage reusable AI prompts across 10 exact categories. Built with modern SaaS aesthetics, smooth micro-interactions, dark/light theme persistence, keyboard shortcuts, and REST API integration.

![AI Prompt Library Banner](https://raw.githubusercontent.com/munjabashendge07/ai-prompt-library/main/banner.png)

## 🌟 Live Demo & Repository
- **Live Demo**: [https://ai-prompt-library-demo.vercel.app](https://ai-prompt-library-demo.vercel.app)
- **GitHub Repository**: [https://github.com/munjabashendge07/ai-prompt-library](https://github.com/munjabashendge07/ai-prompt-library)

---

## 🚀 Features

### 1. Interactive Dashboard
- **Real-Time Statistics**: Automatically calculates total prompts, favorite prompts, categories count, and recently added prompts.
- **Category Distribution**: Visual progress bars displaying prompt density across all 10 categories.
- **Recent Activity Feed**: Quick access to newly created or modified prompt templates.

### 2. Full Prompt CRUD & Actions
- **Create & Edit**: Accessible modal dialogs with full field validation, category selection, tags, description, content, pin to top, and favorite toggles.
- **Delete Confirmation**: Modal popup ensuring safe deletion of prompts.
- **Duplicate**: One-click duplication of existing prompt templates.
- **Pin & Favorite**: Pin critical prompts to the top of the library or filter favorites.
- **Copy to Clipboard**: Quick copy button with visual success state and floating toast notification.
- **Drag-and-Drop Reordering**: Seamlessly drag and reorder prompt cards with order persistence.

### 3. Exact 10 Categories
Enforced consistently across forms, filters, validation rules, TypeScript types, and Mongoose schemas:
1. `Coding`
2. `Marketing`
3. `Content Writing`
4. `Email`
5. `Resume`
6. `SQL`
7. `Design`
8. `Social Media`
9. `Productivity`
10. `Others`

### 4. Search, Filter & Sort
- **Debounced Search**: Live search across prompt titles, content, descriptions, and tags.
- **Combined Filtering**: Filter by category and favorites simultaneously with active filter badges and reset button.
- **Sorting Options**:
  - `Newest First`
  - `Oldest First`
  - `Title: A → Z`
  - `Title: Z → A`

### 5. Robust JSON Import / Export
- **Export**: Download your entire prompt collection as a formatted `.json` file.
- **Import Validation**: Validates JSON syntax, required fields (`title`, `prompt`), category enums (exact 10), and handles missing/duplicate IDs safely without crashing. Provides detailed warning/error lists before committing import.

### 6. Theme & LocalStorage Persistence
- **Dark / Light Mode**: Smooth transition with LocalStorage theme persistence.
- **Data Sync**: Dual-layer architecture synced between Express REST APIs and LocalStorage cache/fallback.

### 7. Keyboard Shortcuts & Accessibility
- `Ctrl / Cmd + K`: Instant focus search bar.
- `Escape`: Close active modals and confirmation dialogs.
- `Ctrl / Cmd + Enter`: Submit prompt form inside modals.
- Full ARIA semantics, visible focus rings, keyboard navigable controls.

---

## 🛠 Tech Stack

### Frontend (`/client`)
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Custom CSS Variables & Animations
- **State Management**: Context API (`PromptContext`, `ThemeContext`, `ToastContext`)
- **Drag & Drop**: `@hello-pangea/dnd`
- **Icons**: Lucide React

### Backend (`/server`)
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose
- **API Architecture**: RESTful JSON API with CORS and centralized error handling

---

## 📁 Repository Structure

```
getaAI/
├── client/                     # React + TypeScript + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Sidebar, Dashboard, PromptCards, Modals
│   │   ├── context/            # PromptContext, ThemeContext, ToastContext
│   │   ├── hooks/              # useDebounce, useKeyboardShortcut, useLocalStorage
│   │   ├── pages/              # DashboardPage, PromptsPage
│   │   ├── services/           # api.ts (REST client with LocalStorage fallback)
│   │   ├── types/              # prompt.ts
│   │   └── utils/              # samplePrompts.ts, jsonValidator.ts
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── server/                     # Express + MongoDB Backend
│   ├── src/
│   │   ├── config/             # db.ts (Mongoose connection)
│   │   ├── controllers/        # promptController.ts
│   │   ├── models/             # Prompt.ts (Mongoose Schema)
│   │   ├── routes/             # promptRoutes.ts
│   │   ├── types/              # prompt.ts
│   │   ├── app.ts
│   │   └── server.ts
│   ├── package.json
│   └── .env.example
│
├── package.json                # Root workspace launcher
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`/server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/prompt_library
CLIENT_URL=http://localhost:5173
```

### Frontend (`/client/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🚦 Quick Start & Setup Instructions

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/munjabashendge07/ai-prompt-library.git
cd ai-prompt-library

# Install root, client, and server dependencies
npm run install:all
```

### 2. Configure Environment Files
- Copy `/server/.env.example` to `/server/.env`
- Copy `/client/.env.example` to `/client/.env`

### 3. Run Locally (Concurrent Mode)
```bash
# Starts Express server on port 5000 and Vite client on port 5173
npm run dev
```

Or run client and server independently:
```bash
# Terminal 1: Backend Server
npm run dev:server

# Terminal 2: Frontend Client
npm run dev:client
```

---

## 📡 REST API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/prompts` | Retrieve all prompts sorted by pinned status and order |
| `POST` | `/api/prompts` | Create a new prompt (with category validation) |
| `PUT` | `/api/prompts/:id` | Update prompt fields |
| `DELETE` | `/api/prompts/:id` | Delete a prompt by ID |
| `PATCH` | `/api/prompts/reorder` | Bulk update prompt list order |
| `POST` | `/api/prompts/seed` | Seed initial sample prompts |
| `POST` | `/api/prompts/import` | Bulk import JSON array of validated prompts |

---

## 📄 JSON Import / Export Format

```json
[
  {
    "title": "Senior Code Reviewer & Security Auditor",
    "prompt": "Act as a Senior Principal Software Engineer... Review code snippet for vulnerabilities.",
    "category": "Coding",
    "tags": ["code-review", "security", "refactoring"],
    "description": "Comprehensive code review prompt.",
    "isFavorite": true,
    "isPinned": font,
    "order": 0
  }
]
```

---

## 🌐 Deployment Guide

### Deploying Frontend (Vercel)
1. Push workspace code to GitHub.
2. Import repository on [Vercel](https://vercel.com).
3. Set **Root Directory** to `client`.
4. Configure Build Command: `npm run build` and Output Directory: `dist`.
5. Set Environment Variable: `VITE_API_BASE_URL=https://your-backend-api.onrender.com/api`.

### Deploying Backend (Render / Railway)
1. Create a Web Service on Render/Railway connected to your repository.
2. Set **Root Directory** to `server`.
3. Build Command: `npm run build`, Start Command: `npm start`.
4. Add Environment Variables:
   - `MONGODB_URI`: Connection string from MongoDB Atlas.
   - `CLIENT_URL`: Your Vercel frontend URL.

## 👤 Author & Contact

- **Author**: munjabashendge07
- **GitHub Profile**: [@munjabashendge07](https://github.com/munjabashendge07)
- **Email**: [munjabashendge07@gmail.com](mailto:munjabashendge07@gmail.com)

---

## 📜 License
MIT License. Free for open-source and commercial use.
