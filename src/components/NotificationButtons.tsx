'use client'

import { useState } from 'react'

interface NotificationButtonsProps {
    vehicleId: string
    hasEmail: boolean
    services: { _id: string; type: string; status: string }[]
}

export default function NotificationButtons({
    vehicleId,
    hasEmail,
    services,
}: NotificationButtonsProps) {
    const [loadingReminder, setLoadingReminder] = useState(false)
    const [loadingReady, setLoadingReady] = useState<string | null>(null)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    async function sendReminder() {
        setLoadingReminder(true)
        setMessage('')
        setError('')

        const res = await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'oil_reminder', vehicleId }),
        })

        const data = await res.json()

        if (res.ok) {
            setMessage('Recordatorio enviado al cliente')
        } else {
            setError(data.error || 'Error al enviar')
        }

        setLoadingReminder(false)
        setTimeout(() => { setMessage(''); setError('') }, 4000)
    }

    async function sendServiceReady(serviceId: string) {
        setLoadingReady(serviceId)
        setMessage('')
        setError('')

        const res = await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type: 'service_ready', serviceId }),
        })

        const data = await res.json()

        if (res.ok) {
            setMessage('Email enviado al cliente')
        } else {
            setError(data.error || 'Error al enviar')
        }

        setLoadingReady(null)
        setTimeout(() => { setMessage(''); setError('') }, 4000)
    }

    const completedServices = services.filter((s) => s.status === 'completado')

    if (!hasEmail) {
        return (
            <p className="text-xs text-gray-400">
                Agregá el email del cliente para enviar notificaciones
            </p>
        )
    }

    return (
        <div>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={sendReminder}
                    disabled={loadingReminder}
                    className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                >
                    {loadingReminder ? 'Enviando...' : 'Recordatorio de aceite'}
                </button>
                {completedServices.slice(0, 1).map((service) => (
                    <button
                        key={service._id}
                        onClick={() => sendServiceReady(service._id)}
                        disabled={loadingReady === service._id}
                        className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition"
                    >
                        {loadingReady === service._id ? 'Enviando...' : 'Avisar que está listo'}
                    </button>
                ))}
            </div>
            {message && (
                <p className="text-xs text-green-600 mt-2">{message}</p>
            )}
            {error && (
                <p className="text-xs text-red-500 mt-2">{error}</p>
            )}
        </div>
    )
}