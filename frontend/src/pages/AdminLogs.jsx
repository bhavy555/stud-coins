import { useEffect, useState } from "react"
import { getData } from "../api/api"

function AdminLogs() {

    const [logs, setLogs] = useState([])
    const [action, setAction] = useState("")
    const [search, setSearch] = useState("")
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [username, setUsername] = useState("")
    const [role, setRole] = useState("")

    const fetchLogs = async () => {
        const token = localStorage.getItem("token")

        let query = `?`

        if (action) query += `action=${encodeURIComponent(action)}&`
        if (username) query += `username=${encodeURIComponent(username)}&`
        if (role) query += `role=${encodeURIComponent(role)}&`
        if (search) query += `search=${encodeURIComponent(search)}&`
        if (from) query += `from=${from}&`
        if (to) query += `to=${to}&`

        const data = await getData(`/admin/logs${query}`, token)
        setLogs(data?.logs || [])
    }

    useEffect(() => {
        fetchLogs()
    }, [])

    return (
        <div className="p-4 space-y-4">

            <h2 className="text-lg font-semibold">System Logs</h2>

            {/* 🔍 FILTER PANEL */}
            <div className="bg-white p-3 rounded-xl shadow space-y-2">

                <div className="flex gap-2 flex-wrap">

                    {/* ACTION FILTER */}
                    <select
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        className="border p-1 rounded"
                    >
                        <option value="">All Actions</option>
                        <option value="USER_CREATED">User Created</option>
                        <option value="USER_UPDATED">User Updated</option>
                        <option value="APPROVE_REQUEST">Approved</option>
                        <option value="REJECT_REQUEST">Rejected</option>
                    </select>

                    {/* SEARCH */}
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search message..."
                        className="border p-1 rounded"
                    />

                    {/* USERNAME FILTER */}
                    <input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Username..."
                        className="border p-1 rounded"
                    />

                    {/* ROLE FILTER */}
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border p-1 rounded"
                    >
                        <option value="">All Roles</option>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="vendor">Vendor</option>
                        <option value="admin">Admin</option>
                    </select>

                    {/* DATE FILTER */}
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border p-1 rounded"
                    />

                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border p-1 rounded"
                    />

                    <button
                        onClick={fetchLogs}
                        className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                        Apply
                    </button>

                </div>

            </div>

            {/* 📜 LOG LIST */}
            <div className="space-y-2">

                {logs.map((log) => (
                    <div key={log.id} className="bg-white p-3 rounded shadow">

                        <div className="flex justify-between">

                            <span className="font-semibold text-blue-600">
                                {log.action}
                            </span>

                            <span className="text-xs text-gray-400">
                                {new Date(log.createdAt).toLocaleString()}
                            </span>

                        </div>

                        <div className="text-sm text-gray-700 mt-1">
                            {log.message}
                        </div>

                    </div>
                ))}

            </div>

        </div>
    )
}

export default AdminLogs