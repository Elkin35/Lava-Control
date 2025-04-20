"use strict";
import mqtt from 'mqtt';

// Broker MQTT y credenciales
const mqttBrokerUrl = process.env.MQTT_BROKER_URL || 'mqtts://6de67707e2aa470b843876fd092a3e83.s1.eu.hivemq.cloud';
const mqttPort      = process.env.MQTT_PORT || 8883;
const mqttUsername  = process.env.MQTT_USER || 'Admin';
const mqttPassword  = process.env.MQTT_PASSWORD || 'Admin1234';

// Opciones para la conexión TLS con autenticación
const options = {
  port: mqttPort,
  username: mqttUsername,
  password: mqttPassword,
  rejectUnauthorized: false,
};

if (!globalThis.mqttClient) {
  globalThis.mqttClient = mqtt.connect(mqttBrokerUrl, options);
  globalThis.pending = new Map();
  globalThis.subscribed = false;

  globalThis.mqttClient.on('connect', () => {
    console.log('Conectado al broker MQTT');
    if (!globalThis.subscribed) {
      globalThis.mqttClient.subscribe('lavacontrol/confirm', err => {
        if (err) console.error('Error al suscribir:', err);
        else {
          globalThis.subscribed = true;
          console.log('Subscrito a lavacontrol/confirm');
        }
      });
    }
  });

  globalThis.mqttClient.on('message', (topic, message) => {
    console.log("Mensaje recibido en topic:", topic, "->", message.toString());
    if (topic !== 'lavacontrol/confirm') return;

    let payload;
    try {
      payload = JSON.parse(message.toString());
    } catch (e) {
      console.error('ACK JSON inválido:', message.toString());
      return;
    }

    const { id, ack } = payload;
    console.log("Procesando ACK. id:", id, "ack:", ack);
    const entry = globalThis.pending.get(id);
    if (!entry) {
      console.log(`ACK para id desconocido: ${id}`);
      return;
    }

    const { command, timeout, resolve } = entry;
    let expected = [];

    if (command.cmd.startsWith('TIMER_ON_')) {
      expected = ['ACK_TIMER_ON', 'ACK_TIMER_ON_ALREADY'];
    } else if (command.cmd.startsWith('TIMER_CHANGE_')) {
      expected = ['ACK_TIMER_CHANGED', 'ACK_TIMER_CHANGE_REJECTED'];
    } else if (command.cmd === 'ON') {
      expected = ['ACK_ON', 'ACK_ON_ALREADY'];
    } else if (command.cmd === 'OFF') {
      expected = ['ACK_OFF'];
    }

    if (expected.includes(ack)) {
      clearTimeout(timeout);
      globalThis.pending.delete(id);
      resolve({ id, ack });
    } else {
      console.log(`ACK inesperado para id ${id}: ${ack}`);
    }
  });
}

export const mqttClient = globalThis.mqttClient;
export const pendingCommands = globalThis.pending;