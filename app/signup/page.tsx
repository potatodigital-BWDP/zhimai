'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const username = email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '')
    const { error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, display_name: displayName || username },
      },
    })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/signup/confirm')
  }

  return (
    <div className="max-w-sm mx-auto pt-8">
      <h1 className="text-xl font-semibold mb-2">加入智脈</h1>
      <p className="text-sm text-gray-400 mb-6">開始收藏讓你停下來的句子</p>
      <form onSubmit={submit} className="space-y-4">
        <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
          placeholder="你的名字（顯示用）"
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
        <input type="email" value={email} onChange={e => setEmail(e.target.value)}
          placeholder="電子郵件" required
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}
          placeholder="密碼（至少 6 碼）" required minLength={6}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-400" />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-gray-900 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition font-medium">
          {loading ? '建立中…' : '建立帳號'}
        </button>
      </form>
      <p className="text-sm text-gray-400 text-center mt-4">
        已經有帳號？<Link href="/login" className="underline hover:text-gray-700">登入</Link>
      </p>
    </div>
  )
}
