import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { z } from 'zod'

const profileSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres').max(50).trim(),
    workshopName: z.string().min(2, 'El nombre del taller debe tener al menos 2 caracteres').max(100).trim(),
})

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const result = profileSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        await connectDB()

        await User.findByIdAndUpdate(session.user.id, {
            name: result.data.name,
            workshopName: result.data.workshopName,
        })

        return NextResponse.json({ message: 'Perfil actualizado' })
    } catch (error) {
        console.error('Error al actualizar perfil:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}