import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { checkRateLimit } from '@/lib/ratelimit'

export async function POST(request: Request) {
    const headersList = await headers()
    const ip =
        headersList.get('x-forwarded-for')?.split(',')[0] ||
        headersList.get('x-real-ip') ||
        'unknown'

    const { allowed, remaining, resetAt } = await checkRateLimit(ip)

    if (!allowed) {
        const minutesLeft = Math.ceil((resetAt - Date.now()) / 60000)
        return NextResponse.json(
            {
                error: `Demasiados intentos. Intentá de nuevo en ${minutesLeft} minuto${minutesLeft !== 1 ? 's' : ''}.`,
            },
            {
                status: 429,
                headers: {
                    'X-RateLimit-Remaining': '0',
                    'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
                },
            }
        )
    }

    return NextResponse.json({ remaining })
}