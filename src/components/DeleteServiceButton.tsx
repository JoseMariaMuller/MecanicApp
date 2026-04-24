'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DeleteServiceButton({
    serviceId,
    vehicleId,
}: {
    serviceId: string
    vehicleId: string
}) {
    const router = useRouter()
    const [confirming, setConfirming] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleDelete() {
        setLoading(true)
        try {
            const res = await fetch(`/api/services/${serviceId}`, {
                method: 'DELETE',
            })

            if (res.ok) {
                router.refresh()
            }
        } catch {
            setLoading(false)
        } finally {
            setConfirming(false)
            setLoading(false)
        }
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-500">¿Eliminar servicio?</span>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 transition"
                >
                    {loading ? 'Eliminando...' : 'Confirmar'}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    className="px-3 py-1 border border-gray-200 text-gray-500 text-xs font-medium rounded-lg hover:bg-gray-50 transition"
                >
                    Cancelar
                </button>
            </div>
        )
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="text-xs text-red-400 hover:text-red-600 transition"
        >
            Eliminar
        </button>
    )
}