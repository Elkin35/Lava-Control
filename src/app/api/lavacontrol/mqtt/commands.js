import { v4 as uuidv4 } from 'uuid';
import { mqttClient, pendingCommands } from './client';

const ACK_TIMEOUT = 1000;
const MAX_ATTEMPTS = 3;

function sendCommandWithAck(command, attempt, resolve, reject) {
  const { id } = command;
  if (attempt > MAX_ATTEMPTS) {
    pendingCommands.delete(id);
    return reject(new Error(`No se recibió ACK tras ${MAX_ATTEMPTS} intentos`));
  }

  mqttClient.publish('lavacontrol', JSON.stringify(command), err => {
    if (err) return reject(err);

    const timeout = setTimeout(() => {
      console.log(`Intento ${attempt} fallido para id ${id}. Reintentando...`);
      sendCommandWithAck(command, attempt + 1, resolve, reject);
    }, ACK_TIMEOUT);

    pendingCommands.set(id, { command, timeout, resolve, reject });
  });
}

// La función handleCommand ahora distingue entre TIMER_ON y CHANGE_TIMER.
export function handleCommand(cmd, seconds = null) {
  return new Promise((resolve, reject) => {
    const id = uuidv4();
    let fullCommand;
    if (seconds !== null) {
      if (cmd === "CHANGE_TIMER") {
        fullCommand = { id, cmd: `TIMER_CHANGE_${seconds}` };
      } else {
        fullCommand = { id, cmd: `TIMER_ON_${seconds}` };
      }
    } else {
      fullCommand = { id, cmd };
    }
    console.log("Enviando comando:", fullCommand);
    sendCommandWithAck(fullCommand, 1, resolve, reject);
  });
}
