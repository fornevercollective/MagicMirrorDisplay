import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/card';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsWidgetProps {
  displayType: string;
  size: 'small' | 'medium' | 'large';
}

interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  publishedAt: Date;
  url: string;
}

export const NewsWidget: React.FC<NewsWidgetProps> = ({ displayType, size }) => {
  const [articles, setArticles] = useState<NewsArticle[]>([
    {
      id: '1',
      title: 'New Technology Breakthrough in Quantum Computing',
      summary: 'Scientists achieve major milestone in quantum error correction...',
      source: 'Tech News',
      publishedAt: new Date(2025, 5, 14, 8, 30),
      url: '#'
    },
    {
      id: '2',
      title: 'Climate Summit Reaches Historic Agreement',
      summary: 'World leaders commit to ambitious carbon reduction targets...',
      source: 'Global News',
      publishedAt: new Date(2025, 5, 14, 7, 15),
      url: '#'
    },
    {
      id: '3',
      title: 'Space Mission Returns with Asteroid Samples',
      summary: 'NASA\'s latest mission successfully brings back materials...',
      source: 'Space Today',
      publishedAt: new Date(2025, 5, 13, 22, 45),
      url: '#'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (size === 'small') {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % articles.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [articles.length, size]);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return `${diffMins}m ago`;
    }
  };

  const ArticleComponent = ({ article, showFull = false }: { article: NewsArticle; showFull?: boolean }) => (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-2">
        <h3 className={`${showFull ? 'text-sm' : 'text-xs'} line-clamp-2`}>
          {article.title}
        </h3>
        {displayType === 'touchscreen' && (
          <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-60" />
        )}
      </div>
      {showFull && (
        <p className="text-xs opacity-80 line-clamp-2">
          {article.summary}
        </p>
      )}
      <div className="flex items-center justify-between text-xs opacity-60">
        <span>{article.source}</span>
        <span>{formatTimeAgo(article.publishedAt)}</span>
      </div>
    </div>
  );

  const content = (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <Newspaper className="h-4 w-4" />
        <span className="text-sm opacity-80">Latest News</span>
      </div>

      {size === 'small' ? (
        <ArticleComponent article={articles[currentIndex]} />
      ) : (
        <div className="space-y-4">
          {articles.slice(0, size === 'large' ? 4 : 2).map(article => (
            <div key={article.id} className="border-l-2 border-blue-500 pl-3">
              <ArticleComponent article={article} showFull={size === 'large'} />
            </div>
          ))}
        </div>
      )}

      {size === 'small' && (
        <div className="flex justify-center gap-1 mt-3">
          {articles.map((_, index) => (
            <div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-500' : 'bg-gray-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (displayType === 'mirror') {
    return <div className="text-white">{content}</div>;
  }

  return (
    <Card className="w-full h-full bg-transparent border-0">
      <CardContent className="p-4">
        {content}
      </CardContent>
    </Card>
  );
};