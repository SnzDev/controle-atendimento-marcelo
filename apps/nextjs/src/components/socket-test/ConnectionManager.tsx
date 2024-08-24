import React, { useEffect, useState } from 'react';
import { socket } from '~/lib/socket.io';
import { ConnectionState } from './ConnectionState';

export function ConnectionManager() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log('connected');
    }
    function onDisconnect() {
      setIsConnected(false);
      console.log('disconnected');
    }

    function onBotActions(data: unknown) {
      console.log(data);
    }

    socket.on('disconnect', onDisconnect);
    socket.on('bot-actions', onBotActions);
    socket.on('qr', onBotActions);

    socket.on('connect', onConnect);
    return () => {
      socket.off('disconnect', onDisconnect);
      socket.off('connect', onConnect);
      socket.off('bot-actions', onBotActions);
      socket.off('qr', onBotActions);
    }
  }, []);


  return (

    <div className="flex gap-2 items-center">
      <ConnectionState isConnected={isConnected} />

      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={connect}>Connect</button>
      <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 ml-4"
        onClick={disconnect}>Disconnect</button>
    </div>
  );
}