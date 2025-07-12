# 🏠 Full-Stack Property Platform

A modern full-stack web application for real estate listings and property management. Built with a React + Vite frontend styled using Tailwind CSS and shadcn/ui, backed by a Node.js + Express API and MongoDB database.

---

## 🚀 Features

- 🔐 User authentication
- 🏡 Property listings with detailed views
- ❤️ Favorite properties
- 👨‍💼 Agent profiles and contact info
- 🔍 Search and filter by type, location, and more
- 📱 Responsive and mobile-friendly UI

---

## 🛠 Tech Stack

### Frontend

- **React** – UI framework
- **Vite** – Build tool for lightning-fast development
- **Tailwind CSS** – Utility-first CSS framework
- **shadcn/ui** – Accessible UI components (based on Radix UI)
- **React Router DOM** – Declarative routing
- **Lucide Icons** – Modern icon library

### Backend

- **Node.js** – JavaScript runtime
- **Express.js** – Backend web framework
- **MongoDB** – NoSQL database (with Mongoose ORM)
- **dotenv** – Environment variable management
- **jsonwebtoken** – JWT-based authentication
- **bcrypt** – Password hashing
- **cors**, **helmet**, **morgan** – Security and logging middleware

---

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/property-platform.git
cd property-platform
2. Setup Environment Variables
Create .env files in both /client and /server folders.

/server/.env example:
env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
3. Install Dependencies
Frontend (Vite + React):
bash
Copy
Edit
cd Realstate
npm install
Backend (Express + MongoDB):
bash
Copy
Edit
cd backend
npm install
4. Run the Development Servers
Start Backend:
bash
Copy
Edit
cd backend
npm run dev
Start Frontend:
bash
Copy
Edit
cd REALSTATE
npm run dev
📁 Folder Structure
bash
Copy
Edit
property-platform/
├── src/            # React frontend
│   ├── index.html
│   └── vite.config.ts
├── backend/            # Express backend
│   ├── routes/
│   ├── models/
└── README.md
📦 Scripts
Frontend (React)
bash
Copy
Edit
npm install        # Install
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview built app
Backend (Node.js)
bash
Copy
Edit
npm run dev        # Start dev server with nodemon
📄 License & Attribution
shadcn/ui is MIT-licensed but requires attribution. Learn more: https://ui.shadcn.com/docs/installation/license

Other dependencies are under their respective open-source licenses.

🙌 Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

✉️ Contact
Have questions or suggestions?

Reach out at abduseid14789@gmail.com or open an issue or for any inquire.

📌 Status
Project is currently in active development.

yaml
Copy
Edit

---

```
