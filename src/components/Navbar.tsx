'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'


export default function Navbar() {
    const pathname = usePathname()
    const { data: session } = useSession()

    const [menuOpen, setMenuOpen] = useState(false)

    const hideOn = ['/', '/login', '/register']
    if (hideOn.includes(pathname)) return null

    const links = [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/vehicles', label: 'Vehículos' },
        { href: '/services/new', label: 'Nuevo servicio' },
        { href: '/stats', label: 'Estadísticas' },
        ...(session?.user?.role === 'admin' ? [{ href: '/team', label: 'Equipo' }] : []),
    ]

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-6xl mx-auto px-4">
                <div className="flex items-center justify-between h-14">

                    {/* LEFT */}
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 4h10M2 7h10M2 10h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                                {session?.user?.workshopName || 'MecanicApp'}
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center gap-1">
                            {links.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className={`px-3 py-1.5 rounded-lg text-sm transition ${pathname === link.href
                                        ? 'bg-gray-100 text-gray-900 font-medium'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="flex items-center gap-3">
                        {/* Perfil (desktop) */}
                        <Link
                            href="/profile"
                            className="text-sm text-gray-500 hover:text-gray-900 transition hidden md:block"
                        >
                            {session?.user?.name}
                        </Link>

                        {/* Logout (desktop) */}
                        <button
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="hidden md:block px-3 py-1.5 rounded-lg text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                        >
                            Salir
                        </button>

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50 transition"
                            aria-label="Menú"
                        >
                            {menuOpen ? (
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* MOBILE MENU */}
            {menuOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white">
                    <div className="max-w-6xl mx-auto px-4 py-3 space-y-1">

                        {/* Links */}
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMenuOpen(false)}
                                className="block px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                            >
                                {link.label}
                            </Link>
                        ))}

                        {/* Perfil */}
                        <Link
                            href="/profile"
                            onClick={() => setMenuOpen(false)}
                            className="block px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                        >
                            Mi perfil
                        </Link>

                        {/* User + logout */}
                        <div className="border-t border-gray-100 pt-3 mt-3">
                            <p className="text-xs text-gray-400 px-3 mb-2">
                                {session?.user?.name}
                            </p>

                            <button
                                onClick={() => signOut({ callbackUrl: '/login' })}
                                className="block w-full text-left px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                            >
                                Salir
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </nav>
    )
}