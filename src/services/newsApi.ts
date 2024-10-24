import axios from 'axios';

const API_KEY = import.meta.env.VITE_NEWSCATCHER_API_KEY;

const newsApi = axios.create({
  baseURL: 'https://api.newscatcherapi.com/v2',
  headers: {
    'x-api-key': API_KEY,
  },
});

export interface NewsArticle {
  title: string;
  summary: string;
  link: string;
  media: string;
  published_date: string;
  rights: string;
  topic: string;
  _score: number;
}

export interface NewsResponse {
  articles: NewsArticle[];
  total_hits: number;
  page: number;
  total_pages: number;
  page_size: number;
}

export const fetchNews = async (
  topic: string = 'technology',
  page: number = 1,
  pageSize: number = 10
): Promise<NewsResponse> => {
  try {
    const response = await newsApi.get('/search', {
      params: {
        q: topic,
        page,
        page_size: pageSize,
        lang: 'en',
        sort_by: 'relevancy',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching news:', error);
    throw error;
  }
};