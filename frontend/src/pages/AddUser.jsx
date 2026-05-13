import { useState } from "react"
import { createUserAPI } from "../api/adminApi"
import { toast } from "sonner"

function AddUser({ role }) {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async () => {
        if (!username || !password) {
            return toast.error("All fields required")
        }

        try {
            setLoading(true)

            const res = await createUserAPI({
                username,
                password,
                role
            })

            if (!res) throw new Error()

            toast.success(`${role} created successfully`)

            setUsername("")
            setPassword("")

        } catch {
            toast.error("Failed to create user")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 space-y-4">

            <h2 className="text-lg font-semibold">
                Add {role}
            </h2>

            <input
                type="text"
                placeholder="Username"
                className="w-full p-2 border rounded"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                className="w-full p-2 border rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
                onClick={handleSubmit}
                className="bg-blue-600 text-white px-4 py-2 rounded"
                disabled={loading}
            >
                {loading ? "Creating..." : "Create"}
            </button>

        </div>
    )
}

export default AddUser