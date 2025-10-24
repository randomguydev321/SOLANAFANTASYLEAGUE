-- NBA Fantasy League Database Schema
-- Run this in pgAdmin or psql

-- Create database (run this first)
-- CREATE DATABASE nba_fantasy;

-- Connect to the database
-- \c nba_fantasy;

-- Players table
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    team VARCHAR(50) NOT NULL,
    position VARCHAR(10) NOT NULL,
    salary INTEGER NOT NULL CHECK (salary >= 1 AND salary <= 5),
    nba_id VARCHAR(20) NOT NULL UNIQUE,
    photo TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Player stats table
CREATE TABLE IF NOT EXISTS player_stats (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL,
    pts DECIMAL(5,2) NOT NULL DEFAULT 0,
    reb DECIMAL(5,2) NOT NULL DEFAULT 0,
    ast DECIMAL(5,2) NOT NULL DEFAULT 0,
    stl DECIMAL(5,2) NOT NULL DEFAULT 0,
    blk DECIMAL(5,2) NOT NULL DEFAULT 0,
    turnovers DECIMAL(5,2) NOT NULL DEFAULT 0,
    fg_made DECIMAL(5,2) NOT NULL DEFAULT 0,
    fg_attempted DECIMAL(5,2) NOT NULL DEFAULT 0,
    ft_made DECIMAL(5,2) NOT NULL DEFAULT 0,
    ft_attempted DECIMAL(5,2) NOT NULL DEFAULT 0,
    fantasy_points DECIMAL(8,2) NOT NULL DEFAULT 0,
    game_date DATE NOT NULL,
    opponent VARCHAR(50) NOT NULL,
    is_playing BOOLEAN NOT NULL DEFAULT true,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (player_id) REFERENCES players (id) ON DELETE CASCADE,
    UNIQUE(player_id, game_date)
);

-- Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    lineup_deadline TIMESTAMP NOT NULL,
    entry_fee DECIMAL(10,2) NOT NULL CHECK (entry_fee >= 0), -- Allow FREE tournaments
    prize_pool DECIMAL(10,2) NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User lineups table
CREATE TABLE IF NOT EXISTS user_lineups (
    id VARCHAR(50) PRIMARY KEY,
    wallet_address VARCHAR(100) NOT NULL,
    tournament_id VARCHAR(50) NOT NULL,
    pg_player_id INTEGER NOT NULL,
    sg_player_id INTEGER NOT NULL,
    sf_player_id INTEGER NOT NULL,
    pf_player_id INTEGER NOT NULL,
    c_player_id INTEGER NOT NULL,
    total_salary INTEGER NOT NULL CHECK (total_salary <= 20),
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments (id) ON DELETE CASCADE,
    FOREIGN KEY (pg_player_id) REFERENCES players (id),
    FOREIGN KEY (sg_player_id) REFERENCES players (id),
    FOREIGN KEY (sf_player_id) REFERENCES players (id),
    FOREIGN KEY (pf_player_id) REFERENCES players (id),
    FOREIGN KEY (c_player_id) REFERENCES players (id),
    UNIQUE(wallet_address, tournament_id)
);

-- Tournament matchups table
CREATE TABLE IF NOT EXISTS tournament_matchups (
    id VARCHAR(50) PRIMARY KEY,
    tournament_id VARCHAR(50) NOT NULL,
    wallet1 VARCHAR(100) NOT NULL,
    wallet2 VARCHAR(100) NOT NULL,
    wallet1_score DECIMAL(8,2) NOT NULL DEFAULT 0,
    wallet2_score DECIMAL(8,2) NOT NULL DEFAULT 0,
    winner VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments (id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);
CREATE INDEX IF NOT EXISTS idx_players_salary ON players(salary);
CREATE INDEX IF NOT EXISTS idx_player_stats_player_id ON player_stats(player_id);
CREATE INDEX IF NOT EXISTS idx_player_stats_game_date ON player_stats(game_date);
CREATE INDEX IF NOT EXISTS idx_player_stats_fantasy_points ON player_stats(fantasy_points);
CREATE INDEX IF NOT EXISTS idx_tournaments_status ON tournaments(status);
CREATE INDEX IF NOT EXISTS idx_tournaments_start_time ON tournaments(start_time);
CREATE INDEX IF NOT EXISTS idx_user_lineups_wallet ON user_lineups(wallet_address);
CREATE INDEX IF NOT EXISTS idx_user_lineups_tournament ON user_lineups(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matchups_tournament ON tournament_matchups(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matchups_wallets ON tournament_matchups(wallet1, wallet2);

-- Insert sample players
INSERT INTO players (id, name, team, position, salary, nba_id, photo) VALUES
(1, 'LUKA DONCIC', 'MAVERICKS', 'PG', 5, '1629029', 'https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png'),
(2, 'STEPHEN CURRY', 'WARRIORS', 'PG', 5, '201939', 'https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png'),
(3, 'SHAI GILGEOUS-ALEXANDER', 'THUNDER', 'PG', 5, '1628983', 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png'),
(31, 'DEVIN BOOKER', 'SUNS', 'SG', 5, '1626164', 'https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png'),
(32, 'DONOVAN MITCHELL', 'CAVALIERS', 'SG', 5, '1628378', 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png'),
(61, 'LEBRON JAMES', 'LAKERS', 'SF', 5, '2544', 'https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png'),
(62, 'KEVIN DURANT', 'SUNS', 'SF', 5, '201142', 'https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png'),
(91, 'GIANNIS ANTETOKOUNMPO', 'BUCKS', 'PF', 5, '203507', 'https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png'),
(92, 'JAYSON TATUM', 'CELTICS', 'PF', 5, '1628369', 'https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png'),
(121, 'NIKOLA JOKIC', 'NUGGETS', 'C', 5, '203999', 'https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png')
ON CONFLICT (id) DO NOTHING;

-- Insert FREE 24-hour tournament (Everyone vs Everyone)
INSERT INTO tournaments (id, name, start_time, end_time, lineup_deadline, entry_fee, prize_pool, status) VALUES
('tournament_24h_' || EXTRACT(EPOCH FROM NOW())::bigint, 
 '24-Hour NBA Fantasy League - Everyone vs Everyone', 
 NOW() + INTERVAL '1 hour',
 NOW() + INTERVAL '25 hours', -- 24 hours
 NOW() + INTERVAL '-1 hour', -- 1 hour ago (deadline passed)
 0, -- FREE entry
 0, 
 'upcoming')
ON CONFLICT (id) DO NOTHING;

-- Grant permissions (adjust as needed)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;
