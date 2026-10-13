# HealthSync — Online Appointment Booking

HealthSync is a full-stack healthcare appointment booking application built to help patients discover doctors, book appointments, manage their profiles, and make appointment payments. It also provides separate interfaces for doctors and administrators to manage appointments and healthcare operations.

> The repository currently uses **Quickcare** in some backend messages and package metadata. This README uses **HealthSync** as the project name to match the repository title.

## Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Run the Application](#run-the-application)
- [API Overview](#api-overview)
- [Security Notes](#security-notes)
- [Troubleshooting](#troubleshooting)

## Overview

HealthSync is organized into three applications:

- **Frontend** — the patient-facing React application.
- **Backend** — the Express API, authentication, appointment workflows, database integration, and payment handling.
- **Admin** — a separate React dashboard for administrative workflows.

The backend uses MongoDB through Mongoose, JWT-based authentication middleware, Cloudinary integration, and Razorpay payment routes.

## Features

### Patient

- Register and log in.
- Browse the available doctors.
- View and update profile information.
- Book appointments with doctors.
- View booked appointments and cancel appointments.
- Start a Razorpay payment flow and verify payment.

### Doctor

- Log in to the doctor area.
- View appointments associated with the doctor.
- Use the doctor appointment workflow exposed by the backend.

### Administrator

- Log in to the admin dashboard.
- Add and list doctors.
- Change doctor availability.
- View and cancel appointments.
- View dashboard information.
- View, update, block, and delete user accounts.
- Add patient records.
- Review user appointment information.

### Supporting integrations

- MongoDB for persistent application data.
- Cloudinary for cloud media handling.
- JWT for protected API access.
- Razorpay for payment processing.

## Technology Stack

| Area | Technologies |
|---|---|
| Frontend | React, Vite, React Router, Axios |
| UI and styling | Bootstrap, Tailwind CSS, React Bootstrap |
| UI effects and icons | Framer Motion, React Icons, Lucide React |
| Backend | Node.js, Express 5 |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Token (JWT), bcrypt |
| File uploads | Multer |
| Media storage | Cloudinary |
| Payments | Razorpay |
| Development tools | npm, Vite, Nodemon, ESLint |

## Project Structure

```text
HealthSync-Online-Booking-Appointment/
├── admin/          # Administrative React application
├── backend/        # Express API, database, auth, and business logic
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── package.json
│   └── server.js
├── frontend/       # Patient-facing React application
├── README.md
└── ...
```

The exact contents of each folder may evolve as the project changes.

## Prerequisites

Install the following before starting:

- [Node.js](https://nodejs.org/) (use a current LTS release)
- npm (included with Node.js)
- A MongoDB database, either local MongoDB or MongoDB Atlas
- A Cloudinary account for media features
- Razorpay test credentials if you want to test payments

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/subhankar19112004/HealthSync-Online-Booking-Appointment.git
cd HealthSync-Online-Booking-Appointment
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure the backend environment

Create a `.env` file inside the **`backend/`** directory. Add your own credentials using the variable names expected by the backend configuration.

Example template:

```dotenv
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017

# Cloudinary credentials
CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

# Authentication
JWT_SECRET=replace_with_a_long_random_secret

# Admin login configuration, if required by your implementation
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password

# Razorpay test credentials
RAZORPAY_KEY_ID=your_razorpay_test_key_id
RAZORPAY_KEY_SECRET=your_razorpay_test_key_secret
```

**Important:** the database configuration appends `/quickcare` to `MONGODB_URI`. Use a MongoDB connection URI without a database name at the end, unless you update the connection code accordingly. Confirm the Cloudinary variable names against `backend/config/cloudinary.js` (or the corresponding configuration file in your current checkout), as configuration filenames and variable names can change.

Never commit your real `.env` file. Add it to `.gitignore`.

### 4. Install frontend dependencies

Open a new terminal from the repository root:

```bash
cd frontend
npm install
```

### 5. Install admin dependencies

Open another terminal from the repository root:

```bash
cd admin
npm install
```

## Run the Application

Run each part in a separate terminal.

### Backend API

```bash
cd backend
npm run dev
```

The backend's default port is **4000**, unless `PORT` is set in `backend/.env`.

For a regular Node.js start:

```bash
npm start
```

The root health endpoint is available at:

```text
http://localhost:4000/
```

### Patient frontend

```bash
cd frontend
npm run dev
```

Vite prints the local URL in the terminal (commonly `http://localhost:5173`).

### Admin dashboard

```bash
cd admin
npm run dev
```

Vite prints the local URL in the terminal. If both Vite apps try to use the same port, Vite will select another available port; use the URL shown in the terminal.

### Production builds

Run these commands from the respective `frontend/` and `admin/` directories:

```bash
npm run build
```

To preview a production build locally:

```bash
npm run preview
```

## API Overview

The backend mounts three main route groups:

| Base path | Purpose | Example routes |
|---|---|---|
| `/api/user` | Patient registration, profile, appointments, payments | `POST /register`, `POST /login`, `GET /get-profile`, `POST /book-appointment`, `GET /appointments`, `POST /cancel-appointment`, `POST /payment-razorpay`, `POST /verify-razorpay` |
| `/api/doctor` | Doctor listing, login, and appointments | `GET /list`, `POST /login`, `GET /appointments` |
| `/api/admin` | Administrative login, doctor management, appointments, and users | `POST /login`, `POST /add-doctor`, `POST /all-doctors`, `GET /all-appointments`, `GET /dashboard`, `GET /all-users` |

Protected endpoints require the relevant authentication token. Refer to the route files and middleware for the exact request body, headers, response shape, and authorization requirements.

## Security Notes

- **Do not use credentials copied from an online README.** Create your own MongoDB, Cloudinary, and Razorpay credentials.
- If any real credentials were committed to GitHub, rotate/revoke them immediately. Removing them from the latest README does not remove them from Git history.
- Keep `.env` files out of version control.
- Use a long, random `JWT_SECRET`; do not use a predictable value.
- Use Razorpay test keys for local development. Never expose the Razorpay secret key in frontend code.
- Validate authorization and input on the server for all sensitive operations.
- Before deploying, configure CORS, HTTPS, production environment variables, and appropriate logging.

## Troubleshooting

### MongoDB connection fails

- Confirm MongoDB is running or that your Atlas cluster is reachable.
- Check `MONGODB_URI` and your database network-access settings.
- Remember that the current connection code appends `/quickcare` to the URI.

### Frontend cannot reach the backend

- Confirm the backend is running on the expected port.
- Check the API base URL used by the frontend and admin app.
- Confirm CORS settings allow the local frontend origins.

### Environment variables are undefined

- Ensure `.env` is in `backend/`, not only in the repository root.
- Restart the backend after changing environment variables.
- Check that the variable names match those read by the backend code.

### Payment integration does not work

- Confirm the Razorpay test key ID and secret are configured on the backend.
- Check the browser console and backend logs for request or verification errors.
- Never move the Razorpay secret into client-side environment variables.

## Development Scripts

| Application | Command | Purpose |
|---|---|---|
| Backend | `npm run dev` | Start the API with Nodemon |
| Backend | `npm start` | Start the API with Node.js |
| Frontend | `npm run dev` | Start the patient frontend |
| Frontend | `npm run build` | Build the patient frontend |
| Frontend | `npm run lint` | Run ESLint |
| Admin | `npm run dev` | Start the admin dashboard |
| Admin | `npm run build` | Build the admin dashboard |
| Admin | `npm run lint` | Run ESLint |

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make and test your changes.
4. Submit a pull request describing the change.

## License

No license information was confirmed from the repository files reviewed. Add a `LICENSE` file and update this section if you intend to distribute the project under an open-source license.

---

**Repository:** [HealthSync — Online Booking Appointment](https://github.com/subhankar19112004/HealthSync-Online-Booking-Appointment)
