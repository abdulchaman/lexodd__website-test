import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import './Skeletons.css';

const baseProps = {
  animation: 'wave',
  variant: 'rectangular',
  className: 'lex-skeleton'
};

const Skel = ({ className = '', ...props }) => (
  <Skeleton {...baseProps} className={`lex-skeleton ${className}`} {...props} />
);

export const SkeletonHero = ({ split = false, image = false }) => (
  <div className={split ? 'skeleton-hero skeleton-hero--split' : 'skeleton-hero'}>
    <div className="skeleton-copy">
      <Skel width={96} height={12} />
      <Skel width="min(620px, 100%)" height={58} className="skeleton-line-lg" />
      <Skel width="min(520px, 88%)" height={18} />
      <Skel width="min(420px, 72%)" height={18} />
      {split && <Skel width={150} height={44} className="skeleton-button" />}
    </div>
    {image && <Skel height={340} className="skeleton-image" />}
  </div>
);

export const SkeletonFilters = ({ count = 4 }) => (
  <div className="filter-row">
    {Array.from({ length: count }).map((_, index) => (
      <Skel key={index} width={index === 0 ? 72 : 118} height={37} className="skeleton-filter" />
    ))}
  </div>
);

export const SkeletonCard = ({ horizontal = false, image = true }) => (
  <div className={horizontal ? 'skeleton-card skeleton-card--horizontal' : 'skeleton-card'}>
    {image && <Skel height={160} className="skeleton-card-image" />}
    <div className="skeleton-card-body">
      <div className="skeleton-meta-row">
        <Skel width={88} height={14} />
        <Skel width={120} height={12} />
      </div>
      <Skel width="92%" height={24} />
      <Skel width="100%" height={14} />
      <Skel width="78%" height={14} />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6, columnsClass = 'grid3', cardProps = {} }) => (
  <div className={columnsClass}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} {...cardProps} />
    ))}
  </div>
);

export const SkeletonSidebar = ({ count = 4 }) => (
  <div className="article-sidebar skeleton-sidebar">
    {Array.from({ length: count }).map((_, index) => (
      <div className="skeleton-sidebar-card" key={index}>
        <Skel width={96} height={12} />
        <Skel width={index % 2 ? 150 : 190} height={18} />
      </div>
    ))}
  </div>
);

export const SkeletonStats = ({ count = 3 }) => (
  <div className="stat-row">
    {Array.from({ length: count }).map((_, index) => (
      <div className="stat-box" key={index}>
        <Skel width={index === 1 ? 92 : 74} height={42} />
        <Skel width={110} height={12} />
      </div>
    ))}
  </div>
);

export const SkeletonJobCard = () => (
  <div className="minimal-job-card skeleton-job-card">
    <div className="job-card-header">
      <span className="job-card-main">
        <Skel width={220} height={21} />
        <Skel width={300} height={16} />
      </span>
      <Skel width={92} height={36} className="skeleton-button" />
    </div>
  </div>
);

const SkeletonTextBlock = ({ lines = 4 }) => (
  <div className="skeleton-text-block">
    <Skel width={90} height={12} />
    <Skel width="70%" height={34} />
    {Array.from({ length: lines }).map((_, index) => (
      <Skel key={index} width={index === lines - 1 ? '72%' : '100%'} height={15} />
    ))}
  </div>
);

const SkeletonPillar = () => (
  <div className="pillar">
    <Skel width={26} height={26} className="skeleton-dot" />
    <Skel width="62%" height={23} />
    <Skel width="100%" height={13} />
    <Skel width="78%" height={13} />
  </div>
);

export const CaseStudiesListingSkeleton = () => (
  <div className="container">
    <div className="page">
      <SkeletonHero />
      <div className="sec">
        <SkeletonFilters count={4} />
        <SkeletonGrid count={6} />
      </div>
    </div>
  </div>
);

