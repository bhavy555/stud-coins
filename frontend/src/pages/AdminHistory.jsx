import { useEffect, useState } from "react"
import { getData } from "../api/api"
import { Check, X, Clock, Copy } from "lucide-react"
import { toast } from "sonner"

const timeAgo = (date) => {
    if (!date) return ""

    const seconds = Math.floor((new Date() - new Date(date)) / 1000)

    if (seconds < 60) return "just now"

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} min ago`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hr ago`

    const days = Math.floor(hours / 24)
    return `${days} days ago`
}

function AdminHistory() {

    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchHistory = async () => {
        try {
            const token = localStorage.getItem("token")
            const data = await getData("/admin/history", token)

            setHistory(data?.requests || [])
        } catch (err) {
            console.log(err)
            toast.error("Failed to load history")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchHistory()
        const refresh = () => fetchHistory()

        window.addEventListener("admin-update", refresh)

        return () => {
            window.removeEventListener("admin-update", refresh)
        }
    }, [])

    return (
        <div className="space-y-4">

            <h2 className="text-lg font-semibold">
                Request History
            </h2>

            {loading ? (
                <div>Loading...</div>
            ) : history.length === 0 ? (
                <div className="text-gray-500 text-sm">
                    No history found
                </div>
            ) : (
                <div className="relative border-l-2 border-gray-200 ml-2 space-y-6">

                    {history.map((req) => {

                        const isApproved = req.status === "approved"
                        const isRejected = req.status === "rejected"
                        const isPending = req.status === "pending"

                        const statusText =
                            isApproved ? "Approved ✔" :
                                isRejected ? "Rejected ✖" :
                                    "Pending ⏳"

                        const statusStyle =
                            isApproved ? "bg-green-100 text-green-700" :
                                isRejected ? "bg-red-100 text-red-600" :
                                    "bg-yellow-100 text-yellow-700"

                        const dotColor =
                            isApproved ? "bg-green-500" :
                                isRejected ? "bg-red-500" :
                                    "bg-yellow-400"

                        const actionBy =
                            isApproved ? `Approved by Admin #${req.approvedBy || "-"}` :
                                isRejected ? `Rejected by Admin #${req.rejectedBy || "-"}` :
                                    "Waiting for admin"

                        const actionTime =
                            isApproved ? req.approvedAt :
                                isRejected ? req.rejectedAt :
                                    req.createdAt

                        return (
                            <div key={req.id} className="ml-4 relative">

                                {/* DOT */}
                                <div className={`absolute -left-[10px] top-2 w-3 h-3 rounded-full ${dotColor}`} />

                                {/* CARD */}
                                <div className="bg-white p-4 rounded-2xl border shadow-sm hover:shadow-md transition">

                                    <div className="flex justify-between">

                                        <div>
                                            <div className="font-medium text-gray-800">
                                                {req.username}
                                            </div>

                                            <div className="text-xs text-gray-500">
                                                Role: {req.role}
                                            </div>

                                            {/* STATUS */}
                                            <div className={`inline-block mt-2 px-2 py-0.5 text-xs rounded-full font-medium ${statusStyle}`}>
                                                {statusText}
                                            </div>

                                            {/* ACTION INFO */}
                                            <div className="text-xs text-gray-400 mt-1">
                                                {actionBy}
                                            </div>

                                            {/* TIME */}
                                            <div className="text-xs text-gray-400">
                                                {timeAgo(actionTime)}
                                            </div>

                                            {/* 🔑 GENERATED KEY (ONLY IF APPROVED) */}
                                            {isApproved && req.generatedKey && (
                                                <div className="flex items-center gap-2 mt-2">

                                                    <span className="text-blue-600 text-xs font-medium">
                                                        {req.generatedKey}
                                                    </span>

                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(req.generatedKey)
                                                            toast.success("Key copied 🔥")
                                                        }}
                                                        className="flex items-center gap-1 text-xs bg-gray-200 px-2 py-0.5 rounded hover:bg-gray-300 transition"
                                                    >
                                                        <Copy size={12} />
                                                        Copy
                                                    </button>

                                                </div>
                                            )}

                                        </div>

                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

        </div>
    )
}

export default AdminHistory