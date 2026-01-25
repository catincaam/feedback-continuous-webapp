# Continuous Feedback WebApp

A **web application for continuous feedback** during courses and seminars, developed as a **team project** as part of a university course.

Students can provide quick, anonymous feedback using emoji-based reactions, while teachers can visualize aggregated feedback in real time or review it later.

---

## Overview

The application enables:
- **Real-time feedback collection** from students
- **Anonymous reactions** to lectures and seminars
- **Dashboard views** for teachers to monitor engagement and sentiment
- Clear separation between frontend, backend, and documentation

---

## Project Structure

continuous-feedback-app/
├── docs/ # Documentation, specifications, test plans
├── frontend/ # React.js frontend application
├── backend/ # Node.js REST API
└── README.md


---

## 🛠️ Tech Stack

### Frontend
- **React.js** (Single Page Application)
- Component-based architecture
- Client-side routing and services layer

### Backend
- **Node.js**
- **REST API**
- Authentication middleware
- Relational database access (MySQL / PostgreSQL)

### Other
- **Docker & Docker Compose** (local development)
- **OpenAPI / Swagger** specification
- **Jest + Supertest** (API testing)
- **Git / GitHub** for version control

---

## Features

- Emoji-based feedback collection
- Role-based access (students / teachers)
- Anonymous feedback storage
- Teacher dashboards for activity and feedback visualization
- RESTful API with documented endpoints

---

## Setup & Development

### Quick setup (development)

1. Copy environment variables example:
   
cp .env.example .env
Start services using Docker Compose:

docker-compose up --build
Backend will be available at:

http://localhost:3000
(if configured accordingly)

## Documentation & Useful Files
docs/openapi.yaml – OpenAPI / Swagger specification for core endpoints

docs/TEST_PLAN.md – Manual and recommended automated tests

docs/CURL_EXAMPLES.md – cURL commands for manual API testing

backend/tests/api.test.js – API test stub (Jest + Supertest)

backend/Dockerfile – Backend service containerization

## Team

Ana-Miruna Grigore

Mara-Catinca Marinescu

Coordinating professor: Cimpeanu Ion Alexandru

## Notes
This project was developed as part of a university course and focuses on learning full-stack web development, teamwork, and clean project structure.

It is intended for educational and portfolio purposes.
