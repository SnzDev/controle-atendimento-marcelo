import React, { useEffect } from 'react';

type EventsProps = {
  events: string[];
}

export function Events({ events }: EventsProps) {

  return (
    <ul className="list-disc list-inside space-y-2">
      {
        events.map((event, index) =>
          <li key={index} className="p-2 bg-blue-100 rounded-md">{event}</li>
        )
      }
    </ul>
  );
}