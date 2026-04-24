import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { sendServiceReadyEmail, sendOilChangeReminderEmail } from '@/lib/email'
import { connectDB } from '@/lib/db'
import { Vehicle } from '@/models/Vehicle'
import { Service } from '@/models/Service'
import { z } from 'zod'

const notificationSchema = z.discriminatedUnion('type', [
    z.object({
        type: z.literal('service_ready'),
        serviceId: z.string(),
    }),
    z.object({
        type: z.literal('oil_reminder'),
        vehicleId: z.string(),
    }),
])

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const result = notificationSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        await connectDB()

        if (result.data.type === 'service_ready') {
            const service = await Service.findOne({
                _id: result.data.serviceId,
                workshopId: session.user.workshopId,
            }).lean() as any

            if (!service) {
                return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
            }

            const vehicle = await Vehicle.findOne({
                _id: service.vehicleId,
                workshopId: session.user.workshopId,
            }).lean() as any

            if (!vehicle) {
                return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 })
            }

            if (!vehicle.clientEmail) {
                return NextResponse.json(
                    { error: 'El cliente no tiene email registrado' },
                    { status: 400 }
                )
            }

            await sendServiceReadyEmail({
                clientName: vehicle.clientName,
                clientEmail: vehicle.clientEmail,
                vehicleBrand: vehicle.brand,
                vehicleModel: vehicle.model,
                vehiclePlate: vehicle.plate,
                workshopName: session.user.workshopName,
                mechanicName: service.mechanicName,
                serviceType: service.type,
            })

            return NextResponse.json({ message: 'Email enviado correctamente' })
        }

        if (result.data.type === 'oil_reminder') {
            const vehicle = await Vehicle.findOne({
                _id: result.data.vehicleId,
                workshopId: session.user.workshopId,
            }).lean() as any

            if (!vehicle) {
                return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 })
            }

            if (!vehicle.clientEmail) {
                return NextResponse.json(
                    { error: 'El cliente no tiene email registrado' },
                    { status: 400 }
                )
            }

            const lastOilChange = await Service.findOne({
                vehicleId: result.data.vehicleId,
                workshopId: session.user.workshopId,
                type: 'cambio_aceite',
                status: 'completado',
                nextServiceKm: { $exists: true },
            })
                .sort({ serviceDate: -1 })
                .lean() as any

            if (!lastOilChange) {
                return NextResponse.json(
                    { error: 'No hay cambio de aceite registrado para este vehículo' },
                    { status: 400 }
                )
            }

            const remainingKm = lastOilChange.nextServiceKm - vehicle.currentKm

            await sendOilChangeReminderEmail({
                clientName: vehicle.clientName,
                clientEmail: vehicle.clientEmail,
                vehicleBrand: vehicle.brand,
                vehicleModel: vehicle.model,
                vehiclePlate: vehicle.plate,
                workshopName: session.user.workshopName,
                remainingKm,
            })

            return NextResponse.json({ message: 'Recordatorio enviado correctamente' })
        }
    } catch (error) {
        console.error('Error al enviar notificación:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}