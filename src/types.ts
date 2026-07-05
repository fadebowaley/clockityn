export interface QuoteComment {
  id: string;
  username: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface SyncHighlight {
  time: number; // in seconds
  text: string; // text highlight for this time
}

export interface SermonQuote {
  id: string;
  quote: string;
  scripture: string;
  scriptureVersion: string; // e.g. "ESV", "NIV", "NKJV"
  speaker: string;
  church: string;
  topic: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  savesCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  insight?: string;
  audioUrl?: string; // audio source path/URL
  audioDuration?: number; // total duration in seconds
  audioTimeline?: SyncHighlight[]; // synchronized text highlights
  background: string; // solid color, gradient values, or image URL
  bgType: 'solid' | 'gradient' | 'image' | 'illustration';
  textColor: string; // CSS color or Tailwind class
  templateId: 'minimal' | 'elegant' | 'modern' | 'dark' | 'church' | 'conference' | 'worship' | 'youth';
  createdAt: string;
  user: {
    name: string;
    username: string;
    avatar: string;
    churchAffiliation?: string;
  };
}

export interface Collection {
  id: string;
  name: string;
  description?: string;
  icon: string; // lucide icon name
  quoteIds: string[];
  coverGradient: string;
}

export interface UserProfile {
  name: string;
  username: string;
  avatar: string;
  bio: string;
  churchAffiliation?: string;
  followersCount: number;
  followingCount: number;
  quotesCount: number;
  savedCollections: Collection[];
}

export type ActiveTab = 'home' | 'search' | 'create' | 'collections' | 'profile';
