import { canUseService } from './content-access'
import type { Access } from './access'

const mk = (over: Partial<Access>): Access => ({
  role: 'free', isPro: false, isAdmin: false, status: null, plan: null,
  trialEnd: null, renewDate: null, cancelAtPeriodEnd: false, ...over,
})
const guest = mk({ role: 'guest' })
const free = mk({ role: 'free' })
const pro = mk({ role: 'pro', isPro: true, status: 'active' })
const admin = mk({ role: 'admin', isPro: true, isAdmin: true })

describe('content-access', () => {
  describe('canUseService', () => {
    it('pro/admin : tous les services', () => {
      for (const s of ['coach', 'smartwatch', 'programme', 'progression', 'notifications']) {
        expect(canUseService(pro, s)).toBe(true)
        expect(canUseService(admin, s)).toBe(true)
      }
    })
    it('free : programme/progression/notifications oui, coach/smartwatch non', () => {
      expect(canUseService(free, 'programme')).toBe(true)
      expect(canUseService(free, 'progression')).toBe(true)
      expect(canUseService(free, 'notifications')).toBe(true)
      expect(canUseService(free, 'coach')).toBe(false)
      expect(canUseService(free, 'smartwatch')).toBe(false)
    })
    it('guest : aucun', () => {
      expect(canUseService(guest, 'programme')).toBe(false)
    })
  })
})
