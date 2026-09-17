import type { SupabaseClient } from '@supabase/supabase-js'

// Faux client Supabase minimal pour les tests serveur : chaque table renvoie un
// résultat fixé par opération, et chaque appel est journalisé (table, opération,
// charge utile, filtres) pour les assertions.

type FakeError = { message: string; code?: string } | null
type FakeResponse = { data: unknown; error: FakeError }
type Op = 'select' | 'insert' | 'update' | 'upsert'

export type FakeTables = Record<string, Partial<Record<Op, { data?: unknown; error?: FakeError }>>>
export type FakeCall = { table: string; op: Op; payload?: unknown; filters: unknown[][] }

interface FakeQuery extends PromiseLike<FakeResponse> {
  eq(...args: unknown[]): FakeQuery
  or(...args: unknown[]): FakeQuery
  order(...args: unknown[]): FakeQuery
  limit(...args: unknown[]): FakeQuery
  maybeSingle(): FakeQuery
  single(): FakeQuery
}

export function createFakeSupabase(tables: FakeTables = {}, extra: Record<string, unknown> = {}) {
  const calls: FakeCall[] = []

  function run(table: string, op: Op, payload?: unknown): FakeQuery {
    const call: FakeCall = { table, op, payload, filters: [] }
    calls.push(call)
    const response: FakeResponse = { data: null, error: null, ...tables[table]?.[op] }
    const query: FakeQuery = {
      then<A = FakeResponse, B = never>(
        onFulfilled?: ((value: FakeResponse) => A | PromiseLike<A>) | null,
        onRejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
      ): PromiseLike<A | B> {
        return Promise.resolve(response).then(onFulfilled, onRejected)
      },
      eq(...args: unknown[]) { call.filters.push(['eq', ...args]); return query },
      or(...args: unknown[]) { call.filters.push(['or', ...args]); return query },
      order(...args: unknown[]) { call.filters.push(['order', ...args]); return query },
      limit(...args: unknown[]) { call.filters.push(['limit', ...args]); return query },
      maybeSingle() { return query },
      single() { return query },
    }
    return query
  }

  const client = {
    from: (table: string) => ({
      select: () => run(table, 'select'),
      insert: (payload: unknown) => run(table, 'insert', payload),
      update: (payload: unknown) => run(table, 'update', payload),
      upsert: (payload: unknown) => run(table, 'upsert', payload),
    }),
    ...extra,
  }

  return { client: client as unknown as SupabaseClient, calls }
}
