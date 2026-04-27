import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="text-center">

                <p className="text-8xl font-medium text-gray-200 mb-6">404</p>

                <h1 className="text-xl font-medium text-gray-900 mb-2">
                    Página no encontrada
                </h1>
                <p className="text-sm text-gray-400 mb-8">
                    La página que buscás no existe o fue movida.
                </p>

                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/dashboard"
                        className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                    >
                        Ir al dashboard
                    </Link>
                    <Link
                        href="/vehicles"
                        className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                    >
                        Ver vehículos
                    </Link>
                </div>

            </div>
        </div>
    )
}