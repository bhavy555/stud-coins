import { QRCodeSVG } from "qrcode.react"

function VendorReceive() {

    const userId = localStorage.getItem("userId")

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Receive Payment</h1>

            <div className="mt-4 flex flex-col items-center">
                <QRCodeSVG
                    value={`http://localhost:5173/pay?userId=${userId}`}
                    size={180}
                />

                <p className="mt-2 text-sm text-gray-500">
                    Vendor ID: {userId}
                </p>
            </div>
        </div>
    )
}

export default VendorReceive