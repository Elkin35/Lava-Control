import { NextResponse } from 'next/server';
import { handleCommand } from '../mqtt/commands';

export const runtime = 'nodejs';

export async function GET(request, { params }) {
  const { action } = await params;
  const url = new URL(request.url);

  let cmd = null;
  let seconds = null;

  if (action === 'on') {
    cmd = 'ON';
  } else if (action === 'off') {
    cmd = 'OFF';
  } else if (action === 'on-time') {
    const sec = url.searchParams.get('seconds');
    seconds = parseInt(sec, 10);
    if (isNaN(seconds) || seconds <= 0) {
      return new Response('Parámetro "seconds" inválido', { status: 400 });
    }
  } else {
    return new Response('Acción no reconocida', { status: 404 });
  }

  try {
    const { id, ack } = await handleCommand(cmd, seconds);
    return NextResponse.json({ id, ack });
  } catch (error) {
    console.error('Error en handleCommand:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
