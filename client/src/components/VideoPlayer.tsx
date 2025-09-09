import React, { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  title?: string;
  className?: string;
  showControls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export default function VideoPlayer({
  src,
  title = "Video Player",
  className = "",
  showControls = true,
  autoPlay = false,
  loop = false,
  muted = false
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [showControlsOverlay, setShowControlsOverlay] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div 
      className={`relative group rounded-lg overflow-hidden ${className}`}
      onMouseEnter={() => setShowControlsOverlay(true)}
      onMouseLeave={() => setShowControlsOverlay(false)}
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        data-testid="video-player"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {showControls && (
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/50 to-transparent transition-opacity duration-300 ${
            showControlsOverlay ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Play/Pause overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              onClick={togglePlay}
              size="lg"
              className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 w-16 h-16 rounded-full"
              data-testid={isPlaying ? 'button-pause' : 'button-play'}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8 ml-1" />
              )}
            </Button>
          </div>

          {/* Bottom controls */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleMute}
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                data-testid="button-mute"
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={toggleFullscreen}
                size="sm"
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
                data-testid="button-fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Title overlay */}
          {title && (
            <div className="absolute top-4 left-4">
              <h3 className="text-white font-semibold text-lg drop-shadow-lg">
                {title}
              </h3>
            </div>
          )}
        </div>
      )}
    </div>
  );
}