import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { FiActivity, FiArrowRight, FiBarChart2, FiCheckCircle, FiCpu, FiEye, FiGitBranch, FiLayers, FiShield, FiTruck } from 'react-icons/fi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import MetaTags from '../common/MetaTags';
import './homeV2.css';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote: 'Lexodd turned scattered operations into a system leadership could actually steer.',
    name: 'Operations Director',
    company: 'Healthcare Network'
  },
  {
    quote: 'The dashboards did more than report activity. They changed how our teams made decisions.',
    name: 'Founder',
    company: 'Logistics Platform'
  },
  {
    quote: 'We finally had visibility across teams, locations, and escalation paths without adding more manual work.',
    name: 'Program Lead',
    company: 'Enterprise Services'
  }
];

const stats = [
  { label: 'Projects delivered', value: 12, suffix: '+' },
  { label: 'Clients supported', value: 50, suffix: '+' },
  { label: 'Delivery success', value: 99, suffix: '%' },
  { label: 'Support model', value: 24, suffix: '/7' }
];

const industries = [
  {
    icon: FiTruck,
    title: 'Logistics',
    text: 'Dispatch, route visibility, fleet accountability, and customer communication layers.'
  },
  {
    icon: FiActivity,
    title: 'Healthcare',
    text: 'Multi-location patient flows, appointment coordination, billing, and staff workflows.'
  },
  {
    icon: FiCpu,
    title: 'Enterprise Ops',
    text: 'Franchise systems, admin dashboards, approval flows, and operating command centers.'
  }
];

const pillars = [
  {
    icon: FiGitBranch,
    title: 'Structure',
    text: 'We map how work really moves, then design the operating system around it.'
  },
  {
    icon: FiEye,
    title: 'Visibility',
    text: 'Every team gets the right view, alert, and signal before small issues become expensive.'
  },
  {
    icon: FiShield,
    title: 'Governance',
    text: 'Escalation, ownership, permissions, and audit trails become part of the product itself.'
  }
];

const process = [
  ['01', 'Decode', 'Map the operational reality across teams, roles, systems, and failure points.'],
  ['02', 'Architect', 'Design the data model, workflows, permissions, dashboards, and integration surface.'],
  ['03', 'Build', 'Ship focused modules that replace manual coordination with reliable product behavior.'],
  ['04', 'Operate', 'Instrument the platform, track adoption, and improve the system with live signals.']
];

function CountUp({ value, suffix }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || started.current) return;
      started.current = true;

      const duration = 1150;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(value * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, { threshold: 0.45 });

    observer.observe(node);
    return () => observer.disconnect();
  }, [value]);

  return <span ref={ref}>{display}{suffix}</span>;
}

function DeferredSection({ children, rootMargin = '240px' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { rootMargin });

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return <div ref={ref}>{visible ? children : <div className="home-v2-deferred" />}</div>;
}

