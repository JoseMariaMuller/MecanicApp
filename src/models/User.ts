import mongoose, { Schema, model, models } from 'mongoose'

export interface IUser {
    _id: string
    name: string
    email: string
    password: string
    role: 'admin' | 'mechanic'
    workshopId: string
    workshopName: string
    createdAt: Date
    updatedAt: Date
}

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'El nombre es obligatorio'],
            trim: true,
            minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        },
        email: {
            type: String,
            required: [true, 'El email es obligatorio'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            required: [true, 'La contraseña es obligatoria'],
            minlength: [8, 'La contraseña debe tener al menos 8 caracteres'],
        },
        role: {
            type: String,
            enum: ['admin', 'mechanic'],
            default: 'admin',
        },
        workshopId: {
            type: String,
            required: [true, 'El ID del taller es obligatorio'],
        },
        workshopName: {
            type: String,
            required: [true, 'El nombre del taller es obligatorio'],
            trim: true,
        },
    },
    { timestamps: true }
)

export const User = models.User || model<IUser>('User', UserSchema)