# 🧠 Peblo Notes AI

AI-powered smart notes application built with Next.js, Supabase, Prisma, and Groq AI.

---

## ✨ Features

- 🔐 Authentication with Supabase Auth
- 📝 Create, edit, and delete notes
- 🤖 AI-generated summaries using Groq AI
- ⚡ Autosave note editing
- 🏷️ Tags and note organization
- 📊 AI Insights panel
- 🌙 Modern dark dashboard UI
- 📱 Responsive layout
- ☁️ Supabase PostgreSQL database
- 🔄 Prisma ORM integration

---

# 🛠️ Tech Stack

## Frontend
- Next.js 16 (App Router)
- React
- Tailwind CSS
- Framer Motion

## Backend
- Next.js API Routes
- Prisma ORM
- Supabase PostgreSQL

## Authentication
- Supabase Auth

## AI Integration
- Groq API

---

# 📂 Project Structure

```bash
src/
├── actions/
├── app/
│   ├── api/
│   ├── auth/
│   ├── dashboard/
│   └── share/
├── components/
│   ├── ai/
│   ├── dashboard/
│   ├── notes/
│   └── ui/
├── hooks/
├── lib/
├── providers/
└── styles/
```

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GROQ_API_KEY=
```

---

# 📦 Installation

Clone the repository:

```bash
git clone https://github.com/sukanya-2006/Peblo-Notes-AI.git
```

Install dependencies:

```bash
npm install
```

Run Prisma database sync:

```bash
npx prisma db push
```

Start the development server:

```bash
npm run dev
```

---

# 🚀 Current Progress

Currently implementing:

- AI insights improvements
- Enhanced autosave workflow
- Better mobile responsiveness
- Note sharing system
- Productivity analytics
- Improved editor experience

---

# 🎨 UI Inspiration

Inspired by:
- Notion
- Linear
- Craft
- Modern productivity dashboards

---

# 👩‍💻 Author

### Sukanya Bhowmick

GitHub:
https://github.com/sukanya-2006

---

# ⭐ Project Goal

Peblo Notes AI aims to become a modern AI-powered productivity and note-taking platform with:
- intelligent summaries
- organized workflows
- smooth editing experience
- clean modern UI
- scalable architecture