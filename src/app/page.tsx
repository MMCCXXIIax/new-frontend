'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickSeries } from 'lightweight-charts';
import { socket } from '../lib/socket';
import { toast } from 'sonner';
import { Zap, AlertTriangle, TrendingUp } from 'lucide-react';

export default function TXDashboard() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [detections, setDetections] = useState<any[]>([]);

  // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 520,
      layout: { backgroundColor: '#0a0a0a', textColor: '#ddd' },
      grid: { vertLines: { color: '#222' }, horzLines: { color: '#222' } },
      crosshair: { mode: 0 },
      timeScale: { timeVisible: true, secondsVisible: true },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#39ff14',
      downColor: '#ff0033',
      borderUpColor: '#39ff14',
      borderDownColor: '#ff0033',
      wickUpColor: '#39ff14',
      wickDownColor: '#ff0033',
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;

    // Fake initial data for demo
    const initialData = [
      { time: '2025-05-01', open: 65200, high: 65500, low: 64800, close: 65350 },
      // ... more data would come from backend
    ];
    candleSeries.setData(initialData);

    const handleResize = () => {
      if (chart) chart.resize(chartContainerRef.current!.clientWidth, 520);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Socket Connection
  useEffect(() => {
    socket.on('connect', () => {
      setConnectionStatus('Connected to V12 Engine ✅');
      toast.success('Connected!', { description: 'Real-time data streaming' });
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected');
      toast.error('Connection Lost');
    });

    socket.on('price_update', (data) => {
      if (candleSeriesRef.current && data.candle) {
        candleSeriesRef.current.update(data.candle);
      }
    });

    socket.on('detection', (data: any) => {
      setDetections(prev => [data, ...prev].slice(0, 10));
      
      toast.success(`${data.type || 'Breakout'} Detected`, {
        description: `${data.symbol} • ${data.confidence || 85}%`,
      });

      // Future: Trigger animated line drawing here
    });

    socket.connect();

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-12">
      {/* Header */}
      <header className="border-b border-[#222] bg-black/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-green-400 flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter neon-text">TX INTELLIGENT</h1>
              <p className="text-sm text-cyan-400">V12 PREDICTIVE ENGINE</p>
            </div>
          </div>

          <div className={`px-5 py-2 rounded-full text-sm flex items-center gap-2 border ${connectionStatus.includes('Connected') ? 'border-green-400 text-green-400' : 'border-red-500 text-red-500'}`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${connectionStatus.includes('Connected') ? 'bg-green-400' : 'bg-red-500'}`} />
            {connectionStatus}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-8">
          <div className="bg-[#111] border border-[#222] rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-semibold">Live Market Intelligence</h2>
                <p className="text-gray-400">Real-time • Breakout • Scalping • Pattern Detection</p>
              </div>
              <div className="text-green-400 text-sm font-mono">● LIVE FEED</div>
            </div>

            <div ref={chartContainerRef} className="w-full rounded-2xl overflow-hidden border border-[#222]" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#111] border border-[#222] rounded-3xl p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" /> Latest Detections
            </h3>
            <div className="space-y-3 max-h-[600px] overflow-auto">
              {detections.length === 0 ? (
                <p className="text-gray-500 italic py-12 text-center">Waiting for detections from V12 Engine...</p>
              ) : (
                detections.map((d, i) => (
                  <div key={i} className="bg-black/70 border border-[#333] rounded-2xl p-4 hover:border-cyan-400 transition-all">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-mono text-xl">{d.symbol || 'BTCUSDT'}</div>
                        <div className="text-sm text-gray-400">{d.type || 'Breakout'} • {d.timeframe || '15m'}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">{d.confidence || 87}%</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}