'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const SOURCE_TYPES = [
  { value: 'book', label: '書' },
  { value: 'web', label: '網路文章' },
  { value: 'self', label: '自己的想法' },
  { value: 'other', label: '其他' },
]

export default function AddPage() {
  const [content, setContent] = useState('')
  const [sourceTitle, setSourceTitle] = useState('')
  const [sourceUrl, setSourceUrl] = useState('')
  const [sourceType, setSourceType] = useState('book')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    const { error: err } = await supabase.from('sentences').insert({
      user_id: user.id,
      content: content.trim(),
      source_title: sourceTitle.trim() || null,
      source_url: sourceUrl.trim() || null,
      source_type: sourceType,
    })

    if (err) { setError(err.message); setLoading(false); return }
    router.push('/')
    router.refresh()
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold mb-6">新增句子</h1>
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className="block text-sm text-gray-600 mb-1">句子 *</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="貼上或手打讓你停下來的那句話"
            rows={4}
            required
            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-base resize-none focus:outline-none focus:border-gray-400"
          />
        </div>

        <div className="flex gap-2">
          {SOURCE_TYPES.map(t => (
            <button key={t.value} type="button"
              onClick={() => setSourceType(t.value)}
              className={`px-3 py-1.5 rounded-full text-sm transition ${
                sourceType === t.value ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {sourceType !== 'self' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              {sourceType === 'book' ? '書名' : sourceType === 'web' ? '文章標題' : '來源'}
            </label>
            <input
              value={sourceTitle}
              onChange={e => setSourceTitle(e.target.value)}
              placeholder={sourceType === 'book' ? '例：人類大歷史' : '例：為什麼我們需要慢思考'}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        )}

        {sourceType === 'web' && (
          <div>
            <label className="block text-sm text-gray-600 mb-1">文章網址（選填）</label>
            <input
              value={sourceUrl}
              onChange={e => setSourceUrl(e.target.value)}
              placeholder="https://..."
              type="url"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-gray-400"
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" disabled={loading || !content.trim()}
          className="w-full py-3 bg-gray-900 text-white rounded-lg disabled:opacity-40 hover:bg-gray-700 transition font-medium">
          {loading ? '儲存中…' : '加入智脈'}
        </button>
      </form>
    </div>
  )
}
