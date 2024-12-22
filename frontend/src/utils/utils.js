import { useNavigate } from 'react-router-dom'

export function checkAuthStatus() {
    return !!localStorage.getItem('accessToken')
}

export async function refreshAccessToken() {
    const refreshToken = localStorage.getItem('refreshToken')

    try {
        const response = await fetch('http://localhost:8000/auth_api/token/refresh/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ refresh: refreshToken}),
        })
        
        const data = await response.json()

        if (response.ok) {
            localStorage.setItem('accessToken', data.access)
            console.log('Токен обновлён')
            return true
        } else {
            console.error('Ошибка при обновлении токена')
            return false
        }
    } catch (error){
        console.error('Ошибка при обновлении токена')
        return false
    }
}

export async function apiRequest(url, options) {
    const accessToken = localStorage.getItem('accessToken')
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
    }

    try {
        let response = await fetch(url, options)
        
        if (response.status === 401) {
        const tokenRefreshed = await refreshAccessToken()

            if (tokenRefreshed) {
                options.headers['Authorization'] = `Bearer ${localStorage.getItem('accessToken')}`
                return fetch(url, options)
            }
        }
        
        return response
        } catch(error) {
            console.error('Ошибка при выполнении запроса:', error)
            throw error
        
        }   
}

export async function fetchUserProfile() {
    const accessToken = localStorage.getItem('accessToken')

    try {
        const response = await fetch('http://localhost:8000/auth_api/home/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`
            },
        })  
        const data = await response.json()

        if (response.ok) return data
        else return null
    } catch(error) {
        console.error('Ошибка запроса', error)
        return null
    }
}

export async function handleLogout() {
    const refreshToken = localStorage.getItem('refreshToken')
    const accessToken = localStorage.getItem('accessToken')

    try {
        const response = await fetch('http://localhost:8000/auth_api/logout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({refresh: refreshToken}),
        })

        if (response.ok) {
            console.log('Токен удалён')
        } else {
            console.log('Ошибка при удалении токена')   
        }
    } catch(error) {
        console.log('Ошибка при выполнении логаута:', error)   
    }

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
}