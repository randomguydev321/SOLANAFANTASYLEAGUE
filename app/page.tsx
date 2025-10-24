'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import BasketballCourt from './components/BasketballCourt';
import LiveGamesWidget from './components/LiveGamesWidget';
// Removed WeeklyMatchup - using real user matchups only
import NBAStatsService from './services/nbaStatsService';
import TournamentService from './services/tournamentService';
import ErrorBoundary from './components/ErrorBoundary';

// Solana Program ID (this would be your deployed program ID)
const PROGRAM_ID = new PublicKey("NBAFantasy111111111111111111111111111111111");

// Players will be loaded from database - NO MOCK DATA
let PLAYERS: Player[] = [];

interface PlayerStats {
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
}

interface Player {
  id: number;
  name: string;
  team: string;
  position: string;
  salary: number;
  nbaId: string;
  photo: string;
  stats?: PlayerStats;
}

interface Lineup {
    PG: number | null;
    SG: number | null;
    SF: number | null;
    PF: number | null;
    C: number | null;
}

interface UserProfile {
  username: string;
  walletAddress: string;
  wins: number;
  losses: number;
  joinDate: string;
}

interface Matchup {
  opponent: string;
  opponentWallet: string;
  isBot: boolean;
  matchupId: string;
  startTime: string;
  endTime: string;
}

