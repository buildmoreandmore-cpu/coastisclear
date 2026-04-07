"use client";

import { useState, useEffect, useRef } from "react";

const ACCESS_KEY = "clearthewax_access";
const SITE_PASSWORD = "clearthewax2026";

type GateState = "loading" | "password" | "nda" | "granted";

export default function SiteGate({ children }: { children: React.ReactNode }) {
  const [gate, setGate] = useState<GateState>("loading");
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState(false);
  const [sigName, setSigName] = useState("");
  const ndaEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ACCESS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.granted) {
          setGate("granted");
          return;
        }
      }
    } catch { /* ignore */ }
    setGate("password");
  }, []);

  const handlePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      setPwError(false);
      setGate("nda");
    } else {
      setPwError(true);
    }
  };

  const handleAgree = () => {
    const record = {
      granted: true,
      name: sigName.trim(),
      date: new Date().toISOString().split("T")[0],
      acceptedAt: new Date().toISOString(),
    };
    localStorage.setItem(ACCESS_KEY, JSON.stringify(record));
    setGate("granted");

    // Save to database (non-blocking)
    fetch("/api/admin/nda", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: sigName.trim(), acceptedAt: record.acceptedAt }),
    }).catch(() => {});
  };

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (gate === "loading") {
    return <div className="min-h-screen bg-[var(--bg)]" />;
  }

  if (gate === "granted") {
    return <>{children}</>;
  }

  if (gate === "password") {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6">
        <h1 className="font-display font-extrabold text-2xl text-[var(--text)] mb-2 tracking-tight">
          Clear the Wax
        </h1>
        <p className="font-mono text-sm text-[var(--text-mid)] mb-10">
          Enter access code to continue
        </p>
        <form onSubmit={handlePassword} className="w-full max-w-xs space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
            placeholder="Access code"
            autoFocus
            className="w-full bg-transparent border-b border-[var(--border-active)] outline-none font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] py-3 text-center"
          />
          {pwError && (
            <p className="font-mono text-xs text-[var(--danger)] text-center">
              Incorrect access code
            </p>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:opacity-80 transition-opacity"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  // NDA step
  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[var(--text)] mb-1 tracking-tight text-center">
          Confidential Access &amp; Nondisclosure Agreement
        </h1>
        <p className="font-mono text-xs text-[var(--text-dim)] mb-6 text-center">
          Please read and accept before accessing the platform.
        </p>

        {/* Scrollable NDA */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 max-h-[60vh] overflow-y-auto font-mono text-xs text-[var(--text-mid)] leading-relaxed space-y-4">
          <p className="font-display font-bold text-sm text-[var(--text)] text-center">
            ClearTheWax.com — Platform Access, Use, and Confidentiality Terms
          </p>
          <p className="text-[var(--text-dim)]">
            Effective Date: The date on which User creates an account or first accesses the ClearTheWax.com platform, whichever occurs first.
          </p>
          <p className="font-bold text-[var(--text)] text-[10px] leading-relaxed">
            BY CLICKING &quot;I AGREE,&quot; CREATING AN ACCOUNT, OR ACCESSING ANY PORTION OF CLEARTHEWAX.COM, USER AGREES TO BE LEGALLY BOUND BY THIS AGREEMENT IN ITS ENTIRETY. IF USER DOES NOT AGREE, USER SHALL NOT ACCESS OR USE THE PLATFORM.
          </p>
          <p>
            THIS CONFIDENTIAL ACCESS &amp; NONDISCLOSURE AGREEMENT (the &quot;Agreement&quot;) is entered into between ClearTheWax LLC (&quot;ClearTheWax,&quot; &quot;Company,&quot; &quot;Disclosing Party&quot;) and the individual, attorney, artist, manager, label, or entity accessing the platform (&quot;User,&quot; &quot;Receiving Party&quot;). Each is a &quot;Party&quot;; together, the &quot;Parties.&quot;
          </p>
          <p>
            ClearTheWax operates a proprietary music sample ownership identification, clearance management, and licensing intelligence platform available at clearthewax.com (the &quot;Platform&quot;). In connection with User&apos;s access to and use of the Platform, ClearTheWax will disclose certain Confidential Information to User, and User may submit certain information to the Platform. This Agreement governs the confidentiality, permitted use, and restrictions applicable to all such information.
          </p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">1. Confidential Information Defined</h2>
          <p>&quot;Confidential Information&quot; means any information disclosed by ClearTheWax to User, or submitted by User to the Platform, either directly or indirectly, in any form, including without limitation:</p>
          <ol className="list-[lower-alpha] list-inside space-y-1 pl-2">
            <li>The ClearTheWax rights holder contact directory, including names, email addresses, phone numbers, mailing addresses, and department routing information for publishers, labels, administrators, and estates;</li>
            <li>Sample ownership records, clearance histories, fee benchmarks, deal terms, negotiation outcomes, and verified contact confidence scores maintained in the ClearTheWax database;</li>
            <li>AI-generated clearance letters, confirmation documents, status reports, and pipeline data produced through or accessed via the Platform;</li>
            <li>User-submitted project data, including artist names, song titles, sample descriptions, timing data, stream projections, distributor information, and release details;</li>
            <li>ClearTheWax&apos;s proprietary technology, database architecture, algorithms, prompt structures, business logic, pricing models, and product roadmap;</li>
            <li>Any data processed by or used to train any artificial intelligence or machine learning system operated by ClearTheWax, together with any outputs, insights, or derived information generated therefrom; and</li>
            <li>All communications between the Parties regarding Platform features, beta access, partnership discussions, or broker service engagements.</li>
          </ol>
          <p>Confidential Information shall not include information that: (i) is or becomes publicly known through no fault of User; (ii) was already in User&apos;s lawful possession prior to disclosure; (iii) is received from a third party without breach of any obligation of confidentiality; or (iv) is independently developed by User without reference to ClearTheWax&apos;s Confidential Information.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">2. Permitted Use of Platform and Data</h2>
          <p>User is granted a limited, non-exclusive, non-transferable, revocable license to access and use the Platform solely for User&apos;s own legitimate music sample clearance activities. User agrees that all Confidential Information accessed through or submitted to the Platform shall be used solely for that purpose and for no other purpose without ClearTheWax&apos;s express prior written consent.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">3. Nondisclosure Obligations</h2>
          <p>User agrees not to disclose ClearTheWax&apos;s Confidential Information to any third party without ClearTheWax&apos;s prior written approval, except where required by law, in which case User shall provide ClearTheWax prompt written notice so that ClearTheWax may seek a protective order. User shall protect ClearTheWax&apos;s Confidential Information using at least the same degree of care User uses to protect its own most sensitive confidential information, but in no event less than reasonable care.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">4. Prohibited Uses — Database and Contact Data</h2>
          <p>User expressly agrees that User shall not, under any circumstances:</p>
          <ol className="list-[lower-alpha] list-inside space-y-1 pl-2">
            <li>Copy, export, scrape, download, or systematically extract any portion of the ClearTheWax rights holder contact directory or ownership database for any purpose outside of User&apos;s own active clearance activities on the Platform;</li>
            <li>Redistribute, resell, sublicense, publish, or otherwise transfer any ClearTheWax database records, contact information, or ownership data to any third party;</li>
            <li>Use ClearTheWax&apos;s Confidential Information to build, populate, supplement, or improve any competing sample clearance database, directory, platform, or service; or</li>
            <li>Share login credentials or provide access to the Platform to any individual or entity not authorized under User&apos;s subscription tier.</li>
          </ol>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">5. Non-Use for Competing Platforms</h2>
          <p>User agrees that during the term of this Agreement and for a period of three (3) years thereafter, User shall not use ClearTheWax&apos;s Confidential Information — including but not limited to its database structure, rights holder contact directory, clearance workflow system, pricing models, AI-generated letter templates, or any other proprietary content — to design, develop, train, deploy, market, or support any software platform, application, or service that is substantially similar in purpose or functionality to the ClearTheWax sample clearance identification and management platform.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">6. AI-Derived Content and Platform Outputs</h2>
          <p>All clearance letters, confirmation documents, status reports, ownership summaries, and other outputs generated by the ClearTheWax platform (&quot;Platform Outputs&quot;) are provided to User for User&apos;s personal clearance use only. User acknowledges that Platform Outputs are derived from ClearTheWax&apos;s proprietary database and AI systems and constitute Confidential Information. User shall not resell, redistribute, or commercially exploit Platform Outputs outside of their intended use in User&apos;s own clearance transactions.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">7. Attorney and Professional User Obligations</h2>
          <p>Entertainment attorneys, managers, and label representatives accessing the Platform on behalf of clients agree that: (a) client data submitted to the Platform is subject to this Agreement and shall be handled accordingly; (b) Platform Outputs are professional reference tools and shall not be used as final legal instruments without independent review by qualified legal counsel; and (c) ClearTheWax does not provide legal advice, and no Platform Output constitutes legal advice, an attorney-client relationship, or a guarantee of clearance or copyright compliance.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">8. No Legal Advice Disclaimer</h2>
          <p>ClearTheWax is a technology platform, not a law firm. Nothing on the Platform, in any Platform Output, or in any communication from ClearTheWax constitutes legal advice. Users should consult a qualified entertainment attorney before executing any clearance agreement, relying on any ownership record, or making any determination regarding fair use, copyright infringement, or sample clearance requirements.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">9. Maintenance of Security</h2>
          <p>ClearTheWax shall implement commercially reasonable technical and organizational security measures governing the Platform, including access controls, data minimization, encryption, and audit logging. ClearTheWax shall promptly notify User of any unauthorized access to or breach of User-submitted data. User shall promptly notify ClearTheWax of any unauthorized access to User&apos;s account or any suspected breach of this Agreement.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">10. Return or Deletion of Data</h2>
          <p>Upon termination of User&apos;s account or upon ClearTheWax&apos;s written request, User shall promptly delete or destroy all copies of ClearTheWax&apos;s Confidential Information in User&apos;s possession, including exported data, downloaded records, and any copies of Platform Outputs, and shall provide written certification of such deletion upon request.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">11. No Warranty</h2>
          <p className="uppercase text-[10px]">All platform data, ownership records, contact information, and platform outputs are provided &quot;as is&quot; without warranties of any kind, express or implied. ClearTheWax does not warrant that any ownership record, contact information, clearance pathway, or fee benchmark is accurate, complete, current, or legally sufficient for any particular purpose. User assumes all risk associated with reliance on platform data.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">12. No License to Intellectual Property</h2>
          <p>Nothing in this Agreement grants User any rights under any intellectual property right of ClearTheWax, nor any rights in or to ClearTheWax&apos;s Confidential Information except as expressly set forth herein.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">13. Term and Termination</h2>
          <p>This Agreement is effective upon User&apos;s first access to the Platform and shall remain in effect until terminated. ClearTheWax may terminate User&apos;s access at any time for any breach of this Agreement. Sections 1, 3, 4, 5, 6, 7, 8, 11, 14, and 15 shall survive termination indefinitely. Sections 4 and 5 shall survive for three (3) years following termination.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">14. Remedies</h2>
          <p>User acknowledges that any violation of this Agreement — particularly Sections 3, 4, and 5 — may cause irreparable injury to ClearTheWax that cannot be adequately compensated by monetary damages. ClearTheWax shall have the right to seek immediate injunctive relief, specific performance, and any other equitable remedies available.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">15. Governing Law, Venue, and Dispute Resolution</h2>
          <p>This Agreement shall be governed by the laws of the State of Georgia, without reference to conflict of laws principles. Any dispute shall be resolved in the courts of Fulton County, State of Georgia.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">16. Privacy and Data Compliance</h2>
          <p>Each Party shall comply with all applicable data protection and privacy laws. ClearTheWax&apos;s collection and use of User data is governed by the ClearTheWax Privacy Policy available at clearthewax.com/privacy.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">17. Entire Agreement and Modifications</h2>
          <p>This Agreement constitutes the entire agreement between the Parties with respect to the subject matter hereof. ClearTheWax reserves the right to modify this Agreement at any time by posting an updated version. User&apos;s continued use of the Platform constitutes acceptance.</p>

          <h2 className="font-display font-bold text-sm text-[var(--text)] pt-2">18. Miscellaneous</h2>
          <p>If any provision is found unenforceable, the remaining provisions continue in full force. This Agreement may not be assigned by User without ClearTheWax&apos;s prior written consent. Electronic acceptance is fully binding and enforceable.</p>

          <div ref={ndaEndRef} />
        </div>

        {/* Signature section */}
        <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="font-mono text-xs text-[var(--text-dim)] block mb-1">
                Type your full name
              </label>
              <input
                type="text"
                value={sigName}
                onChange={(e) => setSigName(e.target.value)}
                placeholder="e.g. Jordan Ellis"
                className="w-full bg-transparent border-b border-[var(--border-active)] outline-none font-mono text-sm text-[var(--text)] placeholder:text-[var(--text-dim)] caret-[var(--text)] py-2"
              />
            </div>
            <div className="sm:w-48">
              <label className="font-mono text-xs text-[var(--text-dim)] block mb-1">
                Date
              </label>
              <p className="font-mono text-sm text-[var(--text)] py-2 border-b border-[var(--border)]">
                {today}
              </p>
            </div>
          </div>

          <button
            onClick={handleAgree}
            disabled={sigName.trim().length < 2}
            className="w-full py-3 bg-[var(--accent)] text-[var(--bg)] font-mono text-sm rounded-lg hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed"
          >
            I Agree
          </button>

          <p className="font-mono text-[10px] text-[var(--text-dim)] text-center leading-relaxed">
            By clicking &quot;I Agree,&quot; you confirm that you have read and understand this Agreement and agree to be legally bound by its terms.
          </p>
        </div>
      </div>
    </div>
  );
}
