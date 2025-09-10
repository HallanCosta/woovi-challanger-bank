import { useCallback, useEffect, useMemo, useState } from 'react';
import { TABLES } from '../config/database';

export type FavoriteRecipient = {
  id: string;
  pixKey: string;
  nickname?: string;
  userName: string;
  userEmail?: string;
  accountType?: 'PHYSICAL' | 'COMPANY' | string;
  accountId?: string;
  createdAt: string;
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteRecipient[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = window.localStorage.getItem(TABLES.FAVORITES);
    const initial = safeParse<FavoriteRecipient[]>(raw, []);
    setFavorites(initial);
  }, []);

  const persist = useCallback((next: FavoriteRecipient[]) => {
    setFavorites(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(TABLES.FAVORITES, JSON.stringify(next));
    }
  }, []);

  const addFavorite = useCallback((favorite: Omit<FavoriteRecipient, 'id' | 'createdAt'>) => {
    const exists = favorites.some((f) => f.pixKey.trim() === favorite.pixKey.trim());
    if (exists) return false;
    const item: FavoriteRecipient = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      ...favorite,
      pixKey: favorite.pixKey.trim(),
    };
    const next = [item, ...favorites];
    persist(next);
    return true;
  }, [favorites, persist]);

  const removeFavorite = useCallback((id: string) => {
    const next = favorites.filter((f) => f.id !== id);
    persist(next);
  }, [favorites, persist]);

  const clearFavorites = useCallback(() => {
    persist([]);
  }, [persist]);

  const getByPixKey = useCallback((pixKey: string) => {
    const key = pixKey.trim();
    return favorites.find((f) => f.pixKey === key) || null;
  }, [favorites]);

  const total = favorites.length;

  const ordered = useMemo(() => {
    return [...favorites].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [favorites]);

  return {
    favorites: ordered,
    total,
    addFavorite,
    removeFavorite,
    clearFavorites,
    getByPixKey,
  };
}


