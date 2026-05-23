import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { getCareerPage } from '../../services/api';
import MetaTags from '../common/MetaTags';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
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
          {loading && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p>Loading career opportunities...</p>
            </div>
          )}

          {!loading && (
            <div className="view-content">
              <div className="hero-split">
                <div>
                  <div className="ey">{hero.eyebrow}</div>
                  <h1>{hero.title}</h1>
                  <p className="lead">{hero.lead}</p>
                  <div className="hero-actions">
                    <Link className="grad-cta cta" to="/open-roles"><span className='cta-text'>See open roles</span></Link>
                  </div>
                </div>
                <div className="img-ph hero-image">
                  {hero.heroImage ? (
                    <img
                      src={getImageUrl(hero.heroImage)}
                      alt={getImageAlt(hero.heroImage, 'Careers hero')}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = getImagePlaceholder(hero.heroImage, 'Image failed to load');
                      }}
                    />
                  ) : (getImagePlaceholder(hero.heroImage, 'CMS - hero image'))}
                </div>
              </div>

              <div className="values-section">
                <div className="values-grid-2col">
                  <div>
                    <div className="sl">How we work as a team</div>
                    <h2>{values.title}</h2>
                    <p className="body mt-2">{values.description}</p>
                    <p className="body mt-2">{values.additional}</p>
                  </div>
                  <div className="img-ph culture-image">
                    {values.cultureImage ? (
                      <img
                        src={getImageUrl(values.cultureImage)}
                        alt={getImageAlt(values.cultureImage, 'Culture')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = getImagePlaceholder(values.cultureImage, 'Image failed to load');
                        }}
                      />
                    ) : (getImagePlaceholder(values.cultureImage, 'CMS - culture image'))}
                  </div>
                </div>
                <div className="values-grid">
                  {values.items && values.items.map((item, index) => (
                    <div className="val" key={index}>
                      <div className="v-num">{item.number}</div>
                      <h3>{item.title}</h3>
                      <p className="body">{item.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="cta-section">
                <div className="cta-grid">
                  <div className="cta-box">
                    <div className="sl">{cta.eyebrow}</div>
                    <h2 className="mb-2">{cta.title}</h2>
                    <p className="body mb-3">{cta.description}</p>
                    <Link className="grad-cta cta" to="/open-roles"><span className='cta-text'>{'See open roles'}</span></Link>
                  </div>
                  <div className="img-ph workspace-image">
                    {cta.workspaceImage ? (
                      <img
                        src={getImageUrl(cta.workspaceImage)}
                        alt={getImageAlt(cta.workspaceImage, 'Workspace')}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = getImagePlaceholder(cta.workspaceImage, 'Image failed to load');
                        }}
                      />
                    ) : (getImagePlaceholder(cta.workspaceImage, 'CMS - workspace image'))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Careers;
