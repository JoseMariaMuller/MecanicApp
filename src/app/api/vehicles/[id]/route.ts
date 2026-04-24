import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Vehicle } from '@/models/Vehicle'
import { z } from 'zod'

const updateVehicleSchema = z.object({
    plate: z.string().min(1).max(10).trim().toUpperCase(),
    brand: z.string().min(1).max(50).trim(),
    model: z.string().min(1).max(50).trim(),
    year: z.number().min(1900).max(new Date().getFullYear() + 1),
    color: z.string().trim().optional(),
    fuel: z.enum(['nafta', 'diesel', 'gnc', 'electrico', 'hibrido']),
    currentKm: z.number().min(0),
    clientName: z.string().min(1).max(100).trim(),
    clientPhone: z.string().min(1).max(20).trim(),
    clientEmail: z.string().email().optional().or(z.literal('')),
    notes: z.string().trim().optional(),
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

        const vehicle = await Vehicle.findOne({
            _id: id,
            workshopId: session.user.workshopId,
        }).lean()

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 })
        }

        return NextResponse.json(vehicle)
    } catch (error) {
        console.error('Error al obtener vehículo:', error)
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

        const result = updateVehicleSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        await connectDB()

        const vehicle = await Vehicle.findOneAndUpdate(
            { _id: id, workshopId: session.user.workshopId },
            result.data,
            { new: true }
        )

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 })
        }

        return NextResponse.json(vehicle)
    } catch (error) {
        console.error('Error al actualizar vehículo:', error)
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

        const vehicle = await Vehicle.findOneAndDelete({
            _id: id,
            workshopId: session.user.workshopId,
        })

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehículo no encontrado' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Vehículo eliminado' })
    } catch (error) {
        console.error('Error al eliminar vehículo:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}