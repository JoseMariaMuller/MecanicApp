import { Schema, model, models } from 'mongoose'

export type ServiceType =
    | 'cambio_aceite'
    | 'cambio_filtro'
    | 'cambio_pastillas'
    | 'alineacion'
    | 'balanceo'
    | 'revision_general'
    | 'cambio_correa'
    | 'cambio_neumaticos'
    | 'diagnostico'
    | 'otro'

export interface IService {
    _id: string
    vehicleId: string
    workshopId: string
    mechanicId: string
    mechanicName: string
    type: ServiceType
    description: string
    kmAtService: number
    nextServiceKm?: number
    nextServiceDate?: Date
    serviceDate: Date
    cost?: number
    parts?: string[]
    status: 'pendiente' | 'en_proceso' | 'completado'
    createdAt: Date
    updatedAt: Date
}

const ServiceSchema = new Schema<IService>(
    {
        vehicleId: {
            type: String,
            required: [true, 'El vehículo es obligatorio'],
        },
        workshopId: {
            type: String,
            required: true,
        },
        mechanicId: {
            type: String,
            required: true,
        },
        mechanicName: {
            type: String,
            required: true,
            trim: true,
        },
        type: {
            type: String,
            enum: [
                'cambio_aceite',
                'cambio_filtro',
                'cambio_pastillas',
                'alineacion',
                'balanceo',
                'revision_general',
                'cambio_correa',
                'cambio_neumaticos',
                'diagnostico',
                'otro',
            ],
            required: [true, 'El tipo de servicio es obligatorio'],
        },
        description: {
            type: String,
            required: [true, 'La descripción es obligatoria'],
            trim: true,
        },
        kmAtService: {
            type: Number,
            required: [true, 'El kilometraje al momento del servicio es obligatorio'],
            min: [0, 'El kilometraje no puede ser negativo'],
        },
        nextServiceKm: {
            type: Number,
            min: [0, 'El kilometraje no puede ser negativo'],
        },
        nextServiceDate: {
            type: Date,
        },
        serviceDate: {
            type: Date,
            required: [true, 'La fecha del servicio es obligatoria'],
            default: Date.now,
        },
        cost: {
            type: Number,
            min: [0, 'El costo no puede ser negativo'],
        },
        parts: {
            type: [String],
            default: [],
        },
        status: {
            type: String,
            enum: ['pendiente', 'en_proceso', 'completado'],
            default: 'pendiente',
        },
    },
    { timestamps: true }
)

export const Service = models.Service || model<IService>('Service', ServiceSchema)