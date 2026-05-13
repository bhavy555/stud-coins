import { useEffect, useState } from "react"
// import { getData, postData } from "../api/api"
import { Check, X } from "lucide-react"
import { Toaster, toast } from "sonner"
// import confetti from "canvas-confetti"
import {
  getPendingRequestsAPI,
  approveRequestAPI,
  rejectRequestAPI
} from "../api/adminApi"
function AdminApproval() {

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [generatedKeys, setGeneratedKeys] = useState({})
  const [processingIds, setProcessingIds] = useState([])
  const [removingIds, setRemovingIds] = useState([])

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token")
      const data = await getPendingRequestsAPI(token)

      setRequests(data?.requests || [])
    } catch (err) {
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const removeWithAnimation = (id) => {
    setRemovingIds(prev => [...prev, id])

    setTimeout(() => {
      setRequests(prev => prev.filter(r => r.id !== id))
    }, 250)
  }

  const handleApprove = async (id) => {
    if (processingIds.includes(id)) return

    try {
      setProcessingIds(prev => [...prev, id])

      const token = localStorage.getItem("token")
      const res = await approveRequestAPI(id, token)

      if (!res) throw new Error("No response")

      setGeneratedKeys(prev => ({
        ...prev,
        [id]: res.secretKey
      }))

      toast.success("Approved 🎉")

      // 🔥 REAL-TIME TRIGGER
      window.dispatchEvent(new Event("admin-update"))

      setTimeout(() => {
        removeWithAnimation(id)
      }, 150)

    } catch (err) {
      console.log(err)
      toast.error("Approval failed")
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id))
    }
  }

  const handleReject = async (id) => {
    if (processingIds.includes(id)) return

    try {
      setProcessingIds(prev => [...prev, id])

      const token = localStorage.getItem("token")
      const res = await rejectRequestAPI(id, token)

      if (!res) throw new Error("No response")

      toast.error("Rejected ❌")

      // 🔥 REAL-TIME TRIGGER
      window.dispatchEvent(new Event("admin-update"))

      setTimeout(() => {
        removeWithAnimation(id)
      }, 150)

    } catch (err) {
      console.log(err)
      toast.error("Reject failed")
    } finally {
      setProcessingIds(prev => prev.filter(pid => pid !== id))
    }
  }

  return (
    <div className="space-y-4">

      <h2 className="text-lg font-semibold">
        Approval Requests
      </h2>

      {loading ? (
        <div>Loading...</div>
      ) : requests.length === 0 ? (
        <div className="text-gray-500 text-sm">
          No pending requests
        </div>
      ) : (
        requests.map((req) => {

          const isProcessing = processingIds.includes(req.id)
          const isRemoving = removingIds.includes(req.id)

          return (
            <div
              key={req.id}
              className={`bg-white p-4 rounded-2xl border shadow-sm flex justify-between items-center transition-all duration-300
                ${isRemoving ? "opacity-0 scale-95" : "opacity-100 scale-100"}
              `}
            >
              <div>
                <div className="font-medium text-gray-800">
                  {req.username}
                </div>

                <div className="text-xs text-gray-500">
                  Role: {req.role}
                </div>
              </div>

              <div className="flex gap-2">

                <button
                  onClick={() => handleApprove(req.id)}
                  disabled={isProcessing}
                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {isProcessing ? "..." : <Check size={14} />}
                  {isProcessing ? "Processing" : "Approve"}
                </button>

                <button
                  onClick={() => handleReject(req.id)}
                  disabled={isProcessing}
                  className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition disabled:opacity-50"
                >
                  {isProcessing ? "..." : <X size={14} />}
                  {isProcessing ? "Processing" : "Reject"}
                </button>

              </div>
            </div>
          )
        })
      )}

    </div>
  )
}

export default AdminApproval