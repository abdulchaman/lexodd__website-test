import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getCareerPage } from '../../services/api';
import MetaTags from '../common/MetaTags';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
import { CareersSkeleton } from '../common/Skeletons';
import OptimizedImage from '../common/OptimizedImage';
import { AnimatedCounter, FadeUp, HoverCard, ScaleIn, StaggerGrid, TextReveal } from '../common/Animations';
import './Careers.css';

const Careers = () => {
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerData();
  }, []);

  const fetchCareerData = async () => {
    try {
      const pageRes = await getCareerPage();
      setCareerData(pageRes.data.data || pageRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching career data:', error);
      setLoading(false);
    }
  };

  const { hero, values, cta } = careerData || { hero: {}, values: {}, cta: {} };

  if (loading) {
    return <CareersSkeleton />;
  }

  return (
    <>
      <MetaTags
        title={careerData?.seo?.metaTitle || 'Careers at Lexodd'}
        description={careerData?.seo?.metaDescription || 'Join our team of systems thinkers'}
        keywords={careerData?.seo?.metaKeywords}
        ogTitle={careerData?.seo?.ogTitle}
        ogDescription={careerData?.seo?.ogDescription}
        ogImage={careerData?.seo?.ogImage?.url}
        canonicalUrl={careerData?.seo?.canonicalUrl}
        robots={careerData?.seo?.robots}
      />
      <div className="container">
        <div className="page">
            <div className="view-content">
              <div className="hero-split">
                <FadeUp>
                  <div className="ey">{hero.eyebrow}</div>
                  <TextReveal as="h1" text={hero.title} />
                  <p className="lead">{hero.lead}</p>
                  <div className="hero-actions">
                    <Link className="grad-cta cta" to="/open-roles"><span className='cta-text'>See open roles</span></Link>
                  </div>
                </FadeUp>
                <ScaleIn className="img-ph hero-image">
                  {hero.heroImage ? (
                    <OptimizedImage
                      src={getImageUrl(hero.heroImage)}
                      alt={getImageAlt(hero.heroImage, 'Careers hero')}
                      width={700}
                      height={420}
                      sizes="(max-width: 768px) 100vw, 560px"
                      loading="eager"
                      fetchPriority="high"
                      fallbackContent={getImagePlaceholder(hero.heroImage, 'Image failed to load')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = getImagePlaceholder(hero.heroImage, 'Image failed to load');
                      }}
                    />
                  ) : (getImagePlaceholder(hero.heroImage, 'CMS - hero image'))}
                </ScaleIn>
              </div>

              {Array.isArray(hero.stats) && hero.stats.length > 0 && (
                <StaggerGrid className="stat-row career-stat-row">
                  {hero.stats.slice(0, 3).map((stat, index) => (
                    <FadeUp className="stat-box" key={`${stat.label || 'career-stat'}-${index}`}>
                      <div className="stat-n"><AnimatedCounter value={stat.value} /></div>
                      <div className="stat-label">{stat.label}</div>
                    </FadeUp>
                  ))}
                </StaggerGrid>
              )}

              <div className="values-section">
                <div className="values-grid-2col">
                  <FadeUp>
                    <div className="sl">How we work as a team</div>
                    <TextReveal as="h2" text={values.title} />
                    <p className="body mt-2">{values.description}</p>
                    <p className="body mt-2">{values.additional}</p>
                  </FadeUp>
                  <ScaleIn className="img-ph culture-image">
                    {values.cultureImage ? (
                      <OptimizedImage
                        src={getImageUrl(values.cultureImage)}
                        alt={getImageAlt(values.cultureImage, 'Culture')}
                        width={700}
                        height={360}
                        sizes="(max-width: 768px) 100vw, 560px"
                        fallbackContent={getImagePlaceholder(values.cultureImage, 'Image failed to load')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = getImagePlaceholder(values.cultureImage, 'Image failed to load');
                        }}
                      />
                    ) : (getImagePlaceholder(values.cultureImage, 'CMS - culture image'))}
                  </ScaleIn>
                </div>
                <StaggerGrid className="values-grid">
                  {values.items && values.items.map((item, index) => (
                    <HoverCard className="val" key={index}>
                      <div className="v-num">{item.number}</div>
                      <h3>{item.title}</h3>
                      <p className="body">{item.description}</p>
                    </HoverCard>
                  ))}
                </StaggerGrid>
              </div>

              <FadeUp className="cta-section">
                <div className="cta-grid">
                  <div className="cta-box">
                    <div className="sl">{cta.eyebrow}</div>
                    <h2 className="mb-2">{cta.title}</h2>
                    <p className="body mb-3">{cta.description}</p>
                    <Link className="grad-cta cta" to="/open-roles"><span className='cta-text'>{'See open roles'}</span></Link>
                  </div>
                  <div className="img-ph workspace-image">
                    {cta.workspaceImage ? (
                      <OptimizedImage
                        src={getImageUrl(cta.workspaceImage)}
                        alt={getImageAlt(cta.workspaceImage, 'Workspace')}
                        width={700}
                        height={320}
                        sizes="(max-width: 768px) 100vw, 560px"
                        fallbackContent={getImagePlaceholder(cta.workspaceImage, 'Image failed to load')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = getImagePlaceholder(cta.workspaceImage, 'Image failed to load');
                        }}
                      />
                    ) : (getImagePlaceholder(cta.workspaceImage, 'CMS - workspace image'))}
                  </div>
                </div>
              </FadeUp>
            </div>
        </div>
      </div>
    </>
  );
};

export default Careers;
