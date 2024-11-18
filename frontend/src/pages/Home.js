import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import { fetchUserProfile, handleLogout } from "../utils/utils"
import { useNavigate } from "react-router-dom"

function Home() {
    const [userData, setUserData] = useState(null)
    const navigate = useNavigate()

    function logout() {
        handleLogout()
        navigate('/login')
    } 

    const isAuth = useAuth()

    useEffect(() => {
        if (isAuth) {
            const getUserData = async () => {
                const data = await fetchUserProfile()
                setUserData(data)
            }
            getUserData()
        }
    }, [isAuth])

    return (
        <div>
            <h2>Логин: {userData ? userData.username : <p>...</p>}</h2>
            <button onClick={logout}>Выйти</button>
        </div>
    )
}

export default Home