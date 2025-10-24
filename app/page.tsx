
'use client';

import { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import BasketballCourt from './components/BasketballCourt';
import LiveGamesWidget from './components/LiveGamesWidget';
import WeeklyMatchup from './components/WeeklyMatchup';
import NBAStatsService from './services/nbaStatsService';
import TournamentService from './services/tournamentService';

// Solana Program ID (this would be your deployed program ID)
const PROGRAM_ID = new PublicKey("NBAFantasy111111111111111111111111111111111");

// ALL 150 NBA PLAYERS WITH REAL POSITIONS AND SALARIES (1-5 TOKENS)
const PLAYERS = [
  // POINT GUARDS (PG) - SALARY 1-5
  { id: 1, name: "LUKA DONCIC", team: "MAVERICKS", position: "PG", salary: 5, nbaId: "1629029", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629029.png" },
  { id: 2, name: "STEPHEN CURRY", team: "WARRIORS", position: "PG", salary: 5, nbaId: "201939", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201939.png" },
  { id: 3, name: "SHAI GILGEOUS-ALEXANDER", team: "THUNDER", position: "PG", salary: 5, nbaId: "1628983", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628983.png" },
  { id: 4, name: "TRAE YOUNG", team: "HAWKS", position: "PG", salary: 4, nbaId: "1629027", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629027.png" },
  { id: 5, name: "DAMIAN LILLARD", team: "BUCKS", position: "PG", salary: 4, nbaId: "203081", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203081.png" },
  { id: 6, name: "JA MORANT", team: "GRIZZLIES", position: "PG", salary: 4, nbaId: "1629630", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629630.png" },
  { id: 7, name: "TYRESE HALIBURTON", team: "PACERS", position: "PG", salary: 4, nbaId: "1630169", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630169.png" },
  { id: 8, name: "LAMELO BALL", team: "HORNETS", position: "PG", salary: 4, nbaId: "1630163", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630163.png" },
  { id: 9, name: "DE'AARON FOX", team: "KINGS", position: "PG", salary: 4, nbaId: "1628368", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628368.png" },
  { id: 10, name: "DARIUS GARLAND", team: "CAVALIERS", position: "PG", salary: 3, nbaId: "1629636", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629636.png" },
  { id: 11, name: "JALEN BRUNSON", team: "KNICKS", position: "PG", salary: 3, nbaId: "1628973", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628973.png" },
  { id: 12, name: "DEJOUNTE MURRAY", team: "HAWKS", position: "PG", salary: 3, nbaId: "1627749", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627749.png" },
  { id: 13, name: "FRED VANVLEET", team: "ROCKETS", position: "PG", salary: 3, nbaId: "1627832", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627832.png" },
  { id: 14, name: "TYRESE MAXEY", team: "76ERS", position: "PG", salary: 3, nbaId: "1630178", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630178.png" },
  { id: 15, name: "CHRIS PAUL", team: "WARRIORS", position: "PG", salary: 2, nbaId: "101108", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/101108.png" },
  { id: 16, name: "KYLE LOWRY", team: "76ERS", position: "PG", salary: 2, nbaId: "200768", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/200768.png" },
  { id: 17, name: "MIKE CONLEY", team: "TIMBERWOLVES", position: "PG", salary: 2, nbaId: "201144", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201144.png" },
  { id: 18, name: "DENNIS SCHRODER", team: "NETS", position: "PG", salary: 2, nbaId: "203471", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203471.png" },
  { id: 19, name: "COLLIN SEXTON", team: "JAZZ", position: "PG", salary: 2, nbaId: "1629012", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629012.png" },
  { id: 20, name: "COBY WHITE", team: "BULLS", position: "PG", salary: 2, nbaId: "1629632", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629632.png" },
  
  // SHOOTING GUARDS (SG) - SALARY 1-5
  { id: 31, name: "DEVIN BOOKER", team: "SUNS", position: "SG", salary: 5, nbaId: "1626164", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626164.png" },
  { id: 32, name: "DONOVAN MITCHELL", team: "CAVALIERS", position: "SG", salary: 5, nbaId: "1628378", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628378.png" },
  { id: 33, name: "ANTHONY EDWARDS", team: "TIMBERWOLVES", position: "SG", salary: 5, nbaId: "1630162", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630162.png" },
  { id: 34, name: "JAYLEN BROWN", team: "CELTICS", position: "SG", salary: 5, nbaId: "1627759", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627759.png" },
  { id: 35, name: "ZACH LAVINE", team: "BULLS", position: "SG", salary: 4, nbaId: "203897", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203897.png" },
  { id: 36, name: "DEMAR DEROZAN", team: "BULLS", position: "SG", salary: 4, nbaId: "201942", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201942.png" },
  { id: 37, name: "BRADLEY BEAL", team: "SUNS", position: "SG", salary: 4, nbaId: "203078", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203078.png" },
  { id: 38, name: "TYLER HERRO", team: "HEAT", position: "SG", salary: 3, nbaId: "1629639", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629639.png" },
  { id: 39, name: "DESMOND BANE", team: "GRIZZLIES", position: "SG", salary: 3, nbaId: "1630217", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630217.png" },
  { id: 40, name: "JORDAN CLARKSON", team: "JAZZ", position: "SG", salary: 3, nbaId: "203903", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203903.png" },
  { id: 41, name: "CJ MCCOLLUM", team: "PELICANS", position: "SG", salary: 3, nbaId: "203468", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203468.png" },
  { id: 42, name: "KLAY THOMPSON", team: "WARRIORS", position: "SG", salary: 3, nbaId: "202691", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202691.png" },
  { id: 43, name: "ANFERNEE SIMONS", team: "TRAIL BLAZERS", position: "SG", salary: 3, nbaId: "1629014", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629014.png" },
  { id: 44, name: "AUSTIN REAVES", team: "LAKERS", position: "SG", salary: 2, nbaId: "1630559", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630559.png" },
  { id: 45, name: "JALEN GREEN", team: "ROCKETS", position: "SG", salary: 3, nbaId: "1630224", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630224.png" },
  { id: 46, name: "RJ BARRETT", team: "RAPTORS", position: "SG", salary: 2, nbaId: "1629628", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629628.png" },
  { id: 47, name: "JORDAN HAWKINS", team: "PELICANS", position: "SG", salary: 2, nbaId: "1641712", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png" },
  { id: 48, name: "DERRICK WHITE", team: "CELTICS", position: "SG", salary: 2, nbaId: "1628401", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628401.png" },
  { id: 49, name: "GARY TRENT JR", team: "BUCKS", position: "SG", salary: 2, nbaId: "1629018", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629018.png" },
  { id: 50, name: "BUDDY HIELD", team: "WARRIORS", position: "SG", salary: 2, nbaId: "1627741", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627741.png" },
  
  // SMALL FORWARDS (SF) - SALARY 1-5
  { id: 61, name: "LEBRON JAMES", team: "LAKERS", position: "SF", salary: 5, nbaId: "2544", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/2544.png" },
  { id: 62, name: "KEVIN DURANT", team: "SUNS", position: "SF", salary: 5, nbaId: "201142", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201142.png" },
  { id: 63, name: "JAYSON TATUM", team: "CELTICS", position: "SF", salary: 5, nbaId: "1628369", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628369.png" },
  { id: 64, name: "KAWHI LEONARD", team: "CLIPPERS", position: "SF", salary: 5, nbaId: "202695", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202695.png" },
  { id: 65, name: "JIMMY BUTLER", team: "HEAT", position: "SF", salary: 4, nbaId: "202710", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202710.png" },
  { id: 66, name: "PAUL GEORGE", team: "76ERS", position: "SF", salary: 4, nbaId: "202331", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202331.png" },
  { id: 67, name: "LAURI MARKKANEN", team: "JAZZ", position: "SF", salary: 4, nbaId: "1628374", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628374.png" },
  { id: 68, name: "FRANZ WAGNER", team: "MAGIC", position: "SF", salary: 3, nbaId: "1630532", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630532.png" },
  { id: 69, name: "SCOTTIE BARNES", team: "RAPTORS", position: "SF", salary: 3, nbaId: "1630567", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630567.png" },
  { id: 70, name: "BRANDON INGRAM", team: "PELICANS", position: "SF", salary: 4, nbaId: "1627742", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627742.png" },
  { id: 71, name: "OG ANUNOBY", team: "KNICKS", position: "SF", salary: 3, nbaId: "1628384", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628384.png" },
  { id: 72, name: "MIKAL BRIDGES", team: "NETS", position: "SF", salary: 3, nbaId: "1628969", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628969.png" },
  { id: 73, name: "DE'ANDRE HUNTER", team: "HAWKS", position: "SF", salary: 2, nbaId: "1629631", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629631.png" },
  { id: 74, name: "HERBERT JONES", team: "PELICANS", position: "SF", salary: 2, nbaId: "1630529", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630529.png" },
  { id: 75, name: "ANDREW WIGGINS", team: "WARRIORS", position: "SF", salary: 2, nbaId: "203952", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203952.png" },
  { id: 76, name: "KELDON JOHNSON", team: "SPURS", position: "SF", salary: 2, nbaId: "1629640", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629640.png" },
  { id: 77, name: "DILLON BROOKS", team: "ROCKETS", position: "SF", salary: 2, nbaId: "1628415", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628415.png" },
  { id: 78, name: "BOGDAN BOGDANOVIC", team: "HAWKS", position: "SF", salary: 2, nbaId: "203992", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203992.png" },
  { id: 79, name: "HARRISON BARNES", team: "KINGS", position: "SF", salary: 2, nbaId: "203084", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203084.png" },
  { id: 80, name: "KELLY OUBRE JR", team: "76ERS", position: "SF", salary: 2, nbaId: "1626162", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626162.png" },
  
  // POWER FORWARDS (PF) - SALARY 1-5
  { id: 91, name: "GIANNIS ANTETOKOUNMPO", team: "BUCKS", position: "PF", salary: 5, nbaId: "203507", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203507.png" },
  { id: 92, name: "ZION WILLIAMSON", team: "PELICANS", position: "PF", salary: 5, nbaId: "1629627", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629627.png" },
  { id: 93, name: "PAOLO BANCHERO", team: "MAGIC", position: "PF", salary: 4, nbaId: "1631094", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631094.png" },
  { id: 94, name: "JULIUS RANDLE", team: "KNICKS", position: "PF", salary: 4, nbaId: "203944", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203944.png" },
  { id: 95, name: "JAREN JACKSON JR", team: "GRIZZLIES", position: "PF", salary: 4, nbaId: "1628991", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628991.png" },
  { id: 96, name: "JABARI SMITH JR", team: "ROCKETS", position: "PF", salary: 3, nbaId: "1631095", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631095.png" },
  { id: 97, name: "JOHN COLLINS", team: "JAZZ", position: "PF", salary: 3, nbaId: "1628381", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628381.png" },
  { id: 98, name: "EVAN MOBLEY", team: "CAVALIERS", position: "PF", salary: 4, nbaId: "1630596", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630596.png" },
  { id: 99, name: "PASCAL SIAKAM", team: "PACERS", position: "PF", salary: 4, nbaId: "1627783", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627783.png" },
  { id: 100, name: "TOBIAS HARRIS", team: "PISTONS", position: "PF", salary: 2, nbaId: "202699", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202699.png" },
  { id: 101, name: "JERAMI GRANT", team: "TRAIL BLAZERS", position: "PF", salary: 3, nbaId: "203924", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203924.png" },
  { id: 102, name: "AARON GORDON", team: "NUGGETS", position: "PF", salary: 3, nbaId: "203932", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203932.png" },
  { id: 103, name: "KYLE KUZMA", team: "WIZARDS", position: "PF", salary: 2, nbaId: "1628398", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628398.png" },
  { id: 104, name: "KEEGAN MURRAY", team: "KINGS", position: "PF", salary: 2, nbaId: "1631093", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631093.png" },
  { id: 105, name: "DRAYMOND GREEN", team: "WARRIORS", position: "PF", salary: 2, nbaId: "203110", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203110.png" },
  { id: 106, name: "PJ WASHINGTON", team: "MAVERICKS", position: "PF", salary: 2, nbaId: "1629023", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629023.png" },
  { id: 107, name: "JALEN WILLIAMS", team: "THUNDER", position: "PF", salary: 3, nbaId: "1631116", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631116.png" },
  { id: 108, name: "JONATHAN KUMINGA", team: "WARRIORS", position: "PF", salary: 2, nbaId: "1630228", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630228.png" },
  { id: 109, name: "TREY MURPHY III", team: "PELICANS", position: "PF", salary: 2, nbaId: "1630530", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630530.png" },
  { id: 110, name: "BOBBY PORTIS", team: "BUCKS", position: "PF", salary: 2, nbaId: "1626171", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626171.png" },
  
  // CENTERS (C) - SALARY 1-5
  { id: 121, name: "NIKOLA JOKIC", team: "NUGGETS", position: "C", salary: 5, nbaId: "203999", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203999.png" },
  { id: 122, name: "JOEL EMBIID", team: "76ERS", position: "C", salary: 5, nbaId: "203954", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203954.png" },
  { id: 123, name: "ANTHONY DAVIS", team: "LAKERS", position: "C", salary: 5, nbaId: "203076", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203076.png" },
  { id: 124, name: "VICTOR WEMBANYAMA", team: "SPURS", position: "C", salary: 5, nbaId: "1641705", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/fallback.png" },
  { id: 125, name: "BAM ADEBAYO", team: "HEAT", position: "C", salary: 4, nbaId: "1628389", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628389.png" },
  { id: 126, name: "DOMANTAS SABONIS", team: "KINGS", position: "C", salary: 4, nbaId: "1627734", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627734.png" },
  { id: 127, name: "KARL-ANTHONY TOWNS", team: "KNICKS", position: "C", salary: 4, nbaId: "1626157", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626157.png" },
  { id: 128, name: "ALPEREN SENGUN", team: "ROCKETS", position: "C", salary: 4, nbaId: "1630578", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1630578.png" },
  { id: 129, name: "JARRETT ALLEN", team: "CAVALIERS", position: "C", salary: 3, nbaId: "1628386", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1628386.png" },
  { id: 130, name: "KRISTAPS PORZINGIS", team: "CELTICS", position: "C", salary: 3, nbaId: "204001", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/204001.png" },
  { id: 131, name: "RUDY GOBERT", team: "TIMBERWOLVES", position: "C", salary: 3, nbaId: "203497", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203497.png" },
  { id: 132, name: "MYLES TURNER", team: "PACERS", position: "C", salary: 3, nbaId: "1626167", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1626167.png" },
  { id: 133, name: "BROOK LOPEZ", team: "BUCKS", position: "C", salary: 2, nbaId: "201572", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/201572.png" },
  { id: 134, name: "CLINT CAPELA", team: "HAWKS", position: "C", salary: 2, nbaId: "203991", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203991.png" },
  { id: 135, name: "MITCHELL ROBINSON", team: "KNICKS", position: "C", salary: 2, nbaId: "1629011", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629011.png" },
  { id: 136, name: "NIKOLA VUCEVIC", team: "BULLS", position: "C", salary: 3, nbaId: "202696", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/202696.png" },
  { id: 137, name: "JUSUF NURKIC", team: "SUNS", position: "C", salary: 2, nbaId: "203994", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/203994.png" },
  { id: 138, name: "DANIEL GAFFORD", team: "MAVERICKS", position: "C", salary: 2, nbaId: "1629655", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1629655.png" },
  { id: 139, name: "IVICA ZUBAC", team: "CLIPPERS", position: "C", salary: 2, nbaId: "1627826", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1627826.png" },
  { id: 150, name: "CHET HOLMGREN", team: "THUNDER", position: "C", salary: 4, nbaId: "1631096", photo: "https://cdn.nba.com/headshots/nba/latest/1040x760/1631096.png" }
];

interface PlayerStats {
  pts: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  to: number;
  fantasyPoints: number;
}

export default function Home() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const [language] = useState<'en'>('en');
  const [isClient, setIsClient] = useState(false);
  const [selectedByPosition, setSelectedByPosition] = useState<{
    PG: number | null;
    SG: number | null;
    SF: number | null;
    PF: number | null;
    C: number | null;
  }>({ PG: null, SG: null, SF: null, PF: null, C: null });
  const [myScore, setMyScore] = useState<number>(0);
  const [prizePool, setPrizePool] = useState<string>('0');
  const [leaderboard, setLeaderboard] = useState<{address: string, score: number}[]>([]);
  const [loading, setLoading] = useState(false);
  const [playerStats, setPlayerStats] = useState<{[key: number]: PlayerStats}>({});
  const [usedSalary, setUsedSalary] = useState<number>(0);
  const [liveStats, setLiveStats] = useState<any[]>([]);
  const [currentTournament, setCurrentTournament] = useState<any>(null);
  const [tournamentResults, setTournamentResults] = useState<any[]>([]);
  const [userMatchup, setUserMatchup] = useState<any>(null);
  const [timeUntilDeadline, setTimeUntilDeadline] = useState<number>(0);
  const [leaderboardData, setLeaderboardData] = useState<Array<{
    walletAddress: string;
    totalScore: number;
    wins: number;
    losses: number;
    lastUpdated: string;
  }>>([]);
  const [userProfile, setUserProfile] = useState<{
    username: string;
    walletAddress: string;
    joinDate: string;
    totalGames: number;
    wins: number;
    losses: number;
  } | null>(null);
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [shuffleMode, setShuffleMode] = useState<'daily' | 'hourly' | 'every-game'>('every-game');
  const SALARY_CAP = 20; // 20 tokens total

  // Set client-side flag to prevent hydration mismatches
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple translation function - English only
  const t = (enText: string) => enText;

  // Calculate fantasy points using Points League scoring system
  const calculateFantasyPoints = (stats: PlayerStats): number => {
    // Points League Formula: PTS×1 + REB×1.2 + AST×1.5 + STL×3 + BLK×3 + TO×(-1)
    return stats.pts + (stats.reb * 1.2) + (stats.ast * 1.5) + (stats.stl * 3) + (stats.blk * 3) + (stats.to * -1);
  };

  // Calculate total team score for a lineup
  const calculateTeamScore = (lineup: {PG: number | null, SG: number | null, SF: number | null, PF: number | null, C: number | null}): number => {
    let totalScore = 0;
    Object.values(lineup).forEach(playerId => {
      if (playerId && playerStats[playerId]) {
        totalScore += playerStats[playerId].fantasyPoints;
      }
    });
    return Math.floor(totalScore);
  };

  // Update leaderboard with wallet performance
  const updateLeaderboard = (walletAddress: string, score: number, won: boolean) => {
    setLeaderboardData(prev => {
      const existing = prev.find(entry => entry.walletAddress === walletAddress);
      if (existing) {
        return prev.map(entry => 
          entry.walletAddress === walletAddress 
            ? {
                ...entry,
                totalScore: entry.totalScore + score,
                wins: won ? entry.wins + 1 : entry.wins,
                losses: won ? entry.losses : entry.losses + 1,
                lastUpdated: new Date().toISOString()
              }
            : entry
        ).sort((a, b) => b.totalScore - a.totalScore);
      } else {
        const newEntry = {
          walletAddress,
          totalScore: score,
          wins: won ? 1 : 0,
          losses: won ? 0 : 1,
          lastUpdated: new Date().toISOString()
        };
        return [...prev, newEntry].sort((a, b) => b.totalScore - a.totalScore);
      }
    });
  };

  // User Profile Management
  const saveUserProfile = (username: string, walletAddress: string) => {
    const profile = {
      username,
      walletAddress,
      joinDate: new Date().toISOString(),
      totalGames: 0,
      wins: 0,
      losses: 0
    };
    localStorage.setItem(`userProfile_${walletAddress}`, JSON.stringify(profile));
    setUserProfile(profile);
    setShowUsernameModal(false);
    setTempUsername('');
  };

  const loadUserProfile = (walletAddress: string) => {
    const saved = localStorage.getItem(`userProfile_${walletAddress}`);
    if (saved) {
      const profile = JSON.parse(saved);
      setUserProfile(profile);
      return profile;
    }
    return null;
  };

  const updateUserProfile = (walletAddress: string, won: boolean) => {
    const profile = loadUserProfile(walletAddress);
    if (profile) {
      const updatedProfile = {
        ...profile,
        totalGames: profile.totalGames + 1,
        wins: won ? profile.wins + 1 : profile.wins,
        losses: won ? profile.losses : profile.losses + 1
      };
      localStorage.setItem(`userProfile_${walletAddress}`, JSON.stringify(updatedProfile));
      setUserProfile(updatedProfile);
    }
  };

  // Daily Matchup System
  const generateDailyMatchup = (userWallet: string) => {
    // Get all registered users (in a real app, this would come from a database)
    const allUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    
    // Filter out current user and get their profiles
    const otherUsers = allUsers.filter((user: string) => user !== userWallet);
    
    if (otherUsers.length === 0) {
      // If no other users, create a bot opponent with Solana-style address
      return {
        opponent: 'Bot_Opponent_001',
        opponentWallet: 'So11111111111111111111111111111111111111112', // Solana system program address
        isBot: true,
        matchupId: `matchup_${Date.now()}`,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
    }
    
    // Randomly select an opponent and get their username
    const randomOpponentWallet = otherUsers[Math.floor(Math.random() * otherUsers.length)];
    const opponentProfile = loadUserProfile(randomOpponentWallet);
    
    return {
      opponent: opponentProfile ? opponentProfile.username : formatAddress(randomOpponentWallet),
      opponentWallet: randomOpponentWallet,
      isBot: false,
      matchupId: `matchup_${Date.now()}`,
      startTime: new Date().toISOString(),
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
    };
  };

  const saveMatchup = (userWallet: string, matchup: any, mode: string) => {
    const now = new Date();
    let key = '';
    
    switch (mode) {
      case 'every-game':
        key = `matchup_${userWallet}_${now.getTime()}`; // Unique for each game
        break;
      case 'hourly':
        key = `matchup_${userWallet}_${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
        break;
      case 'daily':
      default:
        key = `matchup_${userWallet}_${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        break;
    }
    
    localStorage.setItem(key, JSON.stringify(matchup));
  };

  const loadMatchup = (userWallet: string, mode: string) => {
    const now = new Date();
    let key = '';
    
    switch (mode) {
      case 'every-game':
        // For every-game mode, we don't load old matchups - always generate new
        return null;
      case 'hourly':
        key = `matchup_${userWallet}_${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`;
        break;
      case 'daily':
      default:
        key = `matchup_${userWallet}_${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;
        break;
    }
    
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
    return null;
  };

  const shuffleOpponent = (userWallet: string) => {
    const newMatchup = generateDailyMatchup(userWallet);
    saveMatchup(userWallet, newMatchup, shuffleMode);
    setUserMatchup(newMatchup);
    return newMatchup;
  };

  // Initialize empty leaderboard - will be populated with real data
  useEffect(() => {
    setLeaderboardData([]);
  }, []);

  // Load player stats from NBA API
  useEffect(() => {
    const loadPlayerStats = async () => {
      try {
        // Try to load from backend API first
        const apiUrl = 'http://localhost:3001';
        const response = await fetch(`${apiUrl}/api/player-stats`);
        
        if (response.ok) {
          const apiStats = await response.json();
          const formattedStats: {[key: number]: PlayerStats} = {};
          
          // Convert API data to our format
          apiStats.forEach((player: any) => {
            const stats = {
              pts: player.pts || 0,
              reb: player.reb || 0,
              ast: player.ast || 0,
              stl: player.stl || 0,
              blk: player.blk || 0,
              to: player.to || 0,
              fantasyPoints: player.fantasy_points || 0
            };
            formattedStats[player.player_id] = stats;
          });
          
          setPlayerStats(formattedStats);
          console.log('✅ Loaded player stats from API');
        } else {
          throw new Error('API not available');
        }
      } catch (error) {
        console.log('⚠️ API not available, using fallback stats');
        // Fallback: Initialize with empty stats
        setPlayerStats({});
      }
    };

    loadPlayerStats();
  }, []);

  // Calculate used salary
  useEffect(() => {
    let total = 0;
    Object.values(selectedByPosition).forEach(playerId => {
      if (playerId) {
        const player = PLAYERS.find(p => p.id === playerId);
        if (player) total += player.salary;
      }
    });
    setUsedSalary(total);
  }, [selectedByPosition]);

  // Load data when wallet connects
  useEffect(() => {
    if (wallet.connected && wallet.publicKey) {
      const walletAddress = wallet.publicKey.toString();
      
      // Check if this is a first-time user
      const existingProfile = loadUserProfile(walletAddress);
      
      if (!existingProfile) {
        // First-time user - show username modal
        setShowUsernameModal(true);
      } else {
        // Existing user - load their profile and daily matchup
        setUserProfile(existingProfile);
        
        // Check for current matchup based on shuffle mode
        let currentMatchup = loadMatchup(walletAddress, shuffleMode);
        if (!currentMatchup) {
          // Generate new matchup
          currentMatchup = generateDailyMatchup(walletAddress);
          saveMatchup(walletAddress, currentMatchup, shuffleMode);
          
          // Add user to registered users list
          const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
          if (!registeredUsers.includes(walletAddress)) {
            registeredUsers.push(walletAddress);
            localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
          }
        }
        
        setUserMatchup(currentMatchup);
      }
      
      loadData();
    } else {
      // Wallet disconnected - clear user data
      setUserProfile(null);
      setUserMatchup(null);
    }
  }, [wallet.connected, wallet.publicKey]);

  // Load live stats and tournament data
  useEffect(() => {
    const loadLiveData = async () => {
      try {
        // Try to load live stats from backend API first
        try {
          // Always use localhost for development
          const apiUrl = 'http://localhost:3001';
          const response = await fetch(`${apiUrl}/api/live-stats`);
          if (response.ok) {
            const liveStats = await response.json();
            setLiveStats(liveStats);
            console.log('✅ Loaded live stats from backend API');
          } else {
            throw new Error('Backend API not available');
          }
        } catch (apiError) {
          console.log('⚠️ Backend API not available, using local service');
          // Fallback to local service
          const statsService = NBAStatsService.getInstance();
          const stats = await statsService.getLiveStats();
          setLiveStats(stats);
        }
        
        const tournamentService = TournamentService.getInstance();
        
        // Initialize default tournament if none exists
        if (!tournamentService.getCurrentTournament()) {
          tournamentService.initializeDefaultTournament();
        }
        
        // Load current tournament
        const tournament = tournamentService.getCurrentTournament();
        setCurrentTournament(tournament);
        
        // Load user's matchup if wallet is connected
        if (wallet.publicKey && tournament) {
          const matchup = tournamentService.getUserMatchup(wallet.publicKey.toString(), tournament.id);
          setUserMatchup(matchup);
          
          // Get time until deadline
          const timeRemaining = tournamentService.getTimeUntilDeadline(tournament.id);
          setTimeUntilDeadline(timeRemaining);
        }
        
        // Load tournament results if completed
        if (tournament?.status === 'completed') {
          const results = tournamentService.getTournamentResults(tournament.id);
          setTournamentResults(results);
        }
        
        // Update player stats with live data
        const updatedPlayerStats: {[key: number]: PlayerStats} = {};
        // Note: liveStats will be updated via setLiveStats above, 
        // this will be handled in a separate useEffect that watches liveStats state
        
      } catch (error) {
        console.error('Error loading live data:', error);
      }
    };

    loadLiveData();
    
    // Refresh data every 2 minutes for live stats
    const interval = setInterval(loadLiveData, 2 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // Update player stats when liveStats changes
  useEffect(() => {
    if (liveStats && liveStats.length > 0) {
      const updatedPlayerStats: {[key: number]: PlayerStats} = {};
      liveStats.forEach(player => {
        const playerId = parseInt(player.playerId);
        if (playerId) {
          updatedPlayerStats[playerId] = {
            pts: player.pts,
            reb: player.reb,
            ast: player.ast,
            stl: player.stl,
            blk: player.blk,
            to: player.turnovers,
            fantasyPoints: player.fantasyPoints
          };
        }
      });
      setPlayerStats(updatedPlayerStats);
    }
  }, [liveStats]);

  const connectWallet = async () => {
    try {
      if (!wallet.wallet) {
        // If no wallet is selected, we need to show the wallet selection modal
        // This will be handled by the WalletModalProvider
        alert('Please select a wallet first! Install Phantom or Solflare wallet.');
        return;
      }
      await wallet.connect();
      } catch (error) {
        console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please make sure you have Phantom or Solflare installed.');
    }
  };

  const loadData = async () => {
    if (!wallet.publicKey) return;
    
    try {
      // Load real data from Solana program (when deployed)
      // For now, initialize with empty data
      setMyScore(0);
      setPrizePool('0');
      setLeaderboard([]);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const selectPlayer = (playerId: number, position: 'PG' | 'SG' | 'SF' | 'PF' | 'C') => {
    const player = PLAYERS.find(p => p.id === playerId);
    if (!player) return;

    const isSelected = selectedByPosition[position] === playerId;
    
    if (isSelected) {
      setSelectedByPosition(prev => ({ ...prev, [position]: null }));
    } else {
      const newSalary = usedSalary - (selectedByPosition[position] ? PLAYERS.find(p => p.id === selectedByPosition[position])?.salary || 0 : 0) + player.salary;
      
      if (newSalary > SALARY_CAP) {
        alert(`SALARY CAP EXCEEDED! You have ${SALARY_CAP - usedSalary} tokens remaining.`);
        return;
      }
      
      setSelectedByPosition(prev => ({ ...prev, [position]: playerId }));
    }
  };

  const registerLineup = async () => {
    const { PG, SG, SF, PF, C } = selectedByPosition;
    
    if (!PG || !SG || !SF || !PF || !C) {
      alert('PLEASE SELECT ALL 5 POSITIONS');
      return;
    }

    if (usedSalary > SALARY_CAP) {
      alert('SALARY CAP EXCEEDED!');
      return;
    }

    if (!wallet.publicKey) {
      alert('Please connect your wallet first!');
      return;
    }

    setLoading(true);
    try {
      // Register with tournament service
      const tournamentService = TournamentService.getInstance();
      const tournament = tournamentService.getCurrentTournament();
      
      if (!tournament) {
        alert('No active tournament found!');
        setLoading(false);
        return;
      }
      
      // Calculate team score
      const teamScore = calculateTeamScore(selectedByPosition);
      
      const lineup = {
        PG: PG.toString(),
        SG: SG.toString(),
        SF: SF.toString(),
        PF: PF.toString(),
        C: C.toString()
      };
      
      const success = tournamentService.registerLineup(
        wallet.publicKey.toString(),
        tournament.id,
        lineup,
        usedSalary
      );
      
      if (success) {
        // Shuffle opponent if in "every-game" mode
        if (shuffleMode === 'every-game') {
          shuffleOpponent(wallet.publicKey.toString());
        }
        
        alert(`✅ LINEUP REGISTERED! Your team score: ${teamScore} fantasy points`);
        // Refresh tournament data
        setCurrentTournament(tournamentService.getCurrentTournament());
        loadData();
      } else {
        alert('❌ Registration failed! You may already be registered or tournament is not accepting entries.');
      }
      
    } catch (error: any) {
      console.error('Error registering lineup:', error);
      alert(error.message || 'ERROR REGISTERING LINEUP');
    }
    setLoading(false);
  };

  const getSalaryColor = (salary: number) => {
    if (salary === 5) return 'text-red-400';
    if (salary === 4) return 'text-orange-400';
    if (salary === 3) return 'text-yellow-400';
    if (salary === 2) return 'text-green-400';
    return 'text-blue-400';
  };

  const formatAddress = (address: string) => `${address.slice(0,6)}...${address.slice(-4)}`;

  const selectedCount = Object.values(selectedByPosition).filter(id => id !== null).length;

  // Don't render wallet-dependent content until client-side
  if (!isClient) {
    return (
      <div className="min-h-screen relative flex items-center justify-center" style={{ background: '#0a0e27' }}>
        <div className="text-center">
          <div className="text-6xl mb-4">🏀</div>
          <div className="text-white text-2xl font-bold">Loading Solana Fantasy League...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ background: '#0a0e27' }}>
      {/* Username Selection Modal */}
      {showUsernameModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative bg-[#0a0e27] border-4 border-[#f2a900] p-8 max-w-md w-full mx-4 transform -skew-x-3">
            <div className="skew-x-3">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🏀</div>
                <h2 className="text-white font-black text-3xl uppercase tracking-wider mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  Welcome to Solana Fantasy League!
                </h2>
                <p className="text-gray-300 text-sm">
                  Choose your username to start competing daily
                </p>
              </div>
              
              <div className="mb-6">
                <label className="block text-white font-bold text-sm uppercase tracking-wider mb-2" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                  Username
                </label>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  placeholder="Enter your username..."
                  className="w-full px-4 py-3 bg-[#1a1f3a] border-2 border-[#f2a900] text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
                  maxLength={20}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && tempUsername.trim()) {
                      saveUserProfile(tempUsername.trim(), wallet.publicKey!.toString());
                    }
                  }}
                />
                <p className="text-gray-400 text-xs mt-1">
                  Max 20 characters • This will be your display name
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (tempUsername.trim()) {
                      saveUserProfile(tempUsername.trim(), wallet.publicKey!.toString());
                    }
                  }}
                  disabled={!tempUsername.trim()}
                  className="flex-1 bg-[#f2a900] text-[#0a0e27] font-black py-3 px-6 border-2 border-white hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                  START PLAYING
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-gray-400 text-xs">
                  You'll be matched against random opponents every 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="relative border-b-4 border-[#f2a900] shadow-2xl" style={{ 
        background: 'linear-gradient(135deg, #1a1f3a 0%, #0a0e27 100%)',
        clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 100%)'
      }}>
        <div className="max-w-7xl mx-auto px-4 py-6 pb-8">
          <div className="flex justify-between items-center relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-4">
                {/* NBA Logo */}
                <div className="relative">
                  <div className="w-16 h-16 bg-[#f2a900] flex items-center justify-center transform -skew-x-6 border-4 border-white shadow-xl">
                    <span className="text-[#0a0e27] font-bold text-2xl skew-x-6" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>NBA</span>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#f2a900] rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h1 className="text-4xl font-black text-white tracking-wider" style={{ 
                    fontFamily: 'Bebas Neue, sans-serif',
                    textShadow: '3px 3px 0px #f2a900, 6px 6px 0px rgba(0,0,0,0.5)'
                  }}>
                    FANTASY LEAGUE
                  </h1>
                  <p className="text-sm font-bold text-[#f2a900] tracking-widest uppercase" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    ⛓️ POWERED BY SOLANA
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-3 text-sm font-bold text-white uppercase tracking-wide">
                <div className="px-4 py-2 bg-[#0a0e27]/50 border-2 border-[#f2a900]/50 transform -skew-x-6">
                  <span className="skew-x-6 block">💰 Cap: 20</span>
                </div>
                <div className="px-4 py-2 bg-[#0a0e27]/50 border-2 border-[#f2a900]/50 transform -skew-x-6">
                  <span className="skew-x-6 block">⚔️ Weekly</span>
                </div>
                <div className="px-4 py-2 bg-[#0a0e27]/50 border-2 border-[#f2a900]/50 transform -skew-x-6">
                  <span className="skew-x-6 block">📊 Live</span>
                </div>
              </div>
              
              {!wallet.connected ? (
                <WalletMultiButton className="!bg-[#f2a900] !text-[#0a0e27] !font-black !text-lg !transform !-skew-x-6 !border-4 !border-white !shadow-xl hover:!scale-105 !transition-all !uppercase !tracking-wider !px-8 !py-3" />
              ) : (
                <div className="flex items-center gap-4">
                  {userProfile && (
                    <div className="px-4 py-2 bg-[#f2a900] border-2 border-white transform -skew-x-6 shadow-lg">
                      <p className="text-[#0a0e27] font-black text-sm skew-x-6 uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        👤 {userProfile.username}
                      </p>
                    </div>
                  )}
                <div className="px-6 py-3 bg-[#0a0e27] border-4 border-[#f2a900] transform -skew-x-6 shadow-xl">
                    <p className="text-[#f2a900] font-mono text-sm font-bold skew-x-6">{formatAddress(wallet.publicKey?.toString() || '')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {!wallet.connected ? (
        <div className="relative py-20" style={{ background: '#0a0e27' }}>
          <div className="max-w-6xl mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              {/* Main Logo */}
              <div className="inline-block mb-8 relative">
                <div className="w-32 h-32 bg-[#f2a900] flex items-center justify-center transform -skew-x-12 border-8 border-white shadow-2xl mx-auto">
                  <span className="text-[#0a0e27] font-black text-6xl skew-x-12" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>NBA</span>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#f2a900] animate-pulse"></div>
                <div className="absolute -top-2 -left-2 w-8 h-8 bg-white animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              </div>
              
              <h1 className="text-7xl md:text-8xl font-black text-white mb-6 tracking-wider" style={{ 
                fontFamily: 'Bebas Neue, sans-serif',
                textShadow: '5px 5px 0px #f2a900, 10px 10px 0px rgba(0,0,0,0.5)'
              }}>
                NBA FANTASY LEAGUE
              </h1>
              
              <div className="inline-block px-8 py-3 bg-[#0a0e27] border-4 border-[#f2a900] transform -skew-x-6 mb-8">
                <p className="text-2xl font-bold text-[#f2a900] tracking-widest uppercase skew-x-6" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  ⛓️ Build • Compete • Win on Solana
                </p>
              </div>
              
              <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto font-semibold leading-relaxed">
                Draft your ultimate NBA lineup with a 20-token salary cap. Battle weekly matchups with live scoring. Win SOL prizes.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#f2a900] transform -skew-y-2 group-hover:skew-y-2 transition-transform"></div>
                <div className="relative bg-[#1a1f3a] border-4 border-white p-8 transform -skew-y-2 group-hover:skew-y-2 transition-transform">
                  <div className="text-6xl mb-4">🏀</div>
                  <h3 className="font-black text-white text-2xl mb-3 uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    Court Selection
                  </h3>
                  <p className="text-gray-300 font-medium">Draft players on an interactive NBA court. Visual position-based team building.</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-[#f2a900] transform -skew-y-2 group-hover:skew-y-2 transition-transform"></div>
                <div className="relative bg-[#1a1f3a] border-4 border-white p-8 transform -skew-y-2 group-hover:skew-y-2 transition-transform">
                  <div className="text-6xl mb-4">⚔️</div>
                  <h3 className="font-black text-white text-2xl mb-3 uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    Weekly Battles
                  </h3>
                  <p className="text-gray-300 font-medium">Face opponents every week. Head-to-head fantasy competition.</p>
                </div>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-[#f2a900] transform -skew-y-2 group-hover:skew-y-2 transition-transform"></div>
                <div className="relative bg-[#1a1f3a] border-4 border-white p-8 transform -skew-y-2 group-hover:skew-y-2 transition-transform">
                  <div className="text-6xl mb-4">💰</div>
                  <h3 className="font-black text-white text-2xl mb-3 uppercase tracking-wide" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    SOL Prizes
                  </h3>
                  <p className="text-gray-300 font-medium">Win real SOL. Powered by Solana blockchain. Transparent prize pools.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <WalletMultiButton className="!bg-[#f2a900] !text-[#0a0e27] !font-black !text-3xl !transform !-skew-x-6 !border-6 !border-white !shadow-2xl hover:!scale-110 !transition-all !uppercase !tracking-wider !px-12 !py-5 !relative group" />
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 py-8 relative z-10">
          {/* Stats Dashboard */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            {/* Prize Pool */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
              <div className="relative bg-[#1a1f3a] border-4 border-white p-6 transform -skew-x-3 hover:skew-x-3 transition-transform">
                <div className="skew-x-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-4xl">💰</div>
                    <div className="px-2 py-1 bg-[#f2a900] text-[#0a0e27] font-bold text-xs">LIVE</div>
                  </div>
                  <p className="text-xs font-bold text-[#f2a900] uppercase tracking-wider mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Prize Pool</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{prizePool} SOL</p>
                </div>
              </div>
            </div>
            
            {/* Your Score */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white transform -skew-x-3"></div>
              <div className="relative bg-[#1a1f3a] border-4 border-[#f2a900] p-6 transform -skew-x-3 hover:skew-x-3 transition-transform">
                <div className="skew-x-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-4xl">🎯</div>
                    <div className="px-2 py-1 bg-white text-[#0a0e27] font-bold text-xs">YOU</div>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Your Score</p>
                  <p className="text-3xl font-black text-[#f2a900]" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{myScore}</p>
                </div>
              </div>
            </div>
            
            {/* Roster */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
              <div className="relative bg-[#1a1f3a] border-4 border-white p-6 transform -skew-x-3 hover:skew-x-3 transition-transform">
                <div className="skew-x-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-4xl">👥</div>
                    <div className={`px-2 py-1 font-bold text-xs ${selectedCount === 5 ? 'bg-green-500 text-white' : 'bg-white text-[#0a0e27]'}`}>
                      {selectedCount === 5 ? 'FULL' : 'DRAFT'}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Roster</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{selectedCount}/5</p>
                </div>
              </div>
            </div>

            {/* Salary Cap */}
            <div className="relative group">
              <div className="absolute inset-0 bg-white transform -skew-x-3"></div>
              <div className="relative bg-[#1a1f3a] border-4 border-[#f2a900] p-6 transform -skew-x-3 hover:skew-x-3 transition-transform">
                <div className="skew-x-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-4xl">💵</div>
                    <div className={`px-2 py-1 font-bold text-xs ${usedSalary > SALARY_CAP ? 'bg-red-500 text-white' : usedSalary === SALARY_CAP ? 'bg-green-500 text-white' : 'bg-white text-[#0a0e27]'}`}>
                      {usedSalary > SALARY_CAP ? 'OVER' : usedSalary === SALARY_CAP ? 'MAX' : 'OK'}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Salary Cap</p>
                  <p className={`text-3xl font-black ${usedSalary > SALARY_CAP ? 'text-red-500' : 'text-[#f2a900]'}`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {usedSalary}/{SALARY_CAP}
                  </p>
                </div>
              </div>
            </div>

            {/* Team Score */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
              <div className="relative bg-[#0a0e27] border-4 border-white p-6 transform -skew-x-3 hover:skew-x-3 transition-transform">
                <div className="skew-x-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-4xl">🧮</div>
                    <div className="px-2 py-1 font-bold text-xs bg-[#f2a900] text-[#0a0e27]">
                      {selectedCount === 5 ? 'COMPLETE' : 'INCOMPLETE'}
                    </div>
                  </div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>Team Score</p>
                  <p className="text-3xl font-black text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                    {selectedCount === 5 ? calculateTeamScore(selectedByPosition) : '--'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">Fantasy Points</p>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Day Tournament */}
          <div className="mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white transform skew-y-1"></div>
              <div className="relative bg-[#1a1f3a] border-6 border-[#f2a900] p-6 transform skew-y-1">
                <div className="-skew-y-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-4xl">⚔️</div>
                    <div>
                      <h2 className="text-3xl font-black text-white uppercase tracking-wider leading-none" style={{ 
                        fontFamily: 'Bebas Neue, sans-serif',
                        textShadow: '2px 2px 0px #f2a900'
                      }}>
                        3-Day Tournament
                      </h2>
                      <p className="text-[#f2a900] font-bold text-sm">
                        Current Round 1
                      </p>
                    </div>
                  </div>

                  {/* Timer */}
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
                    <div className="relative bg-[#0a0e27] border-4 border-white p-4 transform -skew-x-3">
                      <div className="skew-x-3 text-center">
                        <div className="text-gray-400 text-xs font-bold uppercase mb-1">Next Match In</div>
                        <div className="text-[#f2a900] text-3xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                          2d 14h 32m 15s
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* VS Section */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    {/* Your Team */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-blue-500 transform -skew-x-3"></div>
                      <div className="relative bg-[#0a0e27] border-4 border-blue-400 p-4 transform -skew-x-3">
                        <div className="skew-x-3 text-center">
                          <div className="text-blue-400 text-xs font-bold uppercase mb-2">Your Team</div>
                          <div className="text-white font-mono text-xs mb-2">{formatAddress(wallet.publicKey?.toString() || '')}</div>
                          <div className="text-blue-400 text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                            {myScore}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* VS */}
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-[#f2a900] transform rotate-12 animate-pulse"></div>
                        <div className="relative bg-[#0a0e27] border-4 border-white px-6 py-3">
                          <div className="text-white text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                            VS
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Opponent Team */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-red-500 transform -skew-x-3"></div>
                      <div className="relative bg-[#0a0e27] border-4 border-red-400 p-4 transform -skew-x-3">
                        <div className="skew-x-3 text-center">
                          <div className="text-red-400 text-xs font-bold uppercase mb-2">Opponent</div>
                          <div className="text-white font-mono text-xs mb-2">0x742d...bEb</div>
                          <div className="text-red-400 text-4xl font-black" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                            {Math.floor(Math.random() * 200) + 250}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Record */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white transform -skew-x-3"></div>
                    <div className="relative bg-[#0a0e27] border-4 border-[#f2a900] p-4 transform -skew-x-3">
                      <div className="skew-x-3 flex items-center justify-between">
                        <div className="text-white font-bold text-sm uppercase">Record</div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <span className="text-green-500 font-black text-2xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                              3
                            </span>
                            <span className="text-green-500 text-xs font-bold">W</span>
                          </div>
                          <div className="text-white text-2xl">-</div>
                          <div className="flex items-center gap-2">
                            <span className="text-red-500 font-black text-2xl" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                              1
                            </span>
                            <span className="text-red-500 text-xs font-bold">L</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="mt-4 text-center">
                    <p className="text-gray-400 text-xs font-bold">
                      🏆 Winners advance every 3 days • Top performers win SOL prizes
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Basketball Court - Takes 2 columns */}
            <div className="lg:col-span-2">
              <BasketballCourt
                players={PLAYERS}
                playerStats={playerStats}
                selectedByPosition={selectedByPosition}
                onSelectPlayer={selectPlayer}
                usedSalary={usedSalary}
                salaryCap={SALARY_CAP}
              />
            </div>

            {/* Right Sidebar - Live Games, Weekly Matchup & Leaderboard */}
            <div className="space-y-6">
              <LiveGamesWidget />
              <WeeklyMatchup userAddress={wallet.publicKey?.toString() || ''} />
              
              {/* Leaderboard */}
              <div className="relative">
                <div className="absolute inset-0 bg-[#f2a900] transform -skew-x-3"></div>
                <div className="relative bg-[#0a0e27] border-4 border-white p-6 transform -skew-x-3">
                  <div className="skew-x-3">
                    <h3 className="text-white font-black text-2xl mb-4 uppercase tracking-wider" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                      🏆 Leaderboard
                    </h3>
                    
                    <div className="space-y-3">
                      {leaderboardData.slice(0, 5).map((entry, index) => (
                        <div key={entry.walletAddress} className={`flex items-center justify-between p-3 rounded-lg ${
                          index === 0 ? 'bg-[#f2a900] text-[#0a0e27]' : 
                          index === 1 ? 'bg-gray-300 text-gray-900' : 
                          index === 2 ? 'bg-orange-300 text-orange-900' : 
                          'bg-gray-700 text-white'
                        }`}>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                              index === 0 ? 'bg-[#0a0e27] text-[#f2a900]' : 
                              index === 1 ? 'bg-gray-900 text-gray-300' : 
                              index === 2 ? 'bg-orange-900 text-orange-300' : 
                              'bg-gray-900 text-gray-300'
                            }`}>
                              {index + 1}
            </div>
                            <div>
                              <div className="font-bold text-sm">
                                {formatAddress(entry.walletAddress)}
                              </div>
                              <div className="text-xs opacity-75">
                                {entry.wins}W - {entry.losses}L
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                              {entry.totalScore}
                            </div>
                            <div className="text-xs opacity-75">PTS</div>
                          </div>
                        </div>
                      ))}
          </div>
                    
                    <div className="mt-4 text-center">
                      <div className="text-white/60 text-xs">
                        Top 5 wallets by total fantasy points
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Daily Matchup Information */}
          {wallet.connected && userMatchup && userProfile && (
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
                  
                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="text-center">
                      <div className="text-white font-bold text-sm mb-2 uppercase tracking-wider">You</div>
                      <div className="bg-[#f2a900] text-[#0a0e27] px-4 py-2 rounded-lg font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        {userProfile.username}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {userProfile.wins}W - {userProfile.losses}L
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-white font-bold text-sm mb-2 uppercase tracking-wider">vs</div>
                      <div className="bg-white text-[#0a0e27] px-4 py-2 rounded-lg font-black text-lg" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                        {userMatchup.isBot ? userMatchup.opponent : formatAddress(userMatchup.opponentWallet)}
                      </div>
                      <div className="text-gray-400 text-xs mt-1">
                        {userMatchup.isBot ? 'Bot Opponent' : 'Random Player'}
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
                       'New opponent every 24 hours'}
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
                </div>
              </div>
            </div>
          )}

          {/* Lineup Deadline Warning */}
          {wallet.connected && currentTournament && timeUntilDeadline > 0 && (
            <div className="mb-8">
              <div className="bg-red-900/20 border-4 border-red-500 p-4 transform -skew-x-3">
                <div className="skew-x-3 text-center">
                  <div className="text-red-400 text-lg font-bold mb-2">⚠️ LINEUP DEADLINE</div>
                  <div className="text-white font-mono">
                    {Math.floor(timeUntilDeadline / (1000 * 60 * 60))}h {Math.floor((timeUntilDeadline % (1000 * 60 * 60)) / (1000 * 60))}m remaining
                  </div>
                  <div className="text-red-300 text-sm mt-2">
                    Submit your lineup before the deadline or you'll be replaced!
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Register Button */}
          <div className="mb-8 text-center">
            <button
              onClick={registerLineup}
              disabled={loading || selectedCount !== 5 || usedSalary > SALARY_CAP}
              className={`relative px-16 py-6 font-black text-3xl transform -skew-x-6 border-6 shadow-2xl uppercase tracking-wider transition-all ${
                loading || selectedCount !== 5 || usedSalary > SALARY_CAP
                  ? 'bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed'
                  : 'bg-[#f2a900] text-[#0a0e27] border-white hover:scale-105'
              }`}
              style={{ fontFamily: 'Bebas Neue, sans-serif' }}
            >
              <span className="skew-x-6 block">
                {loading ? '⏳ Registering...' : selectedCount === 5 && usedSalary <= SALARY_CAP ? '🚀 Register Lineup (0.1 SOL)' : '⚠️ Complete Your Lineup'}
              </span>
            </button>
          </div>

          {/* Leaderboard */}
          <div className="relative">
            <div className="absolute inset-0 bg-white transform skew-y-1"></div>
            <div className="relative bg-[#1a1f3a] border-6 border-[#f2a900] p-8 transform skew-y-1">
              <div className="-skew-y-1">
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-5xl">🏆</div>
                  <h2 className="text-5xl font-black text-white uppercase tracking-wider" style={{ 
                    fontFamily: 'Bebas Neue, sans-serif',
                    textShadow: '3px 3px 0px #f2a900'
                  }}>
                    Leaderboard
                  </h2>
                </div>
                
                {leaderboard.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-7xl mb-4">🎯</div>
                    <p className="text-gray-400 text-xl font-bold">No participants yet. Be the first!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {leaderboard.map((entry, i) => (
                      <div 
                        key={i} 
                        className="relative group"
                      >
                        <div className={`absolute inset-0 transform -skew-x-3 ${
                          i === 0 ? 'bg-yellow-400' :
                          i === 1 ? 'bg-gray-400' :
                          i === 2 ? 'bg-orange-400' :
                          'bg-[#f2a900]'
                        }`}></div>
                        <div className={`relative border-4 p-5 transform -skew-x-3 group-hover:skew-x-3 transition-transform ${
                          i === 0 ? 'bg-[#1a1f3a] border-yellow-400' :
                          i === 1 ? 'bg-[#1a1f3a] border-gray-400' :
                          i === 2 ? 'bg-[#1a1f3a] border-orange-400' :
                          'bg-[#0a0e27] border-white'
                        }`}>
                          <div className="flex justify-between items-center skew-x-3">
                            <div className="flex items-center gap-6">
                              <div className={`w-12 h-12 flex items-center justify-center text-2xl font-black border-4 ${
                                i === 0 ? 'bg-yellow-400 text-[#0a0e27] border-yellow-300' :
                                i === 1 ? 'bg-gray-400 text-white border-gray-300' :
                                i === 2 ? 'bg-orange-400 text-white border-orange-300' :
                                'bg-[#f2a900] text-[#0a0e27] border-[#ffc942]'
                              }`} style={{ fontFamily: 'Bebas Neue, sans-serif' }}>
                                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}
                              </div>
                              <span className="font-mono text-white font-bold text-lg">
                                {formatAddress(entry.address)}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-bold text-[#f2a900] uppercase tracking-wider mb-1">Score</div>
                              <span className="text-4xl font-black text-white" style={{ fontFamily: 'Bebas Neue, sans-serif' }}>{entry.score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}