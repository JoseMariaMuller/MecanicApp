'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function NewVehiclePage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

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
            const res = await fetch('/api/vehicles', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                toast.error(result.error || 'Error al registrar el vehículo')
                setLoading(false)
                return
            }

            toast.success('Vehículo registrado correctamente')
            router.push('/dashboard')
            router.refresh()
        } catch {
            setError('Error de conexión, intentá de nuevo')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-2xl mx-auto">

                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/dashboard"
                        className="text-sm text-gray-500 hover:text-gray-900 transition"
                    >
                        ← Volver
                    </Link>
                    <h1 className="text-2xl font-medium text-gray-900">
                        Registrar vehículo
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition uppercase"
                                    placeholder="ABC123"
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
                                    min={1900}
                                    max={new Date().getFullYear() + 1}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="2020"
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="Toyota"
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="Corolla"
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="Blanco"
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-white"
                                >
                                    <option value="">Seleccioná</option>
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
                                min={0}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="89200"
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="Luis García"
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
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="2954123456"
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
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="cliente@email.com"
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
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                                placeholder="Observaciones importantes del vehículo..."
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
                            {loading ? 'Registrando...' : 'Registrar vehículo'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}