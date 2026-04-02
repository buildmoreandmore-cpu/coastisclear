export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-24 max-w-2xl mx-auto">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text)] mb-4 tracking-tight">
        The fastest way to clear a sample.
      </h1>
      <p className="font-mono text-sm text-[var(--text-mid)] mb-12">
        Verified contacts. Real ownership data. No middlemen.
      </p>

      <div className="space-y-8 font-mono text-sm text-[var(--text-mid)] leading-relaxed">
        <p>
          Clear the Wax maintains one of the largest databases of verified sample clearance
          contacts — master owners, publishers, administrators, and licensing
          departments — sourced directly from the labels and publishers themselves.
          Every contact is manually verified. No scraped data. No guesswork.
        </p>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            Built for the industry
          </h2>
          <p>
            Whether you&apos;re an artist clearing your first sample, management
            coordinating a release, a label handling catalog licensing, or an
            entertainment attorney drafting clearance requests — Clear the Wax
            gives you the ownership data and contacts you need in seconds,
            not weeks.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            What you get
          </h2>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">01</span>
              <span>Master and publishing rights holder identification — verified against label and publisher records</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">02</span>
              <span>Direct licensing contacts — departments, emails, and phone numbers for the people who handle clearances</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">03</span>
              <span>Professional clearance request letters — one for master, one for publishing, ready to send</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">04</span>
              <span>Pipeline tracking — a nine-step workflow that mirrors how clearance houses manage deals internally</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">05</span>
              <span>Pipeline tracking — manage your clearance workflow from first contact to contract</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            How it works
          </h2>
          <p>
            Enter the song you&apos;re sampling. We check our internal database first.
            If we have verified ownership data, you get it instantly — along with
            the licensing contact. If the song isn&apos;t in our database yet, we use
            AI inference to identify the most likely rights holders, clearly marked
            with a confidence score so you know exactly what&apos;s verified and what
            needs confirmation.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            What we don&apos;t do
          </h2>
          <p>
            We don&apos;t negotiate. We don&apos;t provide legal advice. We don&apos;t
            charge you to find publicly accessible information. We give you
            the data and the contact. You handle the deal.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            Built from real deals
          </h2>
          <p>
            Every feature in Clear the Wax comes from real clearance workflows —
            real deal threads, real timelines, real contacts. The nine-step pipeline
            tracker mirrors how professional clearance houses manage their deals.
            We built the tool we needed when we were clearing samples ourselves.
          </p>
        </div>

        <div className="pt-8 border-t border-[var(--border)] space-y-2">
          <p className="text-[var(--text-mid)] text-xs">
            <a href="mailto:clearthewaxmusic@gmail.com" className="hover:text-[var(--text)] transition-colors">
              clearthewaxmusic@gmail.com
            </a>
          </p>
          <div className="flex gap-4 flex-wrap">
            <a href="/glossary" className="text-[var(--text-dim)] text-xs hover:text-[var(--text-mid)] transition-colors">
              Glossary
            </a>
            <a href="/terms" className="text-[var(--text-dim)] text-xs hover:text-[var(--text-mid)] transition-colors">
              Terms of Service
            </a>
            <a href="/privacy" className="text-[var(--text-dim)] text-xs hover:text-[var(--text-mid)] transition-colors">
              Privacy Policy
            </a>
          </div>
          <p className="text-[var(--text-dim)] text-xs">
            clearthewax.com — sample clearance, simplified.
          </p>
        </div>
      </div>
    </div>
  );
}
