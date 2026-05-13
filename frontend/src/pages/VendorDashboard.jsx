import { CreditCard, ShoppingBag, Tag, BarChart3, Bell, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { getData } from "../api/api"

function VendorDashboard() {

  const navigate = useNavigate()

  const [stats, setStats] = useState([
    { title: "Today Sales", value: "₹0", icon: <CreditCard size={24}/> },
    { title: "Orders", value: "0", icon: <ShoppingBag size={24}/> }
  ])

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")

        // 🔹 Stats
        const statsData = await getData("/vendor/stats", token)

        setStats([
          {
            title: "Today Sales",
            value: `₹${statsData.sales || 0}`,
            icon: <CreditCard size={24}/>
          },
          {
            title: "Orders",
            value: statsData.orders || 0,
            icon: <ShoppingBag size={24}/>
          }
        ])

        // 🔹 Transactions
        const txnData = await getData("/vendor/transactions", token)
        setTransactions(txnData.transactions || [])

      } catch (err) {
        console.log(err)

        // fallback (your current UI)
        setStats([
          { title: "Today Sales", value: "₹3,250", icon: <CreditCard size={24}/> },
          { title: "Orders", value: "86", icon: <ShoppingBag size={24}/> }
        ])

        setTransactions([
          "₹120 from Rahul",
          "₹80 from Priya",
          "₹200 from Aman"
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
          <h1 className="text-lg font-semibold">Hi, Vendor 👋</h1>
          <p className="text-xs opacity-80">Your business</p>
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
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-4 rounded-xl shadow flex justify-between items-center">
              <div>
                <p className="text-gray-500 text-sm">{item.title}</p>
                <h3 className="text-xl font-bold">
                  {loading ? "..." : item.value}
                </h3>
              </div>
              <div className="text-blue-600">{item.icon}</div>
            </div>
          ))}
        </div>

        {/* ACTIONS */}
        <h2 className="font-semibold">Vendor Actions</h2>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate("/vendor/receive")}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2"
          >
            <CreditCard size={22} /> Receive
          </button>

          <button
            onClick={() => navigate("/vendor/offers")}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2"
          >
            <Tag size={22} /> Offer
          </button>

          <button
            onClick={() => navigate("/vendor/orders")}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2"
          >
            <ShoppingBag size={22} /> Orders
          </button>

          <button
            onClick={() => navigate("/vendor/reports")}
            className="bg-white rounded-xl shadow p-4 flex flex-col items-center gap-2"
          >
            <BarChart3 size={22} /> Reports
          </button>
        </div>

        {/* TRANSACTIONS */}
        <h2 className="font-semibold">Recent Transactions</h2>

        <div className="bg-white rounded-xl shadow p-4 text-sm space-y-2">

          {loading
            ? "Loading..."
            : transactions.length
              ? transactions.map((txn, i) => (
                  <div key={i}>
                    {typeof txn === "string"
                      ? txn
                      : `₹${txn.amount} from ${txn.name}`}
                  </div>
                ))
              : "No transactions"
          }

        </div>

      </div>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3 text-xs">
        <div className="text-blue-700 font-semibold">Home</div>
        <div>Orders</div>
        <div>Reports</div>
        <div>Profile</div>
      </div>

    </div>
  )
}

export default VendorDashboard