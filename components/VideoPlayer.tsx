import React, { useState, useRef, useEffect, useCallback } from 'react';
import type { Video } from '../types';

interface VideoPlayerProps {
  video: Video;
  logEvent: (type: string, target: string, details?: Record<string, any>) => void;
}

// Icons
const PlayIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>);
const PauseIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>);
const VolumeMuteIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5zm11.5 0v6a2.5 2.5 0 0 1-5 0V9h5z" clipRule="evenodd" fillRule="evenodd"/></svg>);
const VolumeLowIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 9v6h4l5 5V4L9 9H5zm11.5 3c0-1.28-.8-2.37-1.9-2.72v5.44c1.1-.35 1.9-1.44 1.9-2.72z"/></svg>);
const VolumeHighIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>);
const FullscreenEnterIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>);
const FullscreenExitIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/></svg>);
const PipEnterIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z"/></svg>);
const SettingsIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12-.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49.42l.38-2.65c.61-.25 1.17-.59-1.69-.98l2.49 1c.23.09.49 0 .61.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z"/></svg>);
const ThumbsUpIcon = ({ className="", filled=false }) => ( filled ? <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21.3,10.211a2.083,2.083,0,0,0-1.854-1.211H14.8V3.8a1.8,1.8,0,0,0-3.6,0V5.773L8.8,11.559A2,2,0,0,0,7,12.973V20a2,2,0,0,0,2,2h8.5a2.193,2.193,0,0,0,2.12-1.609l1.62-7.183A2.1,2.1,0,0,0,21.3,10.211ZM7,20H4a1,1,0,0,1-1-1V13a1,1,0,0,1,1-1H7Z"/></svg> : <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M15.8,7.9a1.8,1.8,0,0,0-1.8-1.8h-.6V3.8a1.8,1.8,0,0,0-3.6,0V9.752L8,15.238V20a2,2,0,0,0,2,2h8.5a2.193,2.193,0,0,0,2.12-1.609l1.62-7.183A2.1,2.1,0,0,0,20.3,10.21a2.081,2.081,0,0,0-1.93-1.1h-3.37ZM4,12H7a1,1,0,0,1,1,1v6a1,1,0,0,1-1,1H4a1,1,0,0,1-1-1V13A1,1,0,0,1,4,12Z"/></svg>);
const ThumbsDownIcon = ({ className="", filled=false }) => ( filled ? <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19,2H10.5a2.193,2.193,0,0,0-2.12,1.609L6.76,10.791A2.1,2.1,0,0,0,8.7,13.789H13.2V19.2a1.8,1.8,0,0,0,3.6,0V17.227l2.4-5.786A2,2,0,0,0,17,8.027V4A2,2,0,0,0,15,2H9a2,2,0,0,0-2,2v.973ZM3,4H6A1,1,0,0,1,7,5V11a1,1,0,0,1-1,1H3Z"/></svg> : <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M8.2,16.1a1.8,1.8,0,0,0,1.8,1.8h.6V20.2a1.8,1.8,0,0,0,3.6,0V14.248L16,8.762V4a2,2,0,0,0-2-2H5.5a2.193,2.193,0,0,0-2.12,1.609l-1.62,7.183A2.1,2.1,0,0,0,3.7,13.79a2.081,2.081,0,0,0,1.93,1.1h3.37ZM20,12h-3a1,1,0,0,1-1-1V5a1,1,0,0,1,1-1h3a1,1,0,0,1,1,1v6A1,1,0,0,1,20,12Z"/></svg>);
const FrameBackIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18V6l8.5 6L6 18zm6.5-6L18 6v12l-5.5-6z" transform="scale(-1, 1) translate(-24, 0)"/></svg>);
const FrameForwardIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm8.5-6L18 6v12l-3.5-6z"/></svg>);
const BookmarkIcon = () => (<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>);


const formatTime = (timeInSeconds: number) => {
  if (isNaN(timeInSeconds) || timeInSeconds < 0) return '00:00';
  const date = new Date(0);
  date.setSeconds(timeInSeconds);
  const timeString = date.toISOString().substr(11, 8);
  return timeString.startsWith('00:') ? timeString.substr(3) : timeString;
};

