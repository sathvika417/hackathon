# FutureProof AI (JobPulse AI) — PRD

## Original problem statement
Build a world-class futuristic AI web application called "JobPulse AI" (branded FutureProof.ai).
Feel: Apple + OpenAI + Stripe + Linear + Emergent onboarding. Glassmorphism, dark/light mode,
particle background, blue+purple+cyan gradients, Framer Motion animations, Recharts, premium
typography, avoid traditional forms. 5-step onboarding: persona → career → journey → cinematic
AI scanning → result dashboard (gauge, 6 score cards, radar, pie, line, top AI factors, skill
recommendations, career alternatives, final CTA).

## Architecture
- **Frontend**: React 19 + CRA + Tailwind + shadcn/ui + Framer Motion + Recharts + Lucide icons
- **Backend**: FastAPI, stateless (no MongoDB by user's decision)
- **ML**: CatBoost regression + scikit-learn `SimpleImputer(median)`; model + imputer persisted
  to `/app/backend/models/` on first startup, then reused
- Routes: `GET /api/`, `GET /api/occupations`, `POST /api/predict`

## User personas
Student, Working Professional, Freelancer, Business Owner, Career Switcher.

## Core requirements (static)
- Landing hero + neural particle background + theme toggle
- 5-step animated onboarding with progress ring + AnimatePresence transitions
- Cinematic scanning (SVG neural viz + laser sweep, no spinner)
- Bento-grid result dashboard: gauge, radar, pie, line, 6 score cards, factors, skills, alternatives, CTA
- All predictions from trained CatBoost model — never LLM or rule-based
- Dark + Light modes both fully styled

## Implemented (2026-02-10)
- [x] CatBoost regression trained on 35-occupation dataset with 8 skill/context features
- [x] User inputs (experience/education/AI usage) blended into feature vector before predict
- [x] Full 3-page flow (Landing / Onboarding / Results) with Framer Motion transitions
- [x] Dark/Light theme toggle with persisted preference
- [x] All charts (gauge, radar, pie, line, sparklines) via Recharts + custom SVG
- [x] Skill recommendations, career alternatives, top AI factors, insights all generated
- [x] Auth UI shell (2026-02-10): ProfileDropdown next to ThemeToggle, /login, /signup, /forgot-password glassmorphism pages with password-strength meter and Firebase-ready AuthContext (client-only mock via localStorage)

## What's next (backlog)
- **P1** Persist analysis history (opt-in) — currently sessionStorage only
- **P1** Share/export analysis as a PDF or shareable link (viral loop)
- **P2** Expand occupation catalog to 200+ (O*NET-aligned)
- **P2** Add "explore careers" mode with side-by-side comparison
- **P2** Email digest of upskilling roadmap (Resend/SendGrid)
- **P3** Auth (Emergent Google) for saved history + LinkedIn import

## Test credentials
_No auth in this build._
