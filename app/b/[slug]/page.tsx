import { notFound } from "next/navigation"
import Link from "next/link"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export default async function PublicBioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("public_bio_pages")
    .select("id,title,affiliate_url,slug,created_at")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) notFound()

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-xl space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
          <div className="space-y-2">
            <div className="text-xs text-white/60">Pivot AI Money Link</div>
            <h1 className="text-3xl font-bold">{data.title}</h1>
            <p className="text-sm text-white/70">
              Tap the button below to continue. (This click is tracked.)
            </p>
          </div>

          <div className="mt-6">
            <a
              href={`/b/${data.slug}/go`}
              className="block w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-4 text-center font-bold text-lg text-white hover:opacity-95 transition"
            >
              Continue →
            </a>
          </div>

          <div className="mt-4 text-xs text-white/40 break-all">
            Destination: {data.affiliate_url}
          </div>
        </div>

        <div className="text-center text-xs text-white/40">
          Powered by <Link href="/" className="text-white/60 hover:text-white">Pivot AI</Link>
        </div>
      </div>
    </div>
  )
}


