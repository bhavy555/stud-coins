import { useEffect, useState } from "react"
import { getData } from "../api/api"

function VendorOrders() {

    const [transactions, setTransactions] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await getData("/vendor/transactions")
            setTransactions(data.transactions || [])
        }

        fetchData()
    }, [])

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Orders</h1>

            <div className="mt-4 space-y-2">
                {transactions.map(tx => (
                    <div key={tx.id} className="bg-white p-3 rounded shadow">
                        ₹{tx.amount} from {tx.name}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VendorOrders