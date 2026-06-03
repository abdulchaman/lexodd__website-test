import './how-we-work.css'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router';
import api, { getHowWeWorkPage } from '../../services/api';
import MetaTags from '../common/MetaTags';
import { getImageAlt, getImageUrl } from '../../utils/imageHelper';
import OptimizedImage from '../common/OptimizedImage';

const HowWeWork = () => {
    const [seo, setSeo] = useState(null);
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/pages/how-we-work/seo')
            .then((response) => setSeo(response.data.data || response.data))
            .catch((error) => console.error('Error fetching how we work SEO:', error));

        getHowWeWorkPage()
            .then((response) => setPageData(response.data.data || response.data))
            .catch((error) => console.error('Error fetching how we work page:', error))
            .finally(() => setLoading(false));
    }, []);

    const heroImageUrl = getImageUrl(pageData?.heroImage);
    const expectImageUrl = getImageUrl(pageData?.expectImage);

    const ImageSkeleton = ({ className }) => (
        <div className={`${className} is-loading`} aria-hidden="true"></div>
    );

    return (
        <>
            <MetaTags
                title={seo?.metaTitle || 'How We Work'}
                description={seo?.metaDescription || 'Structure-first product and systems engineering for complex operations.'}
                keywords={seo?.metaKeywords}
                ogTitle={seo?.ogTitle}
                ogDescription={seo?.ogDescription}
                ogImage={seo?.ogImage?.url}
                canonicalUrl={seo?.canonicalUrl}
                robots={seo?.robots}
            />
            <div className="page-hero">
                <div className='container hero-inner'>

                    {/* Left Content */}
                    <div className='hero-content'>
                        <div className="eyebrow">How we work</div>

                        <h1>
                            Structure first.<br />
                            Then we build.
                        </h1>

                        <p>
                            Most teams want to fix the symptom. We start with the system.
                            Before writing a single line of code, we spend time understanding
                            how your operation actually works — not how it was designed to work.
                        </p>
                    </div>

                    {/* Right Image / Placeholder */}
                    <div className='hero-image-wrapper'>
                        {loading ? (
                            <ImageSkeleton className="hero-image-placeholder" />
                        ) : (
                            <div className='hero-image-placeholder has-image'>
                                {heroImageUrl ? (
                                    <OptimizedImage
                                        src={heroImageUrl}
                                        alt={getImageAlt(pageData?.heroImage, 'How we work')}
                                        width={960}
                                        height={660}
                                        sizes="(max-width: 992px) 100vw, 620px"
                                        loading="eager"
                                        fetchPriority="high"
                                    />
                                ) : (
                                    <div className="image-empty-state">CMS image pending</div>
                                )}
                            </div>
                        )}
                    </div>

                </div>
            </div>
            <section className="section">
                <div className='container'>
                    <div className="section-header">
                        <div className="section-label">The four stages</div>
                        <h2 className="section-title">What working with us looks like</h2>
                        <p class="section-body">Every engagement moves through the same four stages. The depth of each stage depends on where you are — but the sequence never changes.</p>
                    </div>

                    <div className="steps-wk">
                        <div class="step-wk">
                            <div class="step-num">01</div>
                            <div class="step-left">
                                <div class="step-tag">Problem framing</div>
                                <div class="step-title">Understand reality before designing solutions</div>
                                <div class="step-body">
                                    We start by mapping what's actually happening. Where do decisions get made informally? Where does information stop moving? Where do small problems hide until they become expensive ones? This isn't discovery — it's diagnosis.
                                </div>
                            </div>
                            <div class="step-right">
                                <div class="step-outcome">
                                    <strong>What you get</strong>
                                    A clear picture of where your coordination breaks down — and why the current tools or processes aren't solving it.
                                </div>
                                <div class="step-outcome">
                                    <strong>How long</strong>
                                    1–2 weeks, depending on operational complexity.
                                </div>
                            </div>
                        </div>

                        <div class="step-wk">
                            <div class="step-num">02</div>
                            <div class="step-left">
                                <div class="step-tag">System design</div>
                                <div class="step-title">Design for how you'll operate at scale, not how you operate today</div>
                                <div class="step-body">
                                    Most systems are designed around current headcount and current load. They stop working when you grow. We design for the structure your operation needs to be predictable — across teams, locations, and growth stages.
                                </div>
                            </div>
                            <div class="step-right">
                                <div class="step-outcome">
                                    <strong>What you get</strong>
                                    An operational blueprint — decision flows, accountability structure, escalation logic — before any platform work begins.
                                </div>
                                <div class="step-outcome">
                                    <strong>Why this matters</strong>
                                    Fixing structure after build costs 4x more than designing it in from the start.
                                </div>
                            </div>
                        </div>

                        <div class="step-wk">
                            <div class="step-num">03</div>
                            <div class="step-left">
                                <div class="step-tag">Build and integrate</div>
                                <div class="step-title">Controlled delivery, not big releases</div>
                                <div class="step-body">
                                    We build incrementally against the operational blueprint. Each release delivers a working capability — not a partial feature. Your team can operate on it immediately, and we adjust based on real conditions, not projections.
                                </div>
                            </div>
                            <div class="step-right">
                                <div class="step-outcome">
                                    <strong>What you get</strong>
                                    A working system that integrates with your existing operations without requiring a cutover event or retraining your whole team.
                                </div>
                                <div class="step-outcome">
                                    <strong>Our commitment</strong>
                                    No big-bang launches. Every release is tested against real operational load before it's handed over.
                                </div>
                            </div>
                        </div>

                        <div class="step-wk">
                            <div class="step-num">04</div>
                            <div class="step-left">
                                <div class="step-tag">Stabilise and operate</div>
                                <div class="step-title">Performance under real conditions, not demo conditions</div>
                                <div class="step-body">
                                    The hardest part isn't building the system — it's making it stable when real pressure arrives. We stay close through the first operational cycles, refining based on what the data and your team are telling us.
                                </div>
                            </div>
                            <div class="step-right">
                                <div class="step-outcome">
                                    <strong>What you get</strong>
                                    A system that holds up when volume spikes, teams change, or conditions shift — not one that needs constant maintenance.
                                </div>
                                <div class="step-outcome">
                                    <strong>Longer term</strong>
                                    Many clients move to a long-term partnership here. We become an embedded part of the operational team.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="section engage-section">
                <div className='container'>
                    <div class="section-header">
                        <div class="section-label">How we engage</div>
                        <h2 class="section-title">Four ways to work with us</h2>
                        <p class="section-body">We don't have one-size-fits-all retainers. Where you start depends on where the problem is.</p>
                    </div>

                    <div class="engage-grid">
                        <div class="engage-card">
                            <div class="engage-num">Assessment</div>
                            <div class="engage-title">Focused system assessment</div>
                            <div class="engage-body">A short, high-clarity engagement to diagnose where your operational structure is breaking down and what it would take to fix it. Ends with a clear roadmap — not a proposal for more work.</div>
                            <div class="engage-note">Best when: you know something is wrong but can't pinpoint it.</div>
                        </div>
                        <div class="engage-card">
                            <div class="engage-num">Modernisation</div>
                            <div class="engage-title">Targeted modernisation</div>
                            <div class="engage-body">We replace fragile coordination points — spreadsheets, manual handoffs, fragmented tools — while keeping your core operations running. Scoped tightly. No rip-and-replace.</div>
                            <div class="engage-note">Best when: specific workflows are causing repeated failures.</div>
                        </div>
                        <div class="engage-card">
                            <div class="engage-num">Partnership</div>
                            <div class="engage-title">Long-term engineering partnership</div>
                            <div class="engage-body">We become an embedded part of your operational team — accountable for delivery, stability, and evolution over time. This isn't outsourced development; it's shared ownership of outcomes.</div>
                            <div class="engage-note">Best when: the operation is growing and coordination needs ongoing attention.</div>
                        </div>
                        <div class="engage-card">
                            <div class="engage-num">Platform</div>
                            <div class="engage-title">Platform and product buildout</div>
                            <div class="engage-body">End-to-end builds for operational platforms — from architecture through production launch. We stay involved past the handover, because most problems surface after go-live.</div>
                            <div class="engage-note">Best when: you're building something net new and need it to work at scale from day one.</div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="section honest-section">
                <div className='container'>
                    <div className="section-label">What to expect</div>

                    <div className={`honest-inner ${loading ? 'section-loading' : ''}`}>

                        {/* Left Content */}
                        <div className="honest-content">
                            <div className="honest-quote">
                                We work with a small number of clients at a time.
                                That's a deliberate choice — <em>not a capacity constraint.</em>
                            </div>

                            <div className="honest-list">
                                <div className="honest-item">
                                    <div className="honest-dot"></div>
                                    <div>
                                        You'll work directly with the people doing the work.
                                        No account managers between you and the team solving your problem.
                                    </div>
                                </div>

                                <div className="honest-item">
                                    <div className="honest-dot"></div>
                                    <div>
                                        We'll tell you early if the problem is different from
                                        what you described — because we diagnose before we build.
                                    </div>
                                </div>

                                <div className="honest-item">
                                    <div className="honest-dot"></div>
                                    <div>
                                        We don't start work we can't finish well. If the scope
                                        doesn't fit our model, we'll say so before you spend anything.
                                    </div>
                                </div>

                                <div className="honest-item">
                                    <div className="honest-dot"></div>
                                    <div>
                                        Our measure of success is whether your operation runs
                                        better — not whether the software was delivered on time.
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Skeleton Placeholder */}
                        <div className="honest-image-wrapper">
                            {loading ? (
                                <ImageSkeleton className="honest-image-placeholder" />
                            ) : (
                                <div className="honest-image-placeholder has-image">
                                    {expectImageUrl ? (
                                        <OptimizedImage
                                            src={expectImageUrl}
                                            alt={getImageAlt(pageData?.expectImage, 'What to expect')}
                                            width={640}
                                            height={800}
                                            sizes="(max-width: 992px) 100vw, 480px"
                                        />
                                    ) : (
                                        <div className="image-empty-state">CMS image pending</div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </section>

            <div class="how__cta-section container section">

                <div class="cta-left">
                    <h2>Not sure where to start?<br />That's a normal place to be.</h2>
                    <p>Tell us what's breaking down. We'll ask a few direct questions and tell you honestly whether we can help — and how.</p>
                </div>
                <div class="cta-right">
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
                    <div class="cta-note">No pitch deck. No long intake form.</div>
                </div>

            </div>

        </>
    )
}

export default HowWeWork
