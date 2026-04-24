import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Service } from '@/models/Service'
import { Vehicle } from '@/models/Vehicle'
import { z } from 'zod'

const serviceSchema = z.object({
    vehicleId: z.string().min(1, 'El vehículo es obligatorio'),
    type: z.enum([
        'cambio_aceite',
        'cambio_filtro',
        'cambio_pastillas',
        'alineacion',
        'balanceo',
        'revision_general',
        'cambio_correa',
        'cambio_neumaticos',
        'diagnostico',
        'otro',
    ]).catch(() => { throw new Error('Tipo de servicio inválido') }),
    description: z
        .string()
        .min(1, 'La descripción es obligatoria')
        .max(500, 'Descripción demasiado larga')
        .trim(),
    kmAtService: z
        .number()
        .min(0, 'El kilometraje no puede ser negativo'),
    nextServiceKm: z
        .number()
        .min(0, 'El kilometraje no puede ser negativo')
        .optional(),
    nextServiceDate: z
        .string()
        .optional()
        .transform((val) => val ? new Date(val) : undefined),
    serviceDate: z
        .string()
        .min(1, 'La fecha del servicio es obligatoria')
        .transform((val) => new Date(val)),
    cost: z
        .number()
        .min(0, 'El costo no puede ser negativo')
        .optional(),
    parts: z
        .array(z.string().trim())
        .optional()
        .default([]),
    status: z.enum(['pendiente', 'en_proceso', 'completado']).default('completado'),
})

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const vehicleId = searchParams.get('vehicleId')

        await connectDB()

        const query: any = { workshopId: session.user.workshopId }
        if (vehicleId) query.vehicleId = vehicleId

        const services = await Service.find(query).sort({ serviceDate: -1 })

        return NextResponse.json(services)
    } catch (error) {
        console.error('Error al obtener servicios:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()

        const result = serviceSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        await connectDB()

        const vehicle = await Vehicle.findOne({
            _id: result.data.vehicleId,
            workshopId: session.user.workshopId,
        })

        if (!vehicle) {
            return NextResponse.json(
                { error: 'Vehículo no encontrado' },
                { status: 404 }
            )
        }

        await Vehicle.findByIdAndUpdate(result.data.vehicleId, {
            currentKm: result.data.kmAtService,
        })

        const service = await Service.create({
            ...result.data,
            workshopId: session.user.workshopId,
            mechanicId: session.user.id,
            mechanicName: session.user.name,
        })

        return NextResponse.json(service, { status: 201 })
    } catch (error) {
        console.error('Error al crear servicio:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}