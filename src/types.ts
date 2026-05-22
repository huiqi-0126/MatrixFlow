export interface Device {
  id: string;
  name: string;
  ip: string;
  region: string;
  platform: 'TikTok' | 'Instagram' | 'YouTube';
  username: string;
  avatarColor: string;
  accountStatus: 'active' | 'dormant' | 'banned';
  status: 'idle' | 'warmup' | 'posting' | 'analyzing' | 'offline';
  niche: string;
  followerCount: number;
  videoCount: number;
  totalViews: number;
}

export interface Persona {
  id: string; // matches device.id
  avatarUrl: string; // emoji or graphic key
  interests: string[];
  race: string;
  gender: string;
  values: string;
  niche: string;
  bio: string;
  tone: string;
}

export interface WarmupAction {
  type: 'search' | 'scroll' | 'like' | 'comment' | 'profile' | 'bookmark' | 'share';
  param: string;
  duration: number; // seconds
}

export interface WarmupPlan {
  day: number;
  title: string;
  actions: WarmupAction[];
}

export interface VideoAsset {
  id: string;
  title: string;
  niche?: string;
  duration: number; // in seconds
  thumbnailColor: string;
  tagline?: string;
  tags: string[];
  script: string;
  size?: string;
  format?: string;
  status?: string;
  [key: string]: any;
}

export interface DailyPlan {
  day: number;
  topic: string;
  direction: string;
  scriptPrompt: string;
  suggestedTags: string[];
}

export interface ScheduleTask {
  id: string;
  deviceId: string;
  videoAssetId: string;
  description: string;
  tags: string[];
  scheduleTime: string; // e.g. "05/21 11:00"
  status: 'pending' | 'posting' | 'success' | 'failed';
  errorLog?: string;
}

export interface VideoStatistic {
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  fypFraction: number; // e.g., 0.85 (85%)
  retentionRate: number; // e.g., 0.45
}

export interface CreatorStats {
  dailyViews: { date: string; value: number }[];
  dailyFollowers: { date: string; value: number }[];
  trafficSources: { source: string; percentage: number }[];
  topVideos: VideoStatistic[];
}
