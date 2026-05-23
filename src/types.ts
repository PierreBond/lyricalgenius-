/**
 * Shared Type Definitions for Lyric Genius
 */

export type Tab = 'home' | 'play' | 'ranks' | 'profile' | 'settings';

export interface Question {
  id: string;
  lyrics: string;
  choices: string[]; // 4 options
  answerIndex: number; // 0 for A, 1 for B, 2 for C, 3 for D
  category: string;
  song: string;
  artist: string;
  image: string; // hotlink background image
}

export interface ActivityItem {
  id: string;
  user: string;
  userAvatar: string;
  actionHTML: string; // custom markup or styling strings
  timeAgo: string;
  points?: number;
  hasAcceptButton?: boolean;
  challengeGenre?: string;
  isAchievement?: boolean;
  shareText?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  diamonds: number;
  isCurrentUser?: boolean;
  badge?: string; // e.g. "workspace_premium"
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  colorClass: string; // background color class
  unlocked: boolean;
}

export interface MatchHistoryItem {
  id: string;
  song: string;
  artist: string;
  xp: number;
  bgType: 'primary' | 'secondary' | 'tertiary';
}

export type ProPhase = 'plans' | 'verdict' | 'checkout' | 'success';

export interface UserStats {
  diamonds: number;
  xp: number;
  winRate: number;
  topGenre: string;
  globalRank: number;
  level: number;
  progressPercent: number; // e.g. 85 for 85% progress to next level
  isPro: boolean;
}
