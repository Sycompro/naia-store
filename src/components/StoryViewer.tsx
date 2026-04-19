'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface StorySlide {
  id: number;
  mediaUrl: string;
  type: 'IMAGE' | 'VIDEO';
  duration: number;
  order: number;
}

interface StoryGroup {
  id: number;
  name: string;
  thumbnailUrl: string;
  slides: StorySlide[];
}

interface StoryViewerProps {
  groups: StoryGroup[];
  initialGroupIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ groups, initialGroupIndex, onClose }: StoryViewerProps) {
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);

  const currentGroup = groups[groupIndex];
  const currentSlide = currentGroup?.slides[slideIndex];

  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (!mounted || !currentSlide) return;
    setLoading(true);
    startProgress();
    return () => stopProgress();
  }, [groupIndex, slideIndex, mounted]);

  const startProgress = () => {
    stopProgress();
    if (!currentSlide || loading) return;

    if (currentSlide.type === 'VIDEO') {
      setProgress(0);
      return;
    }

    setProgress(0);
    const startTime = Date.now();
    const slideDuration = currentSlide.duration || 5000;

    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / slideDuration) * 100;

      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    }, 30);
  };

  const stopProgress = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
  };

  const handleNext = () => {
    if (!currentGroup) return;

    if (slideIndex < currentGroup.slides.length - 1) {
      setSlideIndex(slideIndex + 1);
    } else if (groupIndex < groups.length - 1) {
      setGroupIndex(groupIndex + 1);
      setSlideIndex(0);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1];
      setGroupIndex(groupIndex - 1);
      setSlideIndex(prevGroup.slides.length - 1);
    }
  };

  // When media finishes loading, start the progress
  useEffect(() => {
    if (!loading && mounted && currentSlide) {
      startProgress();
    }
  }, [loading]);

  if (!currentGroup || !currentSlide || !mounted) return null;

  const viewerContent = (
    <div className="story-viewer-overlay">
      <div className="story-viewer-container">
        {/* Progress Indicators Bar */}
        <div className="progress-container">
          {currentGroup.slides.map((_, idx) => (
            <div key={idx} className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: idx < slideIndex ? '100%' : idx === slideIndex ? `${progress}%` : '0%',
                  transition: idx === slideIndex ? 'none' : 'width 0.2s cubic-bezier(0.1, 0, 0, 1)'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Header Information */}
        <div className="viewer-header">
          <div className="viewer-info">
            <div className="viewer-avatar" style={{ backgroundImage: `url(${currentGroup.thumbnailUrl})` }}></div>
            <div className="viewer-text">
              <span className="viewer-name">{currentGroup.name}</span>
              <span className="viewer-subname">HACE UNAS HORAS</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="story-content">
          {loading && (
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          )}

          {currentSlide.type === 'VIDEO' ? (
            <video
              key={currentSlide.id}
              src={currentSlide.mediaUrl}
              className="story-video-full"
              autoPlay
              muted
              playsInline
              onLoadedData={() => setLoading(false)}
              onEnded={handleNext}
              onTimeUpdate={(e) => {
                const vid = e.currentTarget;
                if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
              }}
            />
          ) : (
            <img
              src={currentSlide.mediaUrl}
              className="story-img-full"
              onLoad={() => setLoading(false)}
              alt=""
            />
          )}

          {/* Interactive Tap Zones */}
          <div className="tap-zone left" onClick={handlePrev}></div>
          <div className="tap-zone right" onClick={handleNext}></div>
        </div>

        {/* Desktop Specific Controls */}
        <button
          className="nav-btn prev"
          onClick={handlePrev}
          disabled={groupIndex === 0 && slideIndex === 0}
        >
          <ChevronLeft size={32} />
        </button>
        <button
          className="nav-btn next"
          onClick={handleNext}
        >
          <ChevronRight size={32} />
        </button>
      </div>

      <style jsx>{`
                .story-viewer-overlay {
                    position: fixed;
                    inset: 0;
                    width: 100vw;
                    height: 100vh;
                    background: rgba(0, 0, 0, 0.98);
                    z-index: 99999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    backdrop-filter: blur(40px);
                    animation: fadeIn 0.3s ease-out;
                }
                .story-viewer-container {
                    position: relative;
                    width: 100%;
                    max-width: 450px;
                    height: 92vh;
                    max-height: 820px;
                    border-radius: 30px;
                    overflow: hidden;
                    background: #000;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.5);
                    border: 1px solid rgba(255,255,255,0.08);
                    display: flex;
                    flex-direction: column;
                }
                .progress-container {
                    position: absolute;
                    top: 15px;
                    left: 12px;
                    right: 12px;
                    display: flex;
                    gap: 6px;
                    z-index: 100;
                }
                .progress-bar-bg {
                    flex: 1;
                    height: 2px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 4px;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: white;
                }
                .viewer-header {
                    position: absolute;
                    top: 32px;
                    left: 0;
                    right: 0;
                    padding: 0 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 100;
                    color: white;
                }
                .viewer-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .viewer-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background-size: cover;
                    background-position: center;
                    border: 2px solid white;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                }
                .viewer-text {
                    display: flex;
                    flex-direction: column;
                }
                .viewer-name {
                    font-weight: 800;
                    font-size: 14px;
                    text-shadow: 0 2px 4px rgba(0,0,0,0.5);
                }
                .viewer-subname {
                    font-size: 10px;
                    font-weight: 700;
                    opacity: 0.7;
                    letter-spacing: 0.5px;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.5);
                }
                .close-btn {
                    background: rgba(0,0,0,0.2);
                    backdrop-filter: blur(10px);
                    border: none;
                    color: white;
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .close-btn:hover { transform: scale(1.1); background: rgba(0,0,0,0.4); }
                
                .story-content {
                    width: 100%;
                    flex: 1;
                    position: relative;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .story-img-full, .story-video-full {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .loader-container {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                }
                .loader {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.1);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .tap-zone {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    z-index: 50;
                    cursor: pointer;
                }
                .tap-zone.left { left: 0; width: 30%; }
                .tap-zone.right { right: 0; width: 70%; }
                
                .nav-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255,255,255,0.1);
                    color: white;
                    width: 54px;
                    height: 54px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 150;
                    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .nav-btn:hover:not(:disabled) { background: rgba(255, 255, 255, 0.2); transform: translateY(-50%) scale(1.1); }
                .nav-btn:disabled { opacity: 0; pointer-events: none; }
                .nav-btn.prev { left: -80px; }
                .nav-btn.next { right: -80px; }

                @media (max-width: 650px) {
                    .story-viewer-container {
                        height: 100vh;
                        max-height: none;
                        border-radius: 0;
                        border: none;
                    }
                    .nav-btn { display: none; }
                    .story-viewer-overlay { background: black; backdrop-filter: none; }
                    .progress-container { top: calc(15px + env(safe-area-inset-top)); }
                    .viewer-header { top: calc(32px + env(safe-area-inset-top)); }
                }
            `}</style>
    </div>
  );

  return createPortal(viewerContent, document.body);
}
