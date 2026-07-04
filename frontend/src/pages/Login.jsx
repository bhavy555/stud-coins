import { useState } from "react"
import { useNavigate } from "react-router-dom"


function Login() {

const [username, setUsername] = useState("")
const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    try {
      // const res = await fetch("http://localhost:5000/login", {
      const res = await fetch("http://10.39.241.45:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      })

      const data = await res.json()

      if (!res.ok) {
        alert(data.message || "Login failed")
        return
      }

      // ✅ STORE EVERYTHING SAFELY
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)
      localStorage.setItem("userId", data.userId)

      console.log("LOGIN OK:", data)

      // ✅ SAFETY CHECK
      if (!data.userId) {
        console.error("userId missing from backend response")
      }

      // ✅ REDIRECT
      switch (data.role) {
        case "admin":
          console.log("GOING TO ADMIN")
          navigate("/admin")
          break
        case "user":
          navigate("/user")
          break
        case "teacher":
          navigate("/teacher")
          break
        case "vendor":
          navigate("/vendor")
          break
        default:
          // console.log("ROLE RECEIVED:", data.role)
          navigate("/")
      }

    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-80 space-y-4">

        <h1 className="text-xl font-bold text-center">
          StudCoin Login / Signup
        </h1>

        <input
            type="text"
            placeholder="Username"
            className="w-full p-2 border rounded"
            value={username}
            onChange={(e)=>setUsername(e.target.value)}
        />

        <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/forgot-password")}
          className="w-full text-red-500 text-sm"
        >
          Forgot Password?
        </button>
        {/* ✅ SIGNUP BUTTON */}
        <button
          onClick={() => navigate("/signup")}
          className="w-full border border-blue-600 text-blue-600 p-2 rounded"
        >
          Go to Signup
        </button>

      </div>

    </div>
  )
}

export default Login