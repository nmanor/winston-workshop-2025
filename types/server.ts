export interface Server {
  id: number;
  name: string;
  url: string;
  status: 'online' | 'offline' | 'unknown';
  statusHistory: ('online' | 'offline')[];
  stability: number; // percentage of uptime from history
} 