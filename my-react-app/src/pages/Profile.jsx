import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = ({ setUsername, setIsAuth }) => {
  const [newUsername, setNewUsername] = useState(localStorage.getItem('username') || '');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access');
    
    try {
      await axios.patch('http://127.0.0.1:8000/api/user/update/', 
        { username: newUsername, password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Данные изменены! Пожалуйста, войдите в систему снова.");
      localStorage.clear();
      setIsAuth(false);
      setUsername('');
      navigate('/login');

    } catch (err) {
      setError(err.response?.data?.error || 'Ошибка обновления данных');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setIsAuth(false);
    setUsername('');
    navigate('/login');
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: 'calc(100vh - 70px)', backgroundColor: '#f8fafc' }}>
      <div className="auth-card" style={{
        width: '100%', maxWidth: '420px', background: 'white', padding: '40px',
        borderRadius: '28px', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.04)', border: '1px solid #f1f5f9'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '24px', fontWeight: '800', color: '#0f172a' }}>Настройки профиля</h2>
        
        {error && (
          <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '12px', borderRadius: '12px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.85rem' }}>Ваш ник</label>
            <input 
              type="text" className="side-input" value={newUsername} 
              onChange={(e) => setNewUsername(e.target.value)} required 
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '0.85rem' }}>Новый пароль</label>
            <input 
              type="password" className="side-input" placeholder="Оставьте пустым, если не меняете"
              value={newPassword} onChange={(e) => setNewPassword(e.target.value)} 
            />
          </div>
          
          <button type="submit" className="btn-primary" style={{ 
            width: '100%', padding: '14px', background: '#4f46e5', color: 'white', 
            border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' 
          }}>
            Сохранить изменения
          </button>
        </form>

        <button onClick={handleLogout} style={{ 
          width: '100%', marginTop: '16px', padding: '12px', background: 'none', 
          border: '1px solid #ef4444', color: '#ef4444', borderRadius: '12px', 
          fontWeight: '600', cursor: 'pointer' 
        }}>
          Выйти из системы
        </button>
      </div>
    </div>
  );
};

export default Profile;