export const WhitePapersListingSkeleton = () => (
  <div className="container">
    <div className="page">
      <SkeletonHero />
      <div className="sec">
        <SkeletonFilters count={4} />
        <div className="skeleton-list">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} horizontal />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const CaseStudySingleSkeleton = () => (
  <div className="container">
    <div className="page">
      <div className="case-study-header">
        <div className="breadcrumb">
          <Skel width={96} height={12} />
          <Skel width={8} height={12} />
          <Skel width={180} height={12} />
        </div>
      </div>
      <div className="case-study-hero">
        <Skel width="min(760px, 100%)" height={62} />
        <Skel width="min(560px, 80%)" height={18} />
        <Skel width="min(460px, 64%)" height={18} />
      </div>
      <div className="article-layout">
        <div className="article-body">
          <SkeletonStats />
          <Skel height={280} className="feature-image" />
          <SkeletonTextBlock />
          <div className="pull"><Skel width="92%" height={28} /><Skel width="70%" height={28} /></div>
          <SkeletonTextBlock />
          <div className="divider" />
          <SkeletonTextBlock />
          <Skel height={220} className="secondary-image" />
          <SkeletonTextBlock lines={2} />
        </div>
        <SkeletonSidebar count={2} />
      </div>
      <div className="sec">
        <Skel width={140} height={12} className="mb-2" />
        <div className="related-row">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  </div>
);

export const WhitePaperSingleSkeleton = () => (
  <div className="container">
    <div className="page">
      <div className="white-paper-header">
        <div className="breadcrumb">
          <Skel width={96} height={12} />
          <Skel width={8} height={12} />
          <Skel width={180} height={12} />
        </div>
      </div>
      <div className="white-paper-hero">
        <Skel width="min(760px, 100%)" height={62} />
        <Skel width="min(560px, 80%)" height={18} />
        <Skel width="min(460px, 64%)" height={18} />
      </div>
      <div className="article-layout">
        <div className="article-body">
          <div className="wp-cover skeleton-download-card">
            <Skel width={56} height={72} />
            <div className="wp-meta">
              <Skel width={180} height={24} />
              <Skel width="90%" height={14} />
              <Skel width={140} height={38} className="skeleton-button" />
            </div>
          </div>
          <SkeletonTextBlock lines={3} />
          <div className="pull"><Skel width="90%" height={28} /><Skel width="64%" height={28} /></div>
          <SkeletonTextBlock />
          <div className="divider" />
          <SkeletonTextBlock />
          <Skel height={200} className="framework-image" />
        </div>
        <SkeletonSidebar count={4} />
      </div>
    </div>
  </div>
);

export const IndustrySingleSkeleton = () => (
  <div className="container">
    <div className="page">
      <div className="industry-header">
        <div className="breadcrumb">
          <Skel width={54} height={12} />
          <Skel width={8} height={12} />
          <Skel width={150} height={12} />
        </div>
      </div>
      <div className="hero industry-hero">
        <SkeletonHero image />
      </div>
      <div className="sec">
        <Skel width={130} height={12} className="mb-2" />
        <Skel width="min(520px, 80%)" height={36} className="mb-2" />
        <Skel width="min(560px, 90%)" height={16} />
        <div className="ind-pillars">
          {Array.from({ length: 4 }).map((_, index) => <SkeletonPillar key={index} />)}
        </div>
      </div>
      <div className="sec">
        <Skel width={120} height={12} className="mb-2" />
        <Skel width={300} height={36} className="mb-4" />
        <div className="related-row"><SkeletonCard /><SkeletonCard /></div>
      </div>
      <div className="sec">
        <Skel width={90} height={12} className="mb-2" />
        <Skel width={360} height={36} className="mb-4" />
        <div className="papers-container">
          {Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} horizontal image={false} />)}
        </div>
      </div>
    </div>
  </div>
);

export const TechStackSkeleton = () => (
  <div className="container">
    <div className="page tech-stack-page">
      <section className="tech-stack-hero"><SkeletonHero split image /></section>
      <section className="tech-introduction">
        <div className="section-copy">
          <Skel width={280} height={36} />
          <Skel width="100%" height={15} />
          <Skel width="84%" height={15} />
        </div>
        <div className="feature-list">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="feature-item" key={index}><Skel width="88%" height={16} /></div>
          ))}
        </div>
      </section>
      <section className="tech-categories">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="stack-category" key={index}>
            <div className="category-header">
              <Skel width={64} height={64} className="category-logo" />
              <Skel width={280} height={34} />
              <Skel width="min(620px, 90%)" height={15} />
            </div>
            <div className="tools-grid">
              {Array.from({ length: 6 }).map((__, toolIndex) => (
                <div className="tool-card" key={toolIndex}>
                  <Skel width="48%" height={22} />
                  <Skel width="100%" height={14} />
                  <Skel width="82%" height={14} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
      <section className="principles-section">
        <div className="category-header">
          <Skel width={260} height={34} />
          <Skel width="min(620px, 90%)" height={15} />
        </div>
        <div className="principles-grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="principle-card" key={index}>
              <Skel width={42} height={12} />
              <Skel width="56%" height={22} />
              <Skel width="100%" height={13} />
              <Skel width="80%" height={13} />
            </div>
          ))}
        </div>
      </section>
      <section className="stack-cta-section">
        <div className="stack-cta-box">
          <Skel width="70%" height={34} />
          <Skel width="100%" height={15} />
          <Skel width="78%" height={15} />
          <div className="btn-row" style={{ justifyContent: 'center' }}>
            <Skel width={150} height={44} className="skeleton-button" />
            <Skel width={130} height={44} className="skeleton-button" />
          </div>
        </div>
      </section>
    </div>
  </div>
);

