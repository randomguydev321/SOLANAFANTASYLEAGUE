# 🏀 Solana Fantasy League

A decentralized NBA fantasy league built on Solana blockchain where players compete with real SOL prizes!

![Solana Fantasy League](https://img.shields.io/badge/Blockchain-Solana-purple?style=for-the-badge&logo=solana)
![Next.js](https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)

## 🚀 Features

- **🎮 Daily Tournaments** - 24-hour fantasy competitions
- **💰 SOL Prizes** - Win real cryptocurrency prizes
- **🎲 Random Matchmaking** - Fair wallet vs wallet matchups
- **⏰ Lineup Deadlines** - 2-hour submission windows
- **📊 Live NBA Stats** - Real-time player statistics
- **🏆 Leaderboards** - Compete against other players
- **🔗 Wallet Integration** - Phantom & Solflare support

## 🏗️ Architecture

```
Frontend (Next.js)     Backend (Express)     Database (PostgreSQL)
     ↓                        ↓                        ↓
http://localhost:3000  →  http://localhost:3001  →  localhost:5432
   Static React App         REST API Server         pgAdmin Interface
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- pgAdmin (optional)
- Solana CLI (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/randomguydev321/SOLANAFANTASYLEAGUE.git
   cd SOLANAFANTASYLEAGUE
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up PostgreSQL**
   - Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/)
   - Install pgAdmin from [pgadmin.org](https://www.pgadmin.org/download/)
   - Create database: `nba_fantasy`
   - Run schema: `backend/schema.sql`

4. **Configure environment**
   ```bash
   cp backend/env.example backend/.env
   # Update database credentials in backend/.env
   ```

5. **Start the application**
   ```bash
   # Start backend API
   npm run backend
   
   # Start frontend (in another terminal)
   npm run dev
   ```

6. **Access the app**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - pgAdmin: http://localhost:5050

## 🎮 How to Play

1. **Connect Wallet** - Use Phantom or Solflare
2. **Select Lineup** - Pick 5 players within 20-token salary cap
3. **Register** - Pay 0.1 SOL entry fee
4. **Compete** - 24-hour tournament against random opponent
5. **Win SOL** - Automatic prize distribution to winners

## 📊 Fantasy Scoring

```
Fantasy Points = PTS + (REB × 1.2) + (AST × 1.5) + (STL × 2) + (BLK × 2) - (TO × 1)
```

## 🏆 Prize Distribution

- **1st Place**: 50% of prize pool
- **2nd Place**: 30% of prize pool  
- **3rd Place**: 20% of prize pool

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Solana Web3.js** - Blockchain interaction
- **Wallet Adapters** - Phantom & Solflare

### Backend
- **Express.js** - API server
- **PostgreSQL** - Database
- **pgAdmin** - Database management
- **CORS** - Cross-origin requests

### Blockchain
- **Solana** - Blockchain network
- **Anchor** - Smart contract framework
- **Rust** - Program language

## 📁 Project Structure

```
SOLANAFANTASYLEAGUE/
├── app/                    # Next.js app directory
│   ├── components/        # React components
│   ├── services/          # API services
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # App layout
│   └── page.tsx           # Main page
├── backend/               # Express API server
│   ├── server.js          # Main server file
│   ├── schema.sql         # Database schema
│   └── env.example        # Environment template
├── programs/              # Solana programs
│   └── nba-fantasy/       # Anchor program
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start frontend
npm run backend          # Start backend API
npm run all              # Start both frontend & backend

# Database
npm run db:setup         # Run database schema

# Solana/Anchor
npm run anchor:build     # Build Solana program
npm run anchor:deploy    # Deploy to devnet
npm run solana:deploy    # Deploy to mainnet
```

## 🌐 API Endpoints

- `GET /api/players` - Get all NBA players
- `GET /api/player-stats` - Get live player statistics
- `POST /api/player-stats` - Update player stats
- `GET /api/tournaments/current` - Get current tournament
- `POST /api/tournaments/:id/register` - Register lineup
- `GET /api/tournaments/:id/matchup/:wallet` - Get user matchup

## 🚀 Deployment

### Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Deploy automatically on push to main

### Backend (Railway/Heroku)
1. Set environment variables
2. Deploy Express server
3. Connect to PostgreSQL database

### Solana Program
1. Build with Anchor: `anchor build`
2. Deploy to devnet: `anchor deploy --provider.cluster devnet`
3. Deploy to mainnet: `anchor deploy --provider.cluster mainnet`

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- NBA for player data and statistics
- Solana Foundation for blockchain infrastructure
- Next.js team for the amazing framework
- PostgreSQL community for the robust database

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/randomguydev321/SOLANAFANTASYLEAGUE/issues)
- **Discussions**: [GitHub Discussions](https://github.com/randomguydev321/SOLANAFANTASYLEAGUE/discussions)

---

**Built with ❤️ for the Solana community** 🏀⚡
