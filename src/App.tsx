import React, { useState } from 'react'
import { Wifi, Settings, Shield } from 'lucide-react'
import DNSSettings from './components/DNSSettings'
import TailscaleControl from './components/TailscaleControl'
import WifiQRCode from './components/WifiQRCode'

function App() {
  const [activeTab, setActiveTab] = useState('dns')

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold"> Router Control Panel</h1>
      </header>
      <div className="container mx-auto p-4">
        <nav className="flex mb-4">
          <button
            className={`flex items-center px-4 py-2 mr-2 ${activeTab === 'dns' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setActiveTab('dns')}
          >
            <Settings className="mr-2" size={20} />
            DNS Settings
          </button>
          <button
            className={`flex items-center px-4 py-2 mr-2 ${activeTab === 'tailscale' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setActiveTab('tailscale')}
          >
            <Shield className="mr-2" size={20} />
            Tailscale
          </button>
          <button
            className={`flex items-center px-4 py-2 ${activeTab === 'wifi' ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => setActiveTab('wifi')}
          >
            <Wifi className="mr-2" size={20} />
            Wi-Fi QR Code
          </button>
        </nav>
        <main className="bg-white p-6 rounded-lg shadow-md">
          {activeTab === 'dns' && <DNSSettings />}
          {activeTab === 'tailscale' && <TailscaleControl />}
          {activeTab === 'wifi' && <WifiQRCode />}
        </main>
      </div>
    </div>
  )
}

export default App