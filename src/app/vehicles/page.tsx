'use client'

import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import Link from 'next/link'

interface Vehicle {
    _id: string
    plate: string
    brand: string
    model: string
    year: number
    color: string
    fuel: string
    currentKm: number
    clientName: string
    clientPhone: string
}

interface Service {
    _id: string
    vehicleId: string
    type: string
    status: string
    kmAtService: number
    nextServiceKm?: number
    serviceDate: string
}

export default function VehiclesPage() {
    const [search, setSearch] = useState('')
    const [debouncedSearch] = useDebounce(search, 300)
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [services, setServices] = useState<Service[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        const url = debouncedSearch
            ? `/api/vehicles?search=${encodeURIComponent(debouncedSearch)}`
            : '/api/vehicles'

        fetch(url)
            .then((res) => res.json())
            .then((data) => {
                setVehicles(data)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [debouncedSearch])

    useEffect(() => {
        fetch('/api/services')
            .then((res) => res.json())
            .then((data) => setServices(data))
    }, [])

    const getVehicleStatus = (vehicle: Vehicle) => {
        const vehicleServices = services.filter(
            (s) => s.vehicleId === vehicle._id && s.status === 'completado' && s.nextServiceKm
        )
        if (vehicleServices.length === 0) return null

        const closest = vehicleServices.sort((a, b) => {
            const remA = (a.nextServiceKm || 0) - vehicle.currentKm
            const remB = (b.nextServiceKm || 0) - vehicle.currentKm
            return remA - remB
        })[0]

        const remaining = (closest.nextServiceKm || 0) - vehicle.currentKm
        const progress = Math.min(
            ((vehicle.currentKm - closest.kmAtService) /
                ((closest.nextServiceKm || 0) - closest.kmAtService)) * 100,
            100
        )

        return { remaining, progress }
    }

    const getBadge = (rem: number) => {
        if (rem <= 500) return { text: 'Urgente', cls: 'bg-red-50 text-red-600 border border-red-100' }
        if (rem <= 1500) return { text: 'Pronto', cls: 'bg-yellow-50 text-yellow-600 border border-yellow-100' }
        return { text: 'Al día', cls: 'bg-green-50 text-green-600 border border-green-100' }
    }

    const getBarColor = (rem: number) => {
        if (rem <= 500) return 'bg-red-500'
        if (rem <= 1500) return 'bg-yellow-400'
        return 'bg-green-500'
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-medium text-gray-900">Vehículos</h1>
                    <Link
                        href="/vehicles/new"
                        className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                        
                    >
                        + Nuevo vehículo
                    </Link>
                </div>

                <div className="relative mb-6">
                    <svg
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        width="16" height="16" viewBox="0 0 16 16" fill="none"
                    >
                        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por patente, marca, modelo o cliente..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-white"
                    />
                    {search && (
                        <button
                            onClick={() => setSearch('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>
                    )}
                </div>

                {debouncedSearch && (
                    <p className="text-sm text-gray-400 mb-4">
                        {loading ? 'Buscando...' : `${vehicles.length} resultado${vehicles.length !== 1 ? 's' : ''} para "${debouncedSearch}"`}
                    </p>
                )}

                {loading && !debouncedSearch ? (
                    <div className="grid gap-4 md:grid-cols-2">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <div className="h-5 w-36 bg-gray-200 rounded mb-2" />
                                        <div className="h-3 w-28 bg-gray-100 rounded" />
                                    </div>
                                    <div className="h-6 w-16 bg-gray-100 rounded-lg" />
                                </div>
                                <div className="border-t border-gray-100 pt-4 mb-4">
                                    <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                                    <div className="h-3 w-24 bg-gray-100 rounded" />
                                </div>
                                <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                            </div>
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
                        {debouncedSearch ? (
                            <>
                                <p className="text-gray-400 text-sm mb-2">No se encontraron vehículos</p>
                                <p className="text-gray-300 text-xs">Probá con otro término de búsqueda</p>
                            </>
                        ) : (
                            <>
                                <p className="text-gray-400 text-sm mb-4">No hay vehículos registrados</p>
                                <Link
                                    href="/vehicles/new"
                                    className="text-sm text-gray-900 font-medium hover:underline"
                                >
                                    Registrar el primero
                                </Link>
                            </>
                        )}
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2">
                        {vehicles.map((vehicle) => {
                            const status = getVehicleStatus(vehicle)

                            return (
                                <Link
                                    key={vehicle._id}
                                    href={`/vehicles/${vehicle._id}`}
                                    className="bg-white border border-gray-200 rounded-2xl p-6 hover:border-gray-300 transition block"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {vehicle.brand} {vehicle.model}
                                            </p>
                                            <p className="text-sm text-gray-500 mt-0.5">
                                                {vehicle.plate} · {vehicle.year} · {vehicle.fuel}
                                            </p>
                                        </div>
                                        {status && (
                                            <span className={`text-xs px-2 py-1 rounded-lg ${getBadge(status.remaining).cls}`}>
                                                {getBadge(status.remaining).text}
                                            </span>
                                        )}
                                    </div>

                                    <div className="border-t border-gray-100 pt-4 mb-4">
                                        <p className="text-sm font-medium text-gray-900">{vehicle.clientName}</p>
                                        <p className="text-xs text-gray-400">{vehicle.clientPhone}</p>
                                    </div>

                                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                                        <span>{vehicle.currentKm.toLocaleString()} km actuales</span>
                                        {status && (
                                            <span>{status.remaining.toLocaleString()} km restantes</span>
                                        )}
                                    </div>

                                    {status ? (
                                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${getBarColor(status.remaining)}`}
                                                style={{ width: `${status.progress}%` }}
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-xs text-gray-400">Sin servicios con km registrado</p>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}