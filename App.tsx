import React, { useState, useCallback, useEffect } from 'react';
import { VIDEO_DATA } from './constants';
import type { Video, ClickstreamEvent } from './types';
import VideoPlayer from './components/VideoPlayer';

const App: React.FC = () => {
  const [videoData, setVideoData] = useState<Video>(VIDEO_DATA);
  const [clickstreamEvents, setClickstreamEvents] = useState<ClickstreamEvent[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const logEvent = useCallback((type: string, target: string, details?: Record<string, any>) => {
    const newEvent: ClickstreamEvent = {
      timestamp: new Date(),
      type,
      target,
      details,
    };
    setClickstreamEvents(prevEvents => [...prevEvents, newEvent]);
  }, []);
  
  useEffect(() => {
    logEvent('app_load', 'application_root');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setVideoUrl(newUrl);
      setVideoData(prevData => ({
        ...prevData,
        src: newUrl,
        title: file.name,
      }));
      logEvent('video_select', 'file_input', { fileName: file.name, fileType: file.type });
    }
  };

  const handleDownloadCSV = () => {
    logEvent('download_csv', 'download_button');
    if (clickstreamEvents.length === 0) {
      alert("No events to download.");
      return;
    }

    const escapeCSV = (field: any): string => {
      if (field === null || field === undefined) {
        return '';
      }
      let str = String(field);
      if (str.search(/("|,|\n)/g) >= 0) {
        str = '"' + str.replace(/"/g, '""') + '"';
      }
      return str;
    };

    const headers = ['timestamp', 'type', 'target', 'details'];
    const csvContent = [
      headers.join(','),
      ...clickstreamEvents.map(event => {
        const row = [
          event.timestamp.toISOString(),
          event.type,
          event.target,
          event.details ? JSON.stringify(event.details) : ''
        ];
        return row.map(escapeCSV).join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'clickstream_log.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-brand-bg text-text-primary font-sans">
      <header className="p-4 bg-component-bg border-b border-border-color shadow-lg flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl md:text-2xl font-bold">Local Video Player</h1>
        <button
          onClick={handleDownloadCSV}
          className="bg-accent-blue text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
          aria-label="Download clickstream event log as CSV"
        >
          Download Event Log
        </button>
      </header>
      <main className="container mx-auto p-4 lg:p-6 flex justify-center">
        <div className="w-full max-w-5xl">
          {videoUrl ? (
            <VideoPlayer video={videoData} logEvent={logEvent} />
          ) : (
            <div className="aspect-video bg-component-bg rounded-xl flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-border-color">
              <h2 className="text-2xl font-bold mb-4">Select Your Video File</h2>
              <p className="text-text-secondary mb-6">Choose a video from your computer to start watching.</p>
              <label className="bg-accent-blue text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors cursor-pointer shadow-lg">
                <span>Upload Video</span>
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  aria-label="Upload a video file"
                />
              </label>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
