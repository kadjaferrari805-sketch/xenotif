// Données de DÉMONSTRATION (athlète fictif « Alex ») pour /dashboard-preview.
// Aucune donnée réelle ; uniquement présentationnel.
export const PREVIEW = {
  name: 'Alex',
  rings: [
    { value: 8420, max: 10000, color: '#FF4500', label: 'Pas', unit: 'pas' },
    { value: 612, max: 700, color: '#A3FF00', label: 'Calories', unit: 'kcal' },
    { value: 47, max: 60, color: '#2563EB', label: 'Minutes actives', unit: 'min' },
  ],
  weekly: [
    { day: 'Lun', steps: 7200, calories: 480, activeMinutes: 38, heartRate: 128 },
    { day: 'Mar', steps: 10300, calories: 690, activeMinutes: 61, heartRate: 142 },
    { day: 'Mer', steps: 5400, calories: 360, activeMinutes: 25, heartRate: 0 },
    { day: 'Jeu', steps: 9100, calories: 600, activeMinutes: 52, heartRate: 138 },
    { day: 'Ven', steps: 11800, calories: 760, activeMinutes: 68, heartRate: 150 },
    { day: 'Sam', steps: 6300, calories: 410, activeMinutes: 30, heartRate: 120 },
    { day: 'Dim', steps: 8420, calories: 612, activeMinutes: 47, heartRate: 132 },
  ],
  stats: { sessionsWeek: 5, hours: 28, activeDays: 6, badges: 4 },
  disciplines: [
    { name: 'Musculation', pct: 72 },
    { name: 'Running & Cardio', pct: 54 },
    { name: 'HIIT', pct: 38 },
  ],
  weight: { unit: 'kg', points: [82.4, 82.0, 81.6, 81.1, 80.7, 80.2, 79.8], goal: 78 },
  nutrition: { calories: 2180, target: 2300, protein: 148, carbs: 210, fat: 64 },
  badges: [
    { icon: '🔥', label: '7 jours' },
    { icon: '💪', label: '50 séances' },
    { icon: '🏃', label: '100 km' },
    { icon: '⚡', label: 'HIIT x20' },
  ],
  gamification: {
    xp: 920,
    levelKey: 'competiteur',
    xpInLevel: 120,
    xpForNext: 800,
    weekly: [
      { id: 'weekMinutes', target: 120, current: 95 },
      { id: 'weekDisciplines', target: 2, current: 2 },
    ],
  },
} as const
