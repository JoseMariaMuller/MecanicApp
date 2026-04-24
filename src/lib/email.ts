import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

export async function sendServiceReadyEmail({
  clientName,
  clientEmail,
  vehicleBrand,
  vehicleModel,
  vehiclePlate,
  workshopName,
  mechanicName,
  serviceType,
}: {
  clientName: string
  clientEmail: string
  vehicleBrand: string
  vehicleModel: string
  vehiclePlate: string
  workshopName: string
  mechanicName: string
  serviceType: string
}) {
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
    otro: 'Servicio',
  }

  const label = serviceLabels[serviceType] || 'Servicio'

  await transporter.sendMail({
    from: `"${workshopName}" <${process.env.GMAIL_USER}>`,
    to: clientEmail,
    subject: `Tu vehículo está listo — ${workshopName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">

          <div style="padding:32px 32px 24px;border-bottom:1px solid #f3f4f6;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#111827;">${workshopName}</p>
            <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Notificación de servicio</p>
          </div>

          <div style="padding:32px;">
            <p style="margin:0 0 8px;font-size:15px;color:#374151;">Hola <strong>${clientName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Tu vehículo ya está listo para retirar. El servicio de <strong>${label}</strong> fue completado exitosamente.
            </p>

            <div style="background:#f9fafb;border-radius:12px;padding:20px;margin-bottom:24px;">
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
                <span style="font-size:13px;color:#6b7280;">Vehículo</span>
                <span style="font-size:13px;font-weight:600;color:#111827;">${vehicleBrand} ${vehicleModel}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
                <span style="font-size:13px;color:#6b7280;">Patente</span>
                <span style="font-size:13px;font-weight:600;color:#111827;">${vehiclePlate}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f3f4f6;">
                <span style="font-size:13px;color:#6b7280;">Servicio</span>
                <span style="font-size:13px;font-weight:600;color:#111827;">${label}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;">
                <span style="font-size:13px;color:#6b7280;">Mecánico</span>
                <span style="font-size:13px;font-weight:600;color:#111827;">${mechanicName}</span>
              </div>
            </div>

            <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
              Podés pasar a buscar tu vehículo en el horario habitual del taller.
            </p>
          </div>

          <div style="padding:20px 32px;border-top:1px solid #f3f4f6;background:#f9fafb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Este email fue enviado por ${workshopName} a través de MecanicApp.
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  })
}

export async function sendOilChangeReminderEmail({
  clientName,
  clientEmail,
  vehicleBrand,
  vehicleModel,
  vehiclePlate,
  workshopName,
  remainingKm,
}: {
  clientName: string
  clientEmail: string
  vehicleBrand: string
  vehicleModel: string
  vehiclePlate: string
  workshopName: string
  remainingKm: number
}) {
  const urgency = remainingKm <= 500 ? 'urgente' : 'próximo'
  const colorAlert = remainingKm <= 500 ? '#fef2f2' : '#fffbeb'
  const borderAlert = remainingKm <= 500 ? '#fecaca' : '#fde68a'
  const colorText = remainingKm <= 500 ? '#dc2626' : '#d97706'

  await transporter.sendMail({
    from: `"${workshopName}" <${process.env.GMAIL_USER}>`,
    to: clientEmail,
    subject: `Recordatorio de mantenimiento — ${workshopName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
      <body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
        <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:16px;border:1px solid #e5e7eb;overflow:hidden;">

          <div style="padding:32px 32px 24px;border-bottom:1px solid #f3f4f6;">
            <p style="margin:0;font-size:20px;font-weight:700;color:#111827;">${workshopName}</p>
            <p style="margin:6px 0 0;font-size:13px;color:#9ca3af;">Recordatorio de mantenimiento</p>
          </div>

          <div style="padding:32px;">
            <p style="margin:0 0 8px;font-size:15px;color:#374151;">Hola <strong>${clientName}</strong>,</p>
            <p style="margin:0 0 24px;font-size:15px;color:#374151;line-height:1.6;">
              Te recordamos que tu vehículo tiene un servicio <strong>${urgency}</strong>.
              ${remainingKm <= 0
                ? 'El servicio está vencido. Te recomendamos hacerlo lo antes posible.'
                : `Te quedan aproximadamente <strong>${remainingKm.toLocaleString()} km</strong> para el próximo servicio.`
              }
            </p>

            <div style="background:${colorAlert};border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid ${borderAlert};">
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid ${borderAlert};">
                <span style="font-size:13px;color:#6b7280;">Vehículo</span>
                <span style="font-size:13px;font-weight:600;color:#111827;">${vehicleBrand} ${vehicleModel}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid ${borderAlert};">
                <span style="font-size:13px;color:#6b7280;">Patente</span>
                <span style="font-size:13px;font-weight:600;color:#111827;">${vehiclePlate}</span>
              </div>
              <div style="display:flex;justify-content:space-between;padding:8px 0;">
                <span style="font-size:13px;color:#6b7280;">Km restantes</span>
                <span style="font-size:13px;font-weight:600;color:${colorText};">
                  ${remainingKm <= 0 ? 'Vencido' : `${remainingKm.toLocaleString()} km`}
                </span>
              </div>
            </div>

            <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.6;">
              Contactanos para coordinar un turno. Estamos para ayudarte a mantener tu vehículo en las mejores condiciones.
            </p>
          </div>

          <div style="padding:20px 32px;border-top:1px solid #f3f4f6;background:#f9fafb;">
            <p style="margin:0;font-size:12px;color:#9ca3af;">
              Este email fue enviado por ${workshopName} a través de MecanicApp.
            </p>
          </div>

        </div>
      </body>
      </html>
    `,
  })
}