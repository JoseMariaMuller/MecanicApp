'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            setError('Completá todos los campos')
            setLoading(false)
            return
        }

        try {
            const limitRes = await fetch('/api/auth/login', { method: 'POST' })

            if (limitRes.status === 429) {
                const data = await limitRes.json()
                setError(data.error)
                setLoading(false)
                return
            }

            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Email o contraseña incorrectos')
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md">

                <div className="text-center mb-8">
                    <h1 className="text-2xl font-medium text-gray-900">
                        Bienvenido
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm">
                        Ingresá a tu taller
                    </p>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-8">
                    <form onSubmit={handleSubmit} noValidate>

                        <div className="mb-5">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
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

                        <div className="mb-6">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Contraseña
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
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
                            {loading ? 'Ingresando...' : 'Ingresar'}
                        </button>

                    </form>
                </div>

                <p className="text-center text-sm text-gray-500 mt-6">
                    ¿No tenés cuenta?{' '}
                    <Link
                        href="/register"
                        className="text-gray-900 font-medium hover:underline"
                    >
                        Registrá tu taller
                    </Link>
                </p>

            </div>
        </div>
    )
}