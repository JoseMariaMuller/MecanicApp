import { Schema, model, models } from 'mongoose'

export interface IInvitation {
    _id: string
    code: string
    workshopId: string
    workshopName: string
    createdBy: string
    usedBy?: string
    used: boolean
    expiresAt: Date
    createdAt: Date
}

const InvitationSchema = new Schema<IInvitation>(
    {
        code: {
            type: String,
            required: true,
            unique: true,
        },
        workshopId: {
            type: String,
            required: true,
        },
        workshopName: {
            type: String,
            required: true,
        },
        createdBy: {
            type: String,
            required: true,
        },
        usedBy: {
            type: String,
        },
        used: {
            type: Boolean,
            default: false,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
)

export const Invitation = models.Invitation || model<IInvitation>('Invitation', InvitationSchema)