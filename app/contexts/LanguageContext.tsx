'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'zh';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Header
    'header.title': 'FANTASY LEAGUE',
    'header.powered': '⛓️ POWERED BY BNB CHAIN',
    'header.connect': 'Connect Wallet',
    'header.cap': '💰 Cap: 20',
    'header.weekly': '⚔️ Weekly',
    'header.live': '📊 Live',
    
    // Landing Page
    'landing.title': 'NBA FANTASY LEAGUE',
    'landing.subtitle': '⛓️ Build • Compete • Win on BNB Chain',
    'landing.description': 'Draft your ultimate NBA lineup with a 20-token salary cap. Battle weekly matchups with live scoring. Win BNB prizes.',
    'landing.feature1.title': 'Court Selection',
    'landing.feature1.desc': 'Draft players on an interactive NBA court. Visual position-based team building.',
    'landing.feature2.title': 'Weekly Battles',
    'landing.feature2.desc': 'Face opponents every week. Head-to-head fantasy competition.',
    'landing.feature3.title': 'BNB Prizes',
    'landing.feature3.desc': 'Win real BNB. Powered by blockchain. Transparent prize pools.',
    'landing.cta': 'Enter The Arena',
    
    // Dashboard
    'dashboard.prizePool': 'Prize Pool',
    'dashboard.yourScore': 'Your Score',
    'dashboard.roster': 'Roster',
    'dashboard.salaryCap': 'Salary Cap',
    'dashboard.live': 'LIVE',
    'dashboard.you': 'YOU',
    'dashboard.full': 'FULL',
    'dashboard.draft': 'DRAFT',
    'dashboard.ok': 'OK',
    'dashboard.over': 'OVER',
    'dashboard.max': 'MAX',
    
    // Court
    'court.title': '🏀 Build Your Lineup',
    'court.progress': 'Team Progress',
    'court.selectPosition': 'Select Your',
    'court.available': 'players available',
    'court.salary': 'Salary',
    'court.hidePlayer': '▼ Hide Players',
    'court.showPlayers': '▶ Show Players',
    'court.clickBelow': 'Click Below',
    'court.empty': 'Empty',
    'court.locked': 'LOCKED',
    
    // Positions
    'pos.pg': 'Point Guard',
    'pos.sg': 'Shooting Guard',
    'pos.sf': 'Small Forward',
    'pos.pf': 'Power Forward',
    'pos.c': 'Center',
    
    // Stats
    'stats.pts': 'PTS',
    'stats.reb': 'REB',
    'stats.ast': 'AST',
    'stats.fantasyPts': 'Fantasy PTS',
    
    // Tips
    'tips.autoAdvance': 'Click position buttons to switch • Auto-advances after selection',
    'tips.salaryCap': 'Click players to select • Watch your salary cap',
    
    // Register
    'register.registering': '⏳ Registering...',
    'register.ready': '🚀 Register Lineup (0.1 BNB)',
    'register.complete': '⚠️ Complete Your Lineup',
    
    // Leaderboard
    'leaderboard.title': 'Leaderboard',
    'leaderboard.noPlayers': 'No participants yet. Be the first!',
    'leaderboard.score': 'Score',
    
    // Matchmaking
    'matchmaking.title': '⚔️ 3-Day Tournament',
    'matchmaking.currentRound': 'Current Round',
    'matchmaking.nextMatch': 'Next Match In',
    'matchmaking.opponent': 'Your Opponent',
    'matchmaking.noOpponent': 'Waiting for opponent...',
    'matchmaking.yourTeam': 'Your Team',
    'matchmaking.vsTeam': 'VS Team',
    'matchmaking.record': 'Record',
    'matchmaking.wins': 'W',
    'matchmaking.losses': 'L',
  },
  zh: {
    // Header
    'header.title': '梦幻联赛',
    'header.powered': '⛓️ 由币安链提供支持',
    'header.connect': '连接钱包',
    'header.cap': '💰 上限: 20',
    'header.weekly': '⚔️ 每周',
    'header.live': '📊 实时',
    
    // Landing Page
    'landing.title': 'NBA 梦幻联赛',
    'landing.subtitle': '⛓️ 构建 • 竞争 • 赢得币安链',
    'landing.description': '用20代币工资帽选出你的终极NBA阵容。参加每周比赛，实时评分。赢取BNB奖金。',
    'landing.feature1.title': '球场选择',
    'landing.feature1.desc': '在互动NBA球场上选秀球员。基于位置的可视化团队建设。',
    'landing.feature2.title': '每周对战',
    'landing.feature2.desc': '每周面对对手。一对一的梦幻竞争。',
    'landing.feature3.title': 'BNB奖金',
    'landing.feature3.desc': '赢取真实BNB。区块链支持。透明奖金池。',
    'landing.cta': '进入竞技场',
    
    // Dashboard
    'dashboard.prizePool': '奖金池',
    'dashboard.yourScore': '你的分数',
    'dashboard.roster': '名单',
    'dashboard.salaryCap': '工资帽',
    'dashboard.live': '实时',
    'dashboard.you': '你',
    'dashboard.full': '已满',
    'dashboard.draft': '选秀',
    'dashboard.ok': '正常',
    'dashboard.over': '超出',
    'dashboard.max': '最大',
    
    // Court
    'court.title': '🏀 组建你的阵容',
    'court.progress': '团队进度',
    'court.selectPosition': '选择你的',
    'court.available': '名可用球员',
    'court.salary': '薪水',
    'court.hidePlayer': '▼ 隐藏球员',
    'court.showPlayers': '▶ 显示球员',
    'court.clickBelow': '点击下方',
    'court.empty': '空',
    'court.locked': '已锁定',
    
    // Positions
    'pos.pg': '控球后卫',
    'pos.sg': '得分后卫',
    'pos.sf': '小前锋',
    'pos.pf': '大前锋',
    'pos.c': '中锋',
    
    // Stats
    'stats.pts': '得分',
    'stats.reb': '篮板',
    'stats.ast': '助攻',
    'stats.fantasyPts': '梦幻得分',
    
    // Tips
    'tips.autoAdvance': '点击位置按钮切换 • 选择后自动前进',
    'tips.salaryCap': '点击球员选择 • 注意你的工资帽',
    
    // Register
    'register.registering': '⏳ 注册中...',
    'register.ready': '🚀 注册阵容 (0.1 BNB)',
    'register.complete': '⚠️ 完成你的阵容',
    
    // Leaderboard
    'leaderboard.title': '排行榜',
    'leaderboard.noPlayers': '还没有参与者。成为第一个！',
    'leaderboard.score': '分数',
    
    // Matchmaking
    'matchmaking.title': '⚔️ 三天锦标赛',
    'matchmaking.currentRound': '当前回合',
    'matchmaking.nextMatch': '下一场比赛',
    'matchmaking.opponent': '你的对手',
    'matchmaking.noOpponent': '等待对手...',
    'matchmaking.yourTeam': '你的队伍',
    'matchmaking.vsTeam': '对战队伍',
    'matchmaking.record': '战绩',
    'matchmaking.wins': '胜',
    'matchmaking.losses': '负',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}




