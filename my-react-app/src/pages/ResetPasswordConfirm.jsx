import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordConfirm = () => {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [status, setStatus] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://127.0.0.1:8000/api/password-reset-confirm/${uidb64}/${token}/`, {
                password: newPassword
            });
            setStatus('Пароль успешно изменен! Теперь можно войти.');
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            setStatus('Ошибка. Ссылка устарела или неверна.');
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
            <div style={{ background: 'white', padding: '40px', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '350px' }}>
                <h2 style={{ textAlign: 'center' }}>Новый пароль</h2>
                <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input 
                        type="password" 
                        placeholder="Введите новый пароль" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                        required
                    />
                    <button type="submit" style={{ padding: '12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>
                        Обновить пароль
                    </button>
                </form>
                {status && <p style={{ marginTop: '20px', textAlign: 'center', color: '#4f46e5' }}>{status}</p>}
            </div>
        </div>
    );
};

export default ResetPasswordConfirm;