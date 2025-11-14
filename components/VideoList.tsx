import React from 'react';
import type { Video } from '../types';

interface VideoListProps {
  videos: Video[];
  currentVideoId: string;
  onSelectVideo: (video: Video) => void;
}

const VideoList: React.FC<VideoListProps> = ({ videos, currentVideoId, onSelectVideo }) => {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-lg font-bold px-2">Up Next</h3>
      {videos.map((video) => (
        <div
          key={video.id}
          onClick={() => onSelectVideo(video)}
          className={`flex items-start gap-3 cursor-pointer transition-colors p-2 rounded-lg ${
            video.id === currentVideoId
              ? 'bg-component-bg'
              : 'hover:bg-component-bg-hover'
          }`}
        >
          <div className="relative flex-shrink-0">
            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-40 aspect-video object-cover rounded-md "
            />
          </div>
          <div className="flex-grow">
            <h4 className="font-semibold text-sm line-clamp-2 text-text-primary leading-tight">
              {video.title}
            </h4>
            <p className="text-xs text-text-secondary mt-1">{video.channel}</p>
            <p className="text-xs text-text-secondary">{video.views} &bull; {video.published}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoList;