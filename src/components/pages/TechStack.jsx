import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Button from '../common/Button';
import { getTechStack } from '../../services/api';
import { getImageAlt, getImageUrl } from '../../utils/imageHelper';
import MetaTags from '../common/MetaTags';
import './TechStack.css';

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

  if (loading) {
    return (
      <div className='container'>
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading tech stack...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !techStack) {
    return (
      <div className='container'>
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Tech stack not available</p>
          </div>
        </div>
      </div>
    );
  }

  const { hero = {}, categories = [], principles = {}, cta = {} } = techStack;
  const totalTools = categories?.reduce((sum, cat) => sum + (cat.tools?.length || 0), 0) || 0;
  const heroStats = Array.isArray(hero.stats)
    ? hero.stats
    : [
        { value: hero.stats?.categories || categories.length, label: 'Categories' },
        { value: hero.stats?.totalTools || totalTools, label: 'Core tools' },
        { value: hero.stats?.openSource || 'OSS', label: 'Open source friendly' }
      ];

  return (
    <>
    <MetaTags
      title={techStack.seo?.metaTitle || hero.title || 'Our Technology Stack'}
      description={techStack.seo?.metaDescription || hero.lead}
      keywords={techStack.seo?.metaKeywords}
      ogTitle={techStack.seo?.ogTitle}
      ogDescription={techStack.seo?.ogDescription}
      ogImage={techStack.seo?.ogImage?.url || hero.heroImage}
      canonicalUrl={techStack.seo?.canonicalUrl}
      robots={techStack.seo?.robots}
    />
    <div className='container'>
      <div className="page">
        {/* Hero Section */}
        <div className="tech-stack-hero">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="ey">{hero.eyebrow}</div>
              <h1>{hero.title}</h1>
              <p className="lead">{hero.lead}</p>
              <div className="hero-stats">
                {heroStats.slice(0, 3).map((stat, index) => (
                  <React.Fragment key={`${stat.label}-${index}`}>
                    {index > 0 && <div className="stat-divider"></div>}
                    <div className="stat-item">
                      <div className="stat-n">{stat.value}</div>
                      <div className="stat-l">{stat.label}</div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="img-ph hero-image">
              {hero?.heroImage ? (
                <img
                  src={getImageUrl(hero.heroImage)}
                  alt={getImageAlt(hero.heroImage, 'Tech Stack image')}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div style="padding: 20px; text-align: center;">Image failed to load</div>';
                  }}
                />
              ) : (
                <div style="padding: 20px; text-align: center;">CMS — hero image</div>
              )}
            </div>
          </div>
        </div>

        {/* Categories Sections */}
        {categories.map((category, idx) => (
          <div className="stack-category" key={category.id}>
            <div className="category-header">
              <div className="category-icon">{category.icon}</div>
              <h2>{category.name}</h2>
              <p className="category-description">{category.description}</p>
            </div>

            <div className="tools-grid">
              {category.tools.map((tool, toolIdx) => (
                <div
                  className="tool-card"
                  key={toolIdx}
                  onClick={() => setExpandedTool(expandedTool === `${category.id}-${toolIdx}` ? null : `${category.id}-${toolIdx}`)}
                >
                  <div className="tool-header">
                    <div className="tool-icon">{tool.iconSymbol}</div>
                    <div className="tool-name">
                      <h3>{tool.name}</h3>
                      <div className="tool-category">{tool.category}</div>
                    </div>
                  </div>
                  <div className="tool-benefit">
                    <p>{tool.benefit}</p>
                  </div>
                  {expandedTool === `${category.id}-${toolIdx}` && (
                    <div className="tool-usecase">
                      <div className="tool-usecase-label">When we use it</div>
                      <p>{tool.useCase}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Principles Section */}
        <div className="principles-section">
          <div className="category-header">
            <div className="category-icon">◇</div>
            <h2>{principles.title}</h2>
            <p className="category-description">{principles.description}</p>
          </div>
          <div className="principles-grid">
            {principles.items.map((principle, idx) => (
              <div className="principle-card" key={idx}>
                <div className="principle-number">{principle.number}</div>
                <h3>{principle.title}</h3>
                <p>{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="stack-cta-section">
          <div className="stack-cta-box">
            <h2>{cta.title}</h2>
            <p className="body-text">{cta.description}</p>
            <div className="btn-row" style={{ justifyContent: 'center' }}>
              <Button variant="primary" onClick={() => alert('Contact functionality will be connected to API')}>
                {cta.buttonText}
              </Button>
              <Button variant="secondary" onClick={() => navigate('/careers')}>
                {cta.secondaryButtonText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default TechStack;
