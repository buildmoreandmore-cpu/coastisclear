export default function PrivacyPage() {
  return (
    <div className="min-h-screen px-6 py-24 max-w-2xl mx-auto">
      <h1 className="font-display font-extrabold text-3xl text-[var(--text)] mb-8 tracking-tight">
        Privacy Policy
      </h1>
      <div className="space-y-6 font-mono text-sm text-[var(--text-mid)] leading-relaxed">
        <p><strong className="text-[var(--text)]">Effective Date:</strong> April 2, 2026</p>

        <p>
          Clear the Wax (&quot;we,&quot; &quot;us,&quot; &quot;our&quot;) respects your privacy. This
          policy explains what data we collect, how we use it, and your rights.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">1. Information We Collect</h2>
        <p><strong className="text-[var(--text)]">Account Information:</strong> When you sign up, we collect your email address and password, stored securely using industry-standard authentication.</p>
        <p><strong className="text-[var(--text)]">Search Data:</strong> We log the song titles and artist names you search for to improve our database. This data is not shared with third parties.</p>
        <p><strong className="text-[var(--text)]">Pipeline Data:</strong> Clearance pipeline items you create are stored in your account.</p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">2. How We Use Your Data</h2>
        <ul className="list-disc list-inside space-y-1">
          <li>To provide the sample clearance research service</li>
          <li>To improve our database coverage based on search patterns</li>
          <li>To send transactional emails (account confirmation, password reset)</li>
          <li>To maintain and improve the service</li>
        </ul>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">3. Data Sharing</h2>
        <p>
          We do not sell, rent, or share your personal information with third
          parties for marketing purposes. We may share limited data with
          trusted service providers (hosting, authentication, email delivery)
          solely to operate the service. These providers are contractually
          bound to protect your data.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">4. Data Security</h2>
        <p>
          We use industry-standard security measures including encrypted
          connections (HTTPS), secure authentication, and access controls.
          However, no method of transmission over the internet is 100% secure.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">5. Data Retention</h2>
        <p>
          We retain your account data for as long as your account is active.
          Search logs are retained to improve our database. You may request
          deletion of your account and associated data at any time by contacting
          us.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">6. Your Rights</h2>
        <p>You have the right to:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and data</li>
          <li>Withdraw consent for data processing</li>
        </ul>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">7. Cookies</h2>
        <p>
          We use essential cookies for authentication and session management.
          We do not use tracking cookies or third-party analytics.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">8. Changes to This Policy</h2>
        <p>
          We may update this privacy policy from time to time. We will notify
          registered users of significant changes via email.
        </p>

        <h2 className="font-display font-bold text-lg text-[var(--text)] mt-8">9. Contact</h2>
        <p>
          For privacy inquiries, contact us at{" "}
          <a href="mailto:clearthewaxmusic@gmail.com" className="text-[var(--text)] hover:opacity-70 transition-opacity">
            clearthewaxmusic@gmail.com
          </a>.
        </p>
      </div>
    </div>
  );
}
