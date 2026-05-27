import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SentenceCard from '@/components/SentenceCard'
import type { Sentence } from '@/lib/types'

type Props = { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params
  return {
    title: `${username} 的知識存摺 — 智脈`,
    description: `${username} 在智脈收藏的句子`,
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const { data: sentences } = await supabase
    .from('sentences')
    .select('*, profiles(id, username, display_name)')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <header className="mb-8">
        <h1 className="text-xl font-semibold">{profile.display_name || profile.username}</h1>
        {profile.bio && <p className="text-gray-500 text-sm mt-1">{profile.bio}</p>}
        <p className="text-gray-400 text-sm mt-2">{(sentences ?? []).length} 個句子</p>
      </header>

      {(sentences ?? []).length === 0 ? (
        <p className="text-gray-400 text-center py-16">還沒有句子。</p>
      ) : (
        (sentences ?? []).map((s: Sentence) => (
          <SentenceCard key={s.id} sentence={s} />
        ))
      )}
    </div>
  )
}
