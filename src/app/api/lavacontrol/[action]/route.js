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
    cmd = 'TIMER_ON';
  } else if (action === 'change-timer') {
    const sec = url.searchParams.get('seconds');
    seconds = parseInt(sec, 10);
    if (isNaN(seconds) || seconds <= 0) {
      return new Response('Parámetro "seconds" inválido', { status: 400 });
    }
    // Utiliza el comando CHANGE_TIMER para reiniciar el timer solo si el nuevo tiempo es mayor al restante
    cmd = 'CHANGE_TIMER';
  } else {
    return new Response('Acción no reconocida', { status: 404 });
  }

  try {
    const { id, ack } = await handleCommand(cmd, seconds);
    
    // Si el cambio de timer fue rechazado, informamos al cliente con un mensaje específico
    if (ack === 'ACK_TIMER_CHANGE_REJECTED') {
      return NextResponse.json({ 
        id, 
        ack,
        message: 'Cambio de timer rechazado: el nuevo tiempo debe ser mayor al tiempo restante actual'
      }, { status: 200 });
    }
    
    return NextResponse.json({ id, ack });
  } catch (error) {
    console.error('Error en handleCommand:', error);
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}