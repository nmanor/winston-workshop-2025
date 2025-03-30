import { NextResponse } from 'next/server';
import type { Server } from '@/types/server';
import { revalidatePath } from 'next/cache';

// In-memory storage (replace with database in production)
let servers: Server[] = [
  { 
    id: 1, 
    name: 'Production Server', 
    url: 'https://prod-server.com', 
    status: 'unknown',
    statusHistory: [],
    stability: 100
  },
  { 
    id: 2, 
    name: 'Development Server', 
    url: 'https://dev-server.com', 
    status: 'unknown',
    statusHistory: [],
    stability: 100
  },
];

const MAX_HISTORY = 5;

export async function GET() {
  return NextResponse.json(servers);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newServer: Server = {
    id: servers.length + 1,
    name: body.name,
    url: body.url,
    status: 'unknown',
    statusHistory: [],
    stability: 100
  };
  
  servers.push(newServer);
  return NextResponse.json(newServer);
}

// Helper function to check server status
async function checkServerStatus(url: string): Promise<'online' | 'offline'> {
  try {
    const response = await fetch(url);
    return response.ok ? 'online' : 'offline';
  } catch (error) {
    return 'offline';
  }
}

function calculateStability(history: ('online' | 'offline')[]): number {
  if (history.length === 0) return 100;
  const onlineCount = history.filter(status => status === 'online').length;
  return Math.round((onlineCount / history.length) * 100);
}

// Update server statuses periodically
setInterval(async () => {
  servers = await Promise.all(
    servers.map(async (server) => {
      const currentStatus = await checkServerStatus(server.url);
      const newHistory = [...server.statusHistory, currentStatus].slice(-MAX_HISTORY);
      return {
        ...server,
        status: currentStatus,
        statusHistory: newHistory,
        stability: calculateStability(newHistory)
      };
    })
  );
}, 10 * 1000); 