import { NextRequest } from 'next/server';

export interface CacheOptions {
  ttl?: number;
  revalidate?: number;
  tags?: string[];
}

const staticCache = new Map<string, { data: unknown; expires: number }>();

export function getCached(key: string): unknown | null {
  const entry = staticCache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    staticCache.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached(key: string, data: unknown, ttl: number = 60): void {
  staticCache.set(key, {
    data,
    expires: Date.now() + ttl * 1000
  });
}

export function invalidateCache(tag?: string): void {
  if (!tag) {
    staticCache.clear();
    return;
  }
  for (const key of staticCache.keys()) {
    if (key.includes(tag)) {
      staticCache.delete(key);
    }
  }
}

export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options: CacheOptions = {}
): Promise<T> {
  const { ttl = 300, revalidate } = options;
  
  const cached = getCached(key);
  if (cached !== null) {
    return cached as T;
  }

  const data = await fetcher();
  setCached(key, data, ttl);
  
  return data;
}

export function getETag(data: unknown): string {
  const str = JSON.stringify(data);
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `"${hash.toString(16)}"`;
}

export function withETag(data: unknown, request: NextRequest): Response {
  const etag = getETag(data);
  const ifNoneMatch = request.headers.get('if-none-match');
  
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304 });
  }
  
  const response = new Response(JSON.stringify(data), {
    headers: {
      'ETag': etag,
      'Cache-Control': 'public, max-age=300, s-maxage=3600',
      'Content-Type': 'application/json'
    }
  });
  
  return response;
}