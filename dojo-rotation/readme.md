# 🥋 Code Dojo Rotation System

![React](https://img.shields.io/badge/React-18.2-%2361DAFB)
![Socket.io](https://img.shields.io/badge/Socket.io-4.7-%23010101)
![Node.js](https://img.shields.io/badge/Node.js-20+-%23339933)

A real-time participant rotation system for collaborative coding sessions.

## 🌟 Features

- **Dual Interface System**

  - 👑 Leader view (`/leader`) - Manage sessions
  - 👥 Participant view (`/dojo`) - Join rotations

- **Smart Rotation**
  - ⏱️ 2-minute automatic timer
  - 🔄 Participant redistribution
  - 🎨 Visual active-user indicators

## 🛠️ Tech Stack

| Component        | Technology          |
| ---------------- | ------------------- |
| Frontend         | React (RSBuild)     |
| State Management | React Context       |
| Backend          | Node.js + Socket.io |
| Styling          | CSS Modules         |

## 🚀 Getting Started

### Prerequisites

- Node.js v20+
- Yarn (recommended) or npm

### Installation

```bash
# Clone repository
git clone {this-repo}
cd dojo-rotation

# Install dependencies
cd backend && yarn
cd ../frontend && yarn
```

### Running Locally

```bash
# Start backend (Terminal 1)
cd backend
yarn dev  # Runs on port 4000

# Start frontend (Terminal 2)
cd ../frontend
yarn dev  # Runs on port 5173 (Vite)
```

## 🌐 Access Points

| Environment | URL                            |
| ----------- | ------------------------------ |
| Development | `http://localhost:5173/leader` |
| Participant | `http://localhost:5173/dojo`   |

## 🔧 Configuration

### Backend Environment

Create `.env` in `/backend`:

```env
PORT=4000
CLIENT_URL=http://localhost:5173
```

### Frontend Customization

Edit `rsbuild.config.ts` for:

- Port changes
- Proxy settings
- Build options

## 🧩 Project Structure

```
dojo-rotation/
├── backend/
│   ├── server.js         # Socket.io server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/   # React components
    │   └── App.jsx      # Router setup
    └── vite.config.ts
```

## 🚨 Troubleshooting

**Socket Connection Issues**

```bash
1. Verify backend is running
2. Check browser console for WS errors
3. Confirm CORS settings in server.js
```

**Routing Problems**

```bash
1. Hard refresh (Ctrl+Shift+R)
2. Verify basename in BrowserRouter
3. Check RSBuild historyApiFallback
```

## 📜 License

MIT Licensed. See [LICENSE](./LICENSE) for details.
