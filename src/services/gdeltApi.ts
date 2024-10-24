import axios from 'axios';
import { fetchNews, NewsArticle } from './newsApi';

export interface GdeltArticle {
  url: string;
  title: string;
  seendate: string;
  socialimage: string;
  domain: string;
  language: string;
  sourcecountry: string;
  description?: string;
  tone?: number;
}

export interface BiasSource {
  domain: string;
  bias: 'left' | 'center' | 'right';
  logo?: string;
  name: string;
}

const biasDatabase: Record<string, BiasSource> = {
  'apnews.com': { domain: 'apnews.com', bias: 'center', name: 'Associated Press', logo: 'https://www.apnews.com/favicon.ico' },
  'reuters.com': { domain: 'reuters.com', bias: 'center', name: 'Reuters', logo: 'https://www.reuters.com/favicon.ico' },
  'bbc.com': { domain: 'bbc.com', bias: 'center', name: 'BBC News', logo: 'https://www.bbc.com/favicon.ico' },
  'bbc.co.uk': { domain: 'bbc.co.uk', bias: 'center', name: 'BBC News', logo: 'https://www.bbc.co.uk/favicon.ico' },
  'npr.org': { domain: 'npr.org', bias: 'center', name: 'NPR', logo: 'https://www.npr.org/favicon.ico' },
  'cnn.com': { domain: 'cnn.com', bias: 'left', name: 'CNN', logo: 'https://www.cnn.com/favicon.ico' },
  'nytimes.com': { domain: 'nytimes.com', bias: 'left', name: 'New York Times', logo: 'https://www.nytimes.com/favicon.ico' },
  'washingtonpost.com': { domain: 'washingtonpost.com', bias: 'left', name: 'Washington Post', logo: 'https://www.washingtonpost.com/favicon.ico' },
  'theguardian.com': { domain: 'theguardian.com', bias: 'left', name: 'The Guardian', logo: 'https://www.theguardian.com/favicon.ico' },
  'foxnews.com': { domain: 'foxnews.com', bias: 'right', name: 'Fox News', logo: 'https://www.foxnews.com/favicon.ico' },
  'nypost.com': { domain: 'nypost.com', bias: 'right', name: 'New York Post', logo: 'https://nypost.com/favicon.ico' },
  'wsj.com': { domain: 'wsj.com', bias: 'right', name: 'Wall Street Journal', logo: 'https://www.wsj.com/favicon.ico' }
};

export const getBiasForDomain = (domain: string): BiasSource => {
  const source = biasDatabase[domain] || {
    domain,
    bias: 'center',
    name: domain,
    logo: `https://www.google.com/s2/favicons?domain=${domain}&sz=128`
  };
  return source;
};

const convertNewsToGdelt = (newsArticle: NewsArticle): GdeltArticle => {
  const domain = new URL(newsArticle.link).hostname;
  return {
    url: newsArticle.link,
    title: newsArticle.title,
    seendate: newsArticle.published_date,
    socialimage: newsArticle.media,
    domain,
    language: 'en',
    sourcecountry: 'US',
    description: newsArticle.summary,
    tone: Math.random() * 20 - 10 // Simulated tone
  };
};

export const fetchGdeltArticles = async (topic: string): Promise<GdeltArticle[]> => {
  try {
    const majorOutlets = Object.keys(biasDatabase).join(' OR domain:');
    const query = `${topic} domain:${majorOutlets}`;
    
    const response = await axios.get(
      `https://api.gdeltproject.org/api/v2/doc/doc?format=json&query=${encodeURIComponent(query)}&mode=artlist&maxrecords=25&sort=DateDesc&timespan=24h`
    );
    
    const articles = response.data.articles || [];
    
    // If GDELT returns no articles, fall back to NewsCatcher API
    if (articles.length === 0) {
      console.log('No GDELT articles found, falling back to NewsCatcher API');
      const newsResponse = await fetchNews(topic);
      return newsResponse.articles.map(convertNewsToGdelt);
    }

    return articles.map((article: GdeltArticle) => ({
      ...article,
      tone: Math.random() * 20 - 10,
      description: article.description || article.title
    }));
  } catch (error) {
    console.error('Error fetching GDELT articles, falling back to NewsCatcher API:', error);
    try {
      const newsResponse = await fetchNews(topic);
      return newsResponse.articles.map(convertNewsToGdelt);
    } catch (fallbackError) {
      console.error('Both GDELT and fallback failed:', fallbackError);
      throw new Error('Unable to fetch articles from any source');
    }
  }
};

export const groupSimilarArticles = (articles: GdeltArticle[]): GdeltArticle[][] => {
  const groups: GdeltArticle[][] = [];
  const used = new Set<string>();

  articles.forEach((article) => {
    if (used.has(article.url)) return;

    const similar = articles.filter((other) => {
      if (used.has(other.url)) return false;
      
      const words1 = article.title.toLowerCase().split(' ');
      const words2 = other.title.toLowerCase().split(' ');
      const commonWords = words1.filter(word => words2.includes(word));
      return commonWords.length >= 3;
    });

    if (similar.length >= 2) {
      similar.forEach(a => used.add(a.url));
      groups.push(similar);
    }
  });

  return groups;
};