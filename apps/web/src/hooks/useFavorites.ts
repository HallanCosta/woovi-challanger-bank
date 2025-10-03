import { useCallback, useEffect, useMemo, useState } from 'react';
import { TABLES } from '../config/database';

export type AccountType = 'PHYSICAL' | 'COMPANY';

export interface FavoriteRecipient {
  id: string;
  pixKey: string;
  nickname?: string;
  userName: string;
  userEmail?: string;
  accountType?: AccountType | string;
  accountId?: string;
  createdAt: string;
}

export type CreateFavoriteData = Omit<FavoriteRecipient, 'id' | 'createdAt'>;

export interface UseFavoritesReturn {
  favorites: FavoriteRecipient[];
  total: number;
  addFavorite: (favorite: CreateFavoriteData) => boolean;
  removeFavorite: (id: string) => void;
  clearFavorites: () => void;
  getByPixKey: (pixKey: string) => FavoriteRecipient | null;
}

function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  
  try {
    return JSON.parse(raw) as T;
  } catch (error) {
    return fallback;
  }
}

function generateUniqueId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function normalizePixKey(pixKey: string): string {
  return pixKey.trim();
}

export function useFavorites(): UseFavoritesReturn {
  const [favoritesList, setFavoritesList] = useState<FavoriteRecipient[]>([]);

  useEffect(() => {
    const storedData = window.localStorage.getItem(TABLES.FAVORITES);
    const initialFavorites = safeJsonParse<FavoriteRecipient[]>(storedData, []);
    setFavoritesList(initialFavorites);
  }, []);

  const persistFavorites = useCallback((newFavorites: FavoriteRecipient[]) => {
    setFavoritesList(newFavorites);
    
    window.localStorage.setItem(TABLES.FAVORITES, JSON.stringify(newFavorites));
  }, []);

  const addFavorite = useCallback((favoriteData: CreateFavoriteData): boolean => {
    const normalizedPixKey = normalizePixKey(favoriteData.pixKey);
    
    const alreadyExists = favoritesList.some(
      (favorite) => normalizePixKey(favorite.pixKey) === normalizedPixKey
    );
    
    if (alreadyExists) {
      return false;
    }

    const newFavorite: FavoriteRecipient = {
      id: generateUniqueId(),
      createdAt: new Date().toISOString(),
      ...favoriteData,
      pixKey: normalizedPixKey,
    };

    const updatedFavorites = [newFavorite, ...favoritesList];
    persistFavorites(updatedFavorites);
    
    return true;
  }, [favoritesList, persistFavorites]);

  const removeFavorite = useCallback((favoriteId: string) => {
    const updatedFavorites = favoritesList.filter(
      (favorite) => favorite.id !== favoriteId
    );
    persistFavorites(updatedFavorites);
  }, [favoritesList, persistFavorites]);

  const clearFavorites = useCallback(() => {
    persistFavorites([]);
  }, [persistFavorites]);

  const getByPixKey = useCallback((pixKey: string): FavoriteRecipient | null => {
    const normalizedPixKey = normalizePixKey(pixKey);
    return favoritesList.find(
      (favorite) => normalizePixKey(favorite.pixKey) === normalizedPixKey
    ) || null;
  }, [favoritesList]);

  const totalFavorites = favoritesList.length;

  const sortedFavorites = useMemo(() => {
    return [...favoritesList].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [favoritesList]);

  return {
    favorites: sortedFavorites,
    total: totalFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites,
    getByPixKey,
  };
}


