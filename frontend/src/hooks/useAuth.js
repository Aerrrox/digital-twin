import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { checkAuthStatus, fetchUserProfile } from '../utils/utils';

export function useAuth() {
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate()
    const isAuthenticated = checkAuthStatus()

    useEffect(() => {
        if (!isAuthenticated)
            navigate('/login')
    }, [isAuthenticated, navigate])

    useEffect(() => {
        if (isAuthenticated) {
          const getUserData = async () => {
            const data = await fetchUserProfile();
            if (data === null) navigate('/login')
            setUserData(data);
          };
          getUserData();
        }
      }, [isAuthenticated, navigate]);

    return userData
}
