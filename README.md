# Connexa – Social Media Platform  

🚀 **Connexa** is a **MERN stack social media platform** that connects people, fosters communication, and builds communities.  
It provides authentication, posting, interaction features, and a modern responsive UI built with React + Vite.  

---

## ✨ Features  

- 🔐 **User Authentication** – JWT-based secure login & registration  
- 👤 **Profile Management** – Update user info, profile pictures, bio  
- 📝 **Create & Share Posts** – Text & media posts  
- ❤️ **Like & Comment System** – Interact with posts in real-time  
- 💬 **Real-Time Support** – WebSocket (Socket.IO) integration for chat/notifications  
- 📱 **Responsive Design** – Works on both desktop & mobile  
- ⚡ **Optimized Build** – React with Vite for fast performance  

---

## 🛠️ Tech Stack  

**Frontend:**  
- React.js (Vite)  
- JavaScript (ES6+)  
- Tailwind CSS / CSS Modules  

**Backend:**  
- Node.js  
- Express.js  

**Database:**  
- MongoDB (Mongoose)  

**Authentication & Security:**  
- JWT Authentication  
- Bcrypt for password hashing  
- Middlewares for validation  

**Other Tools:**  
- Socket.IO for real-time communication  
- ESLint for code linting  
- Git & GitHub for version control  

---

## 📂 Project Structure  

```bash
Connexa/
│-- backend/
│   ├── controllers/     # Business logic
│   ├── middlewares/     # Auth, validation
│   ├── models/          # MongoDB schemas
│   ├── routes/          # Express routes
│   ├── socket/          # WebSocket events
│   ├── utils/           # Helper functions
│   └── index.js         # Backend entry point
│
│-- frontend/
│   ├── public/          # Static assets
│   ├── src/             # React components, pages, state
│   ├── dist/            # Production build
│   ├── vite.config.js   # Vite config
│   ├── eslint.config.js # Linting rules
│   └── index.html       # Entry HTML
│
│-- .env                 # Environment variables
│-- package.json         # Project dependencies
│-- README.md            # Documentation
