import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import SidebarCard from '../common/SidebarCard';
import Button from '../common/Button';
import Card from '../common/Card';
import { getCaseStudyBySlug, getCaseStudies } from '../../services/api';
import { getImageAlt, getImageUrl } from '../../utils/imageHelper';
import MetaTags from '../common/MetaTags';
import { CaseStudySingleSkeleton } from '../common/Skeletons';
import OptimizedImage from '../common/OptimizedImage';
import { AnimatedCounter, FadeUp, ScaleIn, StaggerGrid, TextReveal } from '../common/Animations';
import './CaseStudySingle.css';

const CaseStudySingle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [relatedStudies, setRelatedStudies] = useState([]);

  useEffect(() => {
    if (slug) {
      fetchCaseStudy();
    }
  }, [slug]);

  const fetchCaseStudy = async () => {
    try {
      const response = await getCaseStudyBySlug(slug);
      const studyData = response.data.data || response.data;
      setCaseStudy(studyData);

      try {
        const studiesRes = await getCaseStudies();
        const studies = (studiesRes.data.data || studiesRes.data || []).filter(study => study.isVisible !== false);
        const relatedFiltered = studies
          .filter(s => s.industry === studyData.industry && s._id !== studyData._id)
          .slice(0, 3);
        setRelatedStudies(relatedFiltered);
      } catch (error) {
        console.error('Error fetching related studies:', error);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching case study:', error);
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return <CaseStudySingleSkeleton />;
  }

  if (error || !caseStudy) {
    return (
      <div className='container'>
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>Case study not found</p>
            <Button variant="secondary" onClick={() => navigate('/case-studies')}>← Back to case studies</Button>
          </div>
        </div>
      </div>
    );
  }

  const hero = caseStudy.hero || caseStudy.heroDetail || {};
  const stats = caseStudy.stats || [];
  const images = caseStudy.images || {};
  const content = caseStudy.content || {};
  const sidebar = caseStudy.sidebar || {};
  const section = (value, fallbackTitle) => typeof value === 'string'
    ? { title: fallbackTitle, description: value, additional: '' }
    : (value || { title: fallbackTitle, description: '', additional: '' });

  return (
    <>
      <MetaTags
        title={caseStudy.seo?.metaTitle || caseStudy.title || hero.title}
        description={caseStudy.seo?.metaDescription || caseStudy.excerpt || hero.lead}
        keywords={caseStudy.seo?.metaKeywords}
        ogTitle={caseStudy.seo?.ogTitle}
        ogDescription={caseStudy.seo?.ogDescription}
        ogImage={caseStudy.seo?.ogImage?.url || caseStudy.image?.url || getImageUrl(images.featureImage)}
        canonicalUrl={caseStudy.seo?.canonicalUrl}
        robots={caseStudy.seo?.robots}
      />
      <div className='container'>
        <div className="page">
          <div className="case-study-header">
            <div className="breadcrumb">
              <a onClick={() => navigate('/case-studies')}>Case studies</a>
              <span>›</span>
              <span>{hero?.title || caseStudy.title}</span>
            </div>
          </div>

          <FadeUp className="case-study-hero">
            <TextReveal as="h1" text={hero.title || caseStudy.title} />
            <p className="lead max-width-600">{hero.lead || caseStudy.excerpt}</p>
          </FadeUp>

          <div className="article-layout">
            <div className="article-body">
              <StaggerGrid className="stat-row">
                {stats.map((stat, index) => (
                  <FadeUp className="stat-box" key={index}>
                    <div className="stat-n"><AnimatedCounter value={stat.value} /></div>
                    <div className="stat-label">{stat.label}</div>
                  </FadeUp>
                ))}
              </StaggerGrid>

              {/* Feature Image */}
              <ScaleIn className="img-ph feature-image">
                {images?.featureImage ? (
                  <OptimizedImage
                    src={getImageUrl(images.featureImage)}
                    alt={getImageAlt(images.featureImage, 'Feature image')}
                    width={900}
                    height={420}
                    sizes="(max-width: 1024px) 100vw, 780px"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style={{ padding: "20px", textAlign: "center" }}>Image failed to load</div>';
                    }}
                  />
                ) : (
                  <div style={{ padding: "20px", textAlign: "center" }}>CMS — feature image</div>
                )}
              </ScaleIn>

              <div className="sl mb-2">The problem</div>
              <h2 className="mb-3">{section(content.problem, 'The problem').title}</h2>
              <p className="body-text">{section(content.problem, 'The problem').description}</p>
              <p className="body-text mt-3">{section(content.problem, 'The problem').additional}</p>

              <div className="pull">
                <p>{content.pullQuote}</p>
              </div>

              <div className="sl mb-2">What we found</div>
              <h2 className="mb-3">{section(content.findings, 'What we found').title}</h2>
              <p className="body-text">{section(content.findings, 'What we found').description}</p>
              <p className="body-text mt-3">{section(content.findings, 'What we found').additional}</p>

              <div className="divider"></div>

              <div className="sl mb-2">What we built</div>
              <h2 className="mb-3">{section(content.solution, 'What we built').title}</h2>
              <p className="body-text">{section(content.solution, 'What we built').description}</p>
              <p className="body-text mt-3">{section(content.solution, 'What we built').additional}</p>

              {/* Secondary Image */}
              <div className="img-ph secondary-image">
                {images?.secondaryImage ? (
                  <OptimizedImage
                    src={getImageUrl(images.secondaryImage)}
                    alt={getImageAlt(images.secondaryImage, 'Secondary image')}
                    width={900}
                    height={360}
                    sizes="(max-width: 1024px) 100vw, 780px"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML = '<div style={{ padding: "20px", textAlign: "center" }}>Image failed to load</div>';
                    }}
                  />
                ) : (
                  <div style={{ padding: "20px", textAlign: "center" }}>CMS — secondary image or diagram</div>
                )}
              </div>

              <div className="sl mb-2">The result</div>
              <h2 className="mb-3">{section(content.result, 'The result').title}</h2>
              <p className="body-text">{section(content.result, 'The result').description}</p>
            </div>

            <div className="article-sidebar">
              <SidebarCard label="Client" value={{ strong: sidebar?.client, note: sidebar?.clientNote }} />
              <SidebarCard label="Related white paper" value={sidebar?.relatedWhitePaper} isLink onClick={() => sidebar?.relatedWhitePaperSlug && navigate(`/white-papers/${sidebar.relatedWhitePaperSlug}`)} />
            </div>
          </div>

          <div className="sec">
            <div className="sl mb-2">Related case studies</div>
            <div className="related-row">
              {relatedStudies.length > 0 ? (
                relatedStudies.map((item) => (
                  <Card key={item._id} {...item} onClick={() => navigate(`/case-studies/${item.slug}`)} />
                ))
              ) : (
                <p>No related case studies</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CaseStudySingle;
