'use client'

import { useState, useEffect } from 'react'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'

interface StatsData {
    monthly: { month: string; servicios: number; ingresos: number }[]
    topServiceTypes: { name: string; count: number }[]
    topVehicles: { name: string; count: number }[]
    totalRevenue: number
    totalServices: number
    avgRevenuePerService: number
    thisMonthServices: number
    growth: number
    totalVehicles: number
}

const COLORS = ['#111827', '#374151', '#6b7280', '#9ca3af', '#d1d5db']

export default function StatsPage() {
    const [data, setData] = useState<StatsData | null>(null)
    const [loading, setLoading] = useState(true)
    const [view, setView] = useState<'servicios' | 'ingresos'>('servicios')

    useEffect(() => {
        fetch('/api/stats')
            .then((res) => res.json())
            .then((d) => {
                setData(d)
                setLoading(false)
            })
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 px-4 py-8 animate-pulse">
                <div className="max-w-6xl mx-auto">
                    <div className="h-7 w-40 bg-gray-200 rounded mb-8" />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5">
                                <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
                                <div className="h-8 w-16 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 h-80" />
                </div>
            </div>
        )
    }

    if (!data) return null

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-6xl mx-auto">

                <h1 className="text-2xl font-medium text-gray-900 mb-8">Estadísticas</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">Ingresos totales</p>
                        <p className="text-2xl font-medium text-gray-900">
                            ${data.totalRevenue.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">Servicios totales</p>
                        <p className="text-2xl font-medium text-gray-900">{data.totalServices}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">Ticket promedio</p>
                        <p className="text-2xl font-medium text-gray-900">
                            ${data.avgRevenuePerService.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">Crecimiento mensual</p>
                        <p className={`text-2xl font-medium ${data.growth >= 0 ? 'text-green-600' : 'text-red-500'
                            }`}>
                            {data.growth >= 0 ? '+' : ''}{data.growth}%
                        </p>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-sm font-medium text-gray-900">Últimos 12 meses</p>
                        <div className="flex gap-1">
                            <button
                                onClick={() => setView('servicios')}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition ${view === 'servicios'
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                Servicios
                            </button>
                            <button
                                onClick={() => setView('ingresos')}
                                className={`px-3 py-1.5 text-xs rounded-lg border transition ${view === 'ingresos'
                                        ? 'bg-gray-900 text-white border-gray-900'
                                        : 'text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                Ingresos
                            </button>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        {view === 'servicios' ? (
                            <BarChart data={data.monthly} barSize={24}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                    allowDecimals={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        border: '0.5px solid #e5e7eb',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                    }}
                                    cursor={{ fill: '#f9fafb' }}
                                />
                                <Bar dataKey="servicios" fill="#111827" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        ) : (
                            <LineChart data={data.monthly}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        border: '0.5px solid #e5e7eb',
                                        borderRadius: '12px',
                                        fontSize: '12px',
                                    }}
                                    formatter={(v) => v !== undefined ? [`$${(v as number).toLocaleString()}`, 'Ingresos'] : ['N/A', 'Ingresos']}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="ingresos"
                                    stroke="#111827"
                                    strokeWidth={2}
                                    dot={{ fill: '#111827', r: 3 }}
                                    activeDot={{ r: 5 }}
                                />
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-sm font-medium text-gray-900 mb-6">Servicios más realizados</p>
                        {data.topServiceTypes.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-6">Sin datos</p>
                        ) : (
                            <div className="space-y-3">
                                {data.topServiceTypes.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div
                                            className="w-2.5 h-2.5 rounded-full shrink-0"
                                            style={{ background: COLORS[i] }}
                                        />
                                        <p className="text-sm text-gray-600 flex-1">{item.name}</p>
                                        <p className="text-sm font-medium text-gray-900">{item.count}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-sm font-medium text-gray-900 mb-6">Vehículos más atendidos</p>
                        {data.topVehicles.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-6">Sin datos</p>
                        ) : (
                            <div className="space-y-3">
                                {data.topVehicles.map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <p className="text-xs text-gray-400 w-4">{i + 1}</p>
                                        <p className="text-sm text-gray-600 flex-1 truncate">{item.name}</p>
                                        <p className="text-sm font-medium text-gray-900">
                                            {item.count} {item.count === 1 ? 'servicio' : 'servicios'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    )
}