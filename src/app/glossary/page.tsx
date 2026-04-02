export default function GlossaryPage() {
  return (
    <div className="min-h-screen px-6 py-24 max-w-2xl mx-auto">
      <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--text)] mb-2 tracking-tight">
        Glossary
      </h1>
      <p className="font-mono text-sm text-[var(--text-mid)] mb-12">
        Key terms in sample clearance.
      </p>

      <div className="space-y-12 font-mono text-sm text-[var(--text-mid)] leading-relaxed">
        {/* Clearance & Rights */}
        <section>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-6">
            Clearance &amp; Rights
          </h2>
          <dl className="space-y-5">
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Sample Clearance</dt>
              <dd>The process of getting permission to use part of an existing recording or composition in a new track. Requires separate approval from each rights holder involved.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Master Recording</dt>
              <dd>The actual recorded audio of a song — the specific performance captured in the studio. Owned by whoever paid for the recording, usually a record label or the artist themselves if independently released.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Sound Recording Copyright</dt>
              <dd>The copyright protecting a specific recorded performance. This is separate from the composition copyright. When you hear a song on streaming, the sound recording copyright covers that exact recording. Usually owned by the record label.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Composition Copyright</dt>
              <dd>The copyright protecting the underlying song — the melody, lyrics, and musical arrangement. This exists independently of any recording. A song can have one composition copyright but many different recorded versions. Owned by the songwriter or their publisher.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Master Use License</dt>
              <dd>The license required to use a portion of an existing master recording in a new track. You obtain this from the owner of the sound recording — typically the record label, or the artist if the master is independently owned.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Mechanical License</dt>
              <dd>A license to reproduce and distribute a musical composition. Required when pressing physical copies (vinyl, CD) or distributing digitally. Covers the right to make copies of the composition, not the recording.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Synchronization License (Sync License)</dt>
              <dd>A license to pair music with visual media — film, television, advertisements, video games, or online video. Requires approval from both the master owner and the publisher.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Sampling</dt>
              <dd>Taking a portion of an existing master recording — the actual audio — and incorporating it directly into a new track. Requires clearing both the master recording and the composition, since you are using both.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Interpolation</dt>
              <dd>Re-performing or re-recording a melody, hook, or phrase from an existing composition instead of using the original recording. Because you are creating a new recording, only the composition (publishing) rights need to be cleared — not the master.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Replay</dt>
              <dd>Same as interpolation. Re-recording the original performance yourself rather than lifting audio from the original master. The terms are used interchangeably in the industry.</dd>
            </div>
          </dl>
        </section>

        {/* People & Entities */}
        <section>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-6">
            People &amp; Entities
          </h2>
          <dl className="space-y-5">
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Rights Holder</dt>
              <dd>The person or entity that owns the copyright to a master recording or composition. This is who you need permission from to clear a sample.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Publisher</dt>
              <dd>A company that manages and licenses the composition copyright on behalf of the songwriter. Publishers handle licensing requests, collect royalties, and administer the business side of songwriting.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Administrator</dt>
              <dd>A company that handles licensing and royalty collection for a publisher or songwriter without owning the copyright. The administrator manages the business but the ownership stays with the original rights holder.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">PRO (Performing Rights Organization)</dt>
              <dd>Organizations like ASCAP, BMI, and SESAC that collect performance royalties on behalf of songwriters and publishers. PROs track when songs are performed publicly (radio, streaming, live venues) and distribute payments accordingly.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Songwriter / Writer</dt>
              <dd>The person who wrote the melody, lyrics, or musical arrangement of a composition. A single song can have multiple writers. Each writer may have a different publisher representing their share.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Estate</dt>
              <dd>When a songwriter or rights holder is deceased, their estate manages their copyrights. Clearance requests go through the estate, which may involve additional legal representatives and longer timelines.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Record Label</dt>
              <dd>A company that funds, produces, and distributes recorded music. Labels typically own the master recording copyright as part of the recording agreement with the artist.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Distributor</dt>
              <dd>A company that delivers music to streaming platforms, stores, and retailers. Distributors handle logistics — getting the music where listeners can access it — but typically do not own the master or publishing rights.</dd>
            </div>
          </dl>
        </section>

        {/* Deal Terms */}
        <section>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-6">
            Deal Terms
          </h2>
          <dl className="space-y-5">
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Flat Fee / Buyout</dt>
              <dd>A one-time payment for sample clearance with no ongoing royalty obligation. Once the fee is paid, no further payments are owed regardless of how well the new track performs.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Royalty Split</dt>
              <dd>An ongoing percentage of revenue paid to the original rights holder for the use of their work. The percentage is negotiated as part of the clearance agreement and applies to future earnings from the new track.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Advance</dt>
              <dd>An upfront payment made against future royalties. The advance is recouped from the royalty split — meaning royalty payments don&apos;t begin until the advance amount has been earned back.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Quote</dt>
              <dd>The price or terms a rights holder provides in response to a clearance request. A quote typically includes the fee structure (flat fee, royalty split, or both), territory, and term (duration of the license).</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Territory</dt>
              <dd>The geographic region where the clearance license applies. A worldwide license covers all territories. Some clearances are limited to specific countries or regions.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Term</dt>
              <dd>The duration of a clearance license. Some licenses are granted in perpetuity (forever), while others have a fixed term (e.g., 5 years) after which the license must be renewed.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Cease and Desist</dt>
              <dd>A formal written notice demanding that you stop using copyrighted material without permission. Receiving one does not mean you have been sued — it is a warning that legal action may follow if the issue is not resolved.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Statutory Damages</dt>
              <dd>Damages set by law that a court can award for copyright infringement, separate from actual financial losses. Under U.S. copyright law, these can range from $750 to $30,000 per work infringed, and up to $150,000 per work for willful infringement.</dd>
            </div>
          </dl>
        </section>

        {/* Industry Terms */}
        <section>
          <h2 className="font-display font-bold text-lg text-[var(--text)] mb-6">
            Industry Terms
          </h2>
          <dl className="space-y-5">
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">ISRC (International Standard Recording Code)</dt>
              <dd>A unique 12-character identifier assigned to each individual recording. Used by streaming platforms, distributors, and rights organizations to track plays and royalties across systems.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">ISWC (International Standard Musical Work Code)</dt>
              <dd>A unique identifier for a musical composition (the work itself, not a specific recording). Used by PROs and publishers to track compositions across different recordings and territories.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Production Library / Library Music</dt>
              <dd>Pre-made music tracks available for licensing, often with simpler clearance processes and standardized terms. Production libraries are commonly used in film, TV, and advertising.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">No-Sample Policy</dt>
              <dd>A blanket policy held by some rights holders that refuses all sample clearance requests regardless of the terms offered. When a rights holder has a no-sample policy, the only option is interpolation (re-recording the part yourself) or not using the sample.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Split Sheet</dt>
              <dd>A written agreement between songwriters that documents each person&apos;s percentage ownership of a composition. Split sheets should be signed before a song is released to avoid disputes later.</dd>
            </div>
            <div>
              <dt className="font-display font-bold text-sm text-[var(--text)]">Recoupment</dt>
              <dd>The process by which an advance is earned back from royalties. Until the advance is fully recouped, the rights holder receives royalties but the artist or licensee does not receive additional payments beyond the advance.</dd>
            </div>
          </dl>
        </section>

        {/* Footer */}
        <div className="pt-8 border-t border-[var(--border)]">
          <p className="text-[var(--text-dim)] text-xs">
            These definitions are provided for educational purposes only and do not constitute legal advice. Consult an entertainment attorney for guidance on your specific situation.
          </p>
        </div>
      </div>
    </div>
  );
}
