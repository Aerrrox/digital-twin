import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import bgImg from "../images/bg.jpg";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const sendRequest = async (url, method, body) => {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || 'Ошибка запроса');
        }
        return data;
    };

    const handleLogin = async () => {
        try {
            const data = await sendRequest('http://localhost:8000/auth_api/login/', 'POST', {
                username,
                password,
            });
            localStorage.setItem('accessToken', data.access);
            localStorage.setItem('refreshToken', data.refresh);
            navigate('/'); // Перенаправляем на главную
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1 style={styles.title}>Авторизация</h1>
                <label style={styles.label} htmlFor="username">
                    Имя пользователя
                </label>
                <input
                    style={styles.input}
                    placeholder="Имя пользователя"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label style={styles.label} htmlFor="password">
                    Пароль
                </label>
                <input
                    style={styles.input}
                    type="password"
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button style={styles.button} onClick={handleLogin}>
                    Войти
                </button>
                <button style={styles.button} onClick={() => navigate('/register')}>
                    Регистрация
                </button>
            </div>
        </div>
    );
}

    const styles = {
        container: {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          backgroundImage: `url(${bgImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
        card: {
          width: '90%',
          maxWidth: '400px',
          padding: '20px',
          borderRadius: '15px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(78, 158, 57, 0.8))',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
          position: 'relative',
        },
        title: {
          fontFamily: "'Poppins', sans-serif",
          color: '#4e9e39',
          fontSize: '2rem',
          marginBottom: '20px',
        },
        form: {
          width: '100%',
        },
        label: {
          display: 'block',
          marginTop: '10px',
          fontWeight: 'bold',
          textAlign: 'left',
        },
        input: {
          width: '100%',
          padding: '10px',
          marginTop: '5px',
          marginBottom: '15px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          boxSizing: 'border-box',
        },
        button: {
          width: '100%',
          padding: '12px',
          backgroundColor: '#4CAF50',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          fontSize: '16px',
          cursor: 'pointer',
          marginBottom: '10px',
          transition: 'transform 0.2s ease',
        },
        buttonSecondary: {
          width: '100%',
          padding: '12px',
          backgroundColor: '#ccc',
          border: 'none',
          borderRadius: '4px',
          fontSize: '16px',
          cursor: 'pointer',
          transition: 'transform 0.2s ease',
        },
        buttonHover: {
          transform: 'scale(1.05)',
        },
      };

export default Login
