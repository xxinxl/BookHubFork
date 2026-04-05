import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setMessage('Инструкции по восстановлению отправлены на вашу почту!');
            setIsError(false);
        } catch (err) {
            setMessage('Ошибка! Проверьте правильность введенного Email.');
            setIsError(true);
        }
    };

    return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', 
            justifyContent: 'center', height: '100vh', background: '#f8fafc'
        }}>
            <div style={{
                background: 'white', padding: '40px', borderRadius: '16px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px'
            }}>
                <h2 style={{ textAlign: 'center', color: '#1e293b' }}>Восстановление доступа</h2>
                <p style={{ textAlign: 'center', color: '#64748b', fontSize: '14px', marginBottom: '20px' }}>
                    Введите Email, указанный при регистрации, и мы отправим вам ссылку для смены пароля.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="email" 
                        placeholder="your@email.com" 
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '16px' }}
                    />
                    
                    <button type="submit" style={{
                        padding: '14px', borderRadius: '10px', border: 'none',
                        background: '#4f46e5', color: 'white', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                        Отправить ссылку
                    </button>
                </form>

                {message && (
                    <p style={{ 
                        marginTop: '20px', textAlign: 'center', 
                        color: isError ? '#ef4444' : '#10b981', fontWeight: '500' 
                    }}>
                        {message}
                    </p>
                )}

                <button 
                    onClick={() => navigate('/login')}
                    style={{ marginTop: '20px', width: '100%', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}
                >
                    ← Вернуться к входу
                </button>
            </div>
        </div>
    );
};

export default ForgotPassword;