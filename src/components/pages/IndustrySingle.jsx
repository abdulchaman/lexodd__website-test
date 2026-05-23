import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import Card from '../common/Card';
import Button from '../common/Button';
import { getIndustryBySlug } from '../../services/api';
import { getImageAlt, getImageUrl } from '../../utils/imageHelper';
import MetaTags from '../common/MetaTags';
import './IndustrySingle.css';

const IndustrySingle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [industry, setIndustry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchIndustry();
    }
  }, [slug]);

  const fetchIndustry = async () => {
    try {
      const response = await getIndustryBySlug(slug);
      setIndustry(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching industry:', error);
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='container'>
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Loading industry...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !industry) {
    return (
      <div className='container'>
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Industry not found</p>
            <Button variant="secondary" onClick={() => navigate('/')}>← Go back home</Button>
          </div>
        </div>
      </div>
    );
  }

  const { hero = {}, focus = {}, caseStudies = [], whitePapers = [], cta = {} } = industry;

  return (
    <>
      <MetaTags
        title={industry.seo?.metaTitle || hero.title}
        description={industry.seo?.metaDescription || hero.lead}
        keywords={industry.seo?.metaKeywords}
        ogTitle={industry.seo?.ogTitle}
        ogDescription={industry.seo?.ogDescription}
        ogImage={industry.seo?.ogImage?.url || hero.heroImage}
        canonicalUrl={industry.seo?.canonicalUrl}
        robots={industry.seo?.robots}
      />
      <div className='container'>
        <div className="page">
          <div className="industry-header">
            <div className="breadcrumb">
              <a onClick={() => navigate('/')}>Home</a>
              <span>›</span>
              <span>{hero?.title}</span>
            </div>
          </div>

          <div className="hero industry-hero">
            {/* <div className="cms-note">CMS — editable: industry name, headline, description, challenge bullets, all linked content</div> */}
            <div className="ey">{hero?.eyebrow}</div>
            <h1>{hero?.title}</h1>
            <p className="lead">{hero?.lead}</p>

            {/* Hero Image */}
            <div className="img-ph hero-image mt-4">
              {hero?.heroImage ? (
                <img
                  src={getImageUrl(hero.heroImage)}
                  alt={getImageAlt(hero.heroImage, 'Industry image')}
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

          <div className="sec">
            <div className="sl mb-2">Where we focus</div>
            <h2 className="mb-2 max-width-580">{focus.title}</h2>
            <p className="body-text max-width-560 mb-4">{focus.description}</p>
            <div className="ind-pillars">
              {(focus.pillars || []).map((pillar, index) => (
                <div className="pillar" key={index}>
                  <div className="pillar-icon">◈</div>
                  <h3>{pillar.title}</h3>
                  <p>{pillar.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sec">
            <div className="sl mb-2">Case studies</div>
            <h2 className="mb-4">Work in this industry</h2>
            {/* <div className="cms-note">CMS — auto-populated from case studies tagged to this industry</div> */}
            <div className="related-row">
              {caseStudies && caseStudies.length > 0 ? (
                caseStudies.map((study) => (
                  <Card
                    key={study._id}
                    {...study}
                    onClick={() => navigate(`/case-studies/${study.slug}`)}
                    excerpt={study.result}
                  />
                ))
              ) : (
                <p>No case studies for this industry yet.</p>
              )}
            </div>
          </div>

          <div className="sec">
            <div className="sl mb-2">Research</div>
            <h2 className="mb-4">White papers relevant to this industry</h2>
            {/* <div className="cms-note">CMS — auto-populated from white papers tagged to this industry</div> */}
            <div className="papers-container">
              {whitePapers && whitePapers.length > 0 ? (
                whitePapers.map((paper) => (
                  <div key={paper._id} className="card paper-list-item" onClick={() => navigate(`/white-papers/${paper.slug}`)}>
                    <div>
                      <div className="card-meta mb-2">
                        <span className="tag-wp">{paper.topic}</span>
                      </div>
                      <div className="card-title">{paper.title}</div>
                    </div>
                    <Button variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/white-papers/${paper.slug}`); }}>Read →</Button>
                  </div>
                ))
              ) : (
                <p>No white papers for this industry yet.</p>
              )}
            </div>
          </div>

          <div className="sec">
            <div className="industry-cta-box">
              <div className="sl">{cta.eyebrow}</div>
              <h2 className="mb-2">{cta.title}</h2>
              <p className="body-text">{cta.description}</p>
              <div className="btn-row">

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
          </div>
        </div>
      </div>
    </>
  );
};

export default IndustrySingle;