function HeroSection() {
  return (
    <section className="home-v2-hero" aria-label="Lexodd operational systems hero">
      <video
        className="home-v2-video"
        poster="/images/custom-hero-poster.png"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      >
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      <div className="home-v2-hero-fallback" />
      <div className="home-v2-hero-overlay" />
      <div className="home-v2-grid-overlay" />

      <div className="home-v2-container home-v2-hero-content">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="home-v2-hero-copy"
        >
          <div className="home-v2-eyebrow">Operational Systems Engineering</div>
          <h1>
            Build the nervous system behind <span>high velocity operations.</span>
          </h1>
          <p>
            Lexodd designs the platforms, dashboards, workflows, and governance layers that make complex businesses visible, accountable, and scalable.
          </p>
          <div className="home-v2-actions">
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link className="home-v2-btn home-v2-btn-primary" to="/contact">
                Start a build <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link className="home-v2-btn home-v2-btn-ghost" to="/case-studies">
                View systems
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="home-v2-command-card"
          initial={{ opacity: 0, x: 32 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.75, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="command-top">
            <span />
            Live operating layer
          </div>
          <div className="command-pulse">
            <div />
          </div>
          <div className="command-rows">
            {['Dispatch visibility', 'Workflow ownership', 'Escalation governance', 'Leadership dashboards'].map((item, index) => (
              <div className="command-row" key={item}>
                <span>{String(index + 1).padStart(2, '0')}</span>
                <strong>{item}</strong>
                <FiCheckCircle />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsSection() {
  return (
    <section className="home-v2-stats home-v2-section">
      <div className="home-v2-container home-v2-stats-grid">
        {stats.map((stat) => (
          <motion.article className="home-v2-stat-card reveal-card" key={stat.label} whileHover={{ y: -6 }}>
            <strong><CountUp value={stat.value} suffix={stat.suffix} /></strong>
            <span>{stat.label}</span>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function IndustriesSection() {
  return (
    <section className="home-v2-section">
      <div className="home-v2-container">
        <div className="home-v2-section-head reveal-card">
          <span>Active Industries</span>
          <h2>Systems for teams where coordination is mission critical.</h2>
        </div>
        <div className="home-v2-card-grid">
          {industries.map(({ icon: Icon, title, text }) => (
            <motion.article className="home-v2-glass-card reveal-card" key={title} whileHover={{ y: -8, scale: 1.01 }}>
              <div className="home-v2-icon"><Icon /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

function RealitySection() {
  return (
    <section className="home-v2-section home-v2-reality">
      <div className="home-v2-container home-v2-split reveal-split">
        <div className="home-v2-reality-visual">
          <img src="/images/reality.png" alt="" loading="lazy" />
          <div className="reality-metric one"><strong>42%</strong><span>less manual follow-up</span></div>
          <div className="reality-metric two"><strong>3.4x</strong><span>faster escalation paths</span></div>
        </div>
        <div className="home-v2-reality-copy">
          <span>The Reality</span>
          <h2>Most operational failures are invisible until they become expensive.</h2>
          <p>
            Your business does not need another generic dashboard. It needs a product layer that understands structure, ownership, exceptions, and the signals leaders actually use.
          </p>
          <Link className="home-v2-inline-link" to="/how-we-work">See the operating model <FiArrowRight /></Link>
        </div>
      </div>
    </section>
  );
}

function PillarsSection() {
  return (
    <section className="home-v2-section">
      <div className="home-v2-container">
        <div className="home-v2-section-head reveal-card">
          <span>Three Pillars</span>
          <h2>Every build starts with the same operating discipline.</h2>
        </div>
        <div className="home-v2-pillars">
          {pillars.map(({ icon: Icon, title, text }) => (
            <article className="home-v2-pillar reveal-card" key={title}>
              <Icon />
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineSection() {
  return (
    <section className="home-v2-section home-v2-process">
      <div className="home-v2-container">
        <div className="home-v2-section-head reveal-card">
          <span>What We Do</span>
          <h2>From operational ambiguity to shipped systems.</h2>
        </div>
        <div className="home-v2-timeline">
          <div className="home-v2-timeline-line">
            <div className="home-v2-timeline-progress" />
          </div>
          {process.map(([number, title, text]) => (
            <article className="home-v2-timeline-item reveal-card" key={number}>
              <div className="home-v2-dot" />
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % testimonials.length);
    }, 4300);

    return () => window.clearInterval(timer);
  }, []);

  const current = testimonials[index];

  return (
    <section className="home-v2-section">
      <div className="home-v2-container home-v2-testimonial reveal-card">
        <span>Client Signal</span>
        <motion.blockquote
          key={current.quote}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.4 }}
        >
          “{current.quote}”
        </motion.blockquote>
        <div className="home-v2-testimonial-meta">
          <strong>{current.name}</strong>
          <span>{current.company}</span>
        </div>
        <div className="home-v2-testimonial-dots">
          {testimonials.map((item, dotIndex) => (
            <button
              type="button"
              key={item.company}
              className={dotIndex === index ? 'active' : ''}
              aria-label={`Show testimonial ${dotIndex + 1}`}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="home-v2-section home-v2-final">
      <div className="home-v2-container home-v2-cta reveal-card">
        <div>
          <span>Build With Lexodd</span>
          <h2>Ready to turn operational complexity into product clarity?</h2>
        </div>
        <div className="home-v2-cta-panel">
          <p>Bring the workflows, exceptions, and reporting pain. We will help shape the system that makes it manageable.</p>
          <div className="home-v2-actions">
            <Link className="home-v2-btn home-v2-btn-primary" to="/contact">Talk to us <FiArrowRight /></Link>
            <Link className="home-v2-btn home-v2-btn-ghost" to="/how-we-work">How we work</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

const LazyTestimonials = lazy(() => Promise.resolve({ default: TestimonialsSection }));
const LazyCTA = lazy(() => Promise.resolve({ default: CTASection }));

export default function HomeV2() {
  const prefersReducedMotion = useReducedMotion();
  const animationContext = useRef(null);

  const meta = useMemo(() => ({
    title: 'Lexodd | Operational Systems Engineering',
    description: 'Premium software systems for operational visibility, workflow ownership, governance, dashboards, and scalable coordination.'
  }), []);

  useEffect(() => {
    if (prefersReducedMotion) return undefined;

    animationContext.current = gsap.context(() => {
      gsap.utils.toArray('.reveal-card').forEach((card) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 36 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.72,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 84%'
          }
        });
      });

      gsap.fromTo('.reveal-split .home-v2-reality-visual', { xPercent: -10, autoAlpha: 0 }, {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.reveal-split',
          start: 'top 75%'
        }
      });

      gsap.fromTo('.reveal-split .home-v2-reality-copy', { xPercent: 10, autoAlpha: 0 }, {
        xPercent: 0,
        autoAlpha: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.reveal-split',
          start: 'top 75%'
        }
      });

      gsap.fromTo('.home-v2-timeline-progress', { scaleX: 0 }, {
        scaleX: 1,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: {
          trigger: '.home-v2-timeline',
          start: 'top 70%',
          end: 'bottom 55%',
          scrub: true
        }
      });

      gsap.to('.home-v2-dot', {
        scale: 1.16,
        boxShadow: '0 0 0 10px rgba(165, 31, 193, 0.16)',
        duration: 0.8,
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
        ease: 'sine.inOut',
        scrollTrigger: {
          trigger: '.home-v2-timeline',
          start: 'top 75%',
          end: 'bottom 45%',
          toggleActions: 'play pause resume pause'
        }
      });
    });

    return () => {
      animationContext.current?.revert();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <MetaTags title={meta.title} description={meta.description} />
      <main className="home-v2">
        <HeroSection />
        <StatsSection />
        <DeferredSection><IndustriesSection /></DeferredSection>
        <DeferredSection><RealitySection /></DeferredSection>
        <DeferredSection><PillarsSection /></DeferredSection>
        <DeferredSection><TimelineSection /></DeferredSection>
        <DeferredSection>
          <Suspense fallback={<div className="home-v2-deferred" />}>
            <LazyTestimonials />
          </Suspense>
        </DeferredSection>
        <DeferredSection>
          <Suspense fallback={<div className="home-v2-deferred" />}>
            <LazyCTA />
          </Suspense>
        </DeferredSection>
      </main>
    </>
  );
}
