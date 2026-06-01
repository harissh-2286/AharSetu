# AharSetu – A Smart Digital Platform for Surplus Food Recovery and Hunger Alleviation

AharSetu is a premium social impact platform bridging the gap between food donors (restaurants, hotels, events, individuals), NGOs, volunteers, and hungry beneficiaries. Our goal is to minimize food waste and optimize food distribution in real-time.

---

## 🌟 Tech Stack & Features

- **Frontend**: React.js, Tailwind CSS (Vite for fast tooling)
- **Backend**: Node.js, Express.js (REST APIs, JWT Auth)
- **Database**: MongoDB (Mongoose schemas)
- **Visuals**: Modern Glassmorphism UI, Dark Blue and Green gradients, professional illustrations, and interactive maps.
- **Routing**: Client-side React Router DOM.
- **State System**: React Context API with a dynamic **Dual-Mode Handler**. If the Express server is offline, the React client automatically activates local database replication inside `localStorage`, facilitating a fully functional demo environment without external database requirements.

---

## 📂 Project Structure

```
Ahar Setu/
├── package.json              # Main orchestration package.json
├── README.md                 # Project guide
├── server/                   # Express REST Server
│   ├── server.js             # Main server execution script
│   ├── config/               # DB connectivity config
│   ├── models/               # MongoDB / Mongoose models
│   ├── controllers/          # Business logic handlers
│   ├── middleware/           # Token / role validator middleware
│   └── routes/               # API endpoints
└── client/                   # Vite React Frontend
    ├── index.html            # Core layout HTML
    ├── tailwind.config.js    # Tailwind layout styles
    ├── src/
        ├── main.jsx          # Entry Javascript
        ├── App.jsx           # Main routing & providers
        ├── index.css         # Glassmorphism, scrolls, & gradient custom styles
        ├── components/       # Custom Map, Navbar, Footer, Drawers
        ├── pages/            # FAQ, Forms, Dashboards, Gallery, Landing Page
        └── utils/            # Mock database seeds & client-side API layer
```

---

## 🚀 Getting Started

Ensure you have **Node.js** (v16+) installed.

### Step 1: Install Dependencies
Open your terminal in the root folder (`Ahar Setu`) and run:
```bash
npm install
npm install --prefix client
npm install --prefix server
```
*Or simply run our preset install script:*
```bash
npm run install-all
```

### Step 2: Configure Environment Variables
Create a `.env` file inside the `server/` directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/aharsetu
JWT_SECRET=aharsetu_super_secret_token_12345
CLOUDINARY_URL=your_cloudinary_url_here
```

### Step 3: Run the Application
You can run the frontend and backend simultaneously in development mode with one command from the root directory:
```bash
npm run dev
```

This launches:
1. **Frontend (Client)**: [http://localhost:5173](http://localhost:5173) (Vite development server)
2. **Backend (Server)**: [http://localhost:5000](http://localhost:5000) (Express server)

---

## 🛠️ Testing Dual-Mode Interactivity

AharSetu features a **complete client-side mock backend engine**:
- **Offline / Local Mode (Default)**: If the backend server at port `5000` is offline or cannot be reached, the frontend automatically falls back to utilizing a high-fidelity local state stored in `localStorage`. You can register users, log in, create donations, claim meals, assign volunteers, track deliveries on the interactive map, and view admin panel changes *without having Node or MongoDB running*.
- **Online Full Stack Mode**: Start the backend (`npm run server` or `npm run dev`), ensure MongoDB is running, and the client will dynamically route operations through our secure API layer.
