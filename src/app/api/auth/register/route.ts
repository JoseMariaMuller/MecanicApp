import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'
import { Invitation } from '@/models/Invitation'
import { z } from 'zod'

const registerSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre es demasiado largo')
        .trim(),
    email: z
        .string()
        .email('El email no es válido')
        .toLowerCase(),
    password: z
        .string()
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
        .regex(/[0-9]/, 'Debe contener al menos un número')
        .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial'),
    workshopName: z
        .string()
        .min(2, 'El nombre del taller debe tener al menos 2 caracteres')
        .max(100, 'El nombre del taller es demasiado largo')
        .trim()
        .optional(),
    invitationCode: z
        .string()
        .optional(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const result = registerSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0].message },
                { status: 400 }
            )
        }

        const { name, email, password, workshopName, invitationCode } = result.data

        await connectDB()

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return NextResponse.json(
                { error: 'Ya existe una cuenta con ese email' },
                { status: 409 }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        if (invitationCode) {
            const invitation = await Invitation.findOne({
                code: invitationCode.toUpperCase(),
                used: false,
                expiresAt: { $gt: new Date() },
            })

            if (!invitation) {
                return NextResponse.json(
                    { error: 'Código de invitación inválido o expirado' },
                    { status: 400 }
                )
            }

            const user = await User.create({
                name,
                email,
                password: hashedPassword,
                workshopName: invitation.workshopName,
                workshopId: invitation.workshopId,
                role: 'mechanic',
            })

            await Invitation.findByIdAndUpdate(invitation._id, {
                used: true,
                usedBy: user._id.toString(),
            })

            return NextResponse.json(
                { message: 'Cuenta creada correctamente' },
                { status: 201 }
            )
        }

        if (!workshopName) {
            return NextResponse.json(
                { error: 'El nombre del taller es obligatorio' },
                { status: 400 }
            )
        }

        const workshopId = crypto.randomUUID()

        await User.create({
            name,
            email,
            password: hashedPassword,
            workshopName,
            workshopId,
            role: 'admin',
        })

        return NextResponse.json(
            { message: 'Cuenta creada correctamente' },
            { status: 201 }
        )
    } catch (error) {
        console.error('Error en registro:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        )
    }
}