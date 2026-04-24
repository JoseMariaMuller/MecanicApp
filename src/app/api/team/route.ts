import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/models/User'

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

        const members = await User.find({
            workshopId: session.user.workshopId,
        })
            .select('-password')
            .sort({ role: -1, createdAt: 1 })
            .lean()

        return NextResponse.json(members)
    } catch (error) {
        console.error('Error al obtener equipo:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}