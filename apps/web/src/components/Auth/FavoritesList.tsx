import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Trash2, Heart, Send } from 'lucide-react';
import { FavoriteRecipient } from '../../hooks/useFavorites';

interface FavoritesListProps {
  favorites: FavoriteRecipient[];
  onRemove: (id: string) => void;
  onTransfer: (pixKey: string) => void;
}

export const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, onRemove, onTransfer }) => {
  const maskEmail = (email?: string) => {
    if (!email) return '';
    const [user, domain] = email.split('@');
    if (!user || !domain) return email;
    const visible = user.slice(0, 2);
    return `${visible}****@${domain}`;
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-rose-500 fill-current" />
          Favoritos
        </CardTitle>
        <CardDescription>Suas chaves PIX favoritas</CardDescription>
      </CardHeader>
      <CardContent>
        {favorites.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Você ainda não adicionou favoritos</p>
            <p className="text-sm">Adicione chaves PIX para acessar rapidamente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {favorites.map((fav) => (
              <div key={fav.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div>
                  <p className="font-medium text-sm">{fav.nickname || fav.userName || fav.pixKey}</p>
                  <p className="text-xs text-muted-foreground">{maskEmail(fav.userEmail)}</p>
                  <p className="text-xs text-muted-foreground">Chave PIX: {fav.pixKey}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => onTransfer(fav.pixKey)}>
                    <Send className="w-4 h-4 mr-1" /> Transferir
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => onRemove(fav.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};


