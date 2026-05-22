export type StickerType = 'wings' | 'tears' | 'heart' | 'sparks' | 'hair' | 'skull' | 'guitar' | 'crown' | 'rose' | 'bandage' | 'star' | 'clover' | 'butterfly' | 'music' | 'diamond' | 'custom' | 'withered_rose' | 'chain' | 'dark_heart' | 'alien' | 'game' | 'web' | 'crystal' | 'planet' | 'blood' | 'cup' | 'arrow_heart';

export interface ShamateDestiny {
  nickname: string;
  soulAttribute: string;
  hairHeightFortune: string;
  colorDye: string;
  colorName: string;
  filterSaturate: number;
  stickerType: StickerType;
  destinyAnalysis: string;
  shamateSayings: string[];
  resonanceScore: number;
  titleText?: string;
  adageLeft?: string;
  adageRight?: string;
  aiPrompt?: string;
  aiPromptAlternative?: string;
  generatedImageUrl?: string;
}

export type AppStage = 'idle' | 'processing' | 'done';

export interface ClanMember {
  emoji: string;
  name: string;
  title: string;
  status: 'Online' | 'Offline' | 'Disconnected' | 'In Cyber Ritual';
}

export interface RitualLog {
  time: string;
  user: string;
  action: string;
  result?: string;
  isSystem?: boolean;
}
