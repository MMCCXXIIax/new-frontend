'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi } from 'lightweight-charts';
import { socket } from '../lib/socket';
import { toast } from 'sonner';
import { Zap, AlertTriangle } from 'lucide-react';

export default function TXDashboard() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<any>(null);
  const lineSeriesRef = useRef<any>(null);        // For support/resistance
  const projectionRef = useRef<any>(null);        // For projected path

  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [detections, setDetections] = useState<any[]>([]);

    // Initialize Chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 520,
      layout: { 
        background: { color: '#0a0a0a' }, 
        textColor: '#ddd' 
      },
      grid: { 
        vertLines: { color: '#1a1a1a' }, 
        horzLines: { color: '#1a1a1a' } 
      },
      timeScale: { timeVisible: true, secondsVisible: false },
      crosshair: { mode: 0 },
    });

    const candleSeries = chart.addCandlestickSeries({
      upColor: '#39ff14',
      downColor: '#ff0033',
      borderUpColor: '#39ff14',
      borderDownColor: '#ff0033',
      wickUpColor: '#39ff14',
      wickDownColor: '#ff0033',
    });

    const lineSeries = chart.addLineSeries({
      color: '#00f5ff',
      lineWidth: 2,
    });

    const projectionSeries = chart.addLineSeries({
      color: '#ffd700',
      lineWidth: 2,
      lineStyle: 2, // dashed
    });

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    lineSeriesRef.current = lineSeries;
    projectionRef.current = projectionSeries;

    const handleResize = () => {
      chart.resize(chartContainerRef.current!.clientWidth, 520);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Socket + Animation Logic
  useEffect(() => {
    socket.on('connect', () => {
      setConnectionStatus('Connected to V12 Engine ✅');
      toast.success('Connected to Backend');
    });

    socket.on('detection', (data: any) => {
      const detection = {
        ...data,
        timestamp: new Date().toISOString()
      };
      
      setDetections(prev => [detection, ...prev].slice(0, 8));

      toast.success(`${data.type || 'Pattern'} Detected`, {
        description: `${data.symbol} • ${data.confidence || 85}% confidence`,
      });

      // === ANIMATED DRAWING BASED ON BACKEND DATA ===
      if (lineSeriesRef.current && data.levels) {
        // Draw Support / Resistance lines
        const supportLine = data.levels.support ? [{ time: Date.now()/1000 - 1000, value: data.levels.support },
                                                   { time: Date.now()/1000 + 500, value: data.levels.support }] : [];
        const resistanceLine = data.levels.resistance ? [{ time: Date.now()/1000 - 1000, value: data.levels.resistance },
                                                         { time: Date.now()/1000 + 500, value: data.levels.resistance }] : [];

        lineSeriesRef.current.setData([...supportLine, ...resistanceLine]);
      }

      if (projectionRef.current && data.projectedTarget) {
        // Animate projected path
        const projection = [
          { time: Date.now()/1000, value: data.currentPrice || 65000 },
          { time: Date.now()/1000 + 300, value: data.projectedTarget }
        ];
        projectionRef.current.setData(projection);
      }
    });

    socket.connect();

    return () => socket.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-12">
      <header className="border-b border-[#222] bg-black/90 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter neon-text">TX INTELLIGENT</h1>
              <p className="text-cyan-400 text-sm">V12 PREDICTIVE ENGINE</p>
            </div>
          </div>
          <div className={`px-5 py-2 rounded-full text-sm flex items-center gap-2 border ${connectionStatus.includes('Connected') ? 'border-emerald-400 text-emerald-400' : 'border-red-500 text-red-500'}`}>
            <div className={`w-3 h-3 rounded-full animate-pulse ${connectionStatus.includes('Connected') ? 'bg-emerald-400' : 'bg-red-500'}`} />
            {connectionStatus}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <div className="bg-[#111] border border-[#222] rounded-3xl p-6">
            <div className="flex justify-between mb-6">
              <h2 className="text-2xl font-semibold">Live Market Intelligence</h2>
              <div className="text-emerald-400 text-sm font-mono">● LIVE</div>
            </div>
            <div ref={chartContainerRef} className="w-full rounded-2xl overflow-hidden border border-[#222]" />
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-[#111] border border-[#222] rounded-3xl p-6 h-full">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="text-red-500" /> Recent Detections
            </h3>
            <div className="space-y-4 max-h-[620px] overflow-auto">
              {detections.length === 0 ? (
                <p className="text-gray-500 italic text-center py-20">Waiting for detections from your V12 backend...</p>
              ) : (
                detections.map((d, i) => (
                  <div key={i} className="bg-black/60 border border-[#333] rounded-2xl p-5 hover:border-cyan-400 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-mono text-2xl">{d.symbol}</div>
                        <div className="text-cyan-400">{d.type} • {d.timeframe}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-emerald-400">{d.confidence}%</div>
                        <div className="text-xs text-gray-500">confidence</div>
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