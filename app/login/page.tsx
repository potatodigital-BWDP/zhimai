'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email, password })
    if (err) { setError('帳號或密碼錯誤'); setLoading(false); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-sm mx-auto pt-8">
      <h1 className="text-xl font-semibold mb-6">登入</h1>
      <form onSubmit={submit} className="space-y-4">
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="電子郵件" required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="密碼" required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition font-medium">
          {loading ? '登入中…' : '登入'}
        </button>
      </form>
      <p className="text-sm text-gray-400 text-center mt-4">
        還沒有帳號？<Link href="/signup" className="underline hover:text-gray-700">加入智脈</Link>
      </p>
    </div>
  )
}
