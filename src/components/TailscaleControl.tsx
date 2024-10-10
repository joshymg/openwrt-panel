import React, { useState, useEffect } from 'react'
import { openwrtApi } from '../services/openwrtApi'

const TailscaleControl: React.FC = () => {
  const [isTailscaleEnabled, setIsTailscaleEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchTailscaleStatus()
  }, [])

  const fetchTailscaleStatus = async () => {
    try {
      setIsLoading(true)
      const status = await openwrtApi.getTailscaleStatus()
      setIsTailscaleEnabled(status)
    } catch (err) {
      setError('Failed to fetch Tailscale status')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleTailscale = async () => {
    try {
      setIsLoading(true)
      await openwrtApi.setTailscaleStatus(!isTailscaleEnabled)
      setIsTailscaleEnabled(!isTailscaleEnabled)
      setError(null)
    } catch (err) {
      setError('Failed to toggle Tailscale')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading Tailscale status...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Tailscale Control</h2>
      <div className="flex items-center">
        <span className="mr-4">Tailscale is currently {isTailscaleEnabled ? 'enabled' : 'disabled'}</span>
        <button
          onClick={toggleTailscale}
          className={`px-4 py-2 rounded ${
            isTailscaleEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          } text-white`}
          disabled={isLoading}
        >
          {isTailscaleEnabled ? 'Disable' : 'Enable'} Tailscale
        </button>
      </div>
    </div>
  )
}

export default TailscaleControl