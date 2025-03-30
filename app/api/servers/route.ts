import { NextResponse } from 'next/server';
import type { Server } from '@/types/server';
import { revalidatePath } from 'next/cache';

// In-memory storage (replace with database in production)
let servers: Server[] = [
  { id: 1, name: 'Production Server', url: 'https://prod-server.com', status: 'unknown' },
  { id: 2, name: 'Development Server', url: 'https://dev-server.com', status: 'unknown' },
];

export async function GET() {
  return NextResponse.json(servers);
}

export async function POST(request: Request) {
  const body = await request.json();
  
  const newServer: Server = {
    id: servers.length + 1,
    name: body.name,
    url: body.url,
    status: 'unknown'
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

// Update server statuses periodically
setInterval(async () => {
  servers = await Promise.all(
    servers.map(async (server) => ({
      ...server,
      status: await checkServerStatus(server.url)
    }))
  );
}, 60000); 