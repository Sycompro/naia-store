'use client';
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Story {
  id: number;
  title: string;
  imageUrl: string;
}

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const STORY_DURATION = 5000; // 5 seconds per story

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    startProgress();
    return () => stopProgress();
  }, [currentIndex, mounted]);

  const startProgress = () => {
    stopProgress();
    setProgress(0);
    const startTime = Date.now();

    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / STORY_DURATION) * 100;

      if (newProgress >= 100) {
        handleNext();
      } else {
        setProgress(newProgress);
      }
    }, 50);
  };

  const stopProgress = () => {
    if (progressTimer.current) clearInterval(progressTimer.current);
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const currentStory = stories[currentIndex];

  if (!currentStory || !mounted) return null;

  const viewerContent = (
    <div className="story-viewer-overlay">
      <div className="story-viewer-container glass">
        {/* Progress Bars */}
        <div className="progress-container">
          {stories.map((_, index) => (
            <div key={index} className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{
                  width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%',
                  transition: index === currentIndex ? 'none' : 'width 0.3s'
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="viewer-header">
          <div className="viewer-info">
            <div className="viewer-avatar" style={{ backgroundImage: `url(${currentStory.imageUrl})` }}></div>
            <span className="viewer-name">{currentStory.title}</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={24} /></button>
        </div>

        {/* Story Content */}
        <div className="story-content" style={{ backgroundImage: `url(${currentStory.imageUrl})` }}>
          {/* Navigation Tap Zones */}
          <div className="tap-zone left" onClick={handlePrev}></div>
          <div className="tap-zone right" onClick={handleNext}></div>
        </div>

        {/* Navigation Buttons (Desktop) */}
        <button className="nav-btn prev" onClick={handlePrev} disabled={currentIndex === 0}>
          <ChevronLeft size={32} />
        </button>
        <button className="nav-btn next" onClick={handleNext}>
          <ChevronRight size={32} />
        </button>
      </div>

      <style jsx>{`
        .story-viewer-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.98);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(20px);
        }
        .story-viewer-container {
          position: relative;
          width: 100%;
          max-width: 450px;
          height: 90vh;
          max-height: 800px;
          border-radius: 20px;
          overflow: hidden;
          background: #000;
          box-shadow: 0 25px 50px rgba(0,0,0,0.5);
        }
        .progress-container {
          position: absolute;
          top: 15px;
          left: 10px;
          right: 10px;
          display: flex;
          gap: 5px;
          z-index: 100;
        }
        .progress-bar-bg {
          flex: 1;
          height: 3px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
          overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%;
          background: white;
        }
        .viewer-header {
          position: absolute;
          top: 35px;
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
        }
        .viewer-name {
          font-weight: 700;
          font-size: 16px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          opacity: 0.8;
          transition: 0.3s;
        }
        .close-btn:hover { opacity: 1; transform: scale(1.1); }
        
        .story-content {
          width: 100%;
          height: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          position: relative;
        }
        .tap-zone {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 30%;
          z-index: 50;
        }
        .tap-zone.left { left: 0; }
        .tap-zone.right { right: 0; width: 70%; }
        
        .nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255,255,255,0.1);
          border: none;
          color: white;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 150;
          transition: 0.3s;
          backdrop-filter: blur(5px);
        }
        .nav-btn:hover:not(:disabled) { background: rgba(255,255,255,0.2); transform: translateY(-50%) scale(1.1); }
        .nav-btn:disabled { opacity: 0; pointer-events: none; }
        .nav-btn.prev { left: -70px; }
        .nav-btn.next { right: -70px; }

        @media (max-width: 600px) {
          .story-viewer-container {
            height: 100vh;
            max-height: none;
            border-radius: 0;
          }
          .nav-btn { display: none; }
        }
      `}</style>
    </div>
  );

  return createPortal(viewerContent, document.body);
}
