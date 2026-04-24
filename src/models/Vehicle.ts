import { Schema, model, models } from 'mongoose'

export interface IVehicle {
    _id: string
    plate: string
    brand: string
    model: string
    year: number
    color: string
    fuel: 'nafta' | 'diesel' | 'gnc' | 'electrico' | 'hibrido'
    currentKm: number
    clientName: string
    clientPhone: string
    clientEmail?: string
    workshopId: string
    notes?: string
    createdAt: Date
    updatedAt: Date
}

const VehicleSchema = new Schema<IVehicle>(
    {
        plate: {
            type: String,
            required: [true, 'La patente es obligatoria'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        brand: {
            type: String,
            required: [true, 'La marca es obligatoria'],
            trim: true,
        },
        model: {
            type: String,
            required: [true, 'El modelo es obligatorio'],
            trim: true,
        },
        year: {
            type: Number,
            required: [true, 'El año es obligatorio'],
            min: [1900, 'Año inválido'],
            max: [new Date().getFullYear() + 1, 'Año inválido'],
        },
        color: {
            type: String,
            trim: true,
            default: 'No especificado',
        },
        fuel: {
            type: String,
            enum: ['nafta', 'diesel', 'gnc', 'electrico', 'hibrido'],
            required: [true, 'El tipo de combustible es obligatorio'],
        },
        currentKm: {
            type: Number,
            required: [true, 'El kilometraje actual es obligatorio'],
            min: [0, 'El kilometraje no puede ser negativo'],
        },
        clientName: {
            type: String,
            required: [true, 'El nombre del cliente es obligatorio'],
            trim: true,
        },
        clientPhone: {
            type: String,
            required: [true, 'El teléfono del cliente es obligatorio'],
            trim: true,
        },
        clientEmail: {
            type: String,
            lowercase: true,
            trim: true,
        },
        workshopId: {
            type: String,
            required: true,
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
)

export const Vehicle = models.Vehicle || model<IVehicle>('Vehicle', VehicleSchema)