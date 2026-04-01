'use client';
import React from 'react';

export default function Stories() {
  const [stories, setStories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [currentGender, setCurrentGender] = React.useState('FEMALE');

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

  return (
    <section className="stories-section container">
      <div className="stories-container">
        {loading ? (
          <div className="stories-skeleton"></div>
        ) : Array.isArray(stories) && stories.length > 0 ? (
          stories.map((story) => (
            <div key={story.id} className="story-item">
              <div className="story-ring">
                <div className="story-image" style={{ backgroundImage: `url(${story.imageUrl})` }}></div>
              </div>
              <span className="story-name">{story.title}</span>
            </div>
          ))
        ) : null}
      </div>

      <style jsx>{`
        .stories-section {
          padding: 100px 0 20px;
          overflow-x: auto;
          scrollbar-width: none;
        }
        .stories-section::-webkit-scrollbar {
          display: none;
        }
        .stories-container {
          display: flex;
          gap: 20px;
          padding: 10px 0;
        }
        .story-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: transform 0.3s;
          flex-shrink: 0;
        }
        .story-item:hover {
          transform: scale(1.05);
        }
        .story-ring {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          padding: 3px;
          background: linear-gradient(45deg, var(--primary), var(--primary-dark), #FFD700);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .story-image {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 3px solid var(--bg);
          background-size: cover;
          background-position: center;
        }
        .story-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--fg);
        }
      `}</style>
    </section>
  );
}
