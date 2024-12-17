import React, { useState } from "react";
import { login } from "../api/authApi";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await login(username, password);
            localStorage.setItem("access", response.data.access);
            localStorage.setItem("refresh", response.data.refresh);
            alert("Успешный вход!");
            navigate("/");
        } catch (error) {
            console.error("Ошибка авторизации:", error);
            alert("Неправильные данные для входа");
        }
    };

    return (
        <div>
            <h2>Вход</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Логин"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Войти</button>
            </form>
        </div>
    );
}

export default LoginPage;