import React from 'react';
import { socket } from '~/utils/socket';

export function ConnectionManager() {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div className="flex gap-2 items-center">
      <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        onClick={connect}>Connect</button>
      <button className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 ml-4"
        onClick={disconnect}>Disconnect</button>
    </div>
  );
}