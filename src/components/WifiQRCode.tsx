import React, { useState, useEffect } from 'react'
import { openwrtApi } from '../services/openwrtApi'

const WifiQRCode: React.FC = () => {
  const [ssid, setSSID] = useState('')
  const [password, setPassword] = useState('')
  const [qrCode, setQRCode] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchWifiSettings()
  }, [])

  const fetchWifiSettings = async () => {
    try {
      setIsLoading(true)
      const { ssid } = await openwrtApi.getWifiSettings()
      setSSID(ssid)
    } catch (err) {
      setError('Failed to fetch Wi-Fi settings')
    } finally {
      setIsLoading(false)
    }
  }

  const generateQRCode = (e: React.FormEvent) => {
    e.preventDefault()
    setQRCode(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=WIFI:S:${ssid};T:WPA;P:${password};;`)
  }

  if (isLoading) return <div>Loading Wi-Fi settings...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Wi-Fi QR Code</h2>
      <form onSubmit={generateQRCode} className="mb-4">
        <div className="mb-4">
          <label htmlFor="ssid" className="block mb-2">SSID</label>
          <input
            type="text"
            id="ssid"
            value={ssid}
            onChange={(e) => setSSID(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Generate QR Code
        </button>
      </form>
      {qrCode && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Scan this QR code to connect to Wi-Fi:</h3>
          <img src={qrCode} alt="Wi-Fi QR Code" className="border rounded" />
        </div>
      )}
    </div>
  )
}

export default WifiQRCode