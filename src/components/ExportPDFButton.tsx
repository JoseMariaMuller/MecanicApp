'use client'

import { useState } from 'react'

interface Service {
    _id: string
    type: string
    description: string
    kmAtService: number
    nextServiceKm?: number
    serviceDate: string
    cost?: number
    parts?: string[]
    status: string
    mechanicName: string
}

interface Vehicle {
    plate: string
    brand: string
    model: string
    year: number
    fuel: string
    currentKm: number
    clientName: string
    clientPhone: string
    clientEmail?: string
}

interface ExportPDFButtonProps {
    vehicle: Vehicle
    services: Service[]
    workshopName: string
}

const serviceLabels: Record<string, string> = {
    cambio_aceite: 'Cambio de aceite',
    cambio_filtro: 'Cambio de filtro',
    cambio_pastillas: 'Cambio de pastillas',
    alineacion: 'Alineación',
    balanceo: 'Balanceo',
    revision_general: 'Revisión general',
    cambio_correa: 'Cambio de correa',
    cambio_neumaticos: 'Cambio de neumáticos',
    diagnostico: 'Diagnóstico',
    otro: 'Otro',
}

const statusLabels: Record<string, string> = {
    completado: 'Completado',
    en_proceso: 'En proceso',
    pendiente: 'Pendiente',
}

export default function ExportPDFButton({ vehicle, services, workshopName }: ExportPDFButtonProps) {
    const [loading, setLoading] = useState(false)

    async function handleExport() {
        setLoading(true)

        const { default: jsPDF } = await import('jspdf')
        const { default: autoTable } = await import('jspdf-autotable')

        const doc = new jsPDF()

        doc.setFont('helvetica', 'bold')
        doc.setFontSize(18)
        doc.setTextColor(17, 24, 39)
        doc.text(workshopName, 14, 20)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(107, 114, 128)
        doc.text('Historial de servicios', 14, 28)
        doc.text(`Generado el ${new Date().toLocaleDateString('es-AR')}`, 14, 34)

        doc.setDrawColor(229, 231, 235)
        doc.line(14, 40, 196, 40)

        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(17, 24, 39)
        doc.text('Datos del vehículo', 14, 52)

        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10)
        doc.setTextColor(55, 65, 81)

        const vehicleData = [
            ['Patente', vehicle.plate, 'Marca / Modelo', `${vehicle.brand} ${vehicle.model}`],
            ['Año', String(vehicle.year), 'Combustible', vehicle.fuel],
            ['Km actuales', vehicle.currentKm.toLocaleString(), '', ''],
        ]

        autoTable(doc, {
            startY: 56,
            head: [],
            body: vehicleData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: [107, 114, 128], cellWidth: 40 },
                1: { textColor: [17, 24, 39], cellWidth: 50 },
                2: { fontStyle: 'bold', textColor: [107, 114, 128], cellWidth: 40 },
                3: { textColor: [17, 24, 39], cellWidth: 50 },
            },
        })

        const afterVehicle = (doc as any).lastAutoTable.finalY + 8

        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(17, 24, 39)
        doc.text('Datos del cliente', 14, afterVehicle)

        const clientData = [
            ['Nombre', vehicle.clientName, 'Teléfono', vehicle.clientPhone],
            ['Email', vehicle.clientEmail || '—', '', ''],
        ]

        autoTable(doc, {
            startY: afterVehicle + 4,
            head: [],
            body: clientData,
            theme: 'plain',
            styles: { fontSize: 10, cellPadding: 3 },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: [107, 114, 128], cellWidth: 40 },
                1: { textColor: [17, 24, 39], cellWidth: 50 },
                2: { fontStyle: 'bold', textColor: [107, 114, 128], cellWidth: 40 },
                3: { textColor: [17, 24, 39], cellWidth: 50 },
            },
        })

        const afterClient = (doc as any).lastAutoTable.finalY + 12

        doc.setDrawColor(229, 231, 235)
        doc.line(14, afterClient - 4, 196, afterClient - 4)

        doc.setFontSize(13)
        doc.setFont('helvetica', 'bold')
        doc.setTextColor(17, 24, 39)
        doc.text('Historial de servicios', 14, afterClient + 4)

        if (services.length === 0) {
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(10)
            doc.setTextColor(107, 114, 128)
            doc.text('No hay servicios registrados', 14, afterClient + 14)
        } else {
            const tableData = services.map((s) => [
                new Date(s.serviceDate).toLocaleDateString('es-AR'),
                serviceLabels[s.type] || s.type,
                s.description.length > 40 ? s.description.substring(0, 40) + '...' : s.description,
                `${s.kmAtService.toLocaleString()} km`,
                s.nextServiceKm ? `${s.nextServiceKm.toLocaleString()} km` : '—',
                s.cost ? `$${s.cost.toLocaleString()}` : '—',
                statusLabels[s.status] || s.status,
            ])

            autoTable(doc, {
                startY: afterClient + 8,
                head: [['Fecha', 'Tipo', 'Descripción', 'Km', 'Próximo', 'Costo', 'Estado']],
                body: tableData,
                theme: 'striped',
                headStyles: {
                    fillColor: [17, 24, 39],
                    textColor: [255, 255, 255],
                    fontSize: 9,
                    fontStyle: 'bold',
                },
                bodyStyles: {
                    fontSize: 9,
                    textColor: [55, 65, 81],
                },
                alternateRowStyles: {
                    fillColor: [249, 250, 251],
                },
                columnStyles: {
                    0: { cellWidth: 22 },
                    1: { cellWidth: 32 },
                    2: { cellWidth: 50 },
                    3: { cellWidth: 22 },
                    4: { cellWidth: 22 },
                    5: { cellWidth: 20 },
                    6: { cellWidth: 22 },
                },
            })

            const totalCost = services.reduce((acc, s) => acc + (s.cost || 0), 0)

            if (totalCost > 0) {
                const finalY = (doc as any).lastAutoTable.finalY + 6
                doc.setFont('helvetica', 'bold')
                doc.setFontSize(11)
                doc.setTextColor(17, 24, 39)
                doc.text(`Total en servicios: $${totalCost.toLocaleString()}`, 14, finalY)
            }
        }

        const pageCount = (doc as any).internal.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFont('helvetica', 'normal')
            doc.setFontSize(8)
            doc.setTextColor(156, 163, 175)
            doc.text(
                `Página ${i} de ${pageCount} — ${workshopName}`,
                14,
                doc.internal.pageSize.height - 10
            )
        }

        doc.save(`historial-${vehicle.plate}-${new Date().toISOString().split('T')[0]}.pdf`)
        setLoading(false)
    }

    return (
        <button
            onClick={handleExport}
            disabled={loading}
            className="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-100 disabled:opacity-50 transition"
        >
            {loading ? 'Generando...' : 'Exportar PDF'}
        </button>
    )
}