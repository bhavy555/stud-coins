import { useState } from "react"
import { useNavigate } from "react-router-dom"

function ForgotPassword() {

    const navigate = useNavigate()

    const [username, setUsername] = useState("")
    const [recoveryKey, setRecoveryKey] = useState("")
    const [newPassword, setNewPassword] = useState("")

    const handleReset = async () => {

        const res = await fetch(
            "http://10.195.203.45:5000/api/auth/forgot-password",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    recoveryKey,
                    newPassword
                })
            }
        )

        const data = await res.json()

        alert(data.message)

        if (res.ok) {
            navigate("/")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <div className="bg-white p-6 rounded-xl shadow w-96 space-y-4">

                <h1 className="text-xl font-bold text-center">
                    Reset Password
                </h1>

                <input
                    placeholder="Username"
                    className="w-full border p-2 rounded"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    placeholder="Recovery Key"
                    className="w-full border p-2 rounded"
                    value={recoveryKey}
                    onChange={(e) => setRecoveryKey(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border p-2 rounded"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <button
                    onClick={handleReset}
                    className="w-full bg-green-600 text-white p-2 rounded"
                >
                    Update Password
                </button>

            </div>

        </div>
    )
}

export default ForgotPassword