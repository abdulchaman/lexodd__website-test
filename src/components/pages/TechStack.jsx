import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Button from '../common/Button';
import { getTechStack } from '../../services/api';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
import MetaTags from '../common/MetaTags';
import { TechStackSkeleton } from '../common/Skeletons';
import OptimizedImage from '../common/OptimizedImage';
import { FadeUp, HoverCard, ScaleIn, StaggerGrid, TextReveal } from '../common/Animations';
import './TechStack.css';

const sortByOrder = (items = []) => [...items].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));

const TechStack = () => {
  const navigate = useNavigate();
  const [techStack, setTechStack] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expandedTool, setExpandedTool] = useState(null);

  useEffect(() => {
    fetchTechStack();
  }, []);

  const fetchTechStack = async () => {
    try {
      const response = await getTechStack();
      setTechStack(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tech stack:', error);
      if (error.response?.status === 404) setError(true);
      setLoading(false);
    }
  };

  const visibleCategories = useMemo(() => {
    return sortByOrder(techStack?.categories || [])
      .filter((category) => category.isVisible !== false)
      .map((category) => ({
        ...category,
        tools: sortByOrder(category.tools || []).filter((tool) => tool.isVisible !== false)
      }))
      .filter((category) => category.tools.length > 0);
  }, [techStack]);

  const visiblePrinciples = useMemo(() => {
    return sortByOrder(techStack?.principles?.items || []).filter((item) => item.isVisible !== false);
  }, [techStack]);

  if (loading) {
    return <TechStackSkeleton />;
  }

  if (error || !techStack || techStack.isVisible === false) {
    return (
      <div className="container">
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Tech stack not available</p>
          </div>
        </div>
      </div>
    );
  }

  const { hero = {}, introduction = {}, principles = {}, cta = {} } = techStack;
  const heroImageUrl = getImageUrl(hero.heroImage);
  const ctaImageUrl = getImageUrl(cta.backgroundImage);
  const hasIntroductionContent = introduction.title || introduction.description || introduction.features?.length > 0;

  return (
    <>
      <MetaTags
        title={techStack.seo?.metaTitle || hero.title || 'Our Technology Stack'}
        description={techStack.seo?.metaDescription || hero.lead}
        keywords={techStack.seo?.metaKeywords}
        ogTitle={techStack.seo?.ogTitle}
        ogDescription={techStack.seo?.ogDescription}
        ogImage={techStack.seo?.ogImage?.url || heroImageUrl}
        canonicalUrl={techStack.seo?.canonicalUrl}
        robots={techStack.seo?.robots}
      />
      <div className="container">
        <div className="page tech-stack-page">
          {hero.isVisible !== false && (
            <section className="tech-stack-hero">
              <div className="hero-grid">
                <FadeUp className="hero-content">
                  <div className="ey">{hero.eyebrow}</div>
                  <TextReveal as="h1" text={hero.title} />
                  <p className="mt">{hero.lead}</p>
                </FadeUp>
                <ScaleIn className="img-ph hero-image">
                  {heroImageUrl ? (
                    <OptimizedImage
                      src={heroImageUrl}
                      alt={getImageAlt(hero.heroImage, 'Tech Stack image')}
                      width={900}
                      height={520}
                      sizes="(max-width: 1024px) 100vw, 520px"
                      loading="eager"
                      fetchPriority="high"
                      fallbackContent={getImagePlaceholder(hero.heroImage, 'Image failed to load')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="padding: 20px; text-align: center;">Image failed to load</div>';
                      }}
                    />
                  ) : (
                    getImagePlaceholder(hero.heroImage, 'CMS - hero image')
                  )}
                </ScaleIn>
              </div>
            </section>
          )}

          {introduction.isVisible !== false && hasIntroductionContent && (
            <section className="tech-introduction">
              <FadeUp className="section-copy">
                <TextReveal as="h2" text={introduction.title} />
                <p>{introduction.description}</p>
              </FadeUp>
              {introduction.features?.length > 0 && (
                <StaggerGrid className="feature-list">
                  {introduction.features.map((feature, index) => (
                    <HoverCard className="feature-item" key={`${feature}-${index}`}>{feature}</HoverCard>
                  ))}
                </StaggerGrid>
              )}
            </section>
          )}

          {visibleCategories.length > 0 && (
            <section className="tech-categories">
              {visibleCategories.map((category) => {
                const categoryLogoUrl = getImageUrl(category.logo);
                return (
                  <FadeUp className="stack-category" key={category._id || category.id}>
                    <div className="category-header">
                      {categoryLogoUrl && (
                        <div className="category-logo">
                          <OptimizedImage
                            src={categoryLogoUrl}
                            alt={getImageAlt(category.logo, category.name)}
                            width={64}
                            height={64}
                            sizes="64px"
                          />
                        </div>
                      )}
                      <h2>{category.name}</h2>
                      <p className="category-description">{category.description}</p>
                    </div>

                    <StaggerGrid className="tools-grid">
                      {category.tools.map((tool) => {
                        const toolKey = `${category._id || category.id}-${tool._id || tool.orderIndex || tool.name}`;
                        const isExpanded = expandedTool === toolKey;
                        return (
                          <HoverCard
                            as="button"
                            type="button"
                            className={`tool-card ${isExpanded ? 'expanded' : ''}`}
                            key={toolKey}
                            onClick={() => setExpandedTool(isExpanded ? null : toolKey)}
                            aria-expanded={isExpanded}
                          >
                            <span className="tool-name">
                              <h3>{tool.name}</h3>
                            </span>
                            {tool.description && (
                              <span className="tool-description">{tool.description}</span>
                            )}
                            {isExpanded && tool.useCase && (
                              <span className="tool-usecase">
                                <span className="tool-usecase-label">When we use it</span>
                                <span>{tool.useCase}</span>
                              </span>
                            )}
                          </HoverCard>
                        );
                      })}
                    </StaggerGrid>
                  </FadeUp>
                );
              })}
            </section>
          )}

          {principles.isVisible !== false && visiblePrinciples.length > 0 && (
            <section className="principles-section">
              <FadeUp className="category-header">
                <TextReveal as="h2" text={principles.title} />
                <p className="category-description">{principles.description}</p>
              </FadeUp>
              <StaggerGrid className="principles-grid">
                {visiblePrinciples.map((principle, index) => (
                  <HoverCard className="principle-card" key={principle._id || index}>
                    <div className="principle-number">{principle.number}</div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </HoverCard>
                ))}
              </StaggerGrid>
            </section>
          )}

          {cta.isVisible !== false && (
            <section
              className="stack-cta-section"
              style={ctaImageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.72)), url(${ctaImageUrl})` } : undefined}
            >
              <FadeUp className="stack-cta-box">
                <h2>{cta.title}</h2>
                <p className="body-text">{cta.description}</p>
                <div className="btn-row" style={{ justifyContent: 'center' }}>
                  <Link
                    className='grad-cta cta'
                    to="/contact"
                    aria-label={cta.buttonText || 'Start a conversation'}
                  >
                    <span className='cta-text'>
                      {cta.buttonText || 'Start a conversation'}
                    </span>
                  </Link>
                  <Link
                    className='cta3 cta'
                    to="/open-roles"
                    aria-label={cta.secondaryButtonText || 'See open roles'}
                  >
                    {cta.secondaryButtonText || 'See open roles'}
                  </Link>
                </div>
              </FadeUp>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default TechStack;
