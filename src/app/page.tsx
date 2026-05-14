'use client';

import React, { useEffect, useRef, useState } from 'react';
import { socket } from '../lib/socket';
import { Toaster, toast } from 'sonner';
import { TrendingUp, Zap, AlertTriangle } from 'lucide-react';

export default function TXDashboard() {
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [detections, setDetections] = useState<any[]>([]);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on('connect', () => {
      setConnectionStatus('Connected to V12 Engine');
      toast.success('Connected to Backend', { description: 'Real-time data streaming active' });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      toast.error('Connection Lost');
    });

    socket.on('detection', (data: any) => {
      setDetections(prev => [data, ...prev].slice(0, 8));
      
      toast.success(`${data.type} Detected`, {
        description: `${data.symbol} • ${data.confidence}% confidence`,
        action: {
          label: 'View',
          onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      });
    });

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-[#222] bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00f5ff] to-[#39ff14] flex items-center justify-center">
              <Zap className="w-5 h-5 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tighter neon-text">TX INTELLIGENT</h1>
              <p className="text-xs text-[#00f5ff]">PREDICTIVE INTELLIGENCE</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-1.5 rounded-full text-sm flex items-center gap-2 border ${connectionStatus.includes('Connected') ? 'border-[#39ff14] text-[#39ff14]' : 'border-red-500 text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${connectionStatus.includes('Connected') ? 'bg-[#39ff14] animate-pulse' : 'bg-red-500'}`} />
              {connectionStatus}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-6">
        {/* Main Chart Area */}
        <div className="flex-1 space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold">Live Market Intelligence</h2>
                <p className="text-sm text-gray-400">Real-time pattern detection • Breakout • Scalping</p>
              </div>
              <div className="text-right">
                <div className="text-[#39ff14] text-sm">● LIVE</div>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div ref={chartContainerRef} className="h-[520px] bg-black rounded-xl border border-[#222] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4 opacity-30">📈</div>
                <p className="text-gray-500">TradingView Lightweight Chart will appear here</p>
                <p className="text-xs text-gray-600 mt-2">Real-time candles + animated lines coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Detections */}
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-[#ff0033]" /> Latest Detections
            </h3>
            <div className="space-y-3">
              {detections.length === 0 && (
                <p className="text-gray-500 italic text-center py-8">Waiting for first detection from backend...</p>
              )}
              {detections.map((det, i) => (
                <div key={i} className="bg-black/50 border border-[#222] rounded-xl p-4 flex justify-between items-center hover:border-[#00f5ff] transition-all">
                  <div>
                    <div className="font-mono text-lg">{det.symbol || 'BTCUSDT'}</div>
                    <div className="text-sm text-gray-400">{det.type} • {det.timeframe}</div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg font-bold ${det.confidence > 75 ? 'text-[#39ff14] glow-green' : 'text-[#ffaa00]'}`}>
                    {det.confidence || 82}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-2xl p-6">
            <h3 className="font-semibold mb-4">System Status</h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Backend Engine</span>
                <span className="text-[#39ff14]">V12 • Online</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Detection Mode</span>
                <span>Hybrid Pro + AI Elite</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}