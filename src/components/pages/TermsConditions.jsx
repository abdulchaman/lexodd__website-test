import "./legalPages.css"

export default function TermsConditions() {
    return (
        <main className="legal-page">

            {/* HERO */}
            <header className="legal-hero">
                <div className="container legal-hero__inner">

                    <p className="legal-kicker">
                        Legal
                    </p>

                    <h1 className="legal-title">
                        Terms and Conditions
                    </h1>

                    <p className="legal-meta">
                        Effective Date: April 9, 2026 | Last Updated: April 9, 2026 | Version 1.0
                    </p>

                </div>
            </header>

            {/* CONTENT */}
            <article className="legal-content container">

                <div className="legal-highlight">
                    <p>
                        These Terms and Conditions govern your use of the Lexodd website and your
                        engagement of Lexodd's services. By accessing our website or engaging our
                        services, you agree to be bound by these terms. Please read them carefully.
                    </p>
                </div>

                <section className="legal-section">
                    <h2>1. Definitions</h2>
                    <ul>
                        <li>"Lexodd", "we", "us", or "our" means Lexodd Hypernova Private Limited, a company incorporated in India with CIN U62099AP2023PTC110819.</li>
                        <li>"Client" or "you" means any individual or entity that accesses our website, contacts us, or engages our services.</li>
                        <li>"Services" means operational infrastructure design, development, and delivery services provided by Lexodd.</li>
                        <li>"Agreement" means any signed engagement letter, statement of work, or service contract between Lexodd and a Client.</li>
                        <li>"Deliverables" means any software, systems, platforms, documentation, or other outputs produced by Lexodd under an Agreement.</li>
                        <li>"Intellectual Property" means all patents, copyrights, trademarks, trade secrets, source code, designs, and any other proprietary rights.</li>
                        <li>"Confidential Information" means any non-public information disclosed by one party to the other in connection with a potential or actual engagement.</li>
                        <li>"Website" means www.lexodd.com and any associated subdomains.</li>
                    </ul>
                </section>

                <section className="legal-section">
                    <h2>2. Company Information</h2>
                    <div className="legal-box">
                        <p><strong>Lexodd Hypernova Private Limited</strong></p>
                        <p><strong>Registered Address:</strong> C/O Jyothi Koppu, Old CBI Down, Andhra University, Visakhapatnam, Andhra Pradesh 530003, India</p>
                        <p><strong>Operations Address:</strong> Office No. 202, 203, Saptagiri Towers, Mayur Marg, Begumpet, Hyderabad, Telangana 500016, India</p>
                        <p><strong>CIN:</strong> U62099AP2023PTC110819</p>
                        <p><strong>Email:</strong> info@lexodd.com</p>
                        <p><strong>Phone:</strong> +91 9100113290</p>
                    </div>
                </section>

                <section className="legal-section">
                    <h2>3. Use of the Website</h2>
                    <p>You may use our website for lawful purposes only. You must not attempt to gain unauthorized access to any part of our website or systems, transmit harmful material, or interfere with website performance.</p>
                </section>

                <section className="legal-section">
                    <h2>4. Services and Engagements</h2>
                    <p>Lexodd provides custom operational infrastructure services. The specific scope, deliverables, timelines, and commercial terms are defined in a separate written Agreement for each engagement.</p>
                </section>

                <section className="legal-section">
                    <h2>5. Fees, Payment, and Invoicing</h2>
                    <p>Fees and payment terms are set out in the applicable Agreement. Lexodd may suspend work if payments are overdue.</p>
                </section>

                <section className="legal-section">
                    <h2>6. Intellectual Property</h2>
                    <p>Ownership and licensing of Deliverables and any pre-existing Lexodd IP are governed by the applicable Agreement.</p>
                </section>

                <section className="legal-section">
                    <h2>7. Confidentiality</h2>
                    <p>Where a separate NDA is executed, the terms of that NDA apply. Otherwise, both parties agree to protect Confidential Information shared in connection with engagements.</p>
                </section>

                <section className="legal-section">
                    <h2>8. Warranties and Representations</h2>
                    <p>Any warranty period, remedies, and disclaimers are governed by the applicable Agreement and the maximum extent permitted by law.</p>
                </section>

                <section className="legal-section">
                    <h2>9. Limitation of Liability</h2>
                    <p>Lexodd’s liability is limited to the fullest extent permitted by law and as set out in the applicable Agreement.</p>
                </section>

                <section className="legal-section">
                    <h2>10. Termination</h2>
                    <p>Termination rights and effects are governed by the applicable Agreement.</p>
                </section>

                <section className="legal-section">
                    <h2>11. Dispute Resolution</h2>
                    <p>Disputes shall be resolved as set out in the applicable Agreement or, where not specified, under the laws of India.</p>
                </section>

                <section className="legal-section">
                    <h2>12. Governing Law</h2>
                    <p>These Terms are governed by and construed in accordance with the laws of India.</p>
                </section>

                <section className="legal-section">
                    <h2>13. General Provisions</h2>
                    <p>If any provision is unenforceable, the remaining provisions remain in effect.</p>
                </section>

                <section className="legal-section">
                    <h2>14. Contact</h2>
                    <div className="legal-box">
                        <p><strong>Lexodd Hypernova Private Limited</strong></p>
                        <p>Registered: C/O Jyothi Koppu, Old CBI Down, Andhra University, Visakhapatnam, Andhra Pradesh 530003, India</p>
                        <p>Operations: Office No. 202, 203, Saptagiri Towers, Mayur Marg, Begumpet, Hyderabad, Telangana 500016, India</p>
                        <p>Email: info@lexodd.com</p>
                        <p>Phone: +91 9100113290</p>
                    </div>
                </section>

                <footer className="legal-footer-note">
                    <p>
                        These Terms and Conditions were last reviewed and updated on April 9, 2026. Lexodd recommends that clients consult independent legal counsel before entering into significant engagements.
                    </p>
                </footer>

            </article>

        </main>
    )
}