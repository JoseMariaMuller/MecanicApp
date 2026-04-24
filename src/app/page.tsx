'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', overflowX: 'hidden', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* NAV */}
      <nav style={{ borderBottom: '1px solid #f1f5f9', padding: '0 24px', position: 'sticky', top: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)', zIndex: 50 }}>
        <div style={{ maxWidth: 1152, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M2 7h10M2 10h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>MecanicApp</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link
              href="/login"
              style={{
                fontSize: 14,
                color: '#6b7280',
                textDecoration: 'none',
                display: 'none',
              }}
              className="hidden-mobile"
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#fff',
                background: '#2563eb',
                padding: '8px 20px',
                borderRadius: 12,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Empezar gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        padding: '80px 24px 120px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1d4ed8 100%)',
        backgroundSize: '200% 200%',
        animation: 'gradMove 8s ease infinite',
      }}>
        <div style={{ position: 'absolute', top: -100, right: -80, width: 400, height: 400, borderRadius: '50%', background: 'rgba(37,99,235,0.35)', filter: 'blur(80px)', animation: 'floatOrb 6s ease infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 300, height: 300, borderRadius: '50%', background: 'rgba(96,165,250,0.2)', filter: 'blur(60px)', animation: 'floatOrb 8s ease infinite 2s', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 999, padding: '4px 14px', marginBottom: 24 }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', animation: 'pulseOrb 2s ease infinite' }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: '#bfdbfe' }}>Software de gestión para talleres mecánicos</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, color: '#fff', lineHeight: 1.1, marginBottom: 20 }}
          >
            Tu taller,{' '}
            <span style={{ color: '#60a5fa' }}>bajo control</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ fontSize: 17, color: '#bfdbfe', marginBottom: 40, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}
          >
            Registrá servicios, seguí el historial de cada vehículo y avisá a tus clientes cuando el auto está listo.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 60 }}
          >
            <Link href="/register" style={{ fontSize: 14, fontWeight: 600, color: '#fff', background: '#2563eb', padding: '14px 32px', borderRadius: 14, textDecoration: 'none', boxShadow: '0 0 40px rgba(59,130,246,0.5)' }}>
              Empezar gratis — sin tarjeta
            </Link>
            <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: '#fff', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '14px 32px', borderRadius: 14, textDecoration: 'none' }}>
              Iniciar sesión
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '24px', maxWidth: 580, margin: '0 auto' }}
          >
            <p style={{ fontSize: 11, color: '#60a5fa', marginBottom: 16, textAlign: 'left' }}>Vista previa del dashboard</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { name: 'Toyota Corolla · ABC123', client: 'Luis García', km: 4800, max: 5000, color: '#22c55e', label: 'Al día' },
                { name: 'Ford Ranger · DEF456', client: 'Roberto Martínez', km: 1200, max: 5000, color: '#eab308', label: 'Pronto' },
                { name: 'Fiat Palio · GHI789', client: 'Paula Fernández', km: 200, max: 5000, color: '#ef4444', label: 'Urgente' },
              ].map((v, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 16px' }}
                >
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                    {v.client.slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>{v.name}</p>
                    <p style={{ fontSize: 11, color: '#60a5fa', margin: '0 0 8px' }}>{v.client}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(v.km / v.max) * 100}%` }}
                          transition={{ duration: 1, delay: 0.8 + i * 0.1 }}
                          style={{ height: '100%', borderRadius: 3, background: v.color }}
                        />
                      </div>
                      <span style={{ fontSize: 11, color: v.color, flexShrink: 0 }}>{v.km.toLocaleString()} km</span>
                    </div>
                  </div>
                  <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 8, background: `${v.color}22`, color: v.color, border: `1px solid ${v.color}44`, fontWeight: 500, flexShrink: 0 }}>
                    {v.label}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#111827', marginBottom: 12 }}>
              Todo lo que necesita tu taller
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, margin: '0 auto' }}>
              Diseñado para mecánicos reales, no para administradores de sistemas.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {[
              { title: 'Historial completo', desc: 'Cada servicio registrado con fecha, km, repuestos y costo. El cliente puede pedir su historial en cualquier momento.' },
              { title: 'Alertas automáticas', desc: 'La app avisa cuando un vehículo tiene el próximo servicio por km o por fecha. Nunca más un cliente sin mantenimiento al día.' },
              { title: 'Notificaciones al cliente', desc: 'Avisá por email cuando el auto está listo o cuando se acerca el próximo servicio. Profesional y automático.' },
              { title: 'Multi-mecánico', desc: 'El dueño invita a sus mecánicos con un código. Cada uno registra sus servicios con su nombre y rol.' },
              { title: 'Export a PDF', desc: 'Generá el historial completo del vehículo en un PDF para entregarle al cliente en el momento.' },
              { title: 'Búsqueda instantánea', desc: 'Encontrá cualquier vehículo o cliente en segundos por patente, nombre, marca o modelo.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 20, padding: '28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 9l4 4 8-8" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: 8, fontSize: 15 }}>{f.title}</p>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PLANS */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', marginBottom: 56 }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#111827', marginBottom: 12 }}>
              Planes simples
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280' }}>Empezá gratis y crecé cuando estés listo.</p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Gratis', price: '$0', period: 'para siempre', features: ['Hasta 10 vehículos', '1 mecánico', 'Historial completo', 'Export a PDF'], cta: 'Empezar gratis', highlight: false },
              { name: 'Pro', price: '$4.999', period: 'por mes', features: ['Vehículos ilimitados', 'Hasta 5 mecánicos', 'Notificaciones por email', 'Estadísticas avanzadas', 'Soporte prioritario'], cta: 'Empezar prueba gratis', highlight: true },
              { name: 'Taller', price: '$9.999', period: 'por mes', features: ['Todo lo del plan Pro', 'Mecánicos ilimitados', 'Múltiples sucursales', 'API de integración', 'Soporte dedicado'], cta: 'Contactar', highlight: false },
            ].map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                style={{
                  borderRadius: 24,
                  padding: '36px 28px',
                  position: 'relative',
                  background: plan.highlight ? '#2563eb' : '#fff',
                  border: plan.highlight ? 'none' : '1px solid #e5e7eb',
                  boxShadow: plan.highlight ? '0 20px 60px rgba(37,99,235,0.3)' : '0 1px 3px rgba(0,0,0,0.06)',
                }}
              >
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: '#111827', color: '#fff', fontSize: 11, fontWeight: 600, padding: '4px 14px', borderRadius: 999 }}>
                    Más popular
                  </div>
                )}
                <p style={{ fontWeight: 700, color: plan.highlight ? '#fff' : '#111827', marginBottom: 4, fontSize: 16 }}>{plan.name}</p>
                <p style={{ fontSize: 36, fontWeight: 800, color: plan.highlight ? '#fff' : '#111827', marginBottom: 4 }}>{plan.price}</p>
                <p style={{ fontSize: 13, color: plan.highlight ? '#bfdbfe' : '#9ca3af', marginBottom: 28 }}>{plan.period}</p>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {plan.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: plan.highlight ? '#fff' : '#374151' }}>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7l3.5 3.5L12 3" stroke={plan.highlight ? 'white' : '#2563eb'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '12px 20px',
                    borderRadius: 12,
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: plan.highlight ? '#fff' : '#111827',
                    color: plan.highlight ? '#2563eb' : '#fff',
                  }}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: 'center', borderRadius: 28, padding: '64px 40px', background: 'linear-gradient(135deg, #1d4ed8, #2563eb, #3b82f6)', position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', filter: 'blur(30px)' }} />
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, color: '#fff', marginBottom: 16, position: 'relative' }}>
              Llevá tu taller al siguiente nivel
            </h2>
            <p style={{ fontSize: 16, color: '#bfdbfe', marginBottom: 32, position: 'relative', lineHeight: 1.7 }}>
              Unite gratis hoy y empezá a gestionar tus vehículos de forma profesional.
            </p>
            <Link
              href="/register"
              style={{ display: 'inline-block', fontSize: 14, fontWeight: 700, color: '#2563eb', background: '#fff', padding: '14px 36px', borderRadius: 14, textDecoration: 'none', position: 'relative' }}
            >
              Crear cuenta gratis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid #f1f5f9', padding: '24px', }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M2 7h10M2 10h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>MecanicApp</span>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>© {new Date().getFullYear()} MecanicApp. Todos los derechos reservados.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/login" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>Iniciar sesión</Link>
            <Link href="/register" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>Registrarse</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}