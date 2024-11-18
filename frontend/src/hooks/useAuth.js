import { useNavigate } from 'react-router-dom'
import { checkAuthStatus } from '../utils/utils'
import { useEffect } from 'react'

export function useAuth() {
    const navigate = useNavigate()
    const isAuthenticated = checkAuthStatus()

    useEffect(() => {
        if (!isAuthenticated)
            navigate('/login')
    }, [isAuthenticated, navigate])

    return isAuthenticated
}
