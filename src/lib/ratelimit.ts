import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '15 m'),
  analytics: true,
  prefix: 'mecanicapp:login',
})

export async function checkRateLimit(ip: string): Promise<{
  allowed: boolean
  remaining: number
  resetAt: number
}> {
  const { success, remaining, reset } = await ratelimit.limit(ip)

  return {
    allowed: success,
    remaining,
    resetAt: reset,
  }
}

export function resetRateLimit(_ip: string) {
}