import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
    throw new Error('Falta MONGODB_URI en las variables de entorno')
}

let cached = (global as any).mongoose as {
    conn: typeof mongoose | null
    promise: Promise<typeof mongoose> | null
}

if (!cached) {
    (global as any).mongoose = { conn: null, promise: null }
    cached = (global as any).mongoose
}

export async function connectDB() {
    if (cached.conn) return cached.conn

    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
        })
    }

    cached.conn = await cached.promise
    return cached.conn
}