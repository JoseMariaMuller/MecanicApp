import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect, notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import { Vehicle } from '@/models/Vehicle'
import { Service } from '@/models/Service'
import Link from 'next/link'
import DeleteVehicleButton from '@/components/DeleteVehicleButton'
import DeleteServiceButton from '@/components/DeleteServiceButton'
import ExportPDFButton from '@/components/ExportPDFButton'
import NotificationButtons from '@/components/NotificationButtons'

const serviceLabels: Record<string, string> = {
    cambio_aceite: 'Cambio de aceite',
    cambio_filtro: 'Cambio de filtro',
    cambio_pastillas: 'Cambio de pastillas',
    alineacion: 'Alineación',
    balanceo: 'Balanceo',
    revision_general: 'Revisión general',
    cambio_correa: 'Cambio de correa',
    cambio_neumaticos: 'Cambio de neumáticos',
    diagnostico: 'Diagnóstico',
    otro: 'Otro',
}

const statusLabels: Record<string, { text: string; cls: string }> = {
    completado: { text: 'Completado', cls: 'bg-green-50 text-green-600 border border-green-100' },
    en_proceso: { text: 'En proceso', cls: 'bg-blue-50 text-blue-600 border border-blue-100' },
    pendiente: { text: 'Pendiente', cls: 'bg-yellow-50 text-yellow-600 border border-yellow-100' },
}

export default async function VehicleDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await getServerSession(authOptions)
    if (!session) redirect('/login')

    const { id } = await params

    await connectDB()

    const vehicleRaw = await Vehicle.findOne({
        _id: id,
        workshopId: session.user.workshopId,
    }).lean()

    if (!vehicleRaw) notFound()

    const vehicle = { ...(vehicleRaw as any), _id: (vehicleRaw as any)._id.toString() }

    const servicesRaw = await Service.find({
        vehicleId: id,
        workshopId: session.user.workshopId,
    })
        .sort({ serviceDate: -1 })
        .lean()

    const services = servicesRaw.map((s: any) => ({
        ...s,
        _id: s._id.toString(),
        vehicleId: s.vehicleId.toString(),
    }))

    const lastOilChange = services.find((s: any) => s.type === 'cambio_aceite' && s.status === 'completado')

    const remaining = lastOilChange?.nextServiceKm
        ? lastOilChange.nextServiceKm - vehicle.currentKm
        : null

    const progress = lastOilChange?.nextServiceKm && lastOilChange?.kmAtService
        ? Math.min(
            ((vehicle.currentKm - lastOilChange.kmAtService) /
                (lastOilChange.nextServiceKm - lastOilChange.kmAtService)) * 100,
            100
        )
        : null

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
        <div className="min-h-screen bg-gray-50 px-4 py-8">
            <div className="max-w-4xl mx-auto">

                <div className="flex flex-col gap-3 mb-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/vehicles"
                            className="text-sm text-gray-500 hover:text-gray-900 transition shrink-0"
                        >
                            ← Vehículos
                        </Link>
                        <h1 className="text-2xl font-medium text-gray-900">
                            {vehicle.brand} {vehicle.model}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <ExportPDFButton
                            vehicle={vehicle}
                            services={services}
                            workshopName={session.user.workshopName}
                        />
                        <Link
                            href={`/vehicles/${vehicle._id}/edit`}
                            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"
                        >
                            Editar
                        </Link>
                        <DeleteVehicleButton vehicleId={vehicle._id} />
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                            Datos del vehículo
                        </p>
                        <div className="space-y-2">
                            {[
                                { label: 'Patente', value: vehicle.plate },
                                { label: 'Marca', value: vehicle.brand },
                                { label: 'Modelo', value: vehicle.model },
                                { label: 'Año', value: vehicle.year },
                                { label: 'Color', value: vehicle.color },
                                { label: 'Combustible', value: vehicle.fuel },
                                { label: 'Km actuales', value: vehicle.currentKm.toLocaleString() },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-sm">
                                    <span className="text-gray-400">{label}</span>
                                    <span className="text-gray-900 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-4">
                            Datos del cliente
                        </p>

                        <div className="space-y-2 mb-6">
                            {[
                                { label: 'Nombre', value: vehicle.clientName },
                                { label: 'Teléfono', value: vehicle.clientPhone },
                                { label: 'Email', value: vehicle.clientEmail || '—' },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between text-sm">
                                    <span className="text-gray-400">{label}</span>
                                    <span className="text-gray-900 font-medium">{value}</span>
                                </div>
                            ))}
                        </div>

                        {/* 👇 NUEVO BLOQUE */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                                Notificaciones
                            </p>
                            <NotificationButtons
                                vehicleId={vehicle._id}
                                hasEmail={!!vehicle.clientEmail}
                                services={services}
                            />
                        </div>
                    </div>

                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                        Próximo cambio de aceite
                    </p>
                    {progress !== null && remaining !== null ? (
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Km restantes</span>
                                <span className={`text-xs px-2 py-0.5 rounded-lg ${getBadge(remaining).cls}`}>
                                    {getBadge(remaining).text}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-1">
                                <div
                                    className={`h-full rounded-full ${getColor(remaining)}`}
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-gray-400">
                                <span>{lastOilChange.kmAtService.toLocaleString()} km</span>
                                <span>{remaining.toLocaleString()} km restantes</span>
                                <span>{lastOilChange.nextServiceKm.toLocaleString()} km</span>
                            </div>
                            {lastOilChange.nextServiceDate && (
                                <p className="text-xs text-gray-400 mt-2">
                                    Fecha límite:{' '}
                                    {new Date(lastOilChange.nextServiceDate).toLocaleDateString('es-AR')}
                                </p>
                            )}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">Sin cambio de aceite registrado</p>
                    )}
                </div>

            </div>

            {vehicle.notes && (
                <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
                        Notas
                    </p>
                    <p className="text-sm text-gray-700">{vehicle.notes}</p>
                </div>
            )}

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Historial de servicios
                    </p>
                    <Link
                        href={`/services/new?vehicleId=${vehicle._id}`}
                        className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 transition"

                    >
                        + Registrar servicio
                    </Link>
                </div>

                {services.length === 0 ? (
                    <p className="text-sm text-gray-400 text-center py-6">
                        No hay servicios registrados para este vehículo
                    </p>
                ) : (
                    <div className="space-y-4">
                        {services.map((service: any) => (
                            <div
                                key={service._id}
                                className="border border-gray-100 rounded-xl p-4"
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            {serviceLabels[service.type] || service.type}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(service.serviceDate).toLocaleDateString('es-AR')} · {service.mechanicName}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Link
                                            href={`/services/${service._id}/edit`}
                                            className="text-xs text-gray-400 hover:text-gray-900 transition"
                                        >
                                            Editar
                                        </Link>
                                        <DeleteServiceButton
                                            serviceId={service._id}
                                            vehicleId={vehicle._id}
                                        />

                                        <span className={`text-xs px-2 py-1 rounded-lg ${statusLabels[service.status]?.cls}`}>
                                            {statusLabels[service.status]?.text}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-3">{service.description}</p>

                                <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                                    <span>{service.kmAtService.toLocaleString()} km</span>
                                    {service.nextServiceKm && (
                                        <span>Próximo: {service.nextServiceKm.toLocaleString()} km</span>
                                    )}
                                    {service.cost && (
                                        <span>${service.cost.toLocaleString()}</span>
                                    )}
                                </div>

                                {service.parts?.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-1">
                                        {service.parts.map((part: string, i: number) => (
                                            <span
                                                key={i}
                                                className="text-xs px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-lg text-gray-500"
                                            >
                                                {part}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>

    )
}