export const CareersSkeleton = () => (
  <div className="container">
    <div className="page">
      <div className="view-content">
        <div className="hero-split">
          <SkeletonHero split />
          <Skel height={340} className="hero-image" />
        </div>
        <div className="skeleton-career-stats"><SkeletonStats /></div>
        <div className="values-section">
          <div className="values-grid-2col">
            <SkeletonTextBlock lines={3} />
            <Skel height={260} className="culture-image" />
          </div>
          <div className="values-grid">
            {Array.from({ length: 3 }).map((_, index) => (
              <div className="val" key={index}>
                <Skel width={42} height={12} />
                <Skel width="60%" height={22} />
                <Skel width="100%" height={13} />
                <Skel width="72%" height={13} />
              </div>
            ))}
          </div>
        </div>
        <div className="cta-section">
          <div className="cta-grid">
            <div className="cta-box"><SkeletonTextBlock lines={2} /><Skel width={150} height={44} className="skeleton-button" /></div>
            <Skel height={220} className="workspace-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const OpenRolesSkeleton = () => (
  <div className="container">
    <div className="page">
      <div className="view-content">
        <section className="open-positions">
          <div className="open-positions-head">
            <Skel width={280} height={48} />
            <Skel width="min(520px, 90%)" height={16} />
            <Skel width="min(420px, 78%)" height={16} />
          </div>
          {[0, 1].map((group) => (
            <div className="job-group" key={group}>
              <Skel width={group ? 180 : 220} height={24} />
              <div className="jobs-list-minimal">
                {Array.from({ length: group ? 1 : 3 }).map((_, index) => <SkeletonJobCard key={index} />)}
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  </div>
);

export const ApplyPageSkeleton = () => (
  <div className="apply-page">
    <section className="apply-hero">
      <div className="apply-hero-content">
        <Skel width={110} height={16} className="skeleton-center" />
        <Skel width="min(560px, 90%)" height={52} className="skeleton-center" />
        <div className="apply-job-meta">
          {Array.from({ length: 4 }).map((_, index) => <Skel key={index} width={110} height={28} className="badge" />)}
        </div>
        <Skel width="min(680px, 96%)" height={16} className="skeleton-center" />
        <Skel width="min(520px, 76%)" height={16} className="skeleton-center" />
      </div>
    </section>
    <div className="apply-form-container">
      <div className="form-progress">
        {[0, 1, 2].map((step) => (
          <React.Fragment key={step}>
            {step > 0 && <Skel width={80} height={2} className="step-line" />}
            <div className="step">
              <Skel width={36} height={36} className="step-number" />
              <Skel width={64} height={12} />
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="form-step">
        <Skel width={260} height={34} />
        <div className="form-row-2">
          <SkeletonFormField />
          <SkeletonFormField />
        </div>
        {Array.from({ length: 4 }).map((_, index) => <SkeletonFormField key={index} />)}
        <div className="form-row-2">
          <SkeletonFormField />
          <SkeletonFormField />
        </div>
        <Skel width={130} height={44} className="skeleton-button skeleton-form-action" />
      </div>
    </div>
  </div>
);

const SkeletonFormField = () => (
  <label className="skeleton-form-field">
    <span className="field-label">
      <Skel width={140} height={14} />
      <Skel width={70} height={20} className="field-tag" />
    </span>
    <Skel width="100%" height={46} className="skeleton-input" />
  </label>
);
