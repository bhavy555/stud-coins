import {
  Users,
  Store,
  UserCheck,
  IndianRupee,
  UserPlus,
  ClipboardList,
  Bell,
  Search
} from "lucide-react"

import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getData } from "../api/api"
import AdminApproval from "./AdminApproval"
import AdminHistory from "./AdminHistory"

function AdminDashboard() {

  const navigate = useNavigate()

  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    vendors: 0,
    revenue: 0
  })

  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        const data = await getData("/admin/stats", token)

        setStats({
          students: data.students || 0,
          teachers: data.teachers || 0,
          vendors: data.vendors || 0,
          revenue: data.revenue || 0
        })

        const activityData = await getData("/admin/activity", token)
        setActivity(activityData.activities || [])

      } catch (err) {
        console.log(err)

        // fallback (your original style)
        setStats({
          students: 1245,
          teachers: 34,
          vendors: 18,
          revenue: 240000
        })

        setActivity([
          "New vendor added",
          "Teacher created",
          "Revenue updated"
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const timeAgo = (date) => {
    const diff = Math.floor((new Date() - new Date(date)) / 1000)

    if (diff < 60) return `${diff}s ago`
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`

    return `${Math.floor(diff / 86400)}d ago`
  }

  return (
    <div className="bg-gray-100 min-h-screen pb-24">

      {/* HEADER */}
      <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
          {/* <p className="text-xs opacity-80">System overview</p> */}
        </div>

        <div className="flex gap-3 items-center">
          <Search size={20}/>
          <Bell size={20}/>
          <button
            onClick={handleLogout}
            className="bg-white text-blue-700 px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* ✅ STATS (UNCHANGED) */}
        <div className="grid grid-cols-2 gap-4">

          <div className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Students</p>
              <h3 className="text-xl font-bold">{loading ? "..." : stats.students}</h3>
            </div>
            <Users />
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Teachers</p>
              <h3 className="text-xl font-bold">{loading ? "..." : stats.teachers}</h3>
            </div>
            <UserCheck />
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Vendors</p>
              <h3 className="text-xl font-bold">{loading ? "..." : stats.vendors}</h3>
            </div>
            <Store />
          </div>

          <div className="bg-white p-4 rounded-xl shadow flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <h3 className="text-xl font-bold">
                {loading ? "..." : `₹${(stats.revenue / 100000).toFixed(1)}L`}
              </h3>
            </div>
            <IndianRupee />
          </div>

        </div>

        {/* ✅ ACTIONS (RESTORED — EXACTLY WHERE THEY SHOULD BE) */}
        <h2 className="font-semibold">Actions</h2>

        <div className="grid grid-cols-2 gap-4">

          <button 
            onClick={() => navigate("/add-teacher")} 
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <UserPlus size={22}/> Add Teacher
          </button>

          <button  
            onClick={() => navigate("/add-vendor")}
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <Store size={22}/> Add Vendor
          </button>

          <button 
            onClick={() => navigate("/manage-users")}
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <Users size={22}/> Manage Users
          </button>

          <button 
            onClick={() => navigate("/logs")}
            className="bg-white p-4 rounded-xl shadow flex flex-col items-center gap-2">
            <ClipboardList size={22}/> Logs
          </button>

        </div>

        {/* ✅ ACTIVITY (UNCHANGED) */}
        <h2 className="font-semibold">Recent Activity</h2>

        <div className="bg-white rounded-xl shadow p-4 space-y-2 text-sm">
          {loading
            ? "Loading..."
            : activity.length
              ? activity.map((a, i) => {
                const isNegative =
                  a.text.toLowerCase().includes("failed") ||
                  a.text.toLowerCase().includes("rejected")

                return (
                  <div key={i} className="flex justify-between text-sm">
                    <span className={isNegative ? "text-red-500" : "text-blue-600"}>
                      {a.text}
                    </span>

                    <span className="text-gray-400 text-xs">
                      {timeAgo(a.time)}
                    </span>
                  </div>
                )
              })
              : "No activity"
          }
        </div>

        <h2 className="font-semibold">History</h2>
        <AdminHistory />
        
        {/* ✅ APPROVAL REQUESTS */}
        <div className="space-y-4">
          <h2 className="font-semibold">Approval Requests</h2>

          <div className="bg-white rounded-xl shadow p-4">
            <AdminApproval />
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard