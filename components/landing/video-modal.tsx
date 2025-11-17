'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Play, Pause, Maximize, Volume2, VolumeX } from 'lucide-react';

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string;
  title?: string;
  description?: string;
}

export function VideoModal({
  open,
  onOpenChange,
  videoUrl,
  title = 'IPAM Demo Video',
  description = 'Watch how IPAM simplifies IP address management',
}: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Determine video type (YouTube, Vimeo, or direct video file)
  const videoType = getVideoType(videoUrl);

  // Reset video state when modal closes
  useEffect(() => {
    if (!open) {
      setIsPlaying(false);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [open]);

  // Handle play/pause
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle mute/unmute
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'Escape':
          if (document.fullscreenElement) {
            document.exitFullscreen();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isPlaying, isMuted]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-4xl p-0"
        aria-describedby="video-description"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription id="video-description">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-black">
          {videoType === 'youtube' && (
            <iframe
              src={getYouTubeEmbedUrl(videoUrl)}
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          )}

          {videoType === 'vimeo' && (
            <iframe
              src={getVimeoEmbedUrl(videoUrl)}
              title={title}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          )}

          {videoType === 'direct' && (
            <>
              <video
                ref={videoRef}
                src={videoUrl}
                className="h-full w-full"
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                aria-label={title}
              >
                <track
                  kind="captions"
                  src="/captions.vtt"
                  srcLang="en"
                  label="English"
                  default
                />
                Your browser does not support the video tag.
              </video>

              {/* Custom video controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={togglePlayPause}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleMute}
                    aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>

                  <div className="flex-1" />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleFullscreen}
                    aria-label="Toggle fullscreen"
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Keyboard shortcuts hint */}
        <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
          <span className="font-medium">Keyboard shortcuts:</span> Space/K = Play/Pause, M = Mute, F = Fullscreen
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper functions
function getVideoType(url: string): 'youtube' | 'vimeo' | 'direct' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'direct';
}

function getYouTubeEmbedUrl(url: string): string {
  // Extract video ID from various YouTube URL formats
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = match && match[2].length === 11 ? match[2] : null;
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  }
  return url;
}

function getVimeoEmbedUrl(url: string): string {
  // Extract video ID from Vimeo URL
  const regExp = /vimeo.com\/(\d+)/;
  const match = url.match(regExp);
  const videoId = match ? match[1] : null;
  
  if (videoId) {
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  return url;
}
