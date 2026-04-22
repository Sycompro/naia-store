'use client';
import React from 'react';
import StoryViewer from './StoryViewer';

export default function Stories() {
  const [stories, setStories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentGender, setCurrentGender] = React.useState('FEMALE');
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [initialIndex, setInitialIndex] = React.useState(0);

  React.useEffect(() => {
    const checkTheme = () => {
      const isMen = document.body.classList.contains('men-theme');
      setCurrentGender(isMen ? 'MALE' : 'FEMALE');
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    fetch(`/api/stories?gender=${currentGender}`)
      .then(res => res.json())
      .then(data => {
        setStories(data);
        setLoading(false);
      });
  }, [currentGender]);

  const isVideo = (url: string) => {
    if (!url) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes('/video/upload');
  };

  return (
    <section className="stories-section container">
      <div className="stories-container animate-fade">
        {loading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="story-skeleton" style={{ flexShrink: 0 }}></div>
          ))
        ) : Array.isArray(stories) && stories.length > 0 ? (
          stories.map((group, index) => (
            <div key={group.id} className="story-item" onClick={() => {
              setInitialIndex(index);
              setViewerOpen(true);
            }}>
              <div className="story-ring-premium">
                <div className="story-image-premium" style={{ backgroundImage: `url(${group.thumbnailUrl})` }}>
                  {group.slides?.[0]?.type === 'VIDEO' && (
                    <div className="video-indicator-mini">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="white">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <span className="story-name-premium">{group.name}</span>
            </div>
          ))
        ) : null}
      </div>

      {viewerOpen && (
        <StoryViewer
          groups={stories}
          initialGroupIndex={initialIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}

      <style jsx>{`
        .stories-section {
          margin-top: 100px;
          padding: 20px 0 30px;
          overflow-x: auto;
          scrollbar-width: none;
          mask-image: linear-gradient(to right, black 85%, transparent 100%);
        }
        .stories-section::-webkit-scrollbar {
          display: none;
        }
        .stories-container {
          display: flex;
          gap: 24px;
          padding: 10px 0;
        }
        .story-skeleton {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          background: var(--slate-100);
          flex-shrink: 0;
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
        
        .story-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          flex-shrink: 0;
        }
        .story-item:hover {
          transform: translateY(-5px);
        }
        .story-item:hover .story-ring-premium {
          padding: 2px;
          transform: rotate(15deg);
        }
        .story-ring-premium {
          width: 84px;
          height: 84px;
          border-radius: 50%;
          padding: 4px;
          background: linear-gradient(45deg, #FF7EB3, #E05A94, #FFB7B2, #FF7EB3);
          background-size: 300% 300%;
          animation: gradientMove 5s ease infinite;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(255, 126, 179, 0.2);
          transition: all 0.4s;
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .story-image-premium {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 4px solid var(--white);
          background-size: cover;
          background-position: center;
          box-shadow: inset 0 2px 10px rgba(0,0,0,0.1);
        }
        .story-name-premium {
          font-size: 13px;
          font-weight: 800;
          color: var(--fg);
          letter-spacing: -0.01em;
        }

        .video-indicator-mini {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,0.2);
        }
        
        :global(.men-theme) .story-ring-premium {
          background: linear-gradient(45deg, #1e293b, #334155, #94a3b8);
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.1);
        }
        :global(.men-theme) .story-image-premium {
          border-color: #0f172a;
        }

        @media (max-width: 768px) {
          .stories-section { margin-top: 90px; padding: 20px 0 10px; }
          .stories-container { gap: 15px; padding: 5px 20px; }
          .story-ring-premium { width: 72px; height: 72px; padding: 3px; }
          .story-skeleton { width: 72px; height: 72px; }
          .story-name-premium { font-size: 11px; }
        }
      `}</style>
    </section>
  );
}
