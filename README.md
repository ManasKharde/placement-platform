# Placement Coach 🎯

> **A personalized, production-grade placement readiness platform engineered to transition students and junior engineers into top-tier software engineering roles.**

[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.3.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5.2-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_Cloud-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![OpenAPI](https://img.shields.io/badge/Swagger-OpenAPI_3.0-85EA2D?logo=swagger&logoColor=black)](http://localhost:3000/api-docs)

---

## 📑 Table of Contents
- [Executive Overview & Platform Scale](#-executive-overview--platform-scale)
- [Preparation Paths & Pillar Distribution](#-preparation-paths--pillar-distribution)
- [Core System Architecture](#-core-system-architecture)
  - [1. Single-Query CTE Progress Aggregation](#1-single-query-cte-progress-aggregation)
  - [2. Runway & Velocity Pacing Engine](#2-runway--velocity-pacing-engine)
  - [3. Composite "Software Engineer" Readiness Engine](#3-composite-software-engineer-readiness-engine)
  - [4. Gatekeeper Assessment & Atomic Progression](#4-gatekeeper-assessment--atomic-progression)
  - [5. Multi-Modal Practical Evaluation Architecture](#5-multi-modal-practical-evaluation-architecture)
  - [6. Silent JWT Token Refresh Interceptor](#6-silent-jwt-token-refresh-interceptor)
- [Interactive API Documentation (Swagger)](#-interactive-api-documentation-swagger)
- [Repository Structure](#-repository-structure)
- [Local Development Setup](#-local-development-setup)
  - [Prerequisites](#prerequisites)
  - [1. Database Configuration](#1-database-configuration)
  - [2. Backend Setup (`/server`)](#2-backend-setup-server)
  - [3. Frontend Setup (`/placement-frontend`)](#3-frontend-setup-placement-frontend)
- [Content Attribution & Educational Disclaimer](#-content-attribution--educational-disclaimer)
- [License](#-license)

---

## 📊 Executive Overview & Platform Scale

Placement Coach solves the fragmentation of tech interview prep by consolidating structured roadmaps, vetted learning resources, algorithmic challenges, technical screening flashcards, and formal timed tests into an unified, data-driven ecosystem.

*Metrics verified via direct production database audit:*

| Metric | Verified Count | Detail |
| :--- | :---: | :--- |
| **Preparation Paths** | **5** | Specialized career tracks: Node.js Developer, Java Backend, Node.js Backend, React.js Frontend, Python Backend (+ Composite Software Engineer Track). |
| **Curriculum Tracks** | **42** | Relational tracks in database schema (**36** active tracks mapped with ordered topic modules). |
| **Indexed Topics** | **665** | Modular engineering topics covering foundations, frameworks, system architecture, and campus screening. |
| **Practice & Evaluation Items** | **3,558+** | **3,538** curated screening flashcards, coding challenges, and quiz questions in PostgreSQL JSONB + **20** formal timed exam questions. |
| **Curated Technical Resources** | **2,284** | 782 practical challenges, 570 video lectures, 508 algorithmic problems, 289 documentation references, and 135 deep-dive technical articles. |
| **Content Readiness Coverage** | **98.6%** | 656 of 665 topics feature embedded evaluations, practice items, or reference specifications. |

---

## 🧭 Preparation Paths & Pillar Distribution

The curriculum is structured across **4 Core Engineering Pillars**:

```
                       ┌──────────────────────────────────────────────┐
                       │           Placement Coach Core Pillars       │
                       └──────────────────────┬───────────────────────┘
                                              │
         ┌──────────────────┬─────────────────┴────────────────┬──────────────────┐
         ▼                  ▼                                  ▼                  ▼
┌──────────────────┐ ┌──────────────────┐             ┌──────────────────┐ ┌──────────────────┐
│ Pillar 1: Dev    │ │ Pillar 2: DSA    │             │ Pillar 3: CS     │ │ Pillar 4: Apt    │
│ & System Design  │ │ Problem Solving  │             │ Fundamentals     │ │ & Quantitative   │
├──────────────────┤ ├──────────────────┤             ├──────────────────┤ ├──────────────────┤
│ 237 Topics       │ │ 319 Topics       │             │ 5 Topics         │ │ 39 Topics        │
│ 1,087 Practice Qs│ │ 954 LeetCode/GFG │             │ 200 Flashcards/Qs│ │ 780 Screening Qs │
└──────────────────┘ └──────────────────┘             └──────────────────┘ └──────────────────┘
```

### Path Breakdown

1. **React.js Frontend Developer** (10 Tracks, 122 Topics): HTML5, CSS3 Architecture, Modern ES6+, TypeScript, React 19 Core & Hooks, Redux Toolkit, TanStack Query, Tailwind CSS, Frontend Performance & Web Vitals, and Web Architecture.
2. **Node.js Backend Developer** (8 Tracks, 457 Topics): Problem Solving (DSA & SQL), Node.js Core Architecture, Express RESTful APIs, PostgreSQL & ACID, Authentication & OAuth, Caching/Queues (Redis), System Design, and Aptitude.
3. **Java Backend Developer** (7 Tracks, 414 Topics): Problem Solving (DSA & SQL), Core Java & OOP, Relational Databases with JDBC/Hibernate JPA, Spring Boot Microservices, Cloud Security, System Design, and Aptitude.
4. **Python Backend Developer** (8 Tracks, 417 Topics): Problem Solving (DSA), Python Core & Advanced Runtime Internals, OOP/Concurrency, MongoDB NoSQL, PostgreSQL, System Design, and Campus Aptitude.
5. **Full-Stack "Software Engineer" Composite**: Holistic dual-engine tracking calculating combined frontend and backend readiness.

---

## ⚡ Core System Architecture

### 1. Single-Query CTE Progress Aggregation
Instead of firing N+1 queries across tracks, topics, and user progress tables, the dashboard and roadmap engines utilize single-roundtrip PostgreSQL Common Table Expressions (CTEs):

```sql
WITH path_topics AS (
  SELECT 
    t.id AS track_id, t.name AS track_name, t.slug AS track_slug, pt.track_order,
    top.id AS topic_id, top.name AS topic_name, tt.topic_order,
    up.status AS progress_status
  FROM path_tracks pt
  JOIN tracks t ON pt.track_id = t.id
  JOIN track_topics tt ON t.id = tt.track_id
  JOIN topics top ON tt.topic_id = top.id
  LEFT JOIN user_progress up ON top.id = up.topic_id AND up.user_id = $1
  WHERE pt.path_id = $2
)
SELECT 
  track_id, track_name, track_slug, track_order,
  COUNT(topic_id)::int AS total_track_topics,
  COUNT(CASE WHEN progress_status = 'completed' THEN 1 END)::int AS completed_track_topics
FROM path_topics
GROUP BY track_id, track_name, track_slug, track_order
ORDER BY track_order ASC;
```

### 2. Runway & Velocity Pacing Engine
Implemented in `server/controllers/studyTimeController.js`, the platform projects the exact calendar completion date based on daily study commitments (1–16 hours):

$$\text{Projected Days to Complete} = \left\lceil \frac{\sum \text{Remaining Estimated Minutes}}{\text{Daily Study Target (Minutes)}} \right\rceil$$

### 3. Composite "Software Engineer" Readiness Engine
Implemented in `server/services/readinessEngine.js`, this service correlates progress across disparate frontend and backend tracks to evaluate candidate readiness:
- **0.0% – 19.9%**: *Orientation Stage (Getting Started)*
- **20.0% – 49.9%**: *Core Skills in Progress (Foundations Building)*
- **50.0% – 79.9%**: *Competitive for Placement Screening (Shortlist Competitive)*
- **80.0% – 100%**: *Ready for Technical Screening (Interview Ready)*

### 4. Gatekeeper Assessment & Atomic Progression
To eliminate false self-attestation, topics equipped with formal quizzes require a verified **≥ 70% passing score** before the topic can be marked as complete.
- When a user submits a completion toggle to `/api/topics/:topicId/toggle`, the backend inspects `quiz_attempts` for a verified passing record.
- If unpassed, the API responds with `403 Forbidden`, preventing progression.
- If passed, updates are executed atomically via PostgreSQL UPSERT:
  ```sql
  INSERT INTO user_progress (user_id, topic_id, status, completed_at, updated_at)
  VALUES ($1, $2, $3::progress_status, CASE WHEN $3::progress_status = 'completed' THEN NOW() ELSE NULL END, NOW())
  ON CONFLICT (user_id, topic_id)
  DO UPDATE SET status = EXCLUDED.status, completed_at = EXCLUDED.completed_at, updated_at = NOW();
  ```

### 5. Multi-Modal Practical Evaluation Architecture
The topic detail view (`placement-frontend/src/pages/TopicDetailPage.jsx`) provides tailored evaluation paradigms based on domain context:
- **Core CS 50-Question Timed Suite:** Real-time countdown timer, automatic submission upon expiration, category score breakdowns (Theory, Numerical/Memory, Scenario/Engineering), and review view.
- **Aptitude Assessment Gateway:** Closed assessment card requiring manual start trigger to enter exam conditions.
- **Browse Mode (Self-Paced):** Immediately reveals all curated questions with option radios, immediate feedback, and isolated selection state dictionaries (`q.id || index`).
- **Technical Screening Flashcards:** Collapsible accordions with Markdown syntax highlighting rendering `Interview Answer Frameworks`.

### 6. Silent JWT Token Refresh Interceptor
Implemented in `placement-frontend/src/api/client.js`, an Axios response interceptor intercepts expired `401 Unauthorized` requests:
1. Catches initial auth failure and queues concurrent requests in a memory buffer.
2. Fires a background silent refresh to `POST /api/auth/refresh` using HTTP-only cookies.
3. Upon refresh success, replays all queued requests seamlessly without user logout or UI disruption.
4. If the refresh token is revoked/expired, triggers a window-level `auth:session-expired` event for clean redirect to login.

---

## 📖 Interactive API Documentation (Swagger)

The backend provides complete OpenAPI 3.0 documentation mounted via Swagger UI:
- **Endpoint:** `http://localhost:3000/api-docs`
- **Features:** Interactive request executor, schema definitions, and cookie credential forwarding (`withCredentials: true`).

---

## 📂 Repository Structure

```
Personalized-Placement-Coach/
│
├── README.md                           # Master Project Documentation
│
├── placement-frontend/                 # React 19 Client (Vite + Tailwind v4)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── api/
│       │   └── client.js               # Axios instance with silent refresh interceptors
│       ├── components/
│       │   └── layout/
│       │       └── AppLayout.jsx       # Responsive shell with sticky navigation & mobile drawer
│       ├── context/
│       │   └── AuthContext.jsx         # User session, login, signup & logout state
│       ├── pages/
│       │   ├── DashboardPage.jsx       # Student dashboard, readiness metrics & pacing cards
│       │   ├── RoadmapPage.jsx         # Multi-pillar curriculum tree & track expansion
│       │   ├── TopicDetailPage.jsx     # Workspace, markdown theory, video & evaluation runner
│       │   └── LoginPage.jsx           # Clean authentication & password reset flows
│       └── utils/
│           └── trackUtils.js           # Display name normalizer and badge helpers
│
└── server/                             # Node.js + Express 5 Backend
    ├── package.json
    ├── app.js                          # Express app entry, security headers & route mounting
    ├── config/
    │   ├── db.js                       # PostgreSQL connection pool (Neon SSL support)
    │   ├── passport.js                 # Passport OAuth Google strategy
    │   └── swagger.js                  # OpenAPI 3.0 specification definition
    ├── controllers/
    │   ├── authController.js           # Auth registration, JWT creation, OTP reset
    │   ├── dashboardController.js      # Single-query dashboard metrics aggregation
    │   ├── preparationController.js    # Paths, track hierarchies, roadmap data
    │   ├── progressController.js       # Atomic completion toggles & quiz gatekeeper
    │   ├── quizController.js           # Quiz generation, timer validation & scoring
    │   ├── resourceController.js       # Topic detail ingestion & pillar mapping
    │   └── studyTimeController.js      # Velocity calculations & daily commitment updates
    ├── middleware/
    │   ├── auth.js                     # JWT verification middleware
    │   ├── errorHandler.js             # Centralized API error handler
    │   └── rateLimiter.js              # IP rate limiting for auth & API routes
    ├── routes/                         # Express API route declarations
    ├── scripts/                        # Database migrations & 31 DSA seed batches
    ├── services/
    │   └── readinessEngine.js          # Cross-discipline readiness algorithms
    └── utils/
        ├── emailService.js             # Password reset & transactional notifications
        └── tokenGenerator.js           # Cryptographic access & refresh token generators
```

---

## 🚀 Local Development Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher
- **PostgreSQL**: Local instance or cloud database (e.g., [Neon.tech](https://neon.tech))

---

### 1. Database Configuration
Create a PostgreSQL database (e.g., `placement_platform`). The server automatically executes required migrations and seed scripts on initial launch.

---

### 2. Backend Setup (`/server`)

1. Open your terminal and navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `server/` root:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://<db_user>:<db_password>@<db_host>:<db_port>/<db_name>?sslmode=require
   CLIENT_URL=http://localhost:5173
   FRONTEND_URL=http://localhost:5173

   # JWT Cryptographic Secrets (Generate with `openssl rand -hex 64`)
   ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_here

   # Google OAuth (Optional)
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

   # SMTP Email Configuration (Optional for Password Reset OTPs)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   EMAIL_FROM=Placement Coach <support@placementcoach.com>
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server starts on `http://localhost:3000` and Swagger docs mount at `http://localhost:3000/api-docs`.*

---

### 3. Frontend Setup (`/placement-frontend`)

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd placement-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. *(Optional)* Create a `.env` file in `placement-frontend/`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The client will be live at `http://localhost:5173`.*

5. To build for production:
   ```bash
   npm run build
   ```

---

## 🎓 Content Attribution & Educational Disclaimer

Placement Coach acts as an architectural aggregator and evaluation platform. All embedded video masterclasses, technical documentation, and practice problem references are curated from leading community educators and open technical publications:

- **Data Structures & Algorithms:** Curated problem patterns from **LeetCode**, **GeeksforGeeks**, and video lectures by **Striver (takeUforward)** and **Love Babbar (CodeHelp)**.
- **Computer Science & Web Architecture:** Lectures and reference materials by **Vinod Bahadur Thapa (Thapa Technical)**, **Remzi Arpaci-Dusseau (OSTEP)**, and **MDN Web Docs**.
- **Campus Placement Aptitude:** Quantitative modules and reasoning scenarios by **CareerRide** and standard technical screening frameworks.

*All credit and intellectual property for curated external videos and problem statements belong to their respective creators. Links and creator channel references are provided on every topic page.*

---

## 📄 License
This project is licensed under the [ISC License](LICENSE). Built for educational and career advancement purposes.
