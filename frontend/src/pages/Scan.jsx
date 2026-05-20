import { Html5Qrcode } from "html5-qrcode"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

function Scan() {

    const [started, setStarted] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {

        const scanner = new Html5Qrcode("reader")

        window.currentScanner = scanner

        let scanned = false

        const startCamera = async () => {

            try {

                await scanner.start(
                    { facingMode: "environment" },
                    {
                        fps: 10,
                        qrbox: 250
                    },

                    async (decodedText) => {

                        if (scanned) return

                        scanned = true

                        try {

                            const url = new URL(decodedText)

                            const userId =
                                url.searchParams.get("userId")

                            if (!userId) {
                                toast.error("Invalid QR")
                                return
                            }

                            await scanner.stop()
                            await scanner.clear()

                            navigate(`/pay?userId=${userId}`)

                        } catch (err) {

                            toast.error("Invalid QR")

                            console.log(err)
                        }
                    }
                )

                setStarted(true)

            } catch (err) {

                console.log(err)

                toast.error(
                    "Camera permission denied or camera unavailable"
                )
            }
        }

        startCamera()

        // ✅ AUTO STOP WHEN PAGE HIDDEN
        const handleVisibility = async () => {

            if (
                document.hidden &&
                window.currentScanner
            ) {
                try {

                    await window.currentScanner.stop()

                    await window.currentScanner.clear()

                    setStarted(false)

                } catch (err) {
                    console.log(err)
                }
            }
        }

        document.addEventListener(
            "visibilitychange",
            handleVisibility
        )

        // ✅ CLEANUP
        return async () => {

            document.removeEventListener(
                "visibilitychange",
                handleVisibility
            )

            try {

                if (scanner) {

                    await scanner.stop()

                    await scanner.clear()
                }

            } catch (err) {
                console.log("Scanner cleanup")
            }
        }

    }, [])

    return (

        <div className="min-h-screen bg-black flex flex-col">

            <div className="bg-blue-700 text-white p-4 text-center font-semibold">
                Scan QR
            </div>

            <div
                id="reader"
                className="flex-1"
            />

            {!started && (
                <div className="p-4 text-center text-white">
                    Opening camera...
                </div>
            )}

        </div>
    )
}

export default Scan