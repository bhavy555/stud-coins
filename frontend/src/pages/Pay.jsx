import { useSearchParams, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { getData, postData } from "../api/api"
import { toast } from "sonner"

function Pay() {
    const [params] = useSearchParams()
    const vendorId = params.get("userId")

    const navigate = useNavigate()

    const [amount, setAmount] = useState("")
    const [vendorName, setVendorName] = useState("")
    const [loading, setLoading] = useState(false)

    // ✅ Fetch vendor name
    useEffect(() => {
        const fetchVendor = async () => {
            try {
                const data = await getData("/student/vendors")
                const vendor = data?.vendors?.find(
                    v => v.id === Number(vendorId)
                )

                setVendorName(vendor?.username || "Vendor")
            } catch (err) {
                console.log(err)
            }
        }

        if (vendorId) fetchVendor()
    }, [vendorId])

    // ✅ Handle payment
    const handlePay = async () => {
        if (!amount || amount <= 0) {
            toast.error("Enter valid amount")
            return
        }

        try {
            setLoading(true)

            const res = await postData("/student/pay", {
                amount: Number(amount),
                vendorId
            })

            if (res?.message) {
                toast.success(`Paid ₹${amount} to ${vendorName}`)

                navigate("/success", {
                    state: {
                        paid: true,
                        amount,
                        vendorName
                    }
                })
            } else {
                toast.error("Payment failed")
            }

        } catch (err) {
            console.log(err)
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-6 space-y-5">

                {/* HEADER */}
                <div className="text-center">
                    <h1 className="text-xl font-bold text-gray-800">
                        Pay Now
                    </h1>
                    <p className="text-sm text-gray-500">
                        Secure payment
                    </p>
                </div>

                {/* VENDOR INFO */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-sm text-gray-500">Paying to</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {vendorName || "Loading..."}
                    </p>
                </div>

                {/* AMOUNT INPUT */}
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full border rounded-lg p-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                {/* PAY BUTTON */}
                <button
                    onClick={handlePay}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-semibold text-white transition ${loading
                            ? "bg-gray-400"
                            : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {loading ? "Processing..." : `Pay ₹${amount || 0}`}
                </button>

            </div>

        </div>
    )
}

export default Pay