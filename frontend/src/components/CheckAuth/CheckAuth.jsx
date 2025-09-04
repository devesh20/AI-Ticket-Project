import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loader from '../Loader/Loader'

function CheckAuth({children, protectedRoute}) {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem("token")
            
            if (protectedRoute) {
                // For protected routes, redirect to login if no token
                if (!token) {
                    console.log('CheckAuth - Redirecting to login (no token)')
                    navigate("/login", { replace: true })
                    return
                }
            } else {
                // For public routes (login/signup), redirect to home if already authenticated
                if (token) {
                    console.log('CheckAuth - Redirecting to home (has token)')
                    navigate("/", { replace: true })
                    return
                }
            }
            
            // If we reach here, authentication check passed
            console.log('CheckAuth - Authentication check passed')
            setLoading(false)
        }

        // Small delay to ensure navigation is ready
        const timer = setTimeout(checkAuth, 100)
        
        return () => clearTimeout(timer)
    }, [navigate, protectedRoute])

    if (loading) {
        return <Loader/>
    }

    return children
}

export default CheckAuth