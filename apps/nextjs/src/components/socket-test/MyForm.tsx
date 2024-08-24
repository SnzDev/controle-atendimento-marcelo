import React, { useState } from 'react';
import { socket } from '~/lib/socket.io';

export function MyForm() {
  const [value, setValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    socket.timeout(3000).emit('create-something', value, () => {
      setIsLoading(false);
    });
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col space-y-4 w-[300px] mt-10">
      <input
        onChange={e => setValue(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        type="submit"
        disabled={isLoading}
        className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Submit
      </button>
    </form>
  );
}