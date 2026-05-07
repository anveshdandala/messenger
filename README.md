# Messenger App

A full-stack, real-time chat application built with **React** and **Express**. It allows two-way messaging, friend management, and real-time communication. The backend uses **Node.js**, **Express**, **Sequelize**, and supports both **MySQL** and **SQLite** databases. The frontend uses **React** with Tailwind CSS and Material UI for a modern look and feel.

## Features

- 🌐 **Two-way Real-time Messaging** — Powered by Socket.IO for instant communication.
- 🛡️ **Authentication & JWT Security** — Secure user login, registration, and session management.
- 👥 **Friend Management** — Friend requests, accept/decline, and persistent chat history.
- 🌈 **Modern Frontend** — Built with React, Tailwind CSS, Material UI, and a modular component/page structure.
- 📃 **API Documentation** — Swagger UI auto-generated at `/api-docs`.
- 🧩 **Fully Modular** — Separate `client/` and `server/` code for clarity and scalability.
- 🧪 **Jest & React Testing Library** for frontend tests (see `client/src/setupTests.js` and more).

## Project Structure

```
/
├── client/
│   ├── package.json
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── ...
│   └── public/
├── server/
│   ├── index.js
│   ├── package.json
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   └── routes/
│       ├── auth.routes.js
│       ├── friend.routes.js
│       ├── message.routes.js
│       └── user.routes.js
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Setup

1. **Clone the repo:**
    ```bash
    git clone https://github.com/anveshdandala/messenger.git
    cd messenger
    ```

2. **Install all dependencies for both client and server:**
    ```bash
    npm run setup
    ```

3. **Configure Environment Variables:**
    - Copy `server/.env.example` to `server/.env` (create the file if it doesn't exist).
    - Set your DB credentials and JWT secret.

4. **Start Development in Both Apps:**
    ```bash
    npm run dev
    ```
    This will launch the server (Express on port 5000) and client (React on port 3000) concurrently.

5. **Access the app:**  
    Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **API Documentation:**  
   Visit [http://localhost:5000/api-docs](http://localhost:5000/api-docs) for interactive Swagger docs.

## Scripts

- `npm run setup`: Installs dependencies in both client and server.
- `npm run dev`: Runs client and server concurrently.
- `npm run dev:client`: Runs the client only.
- `npm run dev:server`: Runs the server only.

(See `"scripts"` in each `package.json` for more.)

## License

ISC License.

---

> This repo is a learning/testing ground for full-stack messaging with modern JavaScript tooling.
