# Hyper Cart – Full Stack Application

This repository contains the **full-stack implementation** of **Hyper Cart**, an e-commerce platform built with a **Django (Backend API)** and a **modern Frontend framework** (Angular / React).

Both **backend and frontend live in the same repository** for easier development, versioning, and deployment.

---

## 🧱 Tech Stack

### Backend

* **Python 3.x**
* **Django**
* **Django REST Framework (DRF)**
* **JWT Authentication**
* **PostgreSQL** (Production) / SQLite (Development)

### Frontend

* **Angular / React** (SPA)
* **TypeScript / JavaScript**
* **REST API Integration**
* **Responsive UI**

---

## 📂 Repository Structure

```
hyper_cart/
│── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env
│   ├── hyper_cart/.env
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── asgi.py
│   │   └── wsgi.py
│   └── apps/
│       ├── users/
│       ├── products/
│       ├── cart/
│       ├── orders/
│       └── payments/
│
│── frontend/
│   ├── package.json
│   ├── src/
│   └── angular.json / vite.config.js
│
│── README.md
└── .gitignore
```

---

## ⚙️ Backend Setup (Django)

### 1️⃣ Navigate to backend

```bash
cd backend
```

### 2️⃣ Create & activate virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / Mac
source venv/bin/activate
```

### 3️⃣ Install dependencies

```bash
pip install -r requirements.txt
```

### 4️⃣ Environment variables

Create a `.env` file in the backend directory:

```env
SECRET_KEY=your-secret-key
DEBUG=True
DATABASE_NAME=hyper_cart
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_HOST=localhost
DATABASE_PORT=5432
```

### 5️⃣ Database setup

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6️⃣ Create superuser

```bash
python manage.py createsuperuser
```

### 7️⃣ Run backend server

```bash
python manage.py runserver
```

Backend runs at:

```
http://127.0.0.1:8000/
```

---

## 🎨 Frontend Setup

### 1️⃣ Navigate to frontend

```bash
cd frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run frontend server

```bash
npm start
# or
ng serve
```

Frontend runs at:

```
http://localhost:3000
# or
http://localhost:4200
```

---

## 🔐 Authentication Flow

* Backend provides JWT tokens
* Frontend stores token securely
* API calls include:

```http
Authorization: Bearer <access_token>
```

---

## 🔁 Development Workflow

```bash
# Backend terminal
cd backend
python manage.py runserver

# Frontend terminal
cd frontend
npm start
```

---

## 🚦 Git Workflow

* `main` → stable branch
* `feature/*` → new features

```bash
git checkout -b feature/cart-module
git push origin feature/cart-module
```

> ⚠️ Double confirmation is enabled before push to avoid accidental updates.

---

## 🔒 Security Best Practices

* Never commit `.env`
* Use HTTPS in production
* Keep secrets outside repo

---

## 📦 Deployment (Overview)

* Backend: **Gunicorn + Nginx**
* Frontend: **Build & serve static files**
* Use environment-specific configs

---

## 👨‍💻 Author

**Ameen C A**
Full Stack Developer

---

## 📄 License

MIT License
