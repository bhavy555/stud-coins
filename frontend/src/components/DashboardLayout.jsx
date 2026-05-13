import { useNavigate } from "react-router-dom"

function DashboardLayout({ children }) {

  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOP NAVBAR */}
      <div className="bg-white shadow p-4 flex justify-between items-center">

        <h1 className="text-lg font-semibold text-blue-600">
          StudCoin
        </h1>

        <div className="flex items-center gap-4">

          <span className="text-sm bg-gray-200 px-3 py-1 rounded">
            {role}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>

        </div>

      </div>

      {/* PAGE CONTENT */}
      <div className="p-4">
        {children}
      </div>

    </div>
  )
}

export default DashboardLayout