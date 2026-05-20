import { useEffect, useState } from "react"
import { getData, deleteData, putData } from "../api/api"
import { toast } from "sonner"

function ManageUsers() {

    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [editingId, setEditingId] = useState(null)

    const [form, setForm] = useState({
        username: "",
        role: ""
    })

    const fetchUsers = async () => {
        try {
            const data = await getData("/admin/users")
            setUsers(data?.users || [])
        } catch (err) {
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const startEdit = (user) => {
        setEditingId(user.id)
        setForm({
            username: user.username,
            role: user.role
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setForm({ username: "", role: "" })
    }

    const saveEdit = async (id) => {
        try {
            const res = await putData(`/admin/users/${id}`, form)

            if (!res) throw new Error()

            setUsers(prev =>
                prev.map(u =>
                    u.id === id ? { ...u, ...form } : u
                )
            )

            toast.success("User updated")
            cancelEdit()

        } catch (err) {
            toast.error("Update failed")
        }
    }

    const handleDelete = async (id) => {
        try {
            await deleteData(`/admin/users/${id}`)
            setUsers(prev => prev.filter(u => u.id !== id))
            toast.success("Deleted")
        } catch {
            toast.error("Delete failed")
        }
    }

    return (
        <div className="p-4 space-y-3">

            <h2 className="text-lg font-semibold">Manage Users</h2>

            {loading ? "Loading..." : users.map(user => (

                <div key={user.id} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">

                    <div className="space-y-1">

                        {editingId === user.id ? (
                            <>
                                <input
                                    className="border p-1 rounded w-full"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                />

                                <select
                                    className="border p-1 rounded w-full"
                                    value={form.role}
                                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                                >
                                    <option value="user">user</option>
                                    <option value="teacher">teacher</option>
                                    <option value="vendor">vendor</option>
                                    <option value="admin">admin</option>
                                </select>
                            </>
                        ) : (
                            <>
                                <div className="font-medium">{user.username}</div>
                                <div className="text-xs text-gray-500">{user.role}</div>
                            </>
                        )}

                    </div>

                    <div className="flex gap-2">

                        {editingId === user.id ? (
                            <>
                                <button
                                    onClick={() => saveEdit(user.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    Save
                                </button>

                                <button
                                    onClick={cancelEdit}
                                    className="bg-gray-300 px-3 py-1 rounded"
                                >
                                    Cancel
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={() => startEdit(user)}
                                    className="bg-blue-500 text-white px-3 py-1 rounded"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </>
                        )}

                    </div>

                </div>

            ))}

        </div>
    )
}

export default ManageUsers