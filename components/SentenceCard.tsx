import Link from 'next/link'
import type { Sentence } from '@/lib/types'

const RESPONSE_TYPE_LABELS = { extend: '延伸', challenge: '反駁', echo: '共鳴' }

type Props = { sentence: Sentence; counts?: { extend: number; challenge: number; echo: number } }

export default function SentenceCard({ sentence, counts }: Props) {
  return (
    <article className="py-6 border-b border-gray-100 group">
      <Link href={`/s/${sentence.id}`}>
        <blockquote className="text-xl leading-relaxed font-medium text-gray-900 mb-3 hover:text-gray-600 transition cursor-pointer">
          {sentence.content}
        </blockquote>
      </Link>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center gap-2">
          {sentence.source_title && (
            sentence.source_url ? (
              <a href={sentence.source_url} target="_blank" rel="noopener noreferrer"
                className="hover:text-gray-700 transition">
                {sentence.source_title}
              </a>
            ) : (
              <span>{sentence.source_title}</span>
            )
          )}
          {sentence.source_title && sentence.profiles && <span>·</span>}
          {sentence.profiles && (
            <Link href={`/u/${sentence.profiles.username}`}
              className="hover:text-gray-700 transition">
              {sentence.profiles.display_name || sentence.profiles.username}
            </Link>
          )}
        </div>

        {counts && (
          <div className="flex items-center gap-3">
            {(['extend', 'challenge', 'echo'] as const).map(type => (
              counts[type] > 0 && (
                <span key={type} className="flex items-center gap-1">
                  <span>{counts[type]}</span>
                  <span>{RESPONSE_TYPE_LABELS[type]}</span>
                </span>
              )
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
