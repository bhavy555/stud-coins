import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

function PaymentSuccess() {
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        // block direct access
        if (!location.state?.paid) {
            navigate("/user")
            return
        }

        // ✅ auto redirect after 2 seconds
        const timer = setTimeout(() => {
            navigate("/user")
        }, 2000)

        return () => clearTimeout(timer)

    }, [])
}

export default PaymentSuccess
