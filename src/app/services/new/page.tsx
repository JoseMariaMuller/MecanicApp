'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Vehicle {
    _id: string
    plate: string
    brand: string
    model: string
    clientName: string
    currentKm: number
}

export default function NewServicePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const preselectedVehicleId = searchParams.get('vehicleId')

    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [parts, setParts] = useState<string[]>([''])

    useEffect(() => {
        fetch('/api/vehicles')
            .then((res) => res.json())
            .then((data) => setVehicles(data))
            .catch(() => setError('Error al cargar los vehículos'))
    }, [])

    function addPart() {
        setParts([...parts, ''])
    }

    function removePart(index: number) {
        setParts(parts.filter((_, i) => i !== index))
    }

    function updatePart(index: number, value: string) {
        const updated = [...parts]
        updated[index] = value
        setParts(updated)
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)

        const data = {
            vehicleId: formData.get('vehicleId') as string,
            type: formData.get('type') as string,
            description: formData.get('description') as string,
            kmAtService: Number(formData.get('kmAtService')),
            nextServiceKm: formData.get('nextServiceKm')
                ? Number(formData.get('nextServiceKm'))
                : undefined,
            nextServiceDate: formData.get('nextServiceDate') as string || undefined,
            serviceDate: formData.get('serviceDate') as string,
            cost: formData.get('cost')
                ? Number(formData.get('cost'))
                : undefined,
            parts: parts.filter((p) => p.trim() !== ''),
            status: formData.get('status') as string,
        }

        try {
            const res = await fetch('/api/services', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()

            if (!res.ok) {
                setError(result.error || 'Error al registrar el servicio')
                setLoading(false)
                return
            }

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
                        Registrar servicio
                    </h1>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} noValidate>

                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                            Vehículo y tipo de servicio
                        </p>

                        <div className="mb-4">
                            <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Vehículo
                            </label>
                            <select
                                id="vehicleId"
                                name="vehicleId"
                                required
                                defaultValue={preselectedVehicleId || ''}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-white"
                            >
                                <option value="">Seleccioná un vehículo</option>
                                {vehicles.map((v) => (
                                    <option key={v._id} value={v._id}>
                                        {v.brand} {v.model} · {v.plate} — {v.clientName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tipo de servicio
                            </label>
                            <select
                                id="type"
                                name="type"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-white"
                            >
                                <option value="">Seleccioná</option>
                                <option value="cambio_aceite">Cambio de aceite</option>
                                <option value="cambio_filtro">Cambio de filtro</option>
                                <option value="cambio_pastillas">Cambio de pastillas</option>
                                <option value="alineacion">Alineación</option>
                                <option value="balanceo">Balanceo</option>
                                <option value="revision_general">Revisión general</option>
                                <option value="cambio_correa">Cambio de correa</option>
                                <option value="cambio_neumaticos">Cambio de neumáticos</option>
                                <option value="diagnostico">Diagnóstico</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={3}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition resize-none"
                                placeholder="Describí el trabajo realizado..."
                            />
                        </div>

                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                            Kilometraje y fechas
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="kmAtService" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Km al momento del servicio
                                </label>
                                <input
                                    id="kmAtService"
                                    name="kmAtService"
                                    type="number"
                                    required
                                    min={0}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="89200"
                                />
                            </div>
                            <div>
                                <label htmlFor="nextServiceKm" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Km próximo servicio{' '}
                                    <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <input
                                    id="nextServiceKm"
                                    name="nextServiceKm"
                                    type="number"
                                    min={0}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="94200"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Fecha del servicio
                                </label>
                                <input
                                    id="serviceDate"
                                    name="serviceDate"
                                    type="date"
                                    required
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                            <div>
                                <label htmlFor="nextServiceDate" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Fecha próximo servicio{' '}
                                    <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <input
                                    id="nextServiceDate"
                                    name="nextServiceDate"
                                    type="date"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                />
                            </div>
                        </div>

                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                            Repuestos y costo
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Repuestos utilizados{' '}
                                <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <div className="space-y-2">
                                {parts.map((part, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={part}
                                            onChange={(e) => updatePart(index, e.target.value)}
                                            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                            placeholder="Ej: Filtro de aceite, Aceite 5W30 4L"
                                        />
                                        {parts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePart(index)}
                                                className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-400 hover:text-red-500 hover:border-red-200 transition"
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addPart}
                                className="mt-2 text-sm text-gray-500 hover:text-gray-900 transition"
                            >
                                + Agregar repuesto
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="cost" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Costo total{' '}
                                    <span className="text-gray-400 font-normal">(opcional)</span>
                                </label>
                                <input
                                    id="cost"
                                    name="cost"
                                    type="number"
                                    min={0}
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                    placeholder="15000"
                                />
                            </div>
                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Estado
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    defaultValue="completado"
                                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition bg-white"
                                >
                                    <option value="completado">Completado</option>
                                    <option value="en_proceso">En proceso</option>
                                    <option value="pendiente">Pendiente</option>
                                </select>
                            </div>
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
                            {loading ? 'Registrando...' : 'Registrar servicio'}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    )
}