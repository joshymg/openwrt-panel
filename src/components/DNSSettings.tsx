import React, { useState, useEffect } from 'react'
import { openwrtApi } from '../services/openwrtApi'

const DNSSettings: React.FC = () => {
  const [primaryDNS, setPrimaryDNS] = useState('')
  const [secondaryDNS, setSecondaryDNS] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDNSSettings()
  }, [])

  const fetchDNSSettings = async () => {
    try {
      setIsLoading(true)
      const { servers } = await openwrtApi.getDNSSettings()
      setPrimaryDNS(servers[0] || '')
      setSecondaryDNS(servers[1] || '')
    } catch (err) {
      setError('Failed to fetch DNS settings')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      await openwrtApi.setDNSSettings([primaryDNS, secondaryDNS].filter(Boolean))
      setError(null)
    } catch (err) {
      setError('Failed to update DNS settings')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading DNS settings...</div>
  if (error) return <div className="text-red-500">{error}</div>

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">DNS Settings</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="primaryDNS" className="block mb-2">Primary DNS</label>
          <input
            type="text"
            id="primaryDNS"
            value={primaryDNS}
            onChange={(e) => setPrimaryDNS(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="secondaryDNS" className="block mb-2">Secondary DNS</label>
          <input
            type="text"
            id="secondaryDNS"
            value={secondaryDNS}
            onChange={(e) => setSecondaryDNS(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={isLoading}>
          Update DNS Settings
        </button>
      </form>
    </div>
  )
}

export default DNSSettings