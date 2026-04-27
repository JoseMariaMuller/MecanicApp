'use client'

import Link from 'next/link'
import { motion, useAnimation } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState(0)
  const [year, setYear] = useState('')

  useEffect(() => {
    setYear(String(new Date().getFullYear()))
  }, [])

  const tabs = [
    {
      label: 'Dashboard',
      content: (
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 16 }}>
            {[
              { label: 'Vehículos activos', value: '24', color: '#111827' },
              { label: 'Servicios este mes', value: '18', color: '#111827' },
              { label: 'Alertas pendientes', value: '3', color: '#eab308' },
              { label: 'En taller ahora', value: '2', color: '#3b82f6' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: '12px 14px' }}
              >
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', margin: '0 0 4px' }}>{stat.label}</p>
                <p style={{ fontSize: 22, fontWeight: 700, color: stat.color, margin: 0 }}>{stat.value}</p>
              </motion.div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>Próximos servicios</p>
          {[
            { name: 'Toyota Corolla · ABC123', client: 'Luis García', km: 4800, max: 5000, color: '#22c55e', label: 'Al día' },
            { name: 'Ford Ranger · DEF456', client: 'Roberto Martínez', km: 1200, max: 5000, color: '#eab308', label: 'Pronto' },
            { name: 'Fiat Palio · GHI789', client: 'Paula Fernández', km: 200, max: 5000, color: '#ef4444', label: 'Urgente' },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}
            >
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                {v.client.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>{v.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(v.km / v.max) * 100}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                      style={{ height: '100%', borderRadius: 2, background: v.color }}
                    />
                  </div>
                  <span style={{ fontSize: 9, color: v.color, flexShrink: 0 }}>{v.km.toLocaleString()} km</span>
                </div>
              </div>
              <span style={{ fontSize: 9, padding: '2px 8px', borderRadius: 6, background: `${v.color}22`, color: v.color, border: `1px solid ${v.color}44`, fontWeight: 600, flexShrink: 0 }}>
                {v.label}
              </span>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      label: 'Vehículos',
      content: (
        <div style={{ padding: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '8px 12px', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" /><path d="M8 8l2.5 2.5" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" strokeLinecap="round" /></svg>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>Buscar por patente, marca o cliente...</span>
          </div>
          {[
            { brand: 'Toyota', model: 'Corolla', plate: 'ABC123', client: 'Luis García', km: '89.200', status: 'Al día', color: '#22c55e' },
            { brand: 'Ford', model: 'Ranger', plate: 'DEF456', client: 'Roberto Martínez', km: '45.100', status: 'Pronto', color: '#eab308' },
            { brand: 'Volkswagen', model: 'Gol', plate: 'GHI789', client: 'Ana López', km: '123.400', status: 'Urgente', color: '#ef4444' },
          ].map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '12px 14px', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>{v.brand} {v.model} · {v.plate}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>{v.client}</p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', margin: 0 }}>{v.km} km actuales</p>
              </div>
              <span style={{ fontSize: 9, padding: '3px 8px', borderRadius: 6, background: `${v.color}22`, color: v.color, border: `1px solid ${v.color}44`, fontWeight: 600 }}>
                {v.status}
              </span>
            </motion.div>
          ))}
        </div>
      )
    },
    {
      label: 'Historial',
      content: (
        <div style={{ padding: 20 }}>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 12, padding: '14px', marginBottom: 14 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 4px' }}>DATOS DEL VEHÍCULO</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#fff', margin: '0 0 2px' }}>Toyota Corolla · ABC123</p>
            <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', margin: 0 }}>Luis García · 89.200 km actuales</p>
          </div>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: '0 0 10px' }}>HISTORIAL DE SERVICIOS</p>
          {[
            { type: 'Cambio de aceite', date: '15/04/2026', km: '89.200', next: '94.200', cost: '$52.000', status: 'Completado', color: '#22c55e' },
            { type: 'Cambio de filtro', date: '10/02/2026', km: '85.100', next: '90.100', cost: '$18.500', status: 'Completado', color: '#22c55e' },
            { type: 'Alineación', date: '05/01/2026', km: '82.000', next: '—', cost: '$35.000', status: 'Completado', color: '#22c55e' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
              style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '10px 12px', marginBottom: 8 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: '#fff', margin: 0 }}>{s.type}</p>
                <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 5, background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>{s.status}</span>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{s.date}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{s.km} km</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{s.cost}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )
    }
  ]

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
            <Link href="/login" style={{ fontSize: 14, color: '#6b7280', textDecoration: 'none' }} className="hidden-mobile">
              Iniciar sesión
            </Link>
            <Link href="/register" style={{ fontSize: 14, fontWeight: 500, color: '#fff', background: '#2563eb', padding: '8px 20px', borderRadius: 12, textDecoration: 'none', whiteSpace: 'nowrap' }}>
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

        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
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

          {/* DEMO INTERACTIVA */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            style={{ maxWidth: 640, margin: '0 auto', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20, overflow: 'hidden' }}
          >
            {/* Barra de tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '0 16px' }}>
              {tabs.map((tab, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '12px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: activeTab === i ? '#60a5fa' : 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    borderBottom: activeTab === i ? '2px solid #60a5fa' : '2px solid transparent',
                    transition: 'all 0.2s',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {/* Contenido del tab */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {tabs[activeTab].content}
            </motion.div>
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
                transition={{ duration: 0.4, delay: i * 0.06 }}
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

      {/* PRICING - LANZAMIENTO GRATUITO */}
      <section style={{ padding: '80px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#111827', marginBottom: 16 }}>
              Gratis durante el lanzamiento
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', marginBottom: 40, lineHeight: 1.7 }}>
              MecanicApp está en etapa de lanzamiento. Por tiempo limitado podés usar todas las funciones completamente gratis. Sin tarjeta, sin compromiso.
            </p>
            <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 24, padding: '40px 32px', marginBottom: 24 }}>
              <p style={{ fontSize: 40, fontWeight: 800, color: '#111827', marginBottom: 4 }}>$0</p>
              <p style={{ fontSize: 14, color: '#9ca3af', marginBottom: 32 }}>durante el período de lanzamiento</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 32, textAlign: 'left' }}>
                {[
                  'Vehículos ilimitados',
                  'Mecánicos ilimitados',
                  'Historial completo',
                  'Alertas de mantenimiento',
                  'Notificaciones por email',
                  'Export a PDF',
                  'Estadísticas del taller',
                  'Búsqueda instantánea',
                ].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' }}>
                    <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <Link
                href="/register"
                style={{ display: 'block', textAlign: 'center', padding: '14px 20px', borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none', background: '#2563eb', color: '#fff' }}
              >
                Crear cuenta gratis
              </Link>
            </div>
            <p style={{ fontSize: 13, color: '#9ca3af' }}>
              Cuando lancemos los planes pagos te avisamos con anticipación. Sin sorpresas.
            </p>
          </motion.div>
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
      <footer style={{ borderTop: '1px solid #f1f5f9', padding: '24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2 4h10M2 7h10M2 10h6" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>MecanicApp</span>
          </div>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>© {year} MecanicApp. Todos los derechos reservados.</p>
          <div style={{ display: 'flex', gap: 20 }}>
            <Link href="/login" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>Iniciar sesión</Link>
            <Link href="/register" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>Registrarse</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}