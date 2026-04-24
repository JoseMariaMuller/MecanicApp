import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { connectDB } from '@/lib/db'
import { Vehicle } from '@/models/Vehicle'
import { Service } from '@/models/Service'
import Link from 'next/link'

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    await connectDB()

    const vehiclesRaw = await Vehicle.find({ workshopId: session.user.workshopId }).lean()
    const servicesRaw = await Service.find({ workshopId: session.user.workshopId }).lean()

    const vehicles = vehiclesRaw.map((v: any) => ({ ...v, _id: v._id.toString() }))
    const services = servicesRaw.map((s: any) => ({
        ...s,
        _id: s._id.toString(),
        vehicleId: s.vehicleId.toString(),
    }))

    const servicesThisMonth = services.filter((s: any) => {
        const date = new Date(s.serviceDate)
        const now = new Date()
        return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        )
    })

    const pendingAlerts = services
        .filter((s: any) => {
            if (!s.nextServiceKm) return false
            if (s.status !== 'completado') return false
            const vehicle = vehicles.find((v: any) => v._id === s.vehicleId)
            if (!vehicle) return false
            const remaining = s.nextServiceKm - vehicle.currentKm
            return remaining <= 1500
        })
        .sort((a: any, b: any) => {
            const vehicleA = vehicles.find((v: any) => v._id === a.vehicleId)
            const vehicleB = vehicles.find((v: any) => v._id === b.vehicleId)
            const remA = a.nextServiceKm - (vehicleA?.currentKm || 0)
            const remB = b.nextServiceKm - (vehicleB?.currentKm || 0)
            return remA - remB
        })

    const inProgress = services.filter((s: any) => s.status === 'en_proceso')

    const serviceTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            cambio_aceite: 'Aceite',
            cambio_correa: 'Correa',
            cambio_filtro: 'Filtro',
            cambio_pastillas: 'Pastillas',
            cambio_neumaticos: 'Neumáticos',
            alineacion: 'Alineación',
            balanceo: 'Balanceo',
            revision_general: 'Revisión',
            diagnostico: 'Diagnóstico',
            otro: 'Servicio',
        }
        return labels[type] || 'Servicio'
    }

    const getColor = (rem: number) => {
        if (rem <= 500) return 'bg-red-500'
        if (rem <= 1500) return 'bg-yellow-400'
        return 'bg-green-500'
    }

    const getBadge = (rem: number) => {
        if (rem <= 500) return { text: 'Urgente', cls: 'bg-red-50 text-red-600 border border-red-100' }
        if (rem <= 1500) return { text: 'Pronto', cls: 'bg-yellow-50 text-yellow-600 border border-yellow-100' }
        return { text: 'Al día', cls: 'bg-green-50 text-green-600 border border-green-100' }
    }

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-8">

                <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-2xl font-medium text-gray-900">
                            {session.user.workshopName}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Bienvenido, {session.user.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Link
                            href="/vehicles/new"
                           className="flex-1 md:flex-none text-center px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                        >
                            + Vehículo
                        </Link>
                        <Link
                            href="/services/new"
                            className="flex-1 md:flex-none text-center px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                        >
                            + Servicio
                        </Link>
                        <Link
                            href="/vehicles"
                            className="flex-1 md:flex-none text-center px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                        >
                            Buscar
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">Vehículos activos</p>
                        <p className="text-3xl font-medium text-gray-900">{vehicles.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">Servicios este mes</p>
                        <p className="text-3xl font-medium text-gray-900">{servicesThisMonth.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">Alertas pendientes</p>
                        <p className="text-3xl font-medium text-yellow-500">{pendingAlerts.length}</p>
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl p-5">
                        <p className="text-xs text-gray-500 mb-1">En taller ahora</p>
                        <p className="text-3xl font-medium text-blue-500">{inProgress.length}</p>
                    </div>
                </div>

                {pendingAlerts.length > 0 && (
                    <div className="mb-6 bg-yellow-50 border border-yellow-100 rounded-2xl p-5">
                        <p className="text-sm font-medium text-yellow-800 mb-3">
                            Vehículos que necesitan atención
                        </p>
                        <div className="space-y-2">
                            {pendingAlerts.map((alert: any) => {
                                const vehicle = vehicles.find((v: any) => v._id === alert.vehicleId)
                                if (!vehicle) return null
                                const remaining = alert.nextServiceKm - vehicle.currentKm
                                const isUrgent = remaining <= 500
                                return (
                                    <Link
                                        key={alert._id}
                                        href={`/vehicles/${vehicle._id}`}
                                        className="flex items-center justify-between bg-white rounded-xl px-4 py-3 border border-yellow-100 hover:border-yellow-200 transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full shrink-0 ${isUrgent ? 'bg-red-500' : 'bg-yellow-400'}`} />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900">
                                                    {vehicle.brand} {vehicle.model} · {vehicle.plate}
                                                </p>
                                                <p className="text-xs text-gray-500">{vehicle.clientName}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`text-sm font-medium ${isUrgent ? 'text-red-600' : 'text-yellow-600'}`}>
                                                {remaining.toLocaleString()} km restantes
                                            </p>
                                            <p className="text-xs text-gray-400">{serviceTypeLabel(alert.type)}</p>
                                        </div>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">
                            Próximos servicios
                        </h2>
                        {vehicles.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-400">No hay vehículos registrados</p>
                                <Link
                                    href="/vehicles/new"
                                    className="text-sm text-gray-900 font-medium hover:underline mt-2 inline-block"
                                >
                                    Registrar el primero
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {vehicles.slice(0, 5).map((vehicle: any) => {
                                    const lastService = services
                                        .filter((s: any) =>
                                            s.vehicleId === vehicle._id &&
                                            s.status === 'completado' &&
                                            s.nextServiceKm
                                        )
                                        .sort((a: any, b: any) => {
                                            const remA = a.nextServiceKm - vehicle.currentKm
                                            const remB = b.nextServiceKm - vehicle.currentKm
                                            return remA - remB
                                        })[0]

                                    const remaining = lastService?.nextServiceKm
                                        ? lastService.nextServiceKm - vehicle.currentKm
                                        : null

                                    const progress = lastService?.nextServiceKm && lastService?.kmAtService
                                        ? Math.min(
                                            ((vehicle.currentKm - lastService.kmAtService) /
                                                (lastService.nextServiceKm - lastService.kmAtService)) * 100,
                                            100
                                        )
                                        : null

                                    return (
                                        <Link
                                            key={vehicle._id}
                                            href={`/vehicles/${vehicle._id}`}
                                            className="flex items-center gap-3 hover:opacity-80 transition"
                                        >
                                            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600 shrink-0">
                                                {vehicle.clientName.slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {vehicle.brand} {vehicle.model} · {vehicle.plate}
                                                </p>
                                                <p className="text-xs text-gray-400 mb-1.5">
                                                    {vehicle.clientName}
                                                    {lastService && (
                                                        <span className="ml-1 text-gray-300">
                                                            · {serviceTypeLabel(lastService.type)}
                                                        </span>
                                                    )}
                                                </p>
                                                {progress !== null && remaining !== null ? (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${getColor(remaining)}`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs text-gray-400 shrink-0">
                                                            {remaining.toLocaleString()} km
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-400">Sin servicios con km registrado</p>
                                                )}
                                            </div>
                                            {remaining !== null && (
                                                <span className={`text-xs px-2 py-1 rounded-lg shrink-0 ${getBadge(remaining).cls}`}>
                                                    {getBadge(remaining).text}
                                                </span>
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h2 className="text-sm font-medium text-gray-900 mb-4">
                            En taller ahora
                        </h2>
                        {inProgress.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-gray-400">No hay servicios en proceso</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {inProgress.map((service: any) => {
                                    const vehicle = vehicles.find((v: any) => v._id === service.vehicleId)
                                    return (
                                        <Link
                                            key={service._id}
                                            href={`/vehicles/${service.vehicleId}`}
                                            className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0 hover:opacity-80 transition"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {vehicle
                                                        ? `${vehicle.brand} ${vehicle.model} · ${vehicle.plate}`
                                                        : 'Vehículo no encontrado'}
                                                </p>
                                                <p className="text-xs text-gray-400">{service.description}</p>
                                            </div>
                                            <span className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                                                En proceso
                                            </span>
                                        </Link>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </main>
    )
}