const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 2];
const THUMBNAIL_INTERVAL_S = 5;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, logEvent }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  
  const [likes, setLikes] = useState(video.likes);
  const [views, setViews] = useState(parseInt(video.views.replace(/,/g, ''), 10) || 0);
  const [likeStatus, setLikeStatus] = useState<'liked' | 'disliked' | 'none'>('none');

  const [thumbnails, setThumbnails] = useState<string[]>([]);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewPosition, setPreviewPosition] = useState(0);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTime, setPreviewTime] = useState(0);
  const [bookmarks, setBookmarks] = useState<number[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const seekBarRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);

  const generateThumbnails = useCallback(async (videoSrc: string, videoDuration: number) => {
    if (!videoSrc || thumbnails.length > 0) return;
    
    logEvent('thumbnail_generation_start', 'video_player');
    const tempVideo = document.createElement('video');
    tempVideo.src = videoSrc;
    tempVideo.crossOrigin = "anonymous";
    tempVideo.muted = true;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    const generatedThumbnails: string[] = [];
    
    const onLoadedMetadata = async () => {
        tempVideo.removeEventListener('loadedmetadata', onLoadedMetadata);
        canvas.width = tempVideo.videoWidth / 4;
        canvas.height = tempVideo.videoHeight / 4;
        if (!context) return;
        
        for (let time = 0; time < videoDuration; time += THUMBNAIL_INTERVAL_S) {
            tempVideo.currentTime = time;
            await new Promise(resolve => {
                const onSeeked = () => {
                    tempVideo.removeEventListener('seeked', onSeeked);
                    resolve(true);
                };
                tempVideo.addEventListener('seeked', onSeeked);
            });
            context.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
            generatedThumbnails.push(canvas.toDataURL('image/jpeg', 0.7));
        }
        setThumbnails(generatedThumbnails);
        logEvent('thumbnail_generation_complete', 'video_player', { count: generatedThumbnails.length });
    };

    tempVideo.addEventListener('loadedmetadata', onLoadedMetadata);
}, [thumbnails.length, logEvent]);
  
  useEffect(() => {
    const videoEl = videoRef.current;
    if (videoEl) {
        const handleMetadata = () => {
            if (videoEl.duration && videoEl.duration !== Infinity) {
                generateThumbnails(videoEl.src, videoEl.duration);
            }
        };
        videoEl.addEventListener('loadeddata', handleMetadata);
        return () => videoEl.removeEventListener('loadeddata', handleMetadata);
    }
  }, [generateThumbnails, video.src]);
  
  useEffect(() => {
    try {
        const storedBookmarks = localStorage.getItem(`bookmarks_${video.id}`);
        if (storedBookmarks) {
            setBookmarks(JSON.parse(storedBookmarks));
        }
    } catch (error) {
        console.error("Failed to load bookmarks from localStorage", error);
    }
  }, [video.id]);

  useEffect(() => {
      try {
          localStorage.setItem(`bookmarks_${video.id}`, JSON.stringify(bookmarks));
      } catch (error) {
          console.error("Failed to save bookmarks to localStorage", error);
      }
  }, [bookmarks, video.id]);

  useEffect(() => {
    const timer = setTimeout(() => {
        setViews(v => v + 1);
        logEvent('video_view', 'video_player');
    }, 2000);
    return () => clearTimeout(timer);
  }, [video.id, logEvent]);

  const togglePlayPause = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        logEvent('video_play', 'play_button', { currentTime: videoRef.current.currentTime });
      } else {
        videoRef.current.pause();
        logEvent('video_pause', 'pause_button', { currentTime: videoRef.current.currentTime });
      }
    }
  }, [logEvent]);

  useEffect(() => {
    const playerEl = playerContainerRef.current;
    if (!playerEl) return;

    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.target as HTMLElement).tagName === 'INPUT') return;
        
        switch (e.key) {
            case ' ':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                if (videoRef.current) {
                    const newTime = Math.max(0, videoRef.current.currentTime - 5);
                    videoRef.current.currentTime = newTime;
                    logEvent('video_seek', 'keyboard_shortcut_left', { seekTo: newTime });
                }
                break;
            case 'ArrowRight':
                e.preventDefault();
                if (videoRef.current) {
                    const newTime = Math.min(duration, videoRef.current.currentTime + 5);
                    videoRef.current.currentTime = newTime;
                    logEvent('video_seek', 'keyboard_shortcut_right', { seekTo: newTime });
                }
                break;
            case 'ArrowUp':
                e.preventDefault();
                if (videoRef.current) {
                    const newVolume = Math.min(1, volume + 0.05);
                    videoRef.current.volume = newVolume;
                    setVolume(newVolume);
                    setIsMuted(newVolume === 0);
                    logEvent('volume_change', 'keyboard_shortcut_up', { volume: newVolume });
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                if (videoRef.current) {
                    const newVolume = Math.max(0, volume - 0.05);
                    videoRef.current.volume = newVolume;
                    setVolume(newVolume);
                    setIsMuted(newVolume === 0);
                    logEvent('volume_change', 'keyboard_shortcut_down', { volume: newVolume });
                }
                break;
        }
    };
    
    playerEl.setAttribute('tabindex', '0');
    playerEl.addEventListener('keydown', handleKeyDown);
    return () => {
        playerEl.removeEventListener('keydown', handleKeyDown);
    };
}, [togglePlayPause, duration, logEvent, volume]);
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => {
    const newVolume = parseFloat((e.target as HTMLInputElement).value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if(videoRef.current) videoRef.current.volume = newVolume;
    logEvent('volume_change', 'volume_slider', { volume: newVolume });
  };
  
  const toggleMute = () => {
    if(videoRef.current) {
      const newMuted = !isMuted;
      setIsMuted(newMuted);
      if (newMuted) {
          setVolume(0);
          videoRef.current.volume = 0;
      } else {
          const prevVolume = videoRef.current.volume > 0.01 ? volume : 0.5;
          setVolume(prevVolume);
          videoRef.current.volume = prevVolume;
      }
      logEvent('toggle_mute', 'volume_button', { muted: newMuted });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement> | React.FormEvent<HTMLInputElement>) => {
    if(videoRef.current) {
      const newTime = parseFloat((e.target as HTMLInputElement).value);
      videoRef.current.currentTime = newTime;
      setProgress(newTime);
      logEvent('video_seek', 'progress_bar', { seekTo: newTime });
    }
  };
  
  const handlePlaybackRateChange = (rate: number) => {
    if(videoRef.current) {
        videoRef.current.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSettings(false);
        logEvent('playback_rate_change', 'settings_menu', { rate });
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen();
      logEvent('enter_fullscreen', 'fullscreen_button');
    } else {
      document.exitFullscreen();
      logEvent('exit_fullscreen', 'fullscreen_button');
    }
  };
  
  const togglePip = async () => {
    if(!videoRef.current) return;
    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      logEvent('exit_pip', 'pip_button');
    } else {
      await videoRef.current.requestPictureInPicture();
      logEvent('enter_pip', 'pip_button');
    }
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if(isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 5000);
  };
  
  const handleLike = () => {
    logEvent('video_like', 'like_button', { previousStatus: likeStatus });
    if (likeStatus === 'liked') {
      setLikeStatus('none');
      setLikes(prev => prev - 1);
    } else {
      if (likeStatus !== 'disliked') {
        setLikes(prev => prev + 1);
      }
      setLikeStatus('liked');
    }
  };

  const handleDislike = () => {
    logEvent('video_dislike', 'dislike_button', { previousStatus: likeStatus });
    if (likeStatus === 'disliked') {
      setLikeStatus('none');
    } else {
      if (likeStatus === 'liked') {
        setLikes(prev => prev - 1);
      }
      setLikeStatus('disliked');
    }
  };
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updatePlayingStatus = () => setIsPlaying(!video.paused);
    const updateTime = () => setProgress(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);

    video.addEventListener('play', updatePlayingStatus);
    video.addEventListener('pause', updatePlayingStatus);
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      video.removeEventListener('play', updatePlayingStatus);
      video.removeEventListener('pause', updatePlayingStatus);
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);
  
  const handleMouseMoveOnSeekBar = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!seekBarRef.current || thumbnails.length === 0 || duration === 0) return;
    const rect = seekBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const hoverTime = (x / rect.width) * duration;
    setPreviewTime(hoverTime);
    
    const clampedX = Math.max(0, Math.min(x, rect.width));
    setPreviewPosition(clampedX);

    const thumbnailIndex = Math.min(Math.floor(hoverTime / THUMBNAIL_INTERVAL_S), thumbnails.length - 1);
    if (thumbnails[thumbnailIndex]) {
        setPreviewImage(thumbnails[thumbnailIndex]);
        setIsPreviewing(true);
    }
  };

  const handleMouseLeaveOnSeekBar = () => {
    setIsPreviewing(false);
  };

  const handleFrameSeek = (direction: 'forward' | 'backward') => {
    if (videoRef.current) {
        if(isPlaying) videoRef.current.pause();
        // Assuming 30fps for frame duration
        const frameDuration = 1 / 30;
        const newTime = videoRef.current.currentTime + (direction === 'forward' ? frameDuration : -frameDuration);
        videoRef.current.currentTime = Math.max(0, Math.min(duration, newTime));
        const eventType = direction === 'forward' ? 'frame_seek_forward' : 'frame_seek_backward';
        logEvent(eventType, 'frame_seek_button');
    }
  };
  
  const handleAddBookmark = () => {
      if (videoRef.current) {
          const currentTime = videoRef.current.currentTime;
          if (!bookmarks.includes(currentTime)) {
              setBookmarks(prev => [...prev, currentTime].sort((a,b) => a-b));
              logEvent('add_bookmark', 'bookmark_button', { timestamp: currentTime });
          }
      }
  };

  const VolumeIcon = isMuted || volume === 0 ? VolumeMuteIcon : volume < 0.5 ? VolumeLowIcon : VolumeHighIcon;
  
  if (!video) return null;

  return (
    <div className="flex flex-col">
      <div 
        ref={playerContainerRef}
        className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-xl outline-none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
          if (isPlaying) { 
              setShowControls(false); 
              setShowSettings(false);
          }
        }}
      >
        <video
          ref={videoRef}
          src={video.src}
          className="w-full h-full"
          onClick={togglePlayPause}
        ></video>
        
        <div className={`absolute inset-0 bg-black bg-opacity-30 transition-opacity duration-300 ${showControls || !isPlaying ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
            <div className={`absolute inset-0 flex items-center justify-center pointer-events-auto transition-opacity ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}>
                <button onClick={togglePlayPause} className="text-white bg-black bg-opacity-50 p-4 rounded-full text-5xl transform transition-transform hover:scale-110">
                    <span className="w-14 h-14 block">{isPlaying ? <PauseIcon/> : <PlayIcon/>}</span>
                </button>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-3 text-white pointer-events-auto">
              <div
                ref={seekBarRef}
                className="relative h-5 -top-2 group/seekbar cursor-pointer"
                onMouseMove={handleMouseMoveOnSeekBar}
                onMouseLeave={handleMouseLeaveOnSeekBar}
                onClick={(e) => handleSeek(e as any)} // Allow clicking to seek
              >
                {isPreviewing && previewImage && (
                  <div
                    className="absolute bottom-full mb-2 transform -translate-x-1/2 rounded-md overflow-hidden border-2 border-white bg-black pointer-events-none shadow-lg z-20"
                    style={{ left: `${previewPosition}px` }}
                  >
                    <img src={previewImage} alt="Video preview" className="w-40 aspect-video block" />
                    <span className="absolute bottom-1 w-full text-center text-xs font-bold text-white bg-black/50">{formatTime(previewTime)}</span>
                  </div>
                )}
                 {duration > 0 && bookmarks.map(time => (
                    <div key={time} className="absolute top-1/2 -translate-y-1/2 w-1 h-1.5 bg-yellow-400 pointer-events-none z-10" style={{ left: `${(time / duration) * 100}%` }}></div>
                 ))}
                <input
                  type="range"
                  min="0"
                  max={duration}
                  value={progress}
                  onInput={handleSeek}
                  className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer range-thumb absolute top-1/2 -translate-y-1/2 group-hover/seekbar:h-1.5 transition-all"
                  style={{'--progress': `${(progress / duration) * 100}%`} as React.CSSProperties}
                />
              </div>

              <style>{`
                .range-thumb::-webkit-slider-thumb { appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; transform: scale(0); transition: transform .1s ease-in-out; }
                .range-thumb:hover::-webkit-slider-thumb, .range-thumb:active::-webkit-slider-thumb { transform: scale(1); }
                .range-thumb { background: linear-gradient(to right, #fff var(--progress), rgba(255,255,255,0.3) var(--progress)); }
              `}</style>

              <div className="flex items-center justify-between -mt-2">
                <div className="flex items-center gap-4">
                    <button onClick={() => handleFrameSeek('backward')} className="w-6 h-6"><FrameBackIcon/></button>
                    <button onClick={togglePlayPause} className="w-6 h-6">{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
                    <button onClick={() => handleFrameSeek('forward')} className="w-6 h-6"><FrameForwardIcon/></button>
                    <div className="flex items-center group/volume">
                        <button onClick={toggleMute} className="w-6 h-6"><VolumeIcon/></button>
                        <input type="range" min="0" max="1" step="0.01" value={volume} onInput={handleVolumeChange} className="w-0 h-1 ml-1 rounded-full bg-white/30 group-hover/volume:w-20 transition-all duration-200 ease-in-out range-thumb" style={{'--progress': `${volume * 100}%`} as React.CSSProperties}/>
                    </div>
                    <div className="text-xs">
                        {formatTime(progress)} / {formatTime(duration)}
                    </div>
                </div>

                <div className="flex items-center gap-4 relative">
                    {showSettings && (
                        <div className="absolute bottom-full right-0 mb-2 bg-black/80 rounded-lg p-2 flex flex-col items-center">
                            <span className="text-xs text-gray-400 mb-1">Speed</span>
                            {PLAYBACK_RATES.map(rate => (
                                <button key={rate} onClick={() => handlePlaybackRateChange(rate)} className={`text-xs w-full text-center px-2 py-1 rounded ${playbackRate === rate ? 'bg-accent-blue' : 'hover:bg-white/20'}`}>
                                    {rate === 1 ? 'Normal' : `${rate}x`}
                                </button>
                            ))}
                        </div>
                    )}
                    <button onClick={handleAddBookmark} className="w-6 h-6"><BookmarkIcon/></button>
                    <button onClick={() => { logEvent('toggle_settings', 'settings_button'); setShowSettings(!showSettings); }} className="w-6 h-6"><SettingsIcon/></button>
                    {document.pictureInPictureEnabled && <button onClick={togglePip} className="w-6 h-6"><PipEnterIcon/></button>}
                    <button onClick={toggleFullscreen} className="w-6 h-6">{isFullscreen ? <FullscreenExitIcon/> : <FullscreenEnterIcon/>}</button>
                </div>
              </div>
            </div>
        </div>
      </div>
      
      <div className="py-4">
        <h2 className="text-xl font-bold mb-3">{video.title}</h2>
        <div className="flex justify-end">
          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-component-bg rounded-full">
              <button onClick={handleLike} className={`flex items-center space-x-2 pl-4 pr-3 py-2 rounded-l-full hover:bg-component-bg-hover transition-colors`}>
                <ThumbsUpIcon className="w-5 h-5" filled={likeStatus === 'liked'} />
                <span>{likes.toLocaleString()}</span>
              </button>
              <div className="w-px h-6 bg-border-color"></div>
              <button onClick={handleDislike} className="px-3 py-2 rounded-r-full hover:bg-component-bg-hover transition-colors">
                <ThumbsDownIcon className="w-5 h-5" filled={likeStatus === 'disliked'}/>
              </button>
            </div>
          </div>
        </div>
        <div 
          className="mt-4 bg-component-bg p-4 rounded-lg cursor-pointer"
          onClick={() => {
            logEvent('toggle_description', 'description_box', { expanded: !isDescriptionExpanded });
            setIsDescriptionExpanded(!isDescriptionExpanded);
          }}
        >
          <p className="font-semibold text-sm mb-1">{views.toLocaleString()} views &bull; {video.published}</p>
          <p className={`text-text-secondary text-sm whitespace-pre-wrap ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
            {video.description}
          </p>
          <button className="text-sm font-semibold mt-2 text-text-primary">
            {isDescriptionExpanded ? 'Show less' : '...more'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
