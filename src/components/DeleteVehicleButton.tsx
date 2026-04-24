'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteVehicleButton({ vehicleId }: { vehicleId: string }) {
    const router = useRouter()
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)
        try {
            const res = await fetch(`/api/vehicles/${vehicleId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.push('/vehicles')
                router.refresh()
            }
        } catch {
            setLoading(false)
        }
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">¿Eliminar vehículo?</span>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-xl hover:bg-red-600 disabled:opacity-50 transition"
                >
                    {loading ? 'Eliminando...' : 'Confirmar'}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                >
                    Cancelar
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="px-4 py-2 border border-red-100 text-red-500 text-sm font-medium rounded-xl hover:bg-red-50 transition"
        >
            Eliminar
        </button>
    )
}