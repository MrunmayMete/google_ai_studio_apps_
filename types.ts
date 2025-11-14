export interface Video {
  id: string;
  src: string; // Path to the local video file
  title:string;
  channel: string;
  views: string;
  published: string;
  description: string;
  thumbnail: string;
  likes: number;
}

export interface ClickstreamEvent {
  timestamp: Date;
  type: string;
  target: string;
  details?: Record<string, any>;
}
