import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Vehicle } from '@/models/Vehicle'
import { z } from 'zod'

const vehicleSchema = z.object({
    plate: z
        .string()
        .min(1, 'La patente es obligatoria')
        .max(10, 'Patente inválida')
        .trim()
        .toUpperCase(),
    brand: z
        .string()
        .min(1, 'La marca es obligatoria')
        .max(50, 'Marca demasiado larga')
        .trim(),
    model: z
        .string()
        .min(1, 'El modelo es obligatorio')
        .max(50, 'Modelo demasiado largo')
        .trim(),
    year: z
        .number()
        .min(1900, 'Año inválido')
        .max(new Date().getFullYear() + 1, 'Año inválido'),
    color: z.string().trim().optional(),
    fuel: z.enum(['nafta', 'diesel', 'gnc', 'electrico', 'hibrido']).catch('nafta'),
    currentKm: z
        .number()
        .min(0, 'El kilometraje no puede ser negativo'),
    clientName: z
        .string()
        .min(1, 'El nombre del cliente es obligatorio')
        .max(100, 'Nombre demasiado largo')
        .trim(),
    clientPhone: z
        .string()
        .min(1, 'El teléfono es obligatorio')
        .max(20, 'Teléfono inválido')
        .trim(),
    clientEmail: z
        .string()
        .email('Email inválido')
        .optional()
        .or(z.literal('')),
    notes: z.string().trim().optional(),
})

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')?.trim()

        await connectDB()

        const baseQuery: any = { workshopId: session.user.workshopId }

        if (search) {
            baseQuery.$or = [
                { plate: { $regex: search, $options: 'i' } },
                { brand: { $regex: search, $options: 'i' } },
                { model: { $regex: search, $options: 'i' } },
                { clientName: { $regex: search, $options: 'i' } },
                { clientPhone: { $regex: search, $options: 'i' } },
            ]
        }

        const vehicles = await Vehicle.find(baseQuery)
            .sort({ createdAt: -1 })
            .limit(50)
            .lean()

        return NextResponse.json(vehicles)
    } catch (error) {
        console.error('Error al obtener vehículos:', error)
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

        const result = vehicleSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        await connectDB()

        const existing = await Vehicle.findOne({ plate: result.data.plate })

        if (existing) {
            return NextResponse.json(
                { error: 'Ya existe un vehículo con esa patente' },
                { status: 409 }
            )
        }

        const vehicle = await Vehicle.create({
            ...result.data,
            workshopId: session.user.workshopId,
        })

        return NextResponse.json(vehicle, { status: 201 })
    } catch (error) {
        console.error('Error al crear vehículo:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}