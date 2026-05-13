import { Html5Qrcode } from "html5-qrcode"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

function Scan() {
    const navigate = useNavigate()

    useEffect(() => {
        const scanner = new Html5Qrcode("reader")
        let scanned = false

        const stopScanner = async () => {
            try {
                if (scanner && scanner.getState() === 2) {
                    // 2 = running
                    await scanner.stop()
                    scanner.clear()
                }
            } catch (err) {
                console.log("Scanner already stopped")
            }
        }

        scanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },

            async (decodedText) => {
                if (scanned) return
                scanned = true

                try {
                    const url = new URL(decodedText)
                    const userId = url.searchParams.get("userId")

                    if (userId) {
                        await stopScanner()   // ✅ safe stop
                        navigate(`/pay?userId=${userId}`)
                    }
                } catch {
                    alert("Invalid QR")
                }
            }
        )

        // cleanup
        return () => {
            stopScanner()  // ✅ safe, no crash
        }

    }, [])
    return <div id="reader" className="w-full h-full" />
}

export default Scan