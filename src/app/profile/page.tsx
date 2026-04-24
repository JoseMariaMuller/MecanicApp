'use client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
    const { data: session, update } = useSession()
    const router = useRouter()

    // ✅ Inputs controlados con estado local
    const [nameValue, setNameValue] = useState(session?.user?.name || '')
    const [workshopValue, setWorkshopValue] = useState(session?.user?.workshopName || '')

    const [nameLoading, setNameLoading] = useState(false)
    const [nameError, setNameError] = useState('')
    const [nameSuccess, setNameSuccess] = useState('')

    const [passLoading, setPassLoading] = useState(false)
    const [passError, setPassError] = useState('')
    const [passSuccess, setPassSuccess] = useState('')

    async function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setNameError('')
        setNameSuccess('')
        setNameLoading(true)

        if (!nameValue || !workshopValue) {
            setNameError('Completá todos los campos')
            setNameLoading(false)
            return
        }

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nameValue, workshopName: workshopValue }),
            })
            const data = await res.json()
            if (!res.ok) {
                setNameError(data.error || 'Error al actualizar')
                setNameLoading(false)
                return
            }

            // ✅ Solo los campos a actualizar, sin wrappear en session/user
            await update({ name: nameValue, workshopName: workshopValue })

            router.refresh()
            setNameSuccess('Datos actualizados correctamente')
        } catch {
            setNameError('Error de conexión')
        } finally {
            setNameLoading(false)
        }
    }

    async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setPassError('')
        setPassSuccess('')
        setPassLoading(true)

        const formData = new FormData(e.currentTarget)
        const currentPassword = formData.get('currentPassword') as string
        const newPassword = formData.get('newPassword') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPassError('Completá todos los campos')
            setPassLoading(false)
            return
        }
        if (newPassword !== confirmPassword) {
            setPassError('Las contraseñas no coinciden')
            setPassLoading(false)
            return
        }
        if (newPassword.length < 8) {
            setPassError('La contraseña debe tener al menos 8 caracteres')
            setPassLoading(false)
            return
        }

        try {
            const res = await fetch('/api/profile/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            })
            const data = await res.json()
            if (!res.ok) {
                setPassError(data.error || 'Error al cambiar la contraseña')
                setPassLoading(false)
                return
            }
            setPassSuccess('Contraseña actualizada correctamente')
            ;(e.target as HTMLFormElement).reset()
        } catch {
            setPassError('Error de conexión')
        } finally {
            setPassLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-medium text-gray-900 mb-8">Perfil</h1>

                {/* Datos de la cuenta */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8 mb-6">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
                        Datos de la cuenta
                    </p>
                    <form onSubmit={handleNameSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tu nombre
                            </label>
                            {/* ✅ value + onChange en lugar de defaultValue */}
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={nameValue}
                                onChange={(e) => setNameValue(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="workshopName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nombre del taller
                            </label>
                            {/* ✅ value + onChange en lugar de defaultValue */}
                            <input
                                id="workshopName"
                                name="workshopName"
                                type="text"
                                required
                                value={workshopValue}
                                onChange={(e) => setWorkshopValue(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <p className="px-4 py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-400">
                                {session?.user?.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1.5">El email no se puede cambiar</p>
                        </div>

                        {nameError && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-sm text-red-600">{nameError}</p>
                            </div>
                        )}
                        {nameSuccess && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
                                <p className="text-sm text-green-600">{nameSuccess}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={nameLoading}
                            className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {nameLoading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </form>
                </div>

                {/* Cambiar contraseña */}
                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
                        Cambiar contraseña
                    </p>
                    <form onSubmit={handlePasswordSubmit} noValidate>
                        <div className="mb-4">
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Contraseña actual
                            </label>
                            <input
                                id="currentPassword"
                                name="currentPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="········"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Nueva contraseña
                            </label>
                            <input
                                id="newPassword"
                                name="newPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="········"
                            />
                            <p className="text-xs text-gray-400 mt-1.5">
                                Mínimo 8 caracteres, una mayúscula, un número y un carácter especial
                            </p>
                        </div>
                        <div className="mb-6">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirmá la nueva contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="········"
                            />
                        </div>

                        {passError && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-100">
                                <p className="text-sm text-red-600">{passError}</p>
                            </div>
                        )}
                        {passSuccess && (
                            <div className="mb-4 px-4 py-3 rounded-xl bg-green-50 border border-green-100">
                                <p className="text-sm text-green-600">{passSuccess}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={passLoading}
                            className="w-full py-2.5 px-4 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {passLoading ? 'Cambiando...' : 'Cambiar contraseña'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}