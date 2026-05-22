
import { useEffect, useState } from "react";
import WhatWeDo from "../common/WhatWeDo";
import { Link } from "react-router";
import api from "../../services/api";
import MetaTags from "../common/MetaTags";
import "./home.css";


export default function Home() {
    const [seo, setSeo] = useState(null);

    useEffect(() => {
        api.get('/pages/home/seo')
            .then((response) => setSeo(response.data.data || response.data))
            .catch((error) => console.error('Error fetching home SEO:', error));
    }, []);

    return (
        <>
            <MetaTags
                title={seo?.metaTitle || 'Operational Systems Engineering'}
                description={seo?.metaDescription || 'We design systems that make complex operations visible, accountable, and scalable.'}
                keywords={seo?.metaKeywords}
                ogTitle={seo?.ogTitle}
                ogDescription={seo?.ogDescription}
                ogImage={seo?.ogImage?.url}
                canonicalUrl={seo?.canonicalUrl}
                robots={seo?.robots}
            />
            <section
                className="hero-hm"
                aria-label="Hero section"
            >
                <div className="container hm_hero-grid">
                    <div className="hero-content">
                        <div className="label">
                            <strong>
                                Operational Infrastructure
                            </strong>
                        </div>
                        <h1 className='title'>
                            Your operations<br />
                            outpaced your<br />
                            <span>
                                coordination.
                            </span>
                        </h1>
                        <p className="description">
                            We design the systems that make complex operations visible, accountable, and scalable — before leadership finds out the hard way.
                        </p>

                        <div
                            className="hero-cta"
                            aria-label="Primary actions"
                        >
                            <Link
                                className='grad-cta cta'
                                to="/how-we-work"
                                aria-label="See how we work"
                            >
                                <span className='cta-text'>
                                    See how we work →
                                </span>
                            </Link>
                            <Link
                                className='cta3 cta'
                                to="/case-studies"
                                aria-label="View case studies"
                            >
                                View case studies →
                            </Link>
                        </div>
                    </div>
                    <div class="hero-proof">
                        <div class="proof-item">
                            <div class="proof-label">Recently delivered in</div>
                            <div class="proof-text">Fuel logistics &amp; distribution</div>
                        </div>
                        <div class="proof-divider"></div>
                        <div class="proof-item">
                            <div class="proof-label">Multi-location</div>
                            <div class="proof-text">Healthcare coordination</div>
                        </div>
                        <div class="proof-divider"></div>
                        <div class="proof-item">
                            <div class="proof-label">Enterprise</div>
                            <div class="proof-text">Franchise management platforms.</div>
                        </div>
                    </div>
                </div>
            </section>
            <section
                className="reality section dark"
                aria-labelledby="reality-heading"
            >

                <div className="container">

                    <div className='reality_con'>

                        <div className='reality-content'>

                            <div className="label">
                                <strong>
                                    THE REALITY
                                </strong>
                            </div>

                            <div className='reality-title'>

                                <h2
                                    id="reality-heading"
                                    className=''
                                >
                                    Most failures are invisible until they're expensive.
                                </h2>

                            </div>

                            <p>
                                The root cause isn't execution — it's structure.
                                When visibility is fragmented and accountability is informal, small problems
                                compound silently across teams and locations. By the time leadership is alerted,
                                the organization has already adapted around the failure.
                            </p>

                        </div>
                        <div
                            className="reality-cards"
                            role="list"
                        >

                            <article
                                className='reality-card-inner'
                                role="listitem"
                                aria-labelledby="structure-title"
                            >
                                <div className='rea_crd-desc'>

                                    <div className='reality_counter'>
                                        01
                                    </div>

                                    <div className='rea_crd-ttl'>

                                        <h3 id="structure-title">
                                            Structure is the real problem
                                        </h3>

                                    </div>

                                    <div className='rea_crd-para'>

                                        <p>
                                            Recurring issues aren't operational carelessness. They're a predictable output of systems that weren't designed to surface them.
                                        </p>

                                    </div>

                                </div>

                            </article>

                            <article
                                className='reality-card-inner'
                                role="listitem"
                                aria-labelledby="visibility-title"
                            >
                                <div className='rea_crd-desc'>
                                    <div className='reality_counter'>
                                        02
                                    </div>
                                    <div className='rea_crd-ttl'>
                                        <h3 id="visibility-title">
                                            Visibility precedes everything
                                        </h3>
                                    </div>
                                    <div className='rea_crd-para'>
                                        <p>
                                            You cannot optimize what you cannot see consistently. Real-time, cross-system visibility is the precondition — not the outcome — of good decisions.
                                        </p>
                                    </div>
                                </div>
                            </article>
                            <article
                                className='reality-card-inner'
                                role="listitem"
                                aria-labelledby="control-title"
                            >
                                <div className='rea_crd-desc'>
                                    <div className='reality_counter'>
                                        03
                                    </div>
                                    <div className='rea_crd-ttl'>
                                        <h3 id="control-title">
                                            Governance must be designed
                                        </h3>
                                    </div>
                                    <div className='rea_crd-para'>
                                        <p>
                                            Control doesn't emerge from intent. It has to be built into the structure: defined thresholds, clear ownership, and enforced accountability at scale.
                                        </p>
                                    </div>
                                </div>
                            </article>
                        </div>

                    </div>

                </div>

            </section>
            <WhatWeDo
                label="WHAT WE DO"
                title="We don't sell tools, we design operational structure"
                description="The system is the product. We work with leadership teams to map where coordination breaks down, then build the infrastructure to hold it together — at any scale."
                items={[
                    {
                        number: "01",
                        title: "Diagnose the structure",
                        description:
                            "We identify where visibility fails, where accountability becomes informal, and where execution diverges from intent — before designing anything.",
                    },
                    {
                        number: "02",
                        title: "Design for accountability",
                        description:
                            "We build systems with governance embedded — not added later. Decision paths, escalation logic, and cross-team coordination are explicit by design.",
                    },
                    {
                        number: "03",
                        title: "Scale without surprise",
                        description:
                            "When the system is structured correctly, growth is predictable. New teams, locations, and workflows plug into an existing coordination layer — not chaos.",
                    },

                ]}
            />

            <section
                className="section dark hm__closing mb-80"
                aria-labelledby="closing-title"
            >
                <div className="container cl_section">
                    <div className="cl_st">
                        <h2 id="closing-title">
                            "Operations scale faster than coordination. Most system failures develop quietly, long before leadership is alerted.
                            <span>Lexodd exists to close that gap.</span>"
                        </h2>
                        <div class="proof-clients">
                            Delivered across <strong>fuel logistics</strong> · <strong>multi-location healthcare</strong> · <strong>Franchise management platforms.</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section class="cta-section section">
                <div className="container">
                    <h2 class="cta-headline">If your operations have outgrown your coordination, let's talk.</h2>
                    <p class="cta-sub">
                        We work with a small number of organizations at a time. Tell us where the friction is — we'll tell you if we can help.
                    </p>
                    <div class="cta-actions">
                        <Link
                            className='grad-cta cta'
                            to="/contact"
                            aria-label="See how we work"
                        >
                            <span className='cta-text'>
                                Schedule a conversation
                            </span>
                        </Link>

                        <Link
                            className='cta3 cta'
                            to="/case-studies"
                            aria-label="View case studies"
                        >
                            View case studies →
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}
