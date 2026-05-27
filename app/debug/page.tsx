export default function DebugPage() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'NOT SET'
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'NOT SET'
  return (
    <div style={{ padding: 32, fontFamily: 'monospace' }}>
      <p>URL: {url.slice(0, 40)}</p>
      <p>KEY: {key.slice(0, 20)}...</p>
    </div>
  )
}
