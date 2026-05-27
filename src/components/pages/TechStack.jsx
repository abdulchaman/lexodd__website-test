import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import Button from '../common/Button';
import { getTechStack } from '../../services/api';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
import MetaTags from '../common/MetaTags';
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
    return (
      <div className="container">
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading tech stack...</p>
          </div>
        </div>
      </div>
    );
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
                <div className="hero-content">
                  <div className="ey">{hero.eyebrow}</div>
                  <h1>{hero.title}</h1>
                  <p className="lead">{hero.lead}</p>
                </div>
                <div className="img-ph hero-image">
                  {heroImageUrl ? (
                    <img
                      src={heroImageUrl}
                      alt={getImageAlt(hero.heroImage, 'Tech Stack image')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = '<div style="padding: 20px; text-align: center;">Image failed to load</div>';
                      }}
                    />
                  ) : (
                    getImagePlaceholder(hero.heroImage, 'CMS - hero image')
                  )}
                </div>
              </div>
            </section>
          )}

          {introduction.isVisible !== false && hasIntroductionContent && (
            <section className="tech-introduction">
              <div className="section-copy">
                <h2>{introduction.title}</h2>
                <p>{introduction.description}</p>
              </div>
              {introduction.features?.length > 0 && (
                <div className="feature-list">
                  {introduction.features.map((feature, index) => (
                    <div className="feature-item" key={`${feature}-${index}`}>{feature}</div>
                  ))}
                </div>
              )}
            </section>
          )}

          {visibleCategories.length > 0 && (
            <section className="tech-categories">
              {visibleCategories.map((category) => {
                const categoryLogoUrl = getImageUrl(category.logo);
                return (
                  <div className="stack-category" key={category._id || category.id}>
                    <div className="category-header">
                      {categoryLogoUrl && (
                        <div className="category-logo">
                          <img src={categoryLogoUrl} alt={getImageAlt(category.logo, category.name)} />
                        </div>
                      )}
                      <h2>{category.name}</h2>
                      <p className="category-description">{category.description}</p>
                    </div>

                    <div className="tools-grid">
                      {category.tools.map((tool) => {
                        const toolKey = `${category._id || category.id}-${tool._id || tool.orderIndex || tool.name}`;
                        const isExpanded = expandedTool === toolKey;
                        return (
                          <button
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
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </section>
          )}

          {principles.isVisible !== false && visiblePrinciples.length > 0 && (
            <section className="principles-section">
              <div className="category-header">
                <h2>{principles.title}</h2>
                <p className="category-description">{principles.description}</p>
              </div>
              <div className="principles-grid">
                {visiblePrinciples.map((principle, index) => (
                  <div className="principle-card" key={principle._id || index}>
                    <div className="principle-number">{principle.number}</div>
                    <h3>{principle.title}</h3>
                    <p>{principle.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {cta.isVisible !== false && (
            <section
              className="stack-cta-section"
              style={ctaImageUrl ? { backgroundImage: `linear-gradient(rgba(0,0,0,.72), rgba(0,0,0,.72)), url(${ctaImageUrl})` } : undefined}
            >
              <div className="stack-cta-box">
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
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default TechStack;
