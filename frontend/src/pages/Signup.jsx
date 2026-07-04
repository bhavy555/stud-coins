import { useState } from "react"
import { useNavigate } from "react-router-dom"

function Signup() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    password: "",
    role: "user",
    secretKey: "",
    category: "",
    shopName: "",
    discount: "0"   // ✅ ADD THIS
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const [loadingKey, setLoadingKey] = useState(false)

  const generatePrivateKey = async () => {
    // const res = await fetch("http://localhost:5000/api/auth/generate-key", {
    const res = await fetch("http://10.195.203.45:5000/api/auth/generate-key", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify({
        username: form.username,
        role: form.role
        })
    })

    const data = await res.json()

    if (res.ok) {
        alert("Request sent to admin for approval")
    } else {
        alert(data.message)
    }
 }

  const handleSignup = async () => {
    // const res = await fetch("http://localhost:5000/api/auth/signup", {
      const res = await fetch("http://10.195.203.45:5000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })

    const data = await res.json()

    if (res.ok) {
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)

      navigate(`/${data.role}`)
    } else {
      alert(data.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-6 rounded-xl shadow w-96 space-y-4">

        <h1 className="text-xl font-bold text-center">
          Signup
        </h1>
        
        {/* ROLE */}
        <select
          name="role"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        >
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>

        {form.role === "vendor" && (
          <div className="space-y-3">

            <input
              type="text"
              placeholder="Shop Name"
              value={form.shopName}
              onChange={(e) => setForm({ ...form, shopName: e.target.value })}
              className="w-full p-2 border rounded"
            />

            {/* CATEGORY */}
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Category</option>
              <option value="food">Food</option>
              <option value="books">Books</option>
              <option value="stationery">Stationery</option>
              <option value="services">Services</option>
              <option value="carpenter">Carpenter</option>
              <option value="electrician">Electrician</option>
            </select>

            {/* DISCOUNT */}
            <select
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
              className="w-full p-2 border rounded"
            >
              <option value="0">No Discount</option>
              <option value="5">5%</option>
              <option value="10">10%</option>
              <option value="15">15%</option>
              <option value="20">20%</option>
            </select>

          </div>
        )}

        <input
          name="username"
          placeholder="Username"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full p-2 border rounded"
          onChange={handleChange}
        />


        {/* USER KEYS */}
        {form.role === "user" && (
          <>
            <input
              name="privateKey"
              placeholder="Admin Private Key"
              className="w-full p-2 border rounded"
              onChange={handleChange}
            />
          </>
        )}

        {/* VENDOR KEY */}
        {form.role === "vendor" && (
          <input
            name="secretKey"
            placeholder="Admin Vendor Key"
            className="w-full p-2 border rounded"
            onChange={handleChange}
          />
        )}
        <div className="text-sm text-gray-500 flex items-center gap-2">
            <button
                type="button"
                onClick={() => generatePrivateKey()}
                className="bg-blue-600 text-white px-3 rounded"
                >
                {loadingKey ? "..." : "Generate"}
            </button>
        </div>
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white p-2 rounded"
        >
          Signup
        </button>

      </div>

    </div>
  )
}

export default Signup