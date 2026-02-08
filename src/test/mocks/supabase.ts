import { vi } from 'vitest'

type QueryResult = { data: unknown; error: unknown; count?: number | null }

export function createMockQueryBuilder(resolveWith?: Partial<QueryResult>) {
  const result: QueryResult = {
    data: resolveWith?.data ?? null,
    error: resolveWith?.error ?? null,
    count: resolveWith?.count ?? null,
  }

  const builder: Record<string, unknown> = {}

  const chainMethods = [
    'select', 'eq', 'neq', 'is', 'in', 'ilike', 'gte', 'lte',
    'order', 'range', 'limit', 'or', 'insert', 'update', 'delete',
    'single', 'maybeSingle', 'abortSignal',
  ]

  for (const method of chainMethods) {
    builder[method] = vi.fn().mockReturnValue(builder)
  }

  // Terminal: make the builder thenable so `await supabase.from(...)...` resolves
  builder.then = (resolve: (val: QueryResult) => void) => {
    resolve(result)
    return builder
  }

  return builder as Record<string, ReturnType<typeof vi.fn>> & { then: unknown }
}

export function createMockSupabase() {
  const mockQueryBuilder = createMockQueryBuilder()

  const mockFrom = vi.fn().mockReturnValue(mockQueryBuilder)

  const mockAuth = {
    getUser: vi.fn().mockResolvedValue({
      data: { user: null },
      error: null,
    }),
    getSession: vi.fn().mockResolvedValue({
      data: { session: null },
      error: null,
    }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: {}, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
    updateUser: vi.fn().mockResolvedValue({ data: {}, error: null }),
    onAuthStateChange: vi.fn().mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    }),
  }

  const mockStorageBucket = {
    upload: vi.fn().mockResolvedValue({ data: { path: 'test/path' }, error: null }),
    remove: vi.fn().mockResolvedValue({ data: [], error: null }),
    getPublicUrl: vi.fn().mockReturnValue({
      data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/bucket/test' },
    }),
  }

  const mockStorage = {
    from: vi.fn().mockReturnValue(mockStorageBucket),
  }

  const mockFunctions = {
    invoke: vi.fn().mockResolvedValue({ data: { id: 'mock-resend-id' }, error: null }),
  }

  const mockRpc = vi.fn().mockResolvedValue({ data: [], error: null })

  const supabase = {
    from: mockFrom,
    auth: mockAuth,
    storage: mockStorage,
    functions: mockFunctions,
    rpc: mockRpc,
  }

  return {
    supabase,
    mockFrom,
    mockQueryBuilder,
    mockAuth,
    mockStorage,
    mockStorageBucket,
    mockFunctions,
    mockRpc,
  }
}

/**
 * Helper to configure mockFrom to return specific data for a specific call.
 * Usage: configureQueryResult(mockFrom, { data: [...], error: null })
 */
export function configureQueryResult(
  mockFrom: ReturnType<typeof vi.fn>,
  result: Partial<QueryResult>
) {
  const builder = createMockQueryBuilder(result)
  mockFrom.mockReturnValue(builder)
  return builder
}

/**
 * Configure mockFrom for a specific table name.
 * Usage: configureTableResult(mockFrom, 'profiles', { data: mockProfile, error: null })
 */
export function configureTableResult(
  mockFrom: ReturnType<typeof vi.fn>,
  _tableName: string,
  result: Partial<QueryResult>
) {
  const builder = createMockQueryBuilder(result)
  mockFrom.mockReturnValue(builder)
  return builder
}
