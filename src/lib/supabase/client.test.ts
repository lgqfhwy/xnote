describe('Supabase Client', () => {
  beforeAll(() => {
    // Set environment variables before importing
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
  })

  afterAll(() => {
    // Clean up environment variables
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  })

  it('initializes the Supabase client', async () => {
    const { supabase } = await import('./client')
    expect(supabase).toBeDefined()
    expect(supabase).not.toBeNull()
  })

  it('has the expected auth method', async () => {
    const { supabase } = await import('./client')
    expect(supabase.auth).toBeDefined()
    expect(typeof supabase.auth).toBe('object')
  })

  it('has the expected from method', async () => {
    const { supabase } = await import('./client')
    expect(supabase.from).toBeDefined()
    expect(typeof supabase.from).toBe('function')
  })
})
