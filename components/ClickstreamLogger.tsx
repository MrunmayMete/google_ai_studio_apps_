
import React, { useRef, useEffect } from 'react';
import type { ClickstreamEvent } from '../types';

interface ClickstreamLoggerProps {
  events: ClickstreamEvent[];
}

const ClickstreamLogger: React.FC<ClickstreamLoggerProps> = ({ events }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [events]);

  return (
    <div className="bg-component-bg rounded-lg shadow-xl overflow-hidden">
      <div className="p-4 border-b border-border-color flex justify-between items-center">
        <h3 className="text-lg font-bold">Clickstream Event Log</h3>
        <span className="text-sm bg-accent-blue/20 text-accent-blue px-2 py-1 rounded-md">Events: {events.length}</span>
      </div>
      <div 
        ref={scrollContainerRef}
        className="h-64 p-4 font-mono text-xs text-text-secondary overflow-y-auto bg-black/20"
      >
        {events.map((event, index) => (
          <div key={index} className="mb-2 last:mb-0 border-b border-gray-800 pb-1">
            <p>
              <span className="text-green-400">
                {event.timestamp.toLocaleTimeString()}
              </span>
              <span className="text-cyan-400"> [{event.type}]</span>
              <span className="text-yellow-400"> -> {event.target}</span>
            </p>
            {event.details && (
              <p className="pl-4 text-gray-500">
                {JSON.stringify(event.details)}
              </p>
            )}
          </div>
        ))}
        {events.length === 0 && <p>No events logged yet. Interact with the player to see data.</p>}
      </div>
    </div>
  );
};

export default ClickstreamLogger;
