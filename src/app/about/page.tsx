export default function AboutPage() {
  return (
    <div className="min-h-screen px-6 py-24 max-w-2xl mx-auto">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text)] mb-12 tracking-tight">
        About Clear the Wax
      </h1>

      <div className="space-y-8 font-mono text-sm text-[var(--text-mid)] leading-relaxed">
        <p>
          Clear the Wax is a sample clearance tool built for music producers, artists,
          and entertainment attorneys. We help you identify who owns the music,
          get the right contact, and draft the clearance letter — all in one flow.
        </p>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            The problem
          </h2>
          <p>
            Sample clearance is one of the most opaque processes in the music industry.
            Finding out who controls the master recording and publishing rights to a song
            can take weeks of emails, phone calls, and dead ends. Most artists either
            skip clearance entirely — risking lawsuits — or pay thousands to
            intermediaries who charge for information that should be accessible.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            How we work
          </h2>
          <p>
            Our database is built manually. We contact publishers, labels, and rights
            administrators directly to verify ownership data and licensing contacts.
            No scraped data. No guesswork. When our internal database doesn&apos;t have
            a match, we use AI inference to point you in the right direction — clearly
            marked with a confidence score so you know what&apos;s verified and what&apos;s not.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            What we do
          </h2>
          <ul className="space-y-2">
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">01</span>
              <span>Identify master and publishing rights holders</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">02</span>
              <span>Surface verified licensing contacts with departments and emails</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">03</span>
              <span>Generate professional clearance request letters — one for each side</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">04</span>
              <span>Track your clearance pipeline with a nine-step workflow per side</span>
            </li>
            <li className="flex gap-3">
              <span className="text-[var(--text-dim)] shrink-0">05</span>
              <span>Flag alternative paths — interpolation, flat buyout, related entities</span>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            What we don&apos;t do
          </h2>
          <p>
            We don&apos;t negotiate on your behalf. We don&apos;t provide legal advice.
            We find who owns it and how to reach them. You handle the deal.
          </p>
        </div>

        <div>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-3">
            Built from real deals
          </h2>
          <p>
            Clear the Wax is informed by actual clearance deal threads — real quotes,
            real timelines, real contact workflows. The nine-step pipeline tracker
            mirrors how professional clearance houses track their deals internally.
            We built the tool we wished existed when we were clearing samples ourselves.
          </p>
        </div>

        <div className="pt-8 border-t border-[var(--border)] space-y-2">
          <p className="text-[var(--text-mid)] text-xs">
            <a href="mailto:clearthewaxmusic@gmail.com" className="hover:text-[var(--text)] transition-colors">
              clearthewaxmusic@gmail.com
            </a>
          </p>
          <p className="text-[var(--text-dim)] text-xs">
            clearthewax.com — sample clearance, simplified.
          </p>
        </div>
      </div>
    </div>
  );
}
