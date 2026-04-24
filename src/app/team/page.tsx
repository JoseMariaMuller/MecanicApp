'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Invitation {
    _id: string
    code: string
    expiresAt: string
    used: boolean
}

interface Member {
    _id: string
    name: string
    email: string
    role: string
    createdAt: string
}

export default function TeamPage() {
    const { data: session } = useSession()
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [members, setMembers] = useState<Member[]>([])
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState<string | null>(null)

    useEffect(() => {
        fetchInvitations()
        fetchMembers()
    }, [])

    async function fetchInvitations() {
        const res = await fetch('/api/invitations')
        const data = await res.json()
        if (Array.isArray(data)) setInvitations(data)
    }

    async function fetchMembers() {
        const res = await fetch('/api/team')
        const data = await res.json()
        if (Array.isArray(data)) setMembers(data)
    }

    async function createInvitation() {
        setLoading(true)
        const res = await fetch('/api/invitations', { method: 'POST' })
        const data = await res.json()
        if (res.ok) {
            setInvitations([data, ...invitations])
        }
        setLoading(false)
    }

    async function deleteInvitation(id: string) {
        await fetch(`/api/invitations?id=${id}`, { method: 'DELETE' })
        setInvitations(invitations.filter((i) => i._id !== id))
    }

    function copyCode(code: string) {
        navigator.clipboard.writeText(code)
        setCopied(code)
        setTimeout(() => setCopied(null), 2000)
    }

    if (session?.user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-sm text-gray-400">Solo el administrador puede gestionar el equipo</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-2xl mx-auto">

                <h1 className="text-2xl font-medium text-gray-900 mb-8">Equipo</h1>

                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-900">Invitar mecánico</p>
                            <p className="text-xs text-gray-400 mt-0.5">El código expira en 48 horas</p>
                        </div>
                        <button
                            onClick={createInvitation}
                            disabled={loading}
                            className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-700 disabled:opacity-50 transition"
                        >
                            {loading ? 'Generando...' : 'Generar código'}
                        </button>
                    </div>

                    {invitations.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            No hay invitaciones activas
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {invitations.map((inv) => (
                                <div
                                    key={inv._id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <p className="text-lg font-mono font-medium text-gray-900 tracking-widest">
                                            {inv.code}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Expira {new Date(inv.expiresAt).toLocaleDateString('es-AR')}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => copyCode(inv.code)}
                                            className="px-3 py-1.5 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-white transition"
                                        >
                                            {copied === inv.code ? 'Copiado' : 'Copiar'}
                                        </button>
                                        <button
                                            onClick={() => deleteInvitation(inv._id)}
                                            className="px-3 py-1.5 text-xs border border-red-100 rounded-lg text-red-400 hover:bg-red-50 transition"
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <p className="text-sm font-medium text-gray-900 mb-4">Miembros del taller</p>
                    {members.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-4">
                            No hay mecánicos registrados todavía
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {members.map((member) => (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                            {member.name.slice(0, 2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{member.name}</p>
                                            <p className="text-xs text-gray-400">{member.email}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-lg border ${member.role === 'admin'
                                            ? 'bg-gray-50 text-gray-600 border-gray-100'
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        {member.role === 'admin' ? 'Admin' : 'Mecánico'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}