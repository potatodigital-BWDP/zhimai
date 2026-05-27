'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { User } from '@supabase/supabase-js'
import Link from 'next/link'

type Props = { sentenceId: string; user: User | null }

const TYPES = [
  { value: 'echo', label: '共鳴', desc: '這句話也擊中了我' },
  { value: 'extend', label: '延伸', desc: '從這裡繼續想下去' },
  { value: 'challenge', label: '反駁', desc: '我有不同的看法' },
]

export default function ResponseSection({ sentenceId, user }: Props) {
  const [type, setType] = useState<'echo' | 'extend' | 'challenge'>('echo')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  if (!user) {
    return (
      <p className="text-sm text-gray-400 text-center py-4">
        <Link href="/login" className="underline hover:text-gray-700">登入</Link> 後可以回應這句話
      </p>
    )
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    await supabase.from('responses').insert({
      sentence_id: sentenceId,
      user_id: user.id,
      content: content.trim(),
      response_type: type,
    })
    setContent('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-4">
      <div className="flex gap-2 mb-3">
        {TYPES.map(t => (
          <button key={t.value} type="button"
            onClick={() => setType(t.value as typeof type)}
            className={`px-3 py-1.5 rounded-full text-sm transition ${
              type === t.value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
            title={t.desc}>
            {t.label}
          </button>
        ))}
      </div>
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder={TYPES.find(t => t.value === type)?.desc}
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-gray-400"
      />
      <button type="submit" disabled={loading || !content.trim()}
        className="mt-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-full disabled:opacity-40 hover:bg-gray-700 transition">
        {loading ? '送出中…' : '送出'}
      </button>
    </form>
  )
}
