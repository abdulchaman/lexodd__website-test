import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Button from '../common/Button';
import api, { getWhitePapers } from '../../services/api';
import MetaTags from '../common/MetaTags';
import { formatDisplayDate } from '../../utils/dateFormat';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
import { WhitePapersListingSkeleton } from '../common/Skeletons';
import OptimizedImage from '../common/OptimizedImage';
import { FadeUp, HoverCard, StaggerGrid, TextReveal } from '../common/Animations';

const WhitePapersMain = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All topics');
    const [whitePapers, setWhitePapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroData, setHeroData] = useState({ eyebrow: '', title: '', lead: '' });
    const [seo, setSeo] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        fetchWhitePapers();
        fetchPageSEO();
    }, []);

    const fetchPageSEO = async () => {
        try {
            const response = await api.get('/pages/white-papers/seo');
            setSeo(response.data.data || response.data);
        } catch (error) {
            console.error('Error fetching white papers SEO:', error);
        }
    };

    const fetchWhitePapers = async () => {
        try {
            const response = await getWhitePapers();
            const papers = (response.data.data || response.data || []).filter(paper => paper.isVisible !== false);
            setWhitePapers(papers);
            setFilteredPapers(papers);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching white papers:', error);
            setLoading(false);
        }
    };

    // Get unique topics for filters
    const getUniqueTopics = () => {
        const topics = ['All topics', ...new Set(whitePapers.map(paper => paper.topic).filter(Boolean))];
        return topics;
    };

    const handleFilter = (filter) => {
        setActiveFilter(filter);
        setVisibleCount(6);
        if (filter === 'All topics') {
            setFilteredPapers(whitePapers);
        } else {
            setFilteredPapers(whitePapers.filter(paper => paper.topic === filter));
        }
    };

    if (loading) {
        return <WhitePapersListingSkeleton />;
    }

    const filters = getUniqueTopics();
    const visiblePapers = filteredPapers.slice(0, visibleCount);
    const hasMorePapers = filteredPapers.length > visibleCount;

    return (
        <>
            <MetaTags
                title={seo?.metaTitle || 'White Papers'}
                description={seo?.metaDescription || 'Strategic insights for multi-location operations'}
                keywords={seo?.metaKeywords}
                ogTitle={seo?.ogTitle}
                ogDescription={seo?.ogDescription}
                ogImage={seo?.ogImage?.url}
                canonicalUrl={seo?.canonicalUrl}
                robots={seo?.robots}
            />
            <div className='container'>
                <div className="page">
                    <FadeUp className="hero">
                        <div className="ey">Resources</div>
                        <TextReveal as="h1" text="White Papers" />
                        <p className="lead">Strategic insights for multi-location operations</p>
                    </FadeUp>

                    <div className="sec">
                        {whitePapers.length > 0 && (
                            <FadeUp className="filter-row">
                                {filters.map(filter => (
                                    <button
                                        key={filter}
                                        className={`f-btn ${activeFilter === filter ? 'on' : ''}`}
                                        onClick={() => handleFilter(filter)}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </FadeUp>
                        )}

                        {filteredPapers.length > 0 ? (
                            <>
                            <StaggerGrid className="grid3">
                                {visiblePapers.map(paper => {
                                const coverImageUrl = getImageUrl(paper.coverImage);
                                return (
                                <HoverCard key={paper._id} className="card paper-card motion-card" onClick={() => navigate(`/white-papers/${paper.slug}`)}>
                                    {coverImageUrl && <div className="card-image">
                                        <OptimizedImage
                                            src={coverImageUrl}
                                            alt={getImageAlt(paper.coverImage, paper.title)}
                                            width={420}
                                            height={240}
                                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
                                            fallbackContent={getImagePlaceholder(paper.coverImage, 'Image failed to load')}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = getImagePlaceholder(paper.coverImage, 'Image failed to load');
                                            }}
                                        />
                                    </div>}
                                    <div className='card-body'>
                                        <div className="card-meta mb-2">
                                            <span className="tag-wp">{paper.topic}</span>
                                            <span className="card-date">{formatDisplayDate(paper.date)} · {paper.readTime}</span>
                                        </div>
                                        <h3 className="card-title paper-title">{paper.title}</h3>
                                        <p className="card-excerpt">{paper.excerpt}</p>
                                        {/* <div className="paper-actions">
                                            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/white-papers/${paper.slug}`); }}>Read online</Button>
                                        </div> */}
                                    </div>

                                </HoverCard>
                                );
                                })}
                            </StaggerGrid>
                            {hasMorePapers && (
                                <div className="btn-row" style={{ justifyContent: 'center', marginTop: 32 }}>
                                    <Button variant="secondary" onClick={() => setVisibleCount((count) => count + 6)}>
                                        Load more
                                    </Button>
                                </div>
                            )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">WP</div>
                                <h3>No white papers available</h3>
                                <p>We're working on new research. Check back later.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WhitePapersMain;
