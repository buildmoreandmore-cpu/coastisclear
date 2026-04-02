export default function TermsPage() {
  return (
    <div className="min-h-screen px-6 py-24 max-w-2xl mx-auto">
      <h1 className="font-display font-extrabold text-3xl text-[var(--text)] mb-8 tracking-tight">
        Terms of Service
      </h1>
      <div className="space-y-6 font-mono text-sm text-[var(--text-mid)] leading-relaxed">
        <p><strong className="text-[var(--text)]">Effective Date:</strong> April 2, 2026</p>

        <p>
          By accessing or using Clear the Wax (&quot;clearthewax.com&quot;), you agree
          to be bound by these Terms of Service. If you do not agree, do not use
          the service.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">1. Service Description</h2>
        <p>
          Clear the Wax provides music sample clearance research tools, including
          rights holder identification, contact information lookup, clearance letter
          generation, and pipeline tracking. We are an information service, not a
          law firm, clearance house, or licensing agent.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">2. No Legal Advice</h2>
        <p>
          Nothing on this site constitutes legal advice. The information provided is
          for research purposes only. You should consult a qualified entertainment
          attorney before entering into any licensing agreement. Clear the Wax is
          not responsible for the outcome of any clearance negotiation.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">3. Accuracy of Information</h2>
        <p>
          We make reasonable efforts to verify ownership and contact information.
          However, music rights change hands frequently. We do not guarantee the
          accuracy, completeness, or currency of any data provided. AI-inferred
          results are clearly marked and should be independently verified.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">4. User Accounts</h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials. You agree not to share your account or use the service for
          any unlawful purpose.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">5. Acceptable Use</h2>
        <p>
          You agree not to: (a) use the service to harass or spam rights holders;
          (b) scrape, crawl, or bulk-download data from the service; (c) attempt
          to access admin features without authorization; (d) misrepresent your
          identity or affiliation when contacting rights holders.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">6. Intellectual Property</h2>
        <p>
          The Clear the Wax name, logo, and website design are proprietary.
          Song ownership data is sourced from public records, direct verification,
          and AI inference. We do not claim ownership of any third-party music
          rights information.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">7. Limitation of Liability</h2>
        <p>
          Clear the Wax is provided &quot;as is&quot; without warranties of any kind.
          We are not liable for any damages arising from your use of the service,
          including but not limited to reliance on ownership data, failed clearance
          attempts, or missed licensing deadlines.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">8. Changes to Terms</h2>
        <p>
          We may update these terms at any time. Continued use of the service after
          changes constitutes acceptance of the updated terms.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">9. Contact</h2>
        <p>
          For questions about these terms, contact us at{" "}
          <a href="mailto:clearthewaxmusic@gmail.com" className="text-[var(--text)] hover:opacity-70 transition-opacity">
            clearthewaxmusic@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
}
