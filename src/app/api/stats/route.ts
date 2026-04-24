import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Service } from '@/models/Service'
import { Vehicle } from '@/models/Vehicle'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        await connectDB()

        const now = new Date()
        const twelveMonthsAgo = new Date()
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
        twelveMonthsAgo.setDate(1)
        twelveMonthsAgo.setHours(0, 0, 0, 0)

        const services = await Service.find({
            workshopId: session.user.workshopId,
            serviceDate: { $gte: twelveMonthsAgo },
        }).lean()

        const vehicles = await Vehicle.find({
            workshopId: session.user.workshopId,
        }).lean()

        const monthlyData: Record<string, { month: string; servicios: number; ingresos: number }> = {}

        for (let i = 11; i >= 0; i--) {
            const date = new Date()
            date.setMonth(date.getMonth() - i)
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            const label = date.toLocaleDateString('es-AR', { month: 'short', year: '2-digit' })
            monthlyData[key] = { month: label, servicios: 0, ingresos: 0 }
        }

        services.forEach((s: any) => {
            const date = new Date(s.serviceDate)
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
            if (monthlyData[key]) {
                monthlyData[key].servicios++
                monthlyData[key].ingresos += s.cost || 0
            }
        })

        const serviceTypes: Record<string, number> = {}
        services.forEach((s: any) => {
            serviceTypes[s.type] = (serviceTypes[s.type] || 0) + 1
        })

        const typeLabels: Record<string, string> = {
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

        const topServiceTypes = Object.entries(serviceTypes)
            .map(([type, count]) => ({ name: typeLabels[type] || type, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        const vehicleServiceCount: Record<string, { name: string; count: number }> = {}
        services.forEach((s: any) => {
            const vehicle = (vehicles as any[]).find((v: any) => v._id.toString() === s.vehicleId)
            if (vehicle) {
                const key = s.vehicleId
                if (!vehicleServiceCount[key]) {
                    vehicleServiceCount[key] = {
                        name: `${vehicle.brand} ${vehicle.model} · ${vehicle.plate}`,
                        count: 0,
                    }
                }
                vehicleServiceCount[key].count++
            }
        })

        const topVehicles = Object.values(vehicleServiceCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        const totalRevenue = services.reduce((acc: number, s: any) => acc + (s.cost || 0), 0)
        const totalServices = services.length
        const avgRevenuePerService = totalServices > 0 ? totalRevenue / totalServices : 0

        const thisMonth = services.filter((s: any) => {
            const date = new Date(s.serviceDate)
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        })

        const lastMonth = services.filter((s: any) => {
            const date = new Date(s.serviceDate)
            const lm = new Date()
            lm.setMonth(lm.getMonth() - 1)
            return date.getMonth() === lm.getMonth() && date.getFullYear() === lm.getFullYear()
        })

        const growth = lastMonth.length > 0
            ? Math.round(((thisMonth.length - lastMonth.length) / lastMonth.length) * 100)
            : 0

        return NextResponse.json({
            monthly: Object.values(monthlyData),
            topServiceTypes,
            topVehicles,
            totalRevenue,
            totalServices,
            avgRevenuePerService: Math.round(avgRevenuePerService),
            thisMonthServices: thisMonth.length,
            growth,
            totalVehicles: vehicles.length,
        })
    } catch (error) {
        console.error('Error al obtener estadísticas:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}