# NBA Fantasy League - PostgreSQL Setup Guide

## 🚀 **Quick Setup (1-2 Days)**

### **Step 1: Install PostgreSQL**
1. Download PostgreSQL from: https://www.postgresql.org/download/
2. Install with default settings
3. Remember your password for the `postgres` user

### **Step 2: Install pgAdmin**
1. Download pgAdmin from: https://www.pgadmin.org/download/
2. Install and open pgAdmin
3. Connect to your PostgreSQL server (localhost:5432)

### **Step 3: Create Database**
1. In pgAdmin, right-click "Databases" → "Create" → "Database"
2. Name: `nba_fantasy`
3. Click "Save"

### **Step 4: Run Database Schema**
1. In pgAdmin, select your `nba_fantasy` database
2. Click "Query Tool" (SQL icon)
3. Copy and paste the contents of `backend/schema.sql`
4. Click "Execute" (F5)

### **Step 5: Configure Environment**
1. Copy `backend/env.example` to `backend/.env`
2. Update the database password:
   ```
   DB_PASSWORD=your_actual_password
   ```

### **Step 6: Start the Backend**
```bash
npm run backend
```

### **Step 7: Start the Frontend**
```bash
npm run dev
```

## 🎯 **Architecture**

```
Frontend (Next.js)     Backend (Express)     Database (PostgreSQL)
     ↓                        ↓                        ↓
http://localhost:3000  →  http://localhost:3001  →  localhost:5432
   Static React App         REST API Server         pgAdmin Interface
```

## 📊 **Database Tables**

- **players** - NBA player information
- **player_stats** - Live game statistics
- **tournaments** - Tournament management
- **user_lineups** - User team selections
- **tournament_matchups** - Wallet vs wallet matchups

## 🔧 **API Endpoints**

- `GET /api/players` - Get all players
- `GET /api/player-stats` - Get live stats
- `POST /api/player-stats` - Update stats
- `GET /api/tournaments/current` - Current tournament
- `POST /api/tournaments/:id/register` - Register lineup
- `GET /api/tournaments/:id/matchup/:wallet` - Get matchup

## 🚀 **Running Everything**

```bash
# Start backend API
npm run backend

# Start frontend (in another terminal)
npm run dev

# Access your app
Frontend: http://localhost:3000
Backend:  http://localhost:3001
pgAdmin:  http://localhost:5050 (or desktop app)
```

## 🎮 **What You Get**

- ✅ **PostgreSQL Database** - Professional data storage
- ✅ **pgAdmin Interface** - Easy database management
- ✅ **REST API** - Clean backend architecture
- ✅ **Static Frontend** - Fast Next.js app
- ✅ **Real-time Data** - Live NBA stats
- ✅ **Tournament System** - Complete matchmaking

Perfect for a 1-2 day project! 🏀⚡
