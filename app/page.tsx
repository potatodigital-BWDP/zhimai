import { createClient } from '@/lib/supabase/server'
import SentenceCard from '@/components/SentenceCard'
import type { Sentence } from '@/lib/types'

export const revalidate = 60

export default async function FeedPage() {
  const supabase = await createClient()

  const { data: sentences } = await supabase
    .from('sentences')
    .select('*, profiles(id, username, display_name)')
    .order('created_at', { ascending: false })
    .limit(50)

  const ids = (sentences ?? []).map((s: Sentence) => s.id)
  const { data: responseCounts } = ids.length
    ? await supabase.from('responses').select('sentence_id, response_type').in('sentence_id', ids)
    : { data: [] }

  const countMap: Record<string, { extend: number; challenge: number; echo: number }> = {}
  for (const r of responseCounts ?? []) {
    if (!countMap[r.sentence_id]) countMap[r.sentence_id] = { extend: 0, challenge: 0, echo: 0 }
    countMap[r.sentence_id][r.response_type as 'extend' | 'challenge' | 'echo']++
  }

  return (
    <div>
      <header className="mb-8">
        <p className="text-gray-400 text-sm">知識在句子裡流動</p>
      </header>
      {(sentences ?? []).length === 0 ? (
        <p className="text-gray-400 text-center py-16">還沒有句子。成為第一個加入的人。</p>
      ) : (
        (sentences ?? []).map((s: Sentence) => (
          <SentenceCard key={s.id} sentence={s} counts={countMap[s.id]} />
        ))
      )}
    </div>
  )
}
