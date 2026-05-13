# Maintenance Frontend

A React frontend for the Django Maintenance Dispatch System API.

## Tech Stack

- React.js
- Vite
- React Router DOM
- Axios
- Context API

---

# Setup

1. Open terminal inside:

```bash
software-dev-specialisation/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

# Backend API

The frontend connects to:

```txt
http://127.0.0.1:8000/api
```

API requests preserve authentication cookies using:

```js
withCredentials: true
```

---

# Authentication

This project uses:

- Django Session Authentication
- CSRF Protection
- Secure Cookie-Based Login

The frontend fetches a CSRF token before login and sends credentials securely using Axios.

---

# User Roles

## Property Manager
- View all maintenance requests
- Assign maintenance staff
- Manage request workflow

## Maintenance Staff
- View assigned tasks only
- Update task statuses

## Resident
- Create maintenance requests
- View personal requests only

---

# Available Pages

- Login Page
- Manager Dashboard
- Staff Dashboard
- Resident Dashboard
- Create Request Page
- Request Details Page
- Unauthorized Access Page

---

# Features

- Role-based route protection
- Protected API requests
- Session persistence
- Dynamic sidebar navigation
- Request status updates
- Staff assignment workflow

---

# Environment Variables

Create a `.env` file:

```env
VITE_API_BASE=http://127.0.0.1:8000/api
```

---

# Folder Structure

```bash
src/
│
├── components/
├── context/
├── pages/
├── routes/
├── services/
├── styles/
└── App.jsx
```

---

# Running the Project

## Backend

```bash
python manage.py runserver
```

## Frontend

```bash
npm run dev
```

---

# Security

- API permissions enforced server-side
- Residents cannot access other users' requests
- Maintenance staff cannot access unassigned tasks
- Session cookies securely managed using Django authentication