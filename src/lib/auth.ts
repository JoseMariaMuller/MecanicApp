import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { connectDB } from './db'
import { User } from '@/models/User'

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Contraseña', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email y contraseña son obligatorios')
                }

                await connectDB()

                const user = await User.findOne({ email: credentials.email }).lean()

                if (!user) {
                    throw new Error('Email o contraseña incorrectos')
                }

                const passwordMatch = await bcrypt.compare(
                    credentials.password,
                    user.password
                )

                if (!passwordMatch) {
                    throw new Error('Email o contraseña incorrectos')
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    workshopId: user.workshopId,
                    workshopName: user.workshopName,
                }
            },
        }),
    ],
    callbacks: {
        // ✅ Se agregó `trigger` y `session` como parámetros
        async jwt({ token, user, trigger, session }) {
            // Al hacer login, carga los datos iniciales en el token
            if (user) {
                token.id = user.id
                token.name = user.name
                token.role = (user as any).role
                token.workshopId = (user as any).workshopId
                token.workshopName = (user as any).workshopName
            }

            // ✅ Esto es lo que faltaba: cuando se llama a update() desde el cliente,
            // trigger es 'update' y session contiene los nuevos valores
            if (trigger === 'update' && session) {
                if (session.name) token.name = session.name
                if (session.workshopName) token.workshopName = session.workshopName
            }

            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string
                session.user.name = token.name as string  // ✅ también sincronizar name
                session.user.role = token.role as string
                session.user.workshopId = token.workshopId as string
                session.user.workshopName = token.workshopName as string
            }
            return session
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60,
    },
    secret: process.env.NEXTAUTH_SECRET,
}