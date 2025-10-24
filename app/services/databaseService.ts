// Simple SQLite database for NBA Fantasy League
import Database from 'better-sqlite3';
import path from 'path';

export interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  salary: number;
  nbaId: string;
  photo: string;
}

export interface PlayerStats {
  playerId: number;
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fg: number;
  fga: number;
  ft: number;
  fta: number;
  fantasyPoints: number;
  gameDate: string;
  opponent: string;
  isPlaying: boolean;
  updatedAt: string;
}

export interface Tournament {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  lineupDeadline: string;
  entryFee: number;
  prizePool: number;
  status: 'upcoming' | 'active' | 'completed';
  createdAt: string;
}

export interface UserLineup {
  id: string;
  walletAddress: string;
  tournamentId: string;
  pg: string;
  sg: string;
  sf: string;
  pf: string;
  c: string;
  totalSalary: number;
  registeredAt: string;
}

export interface TournamentMatchup {
  id: string;
  tournamentId: string;
  wallet1: string;
  wallet2: string;
  wallet1Score: number;
  wallet2Score: number;
  winner?: string;
  status: 'pending' | 'active' | 'completed';
  createdAt: string;
}

export class DatabaseService {
  private static instance: DatabaseService;
  private db: Database.Database;

  private constructor() {
    // Create database file in project root
    const dbPath = path.join(process.cwd(), 'nba-fantasy.db');
    this.db = new Database(dbPath);
    this.initializeTables();
  }

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private initializeTables(): void {
    // Players table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS players (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        team TEXT NOT NULL,
        position TEXT NOT NULL,
        salary INTEGER NOT NULL,
        nbaId TEXT NOT NULL,
        photo TEXT NOT NULL
      )
    `);

    // Player stats table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS player_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        playerId INTEGER NOT NULL,
        pts REAL NOT NULL,
        reb REAL NOT NULL,
        ast REAL NOT NULL,
        stl REAL NOT NULL,
        blk REAL NOT NULL,
        to REAL NOT NULL,
        fg REAL NOT NULL,
        fga REAL NOT NULL,
        ft REAL NOT NULL,
        fta REAL NOT NULL,
        fantasyPoints REAL NOT NULL,
        gameDate TEXT NOT NULL,
        opponent TEXT NOT NULL,
        isPlaying BOOLEAN NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (playerId) REFERENCES players (id)
      )
    `);

    // Tournaments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tournaments (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        startTime TEXT NOT NULL,
        endTime TEXT NOT NULL,
        lineupDeadline TEXT NOT NULL,
        entryFee REAL NOT NULL,
        prizePool REAL NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // User lineups table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS user_lineups (
        id TEXT PRIMARY KEY,
        walletAddress TEXT NOT NULL,
        tournamentId TEXT NOT NULL,
        pg TEXT NOT NULL,
        sg TEXT NOT NULL,
        sf TEXT NOT NULL,
        pf TEXT NOT NULL,
        c TEXT NOT NULL,
        totalSalary INTEGER NOT NULL,
        registeredAt TEXT NOT NULL,
        FOREIGN KEY (tournamentId) REFERENCES tournaments (id)
      )
    `);

    // Tournament matchups table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tournament_matchups (
        id TEXT PRIMARY KEY,
        tournamentId TEXT NOT NULL,
        wallet1 TEXT NOT NULL,
        wallet2 TEXT NOT NULL,
        wallet1Score REAL NOT NULL DEFAULT 0,
        wallet2Score REAL NOT NULL DEFAULT 0,
        winner TEXT,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (tournamentId) REFERENCES tournaments (id)
      )
    `);

    console.log('Database tables initialized successfully');
  }

  // Player operations
  insertPlayer(player: Player): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO players (id, name, team, position, salary, nbaId, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(player.id, player.name, player.team, player.position, player.salary, player.nbaId, player.photo);
  }

  getAllPlayers(): Player[] {
    const stmt = this.db.prepare('SELECT * FROM players ORDER BY id');
    return stmt.all() as Player[];
  }

  getPlayerById(id: number): Player | null {
    const stmt = this.db.prepare('SELECT * FROM players WHERE id = ?');
    return stmt.get(id) as Player | null;
  }

  getPlayersByPosition(position: string): Player[] {
    const stmt = this.db.prepare('SELECT * FROM players WHERE position = ? ORDER BY salary DESC');
    return stmt.all(position) as Player[];
  }

  // Player stats operations
  insertPlayerStats(stats: PlayerStats): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO player_stats 
      (playerId, pts, reb, ast, stl, blk, to, fg, fga, ft, fta, fantasyPoints, gameDate, opponent, isPlaying, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      stats.playerId, stats.pts, stats.reb, stats.ast, stats.stl, stats.blk, stats.to,
      stats.fg, stats.fga, stats.ft, stats.fta, stats.fantasyPoints,
      stats.gameDate, stats.opponent, stats.isPlaying, stats.updatedAt
    );
  }

  getPlayerStats(playerId: number): PlayerStats | null {
    const stmt = this.db.prepare('SELECT * FROM player_stats WHERE playerId = ? ORDER BY updatedAt DESC LIMIT 1');
    return stmt.get(playerId) as PlayerStats | null;
  }

  getAllPlayerStats(): PlayerStats[] {
    const stmt = this.db.prepare('SELECT * FROM player_stats ORDER BY fantasyPoints DESC');
    return stmt.all() as PlayerStats[];
  }

  // Tournament operations
  insertTournament(tournament: Tournament): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO tournaments 
      (id, name, startTime, endTime, lineupDeadline, entryFee, prizePool, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      tournament.id, tournament.name, tournament.startTime, tournament.endTime,
      tournament.lineupDeadline, tournament.entryFee, tournament.prizePool,
      tournament.status, tournament.createdAt
    );
  }

  getCurrentTournament(): Tournament | null {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      SELECT * FROM tournaments 
      WHERE status = 'active' AND startTime <= ? AND endTime > ?
      ORDER BY startTime DESC LIMIT 1
    `);
    return stmt.get(now, now) as Tournament | null;
  }

  getUpcomingTournaments(): Tournament[] {
    const now = new Date().toISOString();
    const stmt = this.db.prepare(`
      SELECT * FROM tournaments 
      WHERE status = 'upcoming' AND startTime > ?
      ORDER BY startTime ASC
    `);
    return stmt.all(now) as Tournament[];
  }

  // User lineup operations
  insertUserLineup(lineup: UserLineup): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO user_lineups 
      (id, walletAddress, tournamentId, pg, sg, sf, pf, c, totalSalary, registeredAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      lineup.id, lineup.walletAddress, lineup.tournamentId,
      lineup.pg, lineup.sg, lineup.sf, lineup.pf, lineup.c,
      lineup.totalSalary, lineup.registeredAt
    );
  }

  getUserLineup(walletAddress: string, tournamentId: string): UserLineup | null {
    const stmt = this.db.prepare(`
      SELECT * FROM user_lineups 
      WHERE walletAddress = ? AND tournamentId = ?
    `);
    return stmt.get(walletAddress, tournamentId) as UserLineup | null;
  }

  // Tournament matchup operations
  insertTournamentMatchup(matchup: TournamentMatchup): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO tournament_matchups 
      (id, tournamentId, wallet1, wallet2, wallet1Score, wallet2Score, winner, status, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      matchup.id, matchup.tournamentId, matchup.wallet1, matchup.wallet2,
      matchup.wallet1Score, matchup.wallet2Score, matchup.winner,
      matchup.status, matchup.createdAt
    );
  }

  getUserMatchup(walletAddress: string, tournamentId: string): TournamentMatchup | null {
    const stmt = this.db.prepare(`
      SELECT * FROM tournament_matchups 
      WHERE tournamentId = ? AND (wallet1 = ? OR wallet2 = ?)
    `);
    return stmt.get(tournamentId, walletAddress, walletAddress) as TournamentMatchup | null;
  }

  getTournamentMatchups(tournamentId: string): TournamentMatchup[] {
    const stmt = this.db.prepare(`
      SELECT * FROM tournament_matchups 
      WHERE tournamentId = ?
      ORDER BY createdAt ASC
    `);
    return stmt.all(tournamentId) as TournamentMatchup[];
  }

  // Initialize with sample data
  initializeSampleData(): void {
    // Sample players (first 10 for testing)
    const samplePlayers: Player[] = [
      { id: 1, name: "LUKA DONCIC", team: "MAVERICKS", position: "PG", salary: 5, nbaId: "1629029", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png" },
      { id: 2, name: "STEPHEN CURRY", team: "WARRIORS", position: "PG", salary: 5, nbaId: "201939", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png" },
      { id: 3, name: "SHAI GILGEOUS-ALEXANDER", team: "THUNDER", position: "PG", salary: 5, nbaId: "1628983", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png" },
      { id: 31, name: "DEVIN BOOKER", team: "SUNS", position: "SG", salary: 5, nbaId: "1626164", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png" },
      { id: 32, name: "DONOVAN MITCHELL", team: "CAVALIERS", position: "SG", salary: 5, nbaId: "1628378", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png" },
      { id: 61, name: "LEBRON JAMES", team: "LAKERS", position: "SF", salary: 5, nbaId: "2544", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png" },
      { id: 62, name: "KEVIN DURANT", team: "SUNS", position: "SF", salary: 5, nbaId: "201142", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png" },
      { id: 91, name: "GIANNIS ANTETOKOUNMPO", team: "BUCKS", position: "PF", salary: 5, nbaId: "203507", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png" },
      { id: 92, name: "JAYSON TATUM", team: "CELTICS", position: "PF", salary: 5, nbaId: "1628369", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png" },
      { id: 121, name: "NIKOLA JOKIC", team: "NUGGETS", position: "C", salary: 5, nbaId: "203999", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png" }
    ];

    samplePlayers.forEach(player => this.insertPlayer(player));

    // Sample tournament
    const now = new Date();
    const startTime = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
    const lineupDeadline = new Date(startTime.getTime() - 2 * 60 * 60 * 1000); // 2 hours before
    const endTime = new Date(startTime.getTime() + 24 * 60 * 60 * 1000); // 24 hours later

    const sampleTournament: Tournament = {
      id: `tournament_${Date.now()}`,
      name: "Daily NBA Fantasy",
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      lineupDeadline: lineupDeadline.toISOString(),
      entryFee: 0.1,
      prizePool: 0,
      status: 'upcoming',
      createdAt: now.toISOString()
    };

    this.insertTournament(sampleTournament);

    console.log('Sample data initialized successfully');
  }

  close(): void {
    this.db.close();
  }
}

export default DatabaseService;
