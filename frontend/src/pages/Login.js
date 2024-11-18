import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Login() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    const handleLogin = async () => {
    const response = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    const data = await response.json()

    if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        alert(data.message)
        navigate('/home') // Перенаправляем на страницу логина
    } else {
        alert(data.error)
    }
    }

    return (
    <div>
        <h2>Авторизация</h2>
        <input placeholder="Имя пользователя" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleLogin}>Войти</button>
        <button onClick={() => navigate('/register')}>Регистрация</button>
    </div>
    )
    }

export default Login