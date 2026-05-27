import Link from 'next/link'

export default function SignupConfirmPage() {
  return (
    <div className="max-w-sm mx-auto pt-16 text-center">
      <h1 className="text-xl font-semibold mb-3">確認你的信箱</h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-6">
        我們已寄出一封確認信。<br />
        點擊信中的連結後即可登入。
      </p>
      <Link href="/login" className="text-sm underline text-gray-400 hover:text-gray-700">
        前往登入
      </Link>
    </div>
  )
}
