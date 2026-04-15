# myIITtwin

> Meet the IIT student you would have been.

---

## What is this?

**myIITtwin** is a conversational AI peer — Aryan, a CSE student at IIT Bombay — who lives a parallel version of your college life.

You're a tier 3 CS student. You've wondered what your batchmates at IIT are doing right now. Not to compare. Not to feel behind. Just that quiet curiosity — *if I had gotten in, what would my life look like at this exact moment?*

myIITtwin answers that. But not as a dashboard, not as a roadmap, and not as a highlight reel. Aryan is a peer. He makes mistakes, wastes weekends, plays cricket, shows up to fests, struggles with DP, and still figures it out. You can ask him anything — what he did last semester, what he's doing this week, what he's planning for the next three months. He reacts to what you tell him about your own week. He'll suggest one thing to focus on next — not a list, just one thing.

Every session ends with you feeling clearer and more capable than when you started.

---

## The core idea

Most comparison tools make you feel behind.  
myIITtwin makes you feel like you have someone in your corner.

The difference:
- **Old approach:** "You're 150 problems behind Aryan." → anxiety, rushing, shallow work
- **myIITtwin:** "Oh you learned graphs this week? Same thing I was doing around that time. Here's what I did after that..." → clarity, motivation, one next step

Aryan isn't a benchmark. He's a reference point. His path is a map, not a race track.

---

## How it works

### 1. Onboarding (one conversation, ~2 minutes)
Aryan asks you a few things — your semester, your goal, what you've already done, and your vibe outside of coding (sports? music? gaming?). His personality adjusts to match yours. He's not just a study machine.

### 2. Weekly log (30 seconds, once a week)
You tell him what you did this week. One to three lines. He reacts — relates it to his own experience, and ends with one thing he'd focus on next if he were you.

### 3. Chat anytime
Ask Aryan anything:
- *"What are you working on this week?"*
- *"What did you do in sem 2?"*
- *"What's your plan before internship season?"*
- *"Be honest — how far behind am I?"*

He answers like a peer, not a mentor. Late-night energy. No jargon. No lecture.

---

## What makes Aryan feel real

- He has a life beyond DSA. He skips sessions for cricket matches, pulls all-nighters before exams, has a guitar in his room if that's your vibe, games till 2am sometimes.
- He's the **Normal version** — not the grind machine. He wastes some weekends. He avoided DP for three weeks. He still gets there.
- His timeline is coherent across every conversation — what he says he did in sem 2 stays consistent with what he's doing now.
- He remembers what you told him. If you said you learned BFS last week, he builds on that this week.

---

## Tech stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite |
| AI | Google Gemini 1.5 Flash |
| Backend | Java 17 + Spring Boot 3 |
| Database | H2 file-based (dev) / PostgreSQL (prod) |
| Rate limiting | Bucket4j |

---

## Running locally

### Prerequisites
- Node 18+
- Java 17+
- Maven
- A [Gemini API key](https://aistudio.google.com) (free tier works)

### Backend

```bash
cd backend
set GEMINI_API_KEY=your-key-here       # Windows
# export GEMINI_API_KEY=your-key-here  # macOS / Linux
mvn spring-boot:run
```

Runs on `http://localhost:8080`  
H2 console available at `http://localhost:8080/h2-console`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`

---

## API endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/users` | Create user profile from onboarding |
| GET | `/api/users/{id}` | Get user profile |
| POST | `/api/chat/message` | Send message, get Aryan's reply |
| GET | `/api/chat/history/{userId}` | Get full chat history |
| POST | `/api/logs/{userId}` | Submit weekly log, get Aryan's reaction |
| GET | `/api/logs/{userId}` | Get all past logs |

---

## Project status

- [x] Frontend — landing, onboarding, home, chat screens
- [x] Backend — Spring Boot REST API + H2 storage
- [x] AI layer — Aryan persona + Gemini API prompt system
- [x] Full integration — frontend wired to backend
- [x] Polish — skeletons, mobile responsive, 404 page
- [ ] Deployment

---

## Why this exists

Built by a tier 3 CS student who was always curious what his peers in IIT were doing right now.  
Not to race them. Just to see.

---

*"You haven't suffered enough problems yet to recognize patterns quickly. But this gap is very compressible in 2–3 months if you're consistent."*  
— Aryan, IIT Bombay CSE, Semester 3
