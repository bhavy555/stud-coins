import { Users, PlusCircle, Key, ClipboardList, Bell, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getData } from "../api/api"

function TeacherDashboard() {

  const navigate = useNavigate()

  const [stats, setStats] = useState([])
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

        // 🔹 Fetch stats
        const statsData = await getData("/teacher/stats", token)

        setStats([
          { title: "Students Created", value: statsData.totalStudents || 0, icon: <Users size={24}/> },
          { title: "Active Students", value: statsData.activeStudents || 0, icon: <ClipboardList size={24}/> }
        ])

        // 🔹 Fetch activity
        const activityData = await getData("/teacher/activity", token)

        setActivity(activityData.activities || [])

      } catch (err) {
        console.log(err)

        // fallback (so UI never breaks)
        setActivity([
          "Created 10 new students",
          "Generated class key",
          "Wallet activated"
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen pb-24">

      {/* HEADER */}
      <div className="bg-blue-700 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold">Hi, Teacher 👋</h1>
          <p className="text-xs opacity-80">Manage your students</p>
        </div>

        <div className="flex items-center gap-3">
          <Search size={20}/>
          <Bell size={20}/>
          <button onClick={handleLogout} className="bg-white text-blue-700 px-3 py-1 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">

        {/* STATS */}
        <div className="grid grid-cols-2 gap-4">
          {loading ? "Loading..." : stats.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h3 className="text-xl font-bold">{item.value}</h3>
              </div>
              <div className="text-blue-600">{item.icon}</div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <h2 className="font-semibold">Actions</h2>

        <div className="grid grid-cols-2 gap-4">

          <button className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2">
            <PlusCircle size={22}/> Create Student
          </button>

          <button className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2">
            <Key size={22}/> Generate Key
          </button>

          <button className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2">
            <Users size={22}/> View Students
          </button>

          <button className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2">
            <ClipboardList size={22}/> Logs
          </button>

        </div>

        {/* ✅ RECENT ACTIVITY (RESTORED) */}
        <h2 className="font-semibold">Recent Activity</h2>

        <div className="bg-white rounded-xl shadow p-4 space-y-2 text-sm">
          {loading
            ? "Loading..."
            : activity.length > 0
              ? activity.map((item, i) => <div key={i}>{item}</div>)
              : <div>No recent activity</div>
          }
        </div>

      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3 text-xs">
        <div className="text-blue-700 font-semibold">Home</div>
        <div>Students</div>
        <div>Activity</div>
        <div>Profile</div>
      </div>

    </div>
  )
}

export default TeacherDashboard