import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async () => {
    const token = localStorage.getItem('access');
    
    if (!token) {
      setFavorites([]);
      return;
    }

    try {
      const res = await axios.get('http://127.0.0.1:8000/api/favorites/', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Вытаскиваем объекты книг из ответа нашего FavoriteSerializer
      const bookList = res.data.map(item => item.book);
      setFavorites(bookList);
    } catch (e) {
      console.error("Ошибка загрузки избранного с сервера:", e);
      if (e.response && e.response.status === 401) {
        setFavorites([]);
      }
    }
  }, []);

  const clearFavorites = () => {
    setFavorites([]);
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (book) => {
    const token = localStorage.getItem('access');
    if (!token) {
      alert("Войдите в аккаунт, чтобы сохранять книги");
      return;
    }

    try {
      await axios.post(`http://127.0.0.1:8000/api/books/${book.id}/toggle_favorite/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setFavorites((prev) => {
        const isExist = prev.some((f) => f.id === book.id);
        if (isExist) {
          return prev.filter((f) => f.id !== book.id);
        } else {
          return [book, ...prev];
        }
      });
    } catch (e) {
      console.error("Ошибка синхронизации избранного:", e);
      alert("Не удалось обновить избранное");
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, fetchFavorites, clearFavorites }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};