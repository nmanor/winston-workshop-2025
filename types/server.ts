export interface Server {
  id: number;
  name: string;
  url: string;
  status: 'online' | 'offline' | 'unknown';
} 