import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Service } from '@/models/Service'
import { z } from 'zod'

const updateServiceSchema = z.object({
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
    ]),
    description: z.string().min(1).max(500).trim(),
    kmAtService: z.number().min(0),
    nextServiceKm: z.number().min(0).optional(),
    nextServiceDate: z
        .string()
        .optional()
        .transform((val) => val ? new Date(val) : undefined),
    serviceDate: z.string().transform((val) => new Date(val)),
    cost: z.number().min(0).optional(),
    parts: z.array(z.string().trim()).optional().default([]),
    status: z.enum(['pendiente', 'en_proceso', 'completado']),
})

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params

        await connectDB()

        const service = await Service.findOne({
            _id: id,
            workshopId: session.user.workshopId,
        }).lean()

        if (!service) {
            return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
        }

        return NextResponse.json(service)
    } catch (error) {
        console.error('Error al obtener servicio:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params
        const body = await request.json()

        const result = updateServiceSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        await connectDB()

        const service = await Service.findOneAndUpdate(
            { _id: id, workshopId: session.user.workshopId },
            result.data,
            { new: true }
        )

        if (!service) {
            return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
        }

        return NextResponse.json(service)
    } catch (error) {
        console.error('Error al actualizar servicio:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id } = await params

        await connectDB()

        const service = await Service.findOneAndDelete({
            _id: id,
            workshopId: session.user.workshopId,
        })

        if (!service) {
            return NextResponse.json({ error: 'Servicio no encontrado' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Servicio eliminado' })
    } catch (error) {
        console.error('Error al eliminar servicio:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}