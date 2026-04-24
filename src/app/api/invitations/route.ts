import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Invitation } from '@/models/Invitation'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
        }

        await connectDB()

        const invitations = await Invitation.find({
            workshopId: session.user.workshopId,
            used: false,
            expiresAt: { $gt: new Date() },
        }).sort({ createdAt: -1 })

        return NextResponse.json(invitations)
    } catch (error) {
        console.error('Error al obtener invitaciones:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function POST() {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        if (session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Solo el admin puede invitar mecánicos' }, { status: 403 })
        }

        await connectDB()

        const code = Math.random().toString(36).substring(2, 8).toUpperCase()

        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 48)

        const invitation = await Invitation.create({
            code,
            workshopId: session.user.workshopId,
            workshopName: session.user.workshopName,
            createdBy: session.user.id,
            expiresAt,
        })

        return NextResponse.json(invitation, { status: 201 })
    } catch (error) {
        console.error('Error al crear invitación:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        await connectDB()

        await Invitation.findOneAndDelete({
            _id: id,
            workshopId: session.user.workshopId,
        })

        return NextResponse.json({ message: 'Invitación eliminada' })
    } catch (error) {
        console.error('Error al eliminar invitación:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}