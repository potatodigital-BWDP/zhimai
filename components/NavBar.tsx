'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="border-b border-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg tracking-tight">智脈</Link>
        <div className="flex items-center gap-4 text-sm">
          {user ? (
            <>
              <Link href="/add" className="bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition">
                + 新增句子
              </Link>
              <button onClick={signOut} className="text-gray-500 hover:text-gray-900">登出</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-600 hover:text-gray-900">登入</Link>
              <Link href="/signup" className="bg-gray-900 text-white px-4 py-1.5 rounded-full hover:bg-gray-700 transition">
                加入
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
