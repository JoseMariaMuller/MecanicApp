'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function EditVehiclePage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState('')
    const [vehicle, setVehicle] = useState<any>(null)

    useEffect(() => {
        fetch(`/api/vehicles/${id}`)
            .then((res) => res.json())
            .then((data) => {
                setVehicle(data)
                setFetching(false)
            })
            .catch(() => {
                setError('Error al cargar el vehículo')
                setFetching(false)
            })
    }, [id])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        const data = {
            plate: formData.get('plate') as string,
            brand: formData.get('brand') as string,
            model: formData.get('model') as string,
            year: Number(formData.get('year')),
            color: formData.get('color') as string,
            fuel: formData.get('fuel') as string,
            currentKm: Number(formData.get('currentKm')),
            clientName: formData.get('clientName') as string,
            clientPhone: formData.get('clientPhone') as string,
            clientEmail: formData.get('clientEmail') as string,
            notes: formData.get('notes') as string,
        }

        try {
            const res = await fetch(`/api/vehicles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.error || 'Error al actualizar el vehículo')
                setLoading(false)
                return
            }

            router.push(`/vehicles/${id}`)
            router.refresh()
        } catch {
            setError('Error de conexión, intentá de nuevo')
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400">Cargando...</p>
            </div>
        )
    }

    if (!vehicle) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400">Vehículo no encontrado</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-2xl mx-auto">

                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href={`/vehicles/${id}`}
                        className="text-sm text-gray-500 hover:text-gray-900 transition"
                    >
                        ← Volver
                    </Link>
                    <h1 className="text-2xl font-medium text-gray-900">
                        Editar vehículo
                    </h1>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} noValidate>

                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                            Datos del vehículo
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="plate" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Patente
                                </label>
                                <input
                                    id="plate"
                                    name="plate"
                                    type="text"
                                    required
                                    defaultValue={vehicle.plate}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition uppercase"
                                />
                            </div>
                            <div>
                                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Año
                                </label>
                                <input
                                    id="year"
                                    name="year"
                                    type="number"
                                    required
                                    defaultValue={vehicle.year}
                                    min={1900}
                                    max={new Date().getFullYear() + 1}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Marca
                                </label>
                                <input
                                    id="brand"
                                    name="brand"
                                    type="text"
                                    required
                                    defaultValue={vehicle.brand}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Modelo
                                </label>
                                <input
                                    id="model"
                                    name="model"
                                    type="text"
                                    required
                                    defaultValue={vehicle.model}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Color
                                </label>
                                <input
                                    id="color"
                                    name="color"
                                    type="text"
                                    defaultValue={vehicle.color}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="fuel" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Combustible
                                </label>
                                <select
                                    id="fuel"
                                    name="fuel"
                                    required
                                    defaultValue={vehicle.fuel}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-white"
                                >
                                    <option value="nafta">Nafta</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="gnc">GNC</option>
                                    <option value="electrico">Eléctrico</option>
                                    <option value="hibrido">Híbrido</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="currentKm" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Kilometraje actual
                            </label>
                            <input
                                id="currentKm"
                                name="currentKm"
                                type="number"
                                required
                                defaultValue={vehicle.currentKm}
                                min={0}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                        </div>

                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                            Datos del cliente
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Nombre del cliente
                                </label>
                                <input
                                    id="clientName"
                                    name="clientName"
                                    type="text"
                                    required
                                    defaultValue={vehicle.clientName}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Teléfono
                                </label>
                                <input
                                    id="clientPhone"
                                    name="clientPhone"
                                    type="tel"
                                    required
                                    defaultValue={vehicle.clientPhone}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email del cliente{' '}
                                <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <input
                                id="clientEmail"
                                name="clientEmail"
                                type="email"
                                defaultValue={vehicle.clientEmail}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Notas{' '}
                                <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                rows={3}
                                defaultValue={vehicle.notes}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                            />
                        </div>

                        {error && (
                            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-sm text-red-600">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}