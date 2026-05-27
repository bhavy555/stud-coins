import { Bell, Search, QrCode } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useMemo } from "react"
import { getData, postData } from "../api/api"

function UserDashboard() {

  const navigate = useNavigate()

  const [wallet, setWallet] = useState(0)
  const [offers, setOffers] = useState([])
  const [vendors, setVendors] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const [addAmount, setAddAmount] = useState("")
  const [payAmount, setPayAmount] = useState("")
  const [selectedVendor, setSelectedVendor] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showHistory, setShowHistory] = useState(false)
  const [showOffers, setShowOffers] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [profilePhoto, setProfilePhoto] = useState("")

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  // WALLET
  const fetchWallet = async () => {
    const data = await getData("/user/wallet")
    setWallet(data?.balance || 0)
  }

  // ADD MONEY
  const handleAddMoney = async () => {
    if (!addAmount || addAmount <= 0) return alert("Enter valid amount")

    const res = await postData("/user/add-money", {
      amount: Number(addAmount)
    })

    alert(res?.message)
    setAddAmount("")
    fetchWallet()
  }

  // PAY
  const handlePay = async () => {
    if (!payAmount || payAmount <= 0) return alert("Enter valid amount")

    const res = await postData("/user/pay", {
      amount: Number(payAmount),
      vendorId: selectedVendor
    })

    alert(res?.message)

    setPayAmount("")
    setSelectedVendor(null)

    fetchWallet()

    const txData = await getData("/user/transactions")
    console.log(
      "RAW TRANSACTIONS:",
      JSON.stringify(txData, null, 2)
    )

    setTransactions(txData?.transactions || [])
    // setTransactions(txData.transactions || [])
  }

  // LOAD DATA
  useEffect(() => {
    const load = async () => {
      try {
        await fetchWallet()

        const offersData = await getData("/user/offers")
        setOffers(offersData?.offers || [])

        const vendorData = await getData("/user/vendors")
        // console.log("RAW VENDORS FROM API:", vendorData)
        setVendors(vendorData?.vendors || [])

        const txData = await getData("/user/transactions")
        setTransactions(txData?.transactions || [])

        const savedPhoto =
          localStorage.getItem("profilePhoto")

        if (savedPhoto) {
          setProfilePhoto(savedPhoto)
        }

      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  // 📌 CATEGORY LIST (DYNAMIC FROM DATA ALSO POSSIBLE)
  const categories = [
    "all",
    "food",
    "books",
    "stationery",
    "services",
    "carpenter",
    "electrician"
  ]

  // 📌 FILTER + SORT LOGIC (IMPORTANT PART)
  const filteredVendors = useMemo(() => {

    let data = [...vendors]

    if (selectedCategory !== "all") {
      data = data.filter(v => v.category === selectedCategory)
    }

    data.sort((a, b) => (b.discount || 0) - (a.discount || 0))

    return data

  }, [vendors, selectedCategory])

  const handlePhotoUpload = async (e) => {

    try {

      const file = e.target.files[0]

      if (!file) return

      const formData = new FormData()

      formData.append("photo", file)

      const token = localStorage.getItem("token")

      const res = await fetch(
        "http://10.76.202.45:5000/api/profile/upload-photo",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      )

      const data = await res.json()

      if (!res.ok) {
        return alert(data.message || "Upload failed")
      }

      const photoUrl =
        `http://10.76.202.45:5000/uploads/profiles/${data.photo}`

      setProfilePhoto(photoUrl)

      localStorage.setItem(
        "profilePhoto",
        photoUrl
      )

    } catch (err) {

      console.log(err)

      alert("Photo upload failed")

    }

  }

  return (
    <div className="bg-gray-50 min-h-screen pb-24">

      {/* HEADER */}
      <div className="bg-blue-700 text-white p-4 flex justify-between items-center rounded-b-2xl">

        <div>
          <h1 className="text-lg font-semibold">Hi, User 👋</h1>
          <p className="text-xs opacity-80">Welcome back</p>
        </div>

        <div className="flex items-center gap-3">
          <Search size={20} />
          <Bell size={20} />
          <button onClick={handleLogout} className="bg-white text-blue-700 px-3 py-1 rounded-lg text-sm">
            Logout
          </button>
        </div>

      </div>

      <div className="p-4 space-y-5">

        {/* WALLET */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white rounded-2xl p-5 shadow-lg">

          <div className="text-sm opacity-80">Wallet Balance</div>

          <div className="text-3xl font-bold mt-2">
            {loading ? "..." : `₹ ${wallet}`}
          </div>

          <div className="flex gap-2 mt-4">

            <input
              type="number"
              placeholder="Add money"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              className="w-full p-2 rounded text-black"
            />

            <button
              onClick={handleAddMoney}
              className="bg-white text-blue-700 px-4 rounded-lg font-medium"
            >
              Add
            </button>

          </div>

        </div>

        {/* CATEGORY FILTER */}
        <div className="flex gap-2 overflow-x-auto pb-2">

          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 text-sm rounded-full whitespace-nowrap transition ${selectedCategory === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
                }`}
            >
              {cat}
            </button>
          ))}

        </div>

        {/* VENDORS HEADER */}
        <div className="flex justify-between items-center">
          <h2 className="font-semibold">Nearby Vendors</h2>
          <span className="text-xs text-gray-500">
            Sorted by discount
          </span>
        </div>

        {/* VENDOR CARDS */}
        <div className="space-y-3">

          {filteredVendors.length === 0 && (
            <div className="text-center text-gray-400 py-10">
              No vendors found
            </div>
          )}

          {filteredVendors.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border shadow-sm p-4 space-y-3"
            >

              {/* TOP INFO */}
              <div className="flex justify-between">

                <div>
                  <h2 className="font-semibold text-lg">
                    {v.shopName || v.username}
                  </h2>

                  <p className="text-xs text-gray-500 capitalize">
                    {v.category}
                  </p>
                </div>

                {/* DISCOUNT BADGE */}
                <div className={`text-xs px-2 py-1 rounded-full ${v.discount >= 15
                    ? "bg-green-200 text-green-700"
                    : v.discount >= 5
                      ? "bg-yellow-200 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}>
                  {v.discount || 0}% OFF
                </div>

              </div>

              {/* ACTION */}
              <div className="flex justify-between items-center">

                <button
                  onClick={() => setSelectedVendor(v.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm"
                >
                  Pay
                </button>

                <span className="text-xs text-gray-400">
                  Tap to select
                </span>

              </div>

              {/* PAYMENT INPUT */}
              {selectedVendor === v.id && (
                <div className="flex gap-2 pt-2">

                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full p-2 border rounded-xl"
                  />

                  <button
                    onClick={handlePay}
                    className="bg-green-600 text-white px-4 rounded-xl"
                  >
                    Pay
                  </button>

                </div>
              )}

            </div>
          ))}

        </div>

      </div>

      {/* TRANSACTIONS */}
      <div className="space-y-3">

        <h2 className="font-semibold">
          Recent Transactions
        </h2>

        {transactions.slice(0, 10).map((tx) => {

          // console.log("TX:", tx)


          const myId = Number(localStorage.getItem("userId"))

          const isSent = tx.from === myId

          return (
            <div
              key={tx.id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >

              <div>
                <p className="font-medium">

                  {isSent
                    ? `To ${tx.receiver?.shopName || "Shop"}`
                    : `From ${tx.sender?.username || "User"}`
                  }

                </p>

                <p className="text-xs text-gray-400">
                  {new Date(tx.createdAt).toLocaleString()}
                </p>
              </div>

              <div
                className={`font-semibold ${isSent
                    ? "text-red-500"
                    : "text-green-600"
                  }`}
              >
                {isSent ? "-" : "+"} ₹{tx.amount}
              </div>

            </div>
          )
        })}

      </div>

      {/* PAYMENT HISTORY PANEL */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">

          <div className="bg-white w-full rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">

              <h2 className="text-lg font-semibold">
                Payment History
              </h2>

              <button
                onClick={() => setShowHistory(false)}
                className="text-red-500 font-medium"
              >
                Close
              </button>

            </div>

            {/* HISTORY */}
            <div className="space-y-3">

              {transactions.length === 0 && (
                <div className="text-gray-400 text-center py-10">
                  No payments found
                </div>
              )}

              {transactions.map((tx) => {

                const myId = Number(localStorage.getItem("userId"))
                const isSent = tx.from === myId

                return (
                  <div
                    key={tx.id}
                    className="border rounded-2xl p-4 flex justify-between items-center"
                  >

                    <div>

                      <p className="font-medium">
                        {isSent
                          ? `Paid to ${tx.receiver?.shopName || tx.receiver?.username || "Shop"}`
                          : `Received from ${tx.sender?.username || "User"}`
                        }
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(tx.createdAt).toLocaleString()}
                      </p>

                    </div>

                    <div
                      className={`font-bold ${isSent
                          ? "text-red-500"
                          : "text-green-600"
                        }`}
                    >
                      {isSent ? "-" : "+"} ₹{tx.amount}
                    </div>

                  </div>
                )
              })}

            </div>

          </div>

        </div>
      )}

      {/* OFFERS PANEL */}
      {showOffers && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">

          <div className="bg-gray-100 w-full rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">

              <div>
                <h2 className="text-xl font-bold">
                  Offers & Rewards
                </h2>

                <p className="text-sm text-gray-500">
                  Save more on every payment
                </p>
              </div>

              <button
                onClick={() => setShowOffers(false)}
                className="text-red-500 font-medium"
              >
                Close
              </button>

            </div>

            {/* TOP BANNER */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-5 mb-5 shadow-lg">

              <p className="text-sm opacity-80">
                Special Cashback
              </p>

              <h1 className="text-3xl font-bold mt-1">
                ₹100 Reward
              </h1>

              <p className="text-sm mt-2 opacity-90">
                Complete 5 payments this week
              </p>

            </div>

            {/* OFFERS LIST */}
            <div className="space-y-4">

              {offers.map((offer) => (

                <div
                  key={offer.id}
                  className="bg-white rounded-3xl p-4 shadow-sm border"
                >

                  {/* TOP */}
                  <div className="flex justify-between items-start">

                    <div>

                      <p className="text-lg font-semibold">
                        {offer.title}
                      </p>

                      <p className="text-sm text-gray-500 mt-1 capitalize">
                        {offer.category}
                      </p>

                    </div>

                    {/* DISCOUNT */}
                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {offer.discount}
                    </div>

                  </div>

                  {/* GRAPHICAL BAR */}
                  <div className="mt-4">

                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        style={{
                          width: `${parseInt(offer.discount) || 20}%`
                        }}
                      />

                    </div>

                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>Used 2 times</span>
                      <span>Expires soon</span>
                    </div>

                  </div>

                  {/* BUTTON */}
                  <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-2xl font-medium">
                    Use Offer
                  </button>

                </div>

              ))}

            </div>

          </div>

        </div>
      )}

      {/* PROFILE PANEL */}
      {showProfile && (

        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">

          <div className="bg-white w-full rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-5">

              <h2 className="text-xl font-bold">
                My Profile
              </h2>

              <button
                onClick={() => setShowProfile(false)}
                className="text-red-500"
              >
                Close
              </button>

            </div>

            {/* PROFILE TOP */}
            <div className="flex flex-col items-center text-center">

              {/* PHOTO */}
              <img
                src={
                  profilePhoto ||
                  "https://i.pravatar.cc/150"
                }
                alt="profile"
                className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
              />

              <label className="text-sm text-blue-600 mt-2 cursor-pointer">

                Change Photo

                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handlePhotoUpload}
                />

              </label>

              {/* USERNAME */}
              <h2 className="text-xl font-bold mt-3">
                {localStorage.getItem("username") || "User"}
              </h2>

              {/* UNIQUE ID */}
              <p className="text-gray-500 text-sm mt-1">
                ID: SCN-{localStorage.getItem("userId")}
              </p>

              {/* ROLE */}
              <div className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mt-2">
                USER ACCOUNT
              </div>

            </div>

            {/* WALLET */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-5 mt-6">

              <p className="text-sm opacity-80">
                Available Balance
              </p>

              <h1 className="text-3xl font-bold mt-2">
                ₹ {wallet}
              </h1>

              <button className="mt-4 bg-white text-blue-700 px-4 py-2 rounded-xl font-medium">
                Withdraw Money
              </button>

            </div>

            {/* QR SECTION */}
            <div className="bg-gray-100 rounded-3xl p-5 mt-5 text-center">

              <h3 className="font-semibold mb-4">
                My QR Code
              </h3>

              {/* SAMPLE QR */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=USER-${localStorage.getItem("userId")}`}
                alt="qr"
                className="mx-auto rounded-xl"
              />

              <p className="text-xs text-gray-500 mt-3">
                Scan to pay this user
              </p>

            </div>

            {/* SECURITY */}
            <div className="mt-6 space-y-3">

              <button className="w-full border rounded-2xl py-3 font-medium">
                Change Password
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-500 text-white rounded-2xl py-3 font-medium"
              >
                Logout
              </button>

            </div>

          </div>

        </div>

      )}

      {/* FLOATING QR */}
      <button
        onClick={() => navigate("/scan")}
        className="fixed bottom-20 right-5 bg-blue-700 text-white p-4 rounded-full shadow-lg"
      >
        <QrCode />
      </button>

      {/* BOTTOM NAV */}
      <div className="fixed bottom-0 w-full bg-white border-t flex justify-around p-3 text-xs">

        <div className="text-blue-700 font-semibold">Home</div>
        <div
          onClick={() => setShowHistory(true)}
          className="cursor-pointer"
        >
          Pay
        </div>

        <div
          onClick={() => setShowOffers(true)}
          className="cursor-pointer"
        >
          Offers
        </div>

        <div
          onClick={() => setShowProfile(true)}
          className="cursor-pointer"
        >
          Profile
        </div>

      </div>

    </div>
  )
}

export default UserDashboard