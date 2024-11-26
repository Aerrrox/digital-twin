import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')
    const navigate = useNavigate()

    const handleRegister = async () => {
    const response = await fetch('http://localhost:8000/auth_api/register/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
    })
    const data = await response.json()

    if (response.ok) {
        localStorage.setItem('accessToken', data.access);
        localStorage.setItem('refreshToken', data.refresh);
        alert(data.message)
        navigate('/home')
    } else {
        alert(data.error)
    }
    }

    return (
    <div>
        <h2>Регистрация</h2>
        <input placeholder="Имя пользователя" onChange={(e) => setUsername(e.target.value)} />
        <input type="password" placeholder="Пароль" onChange={(e) => setPassword(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <button onClick={handleRegister}>Зарегистрироваться</button>
    </div>
    )
    }

export default Register