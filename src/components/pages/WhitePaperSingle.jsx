import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import SidebarCard from '../common/SidebarCard';
import Button from '../common/Button';
import { getWhitePaperBySlug, trackDownload } from '../../services/api';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
import MetaTags from '../common/MetaTags';
import { formatDisplayDate } from '../../utils/dateFormat';
import { WhitePaperSingleSkeleton } from '../common/Skeletons';
import OptimizedImage from '../common/OptimizedImage';
import './WhitePaperSingle.css';

const WhitePaperSingle = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [whitePaper, setWhitePaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchWhitePaper();
    }
  }, [slug]);

  const fetchWhitePaper = async () => {
    try {
      const response = await getWhitePaperBySlug(slug);
      setWhitePaper(response.data.data || response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching white paper:', error);
      setError(true);
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      if (whitePaper?._id) {
        await trackDownload(whitePaper._id);
      }
      if (whitePaper?.download?.pdfUrl) {
        window.open(whitePaper.download.pdfUrl, '_blank');
      }
    } catch (error) {
      console.error('Error tracking download:', error);
      if (whitePaper?.download?.pdfUrl) {
        window.open(whitePaper.download.pdfUrl, '_blank');
      }
    }
  };

  if (loading) {
    return <WhitePaperSingleSkeleton />;
  }

  if (error || !whitePaper) {
    return (
      <div className='container'>
        <div className="page">
          <div style={{ padding: '40px', textAlign: 'center' }}>
            <p>White paper not found</p>
            <Button variant="secondary" onClick={() => navigate('/white-papers')}>← Back to white papers</Button>
          </div>
        </div>
      </div>
    );
  }

  const hero = whitePaper.hero || {};
  const images = whitePaper.images || {};
  const abstract = whitePaper.abstract || whitePaper.excerpt;
  const pullQuote = whitePaper.pullQuote;
  const content = whitePaper.content || {};
  const sidebar = whitePaper.sidebar || {};
  const frameworkImageUrl = getImageUrl(images.frameworkDiagram);
  const section = (value, fallbackTitle) => typeof value === 'string'
    ? { title: fallbackTitle, description: value, additional: '' }
    : (value || { title: fallbackTitle, description: '', additional: '' });

  return (
    <>
    <MetaTags
      title={whitePaper.seo?.metaTitle || whitePaper.title || hero.title}
      description={whitePaper.seo?.metaDescription || whitePaper.excerpt || hero.description || hero.lead}
      keywords={whitePaper.seo?.metaKeywords}
      ogTitle={whitePaper.seo?.ogTitle}
      ogDescription={whitePaper.seo?.ogDescription}
      ogImage={whitePaper.seo?.ogImage?.url || getImageUrl(whitePaper.coverImage)}
      canonicalUrl={whitePaper.seo?.canonicalUrl}
      robots={whitePaper.seo?.robots}
    />
    <div className='container'>
      <div className="page">
        <div className="white-paper-header">
          <div className="breadcrumb">
            <a onClick={() => navigate('/white-papers')}>White Papers</a>
            <span>›</span>
            <span>{hero?.title}</span>
          </div>
        </div>

        <div className="white-paper-hero">
          {/* <div className="cms-note">CMS — editable: all content, PDF upload, reading time, topic tag</div> */}
          {/* <div className="card-meta mb-3">
            <span className="tag-wp">{hero.topic || whitePaper.topic}</span>
            <span className="card-date">{formatDisplayDate(hero.date || whitePaper.date)} · {hero.readTime || whitePaper.readTime}</span>
          </div> */}
          <h1>{hero.title || whitePaper.title}</h1>
          <p className="lead max-width-580">{hero.lead || hero.description || whitePaper.excerpt}</p>
        </div>

        <div className="article-layout">
          <div className="article-body">
            {/*
            <div className="wp-cover">
              <div className="wp-icon">📄</div>
              <div className="wp-meta">
              </div>
            </div>
            */}

            <div className="sl mb-2">Abstract</div>
            <p className="body-text">{abstract}</p>

            <div className="pull">
              <p>{pullQuote}</p>
            </div>

            <div className="sl mb-2">The core problem</div>
            <h2 className="mb-3">{section(content.problem, 'The core problem').title}</h2>
            <p className="body-text">{section(content.problem, 'The core problem').description}</p>
            <p className="body-text mt-3">{section(content.problem, 'The core problem').additional}</p>

            <div className="divider"></div>

            <div className="sl mb-2">Framework</div>
            <h2 className="mb-3">{section(content.framework, 'Framework').title}</h2>
            <p className="body-text">{section(content.framework, 'Framework').description}</p>
            <p className="body-text mt-3">{section(content.framework, 'Framework').additional}</p>

            {/* Framework Diagram */}
            <div className="img-ph framework-image">
              {frameworkImageUrl ? (
                <OptimizedImage
                  src={frameworkImageUrl}
                  alt={getImageAlt(images.frameworkDiagram, 'Framework diagram')}
                  width={900}
                  height={320}
                  sizes="(max-width: 1024px) 100vw, 780px"
                  fallbackContent={getImagePlaceholder(images.frameworkDiagram, 'Image failed to load')}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = getImagePlaceholder(images.frameworkDiagram, 'Image failed to load');
                  }}
                />
              ) : (
                getImagePlaceholder(images.frameworkDiagram, 'CMS — framework diagram (editable)')
              )}
            </div>

            {/* <p className="body-text">The full framework, including worked examples from fuel distribution and healthcare contexts, is available in the downloadable PDF.</p> */}

            <div className="btn-row">
              <Button variant="primary" onClick={handleDownload}>
                Download full paper
              </Button>
              <Button variant="secondary" onClick={() => navigate('/white-papers')}>← Back to white papers</Button>
            </div>
          </div>

          <div className="article-sidebar">
            <SidebarCard label="Topic" value={sidebar.topic || whitePaper.topic} />
            {/* <SidebarCard label="Reading time" value={sidebar.readingTime || whitePaper.readTime} /> */}
            <SidebarCard label="Published" value={formatDisplayDate(sidebar.published || whitePaper.date)} />
            <SidebarCard label="Related case study" value={sidebar.relatedCaseStudy} isLink onClick={() => sidebar.relatedCaseStudySlug ? navigate(`/case-studies/${sidebar.relatedCaseStudySlug}`) : navigate('/case-studies')} />
            <SidebarCard label="Also in this series" value={sidebar.alsoInSeries} />
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default WhitePaperSingle;
