import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import Catalog from "./pages/CatalogPage";
import BookDetail from './pages/BookDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { FavoritesProvider } from './context/FavoritesContext';
import Profile from './pages/Profile';
import Reader from './pages/Reader';
import HomePage from './pages/HomePage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPasswordConfirm from './pages/ResetPasswordConfirm';
import './App.css';

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access');
    const savedUsername = localStorage.getItem('username');

    if (token) {
      setIsAuth(true);
      if (savedUsername) {
        setUsername(savedUsername);
      } else {
        try {
          const decoded = jwtDecode(token);
          setUsername(decoded.username || decoded.user_id);
        } catch (error) {
          console.error("Ошибка декодирования токена", error);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    window.location.href = '/';
  };

  return (
    <FavoritesProvider> 
      <BrowserRouter>
        <header className="header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          padding: '0 40px', 
          alignItems: 'center', 
          background: 'white', 
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          position: 'fixed', 
          top: 0,
          left: 0,
          width: '100%',
          height: '70px',
          zIndex: 1000,
          boxSizing: 'border-box'
        }}>
          <div style={{ fontWeight: '800', fontSize: '1.5rem', color: '#4f46e5' }}>BookHub</div>
          
          <nav style={{ display: 'flex', gap: '30px', alignItems: 'center', height: '100%' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '500' }}>
        Главная
    </Link>
            <Link to="/catalog" style={{ textDecoration: 'none', color: '#1e293b', fontWeight: '500' }}>Каталог</Link>
            
            {isAuth ? (
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <Link to="/profile" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ color: '#1e293b', fontWeight: '500' }}>
                    Привет, <span style={{ color: '#4f46e5', fontWeight: '800' }}>{username}</span>!
                  </span>
                </Link>

                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '8px 16px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#475569',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseOver={(e) => e.target.style.background = '#e2e8f0'}
                  onMouseOut={(e) => e.target.style.background = '#f1f5f9'}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <Link to="/login" style={{ 
                  textDecoration: 'none', 
                  color: '#4f46e5', 
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 0' 
                }}>
                  Войти
                </Link>
                <Link to="/register" style={{ 
                  textDecoration: 'none', 
                  background: '#4f46e5', 
                  color: 'white', 
                  padding: '8px 20px', 
                  borderRadius: '8px',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  boxShadow: '0 4px 10px rgba(79, 70, 229, 0.15)'
                }}>
                  Регистрация
                </Link>
              </div>
            )}
          </nav>
        </header>

        <main className="main-app-content" style={{ marginTop: '70px' }}>
    <Routes>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/catalog" element={<Catalog isAuth={isAuth} />} />
        
        <Route path="/reader/:id" element={<Reader />} />
        
        <Route path="/catalog/:id" element={
            <div className="detail-wrapper">
                <BookDetail isAuth={isAuth} />
            </div>
        } />
        
        <Route path="/login" element={<Login setIsAuth={setIsAuth} setUsername={setUsername} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile setUsername={setUsername} setIsAuth={setIsAuth} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uidb64/:token" element={<ResetPasswordConfirm />} />
    </Routes>
</main>
      </BrowserRouter>
    </FavoritesProvider>
  );
}

export default App;