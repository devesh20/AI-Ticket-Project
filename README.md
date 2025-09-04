Full-Stack AI Agent Project 

A full-stack app that automates ticket triage and user workflows using an AI assistant, with a Node.js/Express backend and a React (Vite) frontend.

Features

Auth: Signup/Login with JWT middleware.
Tickets: Create, list, and view details.
AI Triage: Auto-categorization/summarization via utils/ai-ticket.js.
Background jobs: Inngest functions for signup and ticket create flows.
Email: Transactional emails via utils/mailer.js.
Modern UI: React with component library and theme toggle.

Tech Stack

Backend: Node.js, Express, Mongoose/MongoDB, Inngest
Frontend: React, Vite
Auth: JWT
Email: Nodemailer (or similar)
AI: OpenAI/LLM provider (via ai-ticket.js)
