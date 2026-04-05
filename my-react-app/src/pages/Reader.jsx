import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

const Reader = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(
        parseInt(localStorage.getItem(`book-page-${id}`)) || 0
    );

    const token = localStorage.getItem('access');
    const [fontFamily, setFontFamily] = useState(localStorage.getItem('reader-font-family') || '"Georgia", serif');
    const [fontSize, setFontSize] = useState(parseInt(localStorage.getItem('reader-font-size')) || 18);
    const [theme, setTheme] = useState(localStorage.getItem('reader-theme') || 'light');

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        api.get(`books/${id}/`)
            .then(res => {
                setBook(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Ошибка при загрузке книги:", err);
                setLoading(false);
            });
    }, [id, token]);

    useEffect(() => {
    localStorage.setItem('reader-font-size', fontSize);
    localStorage.setItem('reader-theme', theme);
    localStorage.setItem('reader-font-family', fontFamily);
    localStorage.setItem(`book-page-${id}`, currentPage);
}, [fontSize, theme, fontFamily, currentPage, id]);

    if (!token) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100vh', 
                backgroundColor: '#f8fafc',
                fontFamily: '"Inter", sans-serif',
                textAlign: 'center',
                padding: '20px'
            }}>
                <div style={{ 
                    background: 'white', 
                    padding: '40px', 
                    borderRadius: '16px', 
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    maxWidth: '400px'
                }}>
                    <span style={{ fontSize: '50px', marginBottom: '20px', display: 'block' }}>🔒</span>
                    <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>Доступ ограничен</h2>
                    <p style={{ color: '#64748b', marginBottom: '30px', lineHeight: '1.5' }}>
                        Чтобы погрузиться в чтение этой книги, вам нужно авторизоваться в системе.
                    </p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button 
                            onClick={() => navigate('/login')} 
                            style={{ 
                                padding: '14px', 
                                borderRadius: '10px', 
                                border: 'none', 
                                background: '#4f46e5', 
                                color: 'white', 
                                fontWeight: '700', 
                                fontSize: '16px',
                                cursor: 'pointer',
                                transition: '0.2s'
                            }}
                            onMouseOver={(e) => e.target.style.background = '#4338ca'}
                            onMouseOut={(e) => e.target.style.background = '#4f46e5'}
                        >
                            Войти в аккаунт
                        </button>
                        
                        <button 
                            onClick={() => navigate('/catalog')} 
                            style={{ 
                                padding: '12px', 
                                borderRadius: '10px', 
                                border: '1px solid #e2e8f0', 
                                background: 'transparent', 
                                color: '#64748b', 
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                        >
                            Вернуться в каталог
                        </button>
                    </div>
                </div>
            </div>
        );
    }
    if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>Загрузка...</div>;
    if (!book) return <div style={{ padding: '100px', textAlign: 'center' }}>Книга не найдена</div>;

    const paragraphs = book.content ? book.content.split('\n').filter(p => p.trim() !== '') : [];
    const paragraphsPerPage = 10;
    const totalPages = Math.ceil(paragraphs.length / paragraphsPerPage);
    
    const currentParagraphs = paragraphs.slice(
        currentPage * paragraphsPerPage, 
        (currentPage + 1) * paragraphsPerPage
    );

    const themes = {
        light: { bg: '#ffffff', text: '#1e293b', ui: '#f8fafc', border: '#e2e8f0', accent: '#4f46e5' },
        sepia: { bg: '#f4ecd8', text: '#5b4636', ui: '#efe3c4', border: '#dccfb0', accent: '#8c6d46' },
        dark: { bg: '#121212', text: '#e2e8f0', ui: '#1e1e1e', border: '#334155', accent: '#6366f1' }
    };

    const cur = themes[theme];
    const uiFont = '"Inter", "Segoe UI", Roboto, sans-serif';

    const btnStyle = {
        padding: '10px 18px',
        cursor: 'pointer',
        borderRadius: '8px',
        border: `1px solid ${cur.border}`,
        background: cur.ui,
        color: cur.text,
        fontSize: '14px',
        fontWeight: '600',
        fontFamily: uiFont,
        transition: '0.2s'
    };

    return (
        <div style={{ backgroundColor: cur.bg, color: cur.text, minHeight: '100vh', transition: '0.3s', display: 'flex', flexDirection: 'column' }}>
            <header style={{
                position: 'fixed', top: 0, width: '100%', height: '70px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0 40px', backgroundColor: cur.bg, borderBottom: `1px solid ${cur.border}`,
                zIndex: 2000, boxSizing: 'border-box'
            }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => navigate(`/catalog/${id}`)} style={{ ...btnStyle, background: cur.accent, color: 'white', border: 'none' }}>← О книге</button>
                    <button onClick={() => navigate('/catalog')} style={{ ...btnStyle, background: 'transparent', border: `1px solid ${cur.accent}`, color: cur.accent }}>Библиотека</button>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', background: cur.ui, borderRadius: '8px', border: `1px solid ${cur.border}`, overflow: 'hidden' }}>
                        <button onClick={() => setFontSize(prev => Math.max(12, prev - 2))} style={{ ...btnStyle, border: 'none', borderRadius: 0 }}>A-</button>
                        <span style={{ width: '45px', textAlign: 'center', fontWeight: 'bold' }}>{fontSize}</span>
                        <button onClick={() => setFontSize(prev => Math.min(32, prev + 2))} style={{ ...btnStyle, border: 'none', borderRadius: 0 }}>A+</button>
                    </div>
                    <select value={theme} onChange={(e) => setTheme(e.target.value)} style={{ ...btnStyle, padding: '10px' }}>
                        <option value="light">Светлая</option>
                        <option value="sepia">Сепия</option>
                        <option value="dark">Темная</option>
                    </select>
                    <select 
                        value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} style={{ ...btnStyle, padding: '10px' }}>
                        <option value='"Georgia", serif'>С засечками</option>
                        <option value='"Inter", sans-serif'>Без засечек</option>
                        <option value='"Courier New", monospace'>Печатная машинка</option>
                    </select>
                </div>
            </header>

            <main style={{ 
    maxWidth: '750px', 
    margin: '0 auto', 
    padding: '120px 25px 40px',
    fontSize: `${fontSize}px`, 
    lineHeight: '1.8', 
    fontFamily: fontFamily, 
    textAlign: 'justify',
    flex: 1
}}>
    <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '30px', 
        fontSize: '2em', 
        color: theme === 'dark' ? '#ffffff' : '#000000',
        fontWeight: '900',
        lineHeight: '1.2'
    }}>
        {book.title}
    </h1>
    
    <div className="content">
        {currentParagraphs.map((para, idx) => {
            const isHeader = para.length < 30;
            return (
                <p key={idx} style={{ 
                    textAlign: isHeader ? 'center' : 'justify', 
                    fontWeight: isHeader ? 'bold' : 'normal',
                    marginTop: isHeader ? '2em' : '1em',
                    textIndent: isHeader ? '0' : '1.5em',
                    color: cur.text
                }}>
                    {para}
                </p>
            );
        })}
    </div>
</main>

            <footer style={{
                position: 'fixed', bottom: 0, width: '100%', height: '60px',
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                backgroundColor: cur.ui, borderTop: `1px solid ${cur.border}`,
                gap: '20px', zIndex: 2000
            }}>
                <button 
                    disabled={currentPage === 0}
                    onClick={() => { setCurrentPage(p => p - 1); window.scrollTo(0,0); }}
                    style={{ ...btnStyle, opacity: currentPage === 0 ? 0.5 : 1 }}
                >
                    Назад
                </button>
                
                <span style={{ fontFamily: uiFont, fontSize: '14px', fontWeight: 'bold' }}>
                    Страница {currentPage + 1} из {totalPages}
                </span>

                <button 
                    disabled={currentPage === totalPages - 1}
                    onClick={() => { setCurrentPage(p => p + 1); window.scrollTo(0,0); }}
                    style={{ ...btnStyle, opacity: currentPage === totalPages - 1 ? 0.5 : 1 }}
                >
                    Вперед
                </button>
            </footer>
        </div>
    );
};

export default Reader;