export default function Home() {
  const wallet = useWallet();
  const { connection } = useConnection();
  
  // Client-side check to prevent hydration issues
  const [isClient, setIsClient] = useState(false);
  
  // State for players and stats
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerStats, setPlayerStats] = useState<{[key: number]: PlayerStats}>({});
  const [liveStats, setLiveStats] = useState<any[]>([]);
  
  // Tournament and matchup state
  const [currentTournament, setCurrentTournament] = useState<any>(null);
  const [tournamentResults, setTournamentResults] = useState<any[]>([]);
  const [userMatchup, setUserMatchup] = useState<Matchup | null>(null);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState(0);
  
  // User profile and matchup system
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [shuffleMode, setShuffleMode] = useState<'daily' | 'hourly' | 'every-game'>('daily');
  
  // Leaderboard state
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  
  // Team locking state
  const [isTeamLocked, setIsTeamLocked] = useState(false);
  const [teamLockData, setTeamLockData] = useState<any>(null);
  const [opponentTeam, setOpponentTeam] = useState<Lineup | null>(null);
  
  // Lineup state
  const [lineup, setLineup] = useState<Lineup>({
    PG: null,
    SG: null,
    SF: null,
    PF: null,
    C: null,
  });

  // Initialize client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load players from database
  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const response = await fetch('/api/players');
        if (response.ok) {
          const playersData = await response.json();
          setPlayers(playersData);
          PLAYERS = playersData; // Update global PLAYERS array
          
          // Initialize player stats
          const stats: {[key: number]: PlayerStats} = {};
          playersData.forEach((player: any) => {
            stats[player.id] = {
              pts: player.pts || 0,
              reb: player.reb || 0,
              ast: player.ast || 0,
              stl: player.stl || 0,
              blk: player.blk || 0,
              to: player.turnovers || 0,
              fg: player.fgm || 0,
              fga: player.fga || 0,
              ft: player.ftm || 0,
              fta: player.fta || 0,
              fantasyPoints: player.fantasy_points || 0,
            };
          });
          setPlayerStats(stats);
        } else {
          console.error('Failed to load players from database');
        }
      } catch (error) {
        console.error('Error loading players:', error);
      }
    };

    if (isClient) {
      loadPlayers();
    }
  }, [isClient]);

  // Load live stats from backend API
  useEffect(() => {
    const loadLiveStats = async () => {
      try {
        const response = await fetch('/api/live-stats');
        if (response.ok) {
          const stats = await response.json();
          setLiveStats(stats);
          
          // Update player stats with live data
          const updatedStats: {[key: number]: PlayerStats} = {};
          stats.forEach((stat: any) => {
            updatedStats[stat.playerId] = {
              pts: stat.pts || 0,
              reb: stat.reb || 0,
              ast: stat.ast || 0,
              stl: stat.stl || 0,
              blk: stat.blk || 0,
              to: stat.turnovers || 0,
              fg: stat.fgm || 0,
              fga: stat.fga || 0,
              ft: stat.ftm || 0,
              fta: stat.fta || 0,
              fantasyPoints: stat.fantasyPoints || 0,
            };
          });
          setPlayerStats(updatedStats);
        }
      } catch (error) {
        console.error('Error loading live stats:', error);
      }
    };

    if (isClient) {
      loadLiveStats();
      // Refresh every 2 minutes
      const interval = setInterval(loadLiveStats, 2 * 60 * 1000);
    return () => clearInterval(interval);
    }
  }, [isClient]);

  // Load tournament data
  useEffect(() => {
    if (isClient) {
      const tournamentService = TournamentService.getInstance();
      const activeTournament = tournamentService.getCurrentTournament();
      setCurrentTournament(activeTournament);
      
      // Set up deadline timer
      const updateDeadline = () => {
        if (activeTournament) {
          const now = new Date();
          const timeRemaining = activeTournament.lineupDeadline.getTime() - now.getTime();
          setTimeUntilDeadline(Math.max(0, timeRemaining));
        }
      };
      
      updateDeadline();
      const interval = setInterval(updateDeadline, 1000);
      return () => clearInterval(interval);
    }
  }, [isClient]);

  // Wallet connection and user profile management
  useEffect(() => {
    if (isClient && wallet.connected && wallet.publicKey) {
      const walletAddress = wallet.publicKey.toString();
      
      // Check if user profile exists
      const existingProfile = loadUserProfile(walletAddress);
      if (existingProfile) {
        setUserProfile(existingProfile);
        // Load or generate matchup
        const matchup = loadMatchup(walletAddress);
        if (matchup) {
          setUserMatchup(matchup);
    } else {
          const newMatchup = generateDailyMatchup(walletAddress);
          if (newMatchup) {
            setUserMatchup(newMatchup);
            saveMatchup(walletAddress, newMatchup);
          }
        }
      } else {
        // First time user - show username modal
        setShowUsernameModal(true);
      }
    }
  }, [isClient, wallet.connected, wallet.publicKey]);

  // User profile functions
  const saveUserProfile = (profile: UserProfile) => {
    localStorage.setItem(`userProfile_${profile.walletAddress}`, JSON.stringify(profile));
  };

  const loadUserProfile = (walletAddress: string): UserProfile | null => {
    const saved = localStorage.getItem(`userProfile_${walletAddress}`);
    return saved ? JSON.parse(saved) : null;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      saveUserProfile(updatedProfile);
    }
  };

  // Daily Matchup System - New opponent every 24 hours
  const generateDailyMatchup = (userWallet: string) => {
    // Get all registered users
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Filter out current user
    const otherUsers = allUsers.filter((user: string) => user !== userWallet);
    
    if (otherUsers.length === 0) {
      return null; // No opponents available
    }
    
    // Get user's matchup history to avoid recent opponents
    const matchupHistory = JSON.parse(localStorage.getItem(`matchupHistory_${userWallet}`) || '[]');
    const recentOpponents = matchupHistory.slice(-3); // Last 3 opponents
    
    // Filter out recent opponents
    const availableOpponents = otherUsers.filter(user => !recentOpponents.includes(user));
    const opponentPool = availableOpponents.length > 0 ? availableOpponents : otherUsers;
    
    // Randomly select opponent
    const randomOpponentWallet = opponentPool[Math.floor(Math.random() * opponentPool.length)];
    const opponentProfile = loadUserProfile(randomOpponentWallet);
    
    // Add to matchup history
    matchupHistory.push(randomOpponentWallet);
    localStorage.setItem(`matchupHistory_${userWallet}`, JSON.stringify(matchupHistory));
    
    return {
      opponent: opponentProfile ? opponentProfile.username : formatAddress(randomOpponentWallet),
      opponentWallet: randomOpponentWallet,
      isBot: false,
      matchupId: `matchup_${Date.now()}`,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  };

  const saveMatchup = (walletAddress: string, matchup: Matchup) => {
    localStorage.setItem(`matchup_${walletAddress}`, JSON.stringify(matchup));
  };

  const loadMatchup = (walletAddress: string): Matchup | null => {
    const saved = localStorage.getItem(`matchup_${walletAddress}`);
    return saved ? JSON.parse(saved) : null;
  };

  const shuffleOpponent = (userWallet: string) => {
    const newMatchup = generateDailyMatchup(userWallet);
    if (newMatchup) {
      setUserMatchup(newMatchup);
      saveMatchup(userWallet, newMatchup);
    }
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  // Calculate team score using Points League formula
  const calculateTeamScore = () => {
    let totalScore = 0;
    Object.values(lineup).forEach(playerId => {
      if (playerId && playerStats[playerId]) {
        const stats = playerStats[playerId];
        // Points League: PTS×1 + REB×1.2 + AST×1.5 + STL×3 + BLK×3 + TO×(-1)
        totalScore += (stats.pts * 1) + (stats.reb * 1.2) + (stats.ast * 1.5) + (stats.stl * 3) + (stats.blk * 3) + (stats.to * -1);
      }
    });
    return totalScore;
  };

  // Leaderboard functions - Accumulate points over time
  const updateLeaderboard = (walletAddress: string, score: number, isWin: boolean) => {
    const existingEntry = leaderboardData.find(entry => entry.wallet === walletAddress);
    if (existingEntry) {
      // Accumulate points over time
      existingEntry.totalScore += score;
      existingEntry.wins += isWin ? 1 : 0;
      existingEntry.losses += isWin ? 0 : 1;
      existingEntry.gamesPlayed += 1;
      existingEntry.lastScore = score;
      existingEntry.lastUpdate = new Date().toISOString();
    } else {
      // New player entry
      leaderboardData.push({
        wallet: walletAddress,
        username: userProfile?.username || formatAddress(walletAddress),
        totalScore: score,
        wins: isWin ? 1 : 0,
        losses: isWin ? 0 : 1,
        gamesPlayed: 1,
        lastScore: score,
        lastUpdate: new Date().toISOString(),
        joinDate: new Date().toISOString()
      });
    }
    
    // Sort by total accumulated score
    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
    setLeaderboardData([...leaderboardData]);
    
    // Save to localStorage
    localStorage.setItem('leaderboardData', JSON.stringify(leaderboardData));
  };

  const connectWallet = async () => {
    try {
      if (!wallet.wallet) {
        alert('Please select a wallet first');
        return;
      }
      await wallet.connect();
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  // Remove player from lineup
  const removePlayer = (position: keyof Lineup) => {
    if (isTeamLocked) {
      alert('Team is locked for 24 hours. Cannot make changes.');
      return;
    }
    
    setLineup(prev => ({
      ...prev,
      [position]: null
    }));
  };

  const registerLineup = async () => {
    if (!wallet.connected || !wallet.publicKey) {
      alert('Please connect your wallet first');
      return;
    }

    // Check if all positions are filled
    const positions = Object.values(lineup);
    if (positions.some(pos => pos === null)) {
      alert('Please select a player for each position');
      return;
    }

    // Check salary cap
    const totalSalary = positions.reduce((sum, playerId) => {
      const player = players.find(p => p.id === playerId);
      return sum + (player?.salary || 0);
    }, 0);

    if (totalSalary > 15) {
      alert('Lineup exceeds salary cap of 15 tokens');
      return;
    }

    try {
      const tournamentService = TournamentService.getInstance();
      const currentTournament = tournamentService.getCurrentTournament();
      
      const success = tournamentService.registerLineup(
        wallet.publicKey.toString(),
        currentTournament.id,
        lineup as any,
        totalSalary
      );
      
      if (!success) {
        alert('Failed to register lineup. Tournament may be full or deadline passed.');
        return;
      }

      // Add to registered users
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (!registeredUsers.includes(wallet.publicKey.toString())) {
        registeredUsers.push(wallet.publicKey.toString());
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
      }

      // Lock team first - opponent will be assigned later
      const lockData = {
        lineup: { ...lineup },
        lockedAt: new Date().toISOString(),
        unlockAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours from now
        opponent: null, // No opponent yet - waiting for match
        status: 'waiting_for_opponent' // Status: waiting_for_opponent, matched, completed
      };
      localStorage.setItem(`lockedTeam_${wallet.publicKey.toString()}`, JSON.stringify(lockData));

      // Try to find an opponent immediately
      const matchup = generateDailyMatchup(wallet.publicKey.toString());
      if (matchup) {
        // Update lock data with opponent
        const updatedLockData = {
          ...lockData,
          opponent: matchup.opponentWallet,
          status: 'matched'
        };
        localStorage.setItem(`lockedTeam_${wallet.publicKey.toString()}`, JSON.stringify(updatedLockData));
        
        setUserMatchup(matchup);
        saveMatchup(wallet.publicKey.toString(), matchup);
      } else {
        // No opponent available yet - keep waiting status
        setUserMatchup(null);
      }

      // Calculate team score using weekly NBA stats
      const currentTeamScore = calculateTeamScore();
      
      // Update leaderboard with accumulated points
      updateLeaderboard(wallet.publicKey.toString(), currentTeamScore, true);
      
      // Update user profile with win
      updateUserProfile({ 
        wins: (userProfile?.wins || 0) + 1 
      });

      if (matchup) {
        alert(`Lineup registered successfully! Team locked and matched with opponent: ${matchup.opponent}. Team Score: ${currentTeamScore.toFixed(1)} fantasy points!`);
      } else {
        alert(`Lineup registered successfully! Team locked and waiting for opponent... Team Score: ${currentTeamScore.toFixed(1)} fantasy points!`);
      }
    } catch (error) {
      console.error('Error registering lineup:', error);
      alert('Failed to register lineup');
    }
  };

  const handleUsernameSubmit = () => {
    if (tempUsername.trim() && wallet.publicKey) {
      const newProfile: UserProfile = {
        username: tempUsername.trim(),
        walletAddress: wallet.publicKey.toString(),
        wins: 0,
        losses: 0,
        joinDate: new Date().toISOString(),
      };
      
      setUserProfile(newProfile);
      saveUserProfile(newProfile);
      setShowUsernameModal(false);
      setTempUsername('');
      
      // Generate initial matchup
      const matchup = generateDailyMatchup(wallet.publicKey.toString());
      if (matchup) {
        setUserMatchup(matchup);
        saveMatchup(wallet.publicKey.toString(), matchup);
      }
    }
  };

  // Load leaderboard from localStorage (real user data only)
  useEffect(() => {
    if (isClient) {
      // Load real leaderboard data from localStorage
      const savedLeaderboard = localStorage.getItem('leaderboardData');
      if (savedLeaderboard) {
        setLeaderboardData(JSON.parse(savedLeaderboard));
      } else {
        // Start with empty leaderboard - no mock data
        setLeaderboardData([]);
      }
    }
  }, [isClient]);

  // Check for locked team and load opponent data
  useEffect(() => {
    if (isClient && wallet.publicKey) {
      const lockKey = `lockedTeam_${wallet.publicKey.toString()}`;
      const lockData = localStorage.getItem(lockKey);
      
      if (lockData) {
        const parsed = JSON.parse(lockData);
        const unlockTime = new Date(parsed.unlockAt);
        const now = new Date();
        
        if (now < unlockTime) {
          // Team is still locked
          setIsTeamLocked(true);
          setTeamLockData(parsed);
          
          // Load opponent's team if matched
          if (parsed.opponent && parsed.status === 'matched') {
            const opponentLockKey = `lockedTeam_${parsed.opponent}`;
            const opponentData = localStorage.getItem(opponentLockKey);
            if (opponentData) {
              const opponentParsed = JSON.parse(opponentData);
              setOpponentTeam(opponentParsed.lineup);
            }
          } else {
            // No opponent yet or still waiting
            setOpponentTeam(null);
          }
        } else {
          // Team is unlocked, clear lock data
          localStorage.removeItem(lockKey);
          setIsTeamLocked(false);
          setTeamLockData(null);
          setOpponentTeam(null);
        }
      }
    }
  }, [isClient, wallet.publicKey]);

  if (!isClient) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-white text-2xl font-bold">Loading NBA Fantasy League...</div>
                  </div>
                </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0a0e27]">
      {/* Header */}
        <header className="bg-[#1a1f3a] border-b-4 border-[#f2a900] p-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏀</div>
                <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  NBA Fantasy League
                  </h1>
                <p className="text-[#f2a900] font-bold text-sm">Solana Blockchain • Real Stats • Real Money</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-white font-bold text-sm uppercase tracking-wider">Salary Cap</div>
                <div className="text-[#f2a900] text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  15 Tokens
                        </div>
                        </div>
              
              <div className="text-center">
                <div className="text-white font-bold text-sm uppercase tracking-wider">Team Score</div>
                <div className="text-[#f2a900] text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  {calculateTeamScore().toFixed(1)}
                  </div>
              </div>
              
              <WalletMultiButton />
                </div>
                </div>
        </header>

        {/* Username Modal */}
        {showUsernameModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1f3a] border-4 border-[#f2a900] p-8 max-w-md w-full mx-4">
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 text-center" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                Choose Your Username
              </h2>
              <p className="text-gray-300 text-sm mb-6 text-center">
                Pick a username that other players will see when they face you in matchups.
              </p>
              <input
                type="text"
                value={tempUsername}
                onChange={(e) => setTempUsername(e.target.value)}
                placeholder="Enter your username..."
                className="w-full p-3 bg-[#0a0e27] border-2 border-[#f2a900] text-white placeholder-gray-400 focus:outline-none focus:border-white mb-4"
                maxLength={20}
              />
              <div className="flex gap-3">
                <button 
                  onClick={handleUsernameSubmit}
                  className="flex-1 bg-[#f2a900] text-[#0a0e27] py-3 font-black uppercase tracking-wider hover:bg-white transition-colors"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  Save Username
                </button>
              <button 
                  onClick={() => setShowUsernameModal(false)}
                  className="flex-1 bg-gray-600 text-white py-3 font-black uppercase tracking-wider hover:bg-gray-500 transition-colors"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                  Cancel
              </button>
                </div>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Live Matchup */}
              {wallet.connected && userProfile && (
          <div className="mb-8">
                  <div className="bg-[#1a1f3a] border-4 border-[#f2a900] p-6 transform -skew-x-3">
                    <div className="skew-x-3">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[#f2a900] text-2xl font-black uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                          🏀 Live Matchup
                  </h3>
                        <div className="flex items-center gap-2">
              <button 
                            onClick={() => shuffleOpponent(wallet.publicKey!.toString())}
                            className="bg-[#f2a900] text-[#0a0e27] px-3 py-1 text-xs font-black uppercase tracking-wider hover:bg-white transition-colors"
                style={{ fontFamily: 'Bebas Neue, sans-serif' }}
              >
                            🔄 Shuffle
              </button>
              </div>
            </div>
            
                      {userMatchup ? (
                        // Show matchup when real opponent is available
                        <>
                          <div className="grid grid-cols-2 gap-6 mb-4">
                            <div className="text-center">
                              <div className="text-white font-bold text-sm mb-2 uppercase tracking-wider">You</div>
                              <div className="bg-[#f2a900] text-[#0a0e27] px-4 py-2 rounded-lg font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {userProfile.username}
                  </div>
                              <div className="text-gray-400 text-xs mt-1">
                                {userProfile.wins}W - {userProfile.losses}L
                </div>
                              <div className="text-[#f2a900] text-xs font-bold mt-1">
                                Total: {userProfile.wins + userProfile.losses} Games
              </div>
            </div>
            
                            <div className="text-center">
                              <div className="text-white font-bold text-sm mb-2 uppercase tracking-wider">vs</div>
                              <div className="bg-white text-[#0a0e27] px-4 py-2 rounded-lg font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {userMatchup.opponent}
                    </div>
                              <div className="text-gray-400 text-xs mt-1">
                                Real Solana User
                  </div>
                              <div className="text-gray-400 text-xs">
                                Random Opponent
                </div>
              </div>
            </div>

                          <div className="text-center mb-4">
                            <div className="text-gray-300 text-sm mb-2">
                              Matchup expires in: <span className="text-[#f2a900] font-bold">{Math.floor(timeUntilDeadline / (1000 * 60 * 60))}h {Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60))}m</span>
                    </div>
                            <div className="text-gray-400 text-xs">
                              {shuffleMode === 'every-game' ? 'New opponent every game' : 
                               shuffleMode === 'hourly' ? 'New opponent every hour' : 
                               'New random opponent every 24 hours'}
                  </div>
                </div>
                          
                          {/* Shuffle Mode Selector */}
                          <div className="border-t border-gray-600 pt-4">
                            <div className="text-center mb-3">
                              <div className="text-white font-bold text-sm uppercase tracking-wider mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                Shuffle Mode
              </div>
                              <div className="flex gap-2 justify-center">
                                {(['every-game', 'hourly', 'daily'] as const).map((mode) => (
                                  <button
                                    key={mode}
                                    onClick={() => setShuffleMode(mode)}
                                    className={`px-3 py-1 text-xs font-black uppercase tracking-wider transition-colors ${
                                      shuffleMode === mode 
                                        ? 'bg-[#f2a900] text-[#0a0e27]' 
                                        : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                                    }`}
                                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                                  >
                                    {mode === 'every-game' ? 'Per Game' : 
                                     mode === 'hourly' ? 'Hourly' : 'Daily'}
                                  </button>
                                ))}
            </div>
          </div>
                  </div>
                        </>
                      ) : (
                        // Show waiting message when no real opponents available
                        <div className="text-center py-8">
                          <div className="text-6xl mb-4">⏳</div>
                          <h3 className="text-white text-xl font-bold mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                            Waiting for Real Opponents
                          </h3>
                          <p className="text-gray-300 text-sm mb-4">
                            You're the first player! Share the game with friends to start competing against real Solana users.
                          </p>
                          <div className="text-gray-400 text-xs mb-4">
                            No bots or fake opponents - only real wallet vs wallet matchups!
                    </div>
                          <div className="bg-[#f2a900] text-[#0a0e27] px-4 py-2 rounded-lg font-black text-sm inline-block" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                            {userProfile.username} - Ready to Compete!
                  </div>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
              )}

              {/* Basketball Court */}
              <BasketballCourt
                players={players}
                playerStats={playerStats}
                selectedByPosition={lineup}
                onSelectPlayer={(playerId, position) => {
                  if (isTeamLocked) {
                    alert('Team is locked for 24 hours. Cannot make changes.');
                    return;
                  }
                  setLineup(prev => ({
                    ...prev,
                    [position]: playerId
                  }));
                }}
                onRemovePlayer={removePlayer}
                usedSalary={Object.values(lineup).reduce((sum, playerId) => {
                  const player = players.find(p => p.id === playerId);
                  return sum + (player?.salary || 0);
                }, 0)}
                salaryCap={15}
                isLocked={isTeamLocked}
                opponentTeam={opponentTeam}
              />

              {/* Lineup Registration */}
              {wallet.connected && (
                <div className="bg-[#1a1f3a] border-4 border-[#f2a900] p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[#f2a900] text-xl font-black uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      🏀 Register Lineup
                    </h3>
                    <div className="text-right">
                      <div className="text-white font-bold text-sm">Team Score</div>
                      <div className="text-[#f2a900] text-2xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        {calculateTeamScore().toFixed(1)}
                        </div>
                      </div>
                    </div>

                  {/* Team Status Display */}
                  {isTeamLocked && (
                    <div className="mb-4 p-4 bg-[#0a0e27] border-2 border-[#f2a900] rounded-lg">
                      <div className="text-center">
                        <div className="text-[#f2a900] font-black text-lg mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                          {teamLockData?.status === 'waiting_for_opponent' ? '⏳ WAITING FOR OPPONENT' : 
                           teamLockData?.status === 'matched' ? '✅ OPPONENT MATCHED' : 
                           '🔒 TEAM LOCKED'}
                        </div>
                        {teamLockData?.status === 'waiting_for_opponent' && (
                          <div className="text-white text-sm">
                            Your team is locked and waiting for a random opponent to be assigned...
                          </div>
                        )}
                        {teamLockData?.status === 'matched' && userMatchup && (
                          <div className="text-white text-sm">
                            Matched with: <span className="text-[#f2a900] font-bold">{userMatchup.opponent}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-5 gap-4 mb-4">
                    {Object.entries(lineup).map(([position, playerId]) => {
                      const player = players.find(p => p.id === playerId);
                      return (
                        <div key={position} className="text-center">
                          <div className="text-gray-400 text-xs font-bold uppercase mb-1">{position}</div>
                          <div className="bg-[#0a0e27] border border-gray-600 p-2 rounded">
                            {player ? (
                              <div>
                                <div className="text-white text-xs font-bold">{player.name}</div>
                                <div className="text-gray-400 text-xs">{player.team}</div>
                                <div className="text-[#f2a900] text-xs font-bold">{player.salary} tokens</div>
                          </div>
                            ) : (
                              <div className="text-gray-500 text-xs">Empty</div>
                            )}
                        </div>
                      </div>
                      );
                    })}
                    </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm">
                      <div className="text-gray-300">Total Salary: <span className="text-white font-bold">
                        {Object.values(lineup).reduce((sum, playerId) => {
                          const player = players.find(p => p.id === playerId);
                          return sum + (player?.salary || 0);
                        }, 0)}/15 tokens
                      </span></div>
                          </div>
            <button
              onClick={registerLineup}
                      disabled={isTeamLocked || Object.values(lineup).some(pos => pos === null) || 
                               Object.values(lineup).reduce((sum, playerId) => {
                                 const player = players.find(p => p.id === playerId);
                                 return sum + (player?.salary || 0);
                               }, 0) > 15}
                      className="bg-[#f2a900] text-[#0a0e27] px-6 py-3 font-black uppercase tracking-wider hover:bg-white transition-colors disabled:bg-gray-600 disabled:text-gray-400"
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
                      {isTeamLocked ? 
                        (teamLockData?.status === 'waiting_for_opponent' ? 'Waiting for Opponent...' : 
                         teamLockData?.status === 'matched' ? 'Team Locked (24h)' : 
                         'Team Locked (24h)') : 
                        'Register Lineup'}
            </button>
                        </div>
                      </div>
              )}

              {/* Live Games Widget */}
              <LiveGamesWidget />
                  </div>

            {/* Sidebar */}
            <div className="space-y-8">
          {/* Leaderboard */}
              <div className="bg-[#1a1f3a] border-4 border-[#f2a900] p-6">
                <h3 className="text-[#f2a900] text-xl font-black uppercase tracking-wider mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  🏆 Leaderboard
                </h3>
                <div className="space-y-3">
                  {leaderboardData.length > 0 ? (
                    leaderboardData.slice(0, 5).map((entry, index) => (
                      <div key={entry.wallet} className="flex items-center justify-between bg-[#0a0e27] p-3 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                            index === 0 ? 'bg-yellow-500 text-black' :
                            index === 1 ? 'bg-gray-400 text-black' :
                            index === 2 ? 'bg-orange-600 text-white' :
                            'bg-gray-600 text-white'
                          }`}>
                            {index + 1}
                  </div>
                        <div>
                          <div className="text-white font-bold text-sm">{entry.username}</div>
                          <div className="text-gray-400 text-xs">{entry.wins}W - {entry.losses}L</div>
                          <div className="text-gray-500 text-xs">{entry.gamesPlayed || 0} games</div>
                </div>
              </div>
                            <div className="text-right">
                          <div className="text-[#f2a900] font-black text-sm" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                            {entry.totalScore.toFixed(1)}
            </div>
                          <div className="text-gray-400 text-xs">points</div>
          </div>
            </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-2">🏆</div>
                      <p className="text-gray-400 text-sm">No players yet</p>
                      <p className="text-gray-500 text-xs">Be the first to register a lineup!</p>
            </div>
                )}
          </div>
          </div>

              {/* Tournament Info */}
              {currentTournament && (
                <div className="bg-[#1a1f3a] border-4 border-[#f2a900] p-6">
                  <h3 className="text-[#f2a900] text-xl font-black uppercase tracking-wider mb-4" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    🏆 Tournament
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Name:</span>
                      <span className="text-white font-bold">{currentTournament.name}</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Entry Fee:</span>
                      <span className="text-green-500 font-bold">FREE</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Participants:</span>
                      <span className="text-white font-bold">{currentTournament.participants.length}</span>
                              </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Time Left:</span>
                      <span className="text-[#f2a900] font-bold">
                        {Math.floor(timeUntilDeadline / (1000 * 60 * 60))}h {Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60))}m
                              </span>
                            </div>
                            </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </ErrorBoundary>
  );
}