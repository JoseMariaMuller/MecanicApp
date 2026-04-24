'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [isInvited, setIsInvited] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string
        const invitationCode = formData.get('invitationCode') as string
        const workshopName = formData.get('workshopName') as string

        if (!name || !email || !password || !confirmPassword) {
            setError('Completá todos los campos')
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            setLoading(false)
            return
        }

        if (!isInvited && !workshopName) {
            setError('Ingresá el nombre del taller')
            setLoading(false)
            return
        }

        if (isInvited && !invitationCode) {
            setError('Ingresá el código de invitación')
            setLoading(false)
            return
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                    workshopName: isInvited ? undefined : workshopName,
                    invitationCode: isInvited ? invitationCode : undefined,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                setError(data.error || 'Error al crear la cuenta')
                setLoading(false)
                return
            }

            router.push('/login?registered=true')
        } catch {
            setError('Error de conexión, intentá de nuevo')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-medium text-gray-900">
                        Registrá tu taller
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Creá tu cuenta y empezá a gestionar tus vehículos
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} noValidate>

                        <div className="mb-5">
                            <div className="flex items-center gap-3 mb-4">
                                <button
                                    type="button"
                                    onClick={() => setIsInvited(false)}
                                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${!isInvited
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    Crear taller
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsInvited(true)}
                                    className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${isInvited
                                            ? 'bg-gray-900 text-white border-gray-900'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    Unirme a un taller
                                </button>
                            </div>

                            {isInvited ? (
                                <div>
                                    <label htmlFor="invitationCode" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Código de invitación
                                    </label>
                                    <input
                                        id="invitationCode"
                                        name="invitationCode"
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition uppercase tracking-widest"
                                        placeholder="ABC123"
                                        maxLength={6}
                                    />
                                    <p className="text-xs text-gray-400 mt-1.5">
                                        Pedile el código al dueño del taller
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <label htmlFor="workshopName" className="block text-sm font-medium text-gray-700 mb-1.5">
                                        Nombre del taller
                                    </label>
                                    <input
                                        id="workshopName"
                                        name="workshopName"
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                        placeholder="Taller San Martín"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="mb-5">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Tu nombre
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="Carlos García"
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="tu@email.com"
                            />
                        </div>

                        <div className="mb-5">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
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
                                Confirmá la contraseña
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition"
                                placeholder="········"
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
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>

                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿Ya tenés cuenta?{' '}
                    <Link href="/login" className="text-gray-900 font-medium hover:underline">
                        Ingresá acá
                    </Link>
                </p>

            </div>
        </div>
    )
}