import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'La contraseña actual es obligatoria'),
    newPassword: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
})

export async function PUT(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const result = passwordSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        await connectDB()

        const user = await User.findById(session.user.id).lean() as any

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const passwordMatch = await bcrypt.compare(
            result.data.currentPassword,
            user.password
        )

        if (!passwordMatch) {
            return NextResponse.json(
                { error: 'La contraseña actual es incorrecta' },
                { status: 400 }
            )
        }

        const hashedPassword = await bcrypt.hash(result.data.newPassword, 12)

        await User.findByIdAndUpdate(session.user.id, {
            password: hashedPassword,
        })

        return NextResponse.json({ message: 'Contraseña actualizada' })
    } catch (error) {
        console.error('Error al cambiar contraseña:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}