import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Button from '../common/Button';
import api, { getWhitePapers } from '../../services/api';
import MetaTags from '../common/MetaTags';

const WhitePapersMain = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All topics');
    const [whitePapers, setWhitePapers] = useState([]);
    const [filteredPapers, setFilteredPapers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [heroData, setHeroData] = useState({ eyebrow: '', title: '', lead: '' });
    const [seo, setSeo] = useState(null);

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
            const papers = response.data.data || response.data || [];
            setWhitePapers(papers);
            setFilteredPapers(papers);

            setHeroData({
                eyebrow: 'Resources',
                title: 'White Papers',
                lead: 'Strategic insights for multi-location operations'
            });
            setLoading(false);
        } catch (error) {
            console.error('Error fetching white papers:', error);
            setLoading(false);
        }
    };

    // Get unique topics for filters
    const getUniqueTopics = () => {
        const topics = ['All topics', ...new Set(whitePapers.map(paper => paper.topic))];
        return topics;
    };

    const handleFilter = (filter) => {
        setActiveFilter(filter);
        if (filter === 'All topics') {
            setFilteredPapers(whitePapers);
        } else {
            setFilteredPapers(whitePapers.filter(paper => paper.topic === filter));
        }
    };

    if (loading) {
        return (
            <div className='container'>
                <div className="page">
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p>Loading white papers...</p>
                    </div>
                </div>
            </div>
        );
    }

    const filters = getUniqueTopics();

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
                    <div className="hero">
                        <div className="ey">{heroData.eyebrow}</div>
                        <h1>{heroData.title}</h1>
                        <p className="lead">{heroData.lead}</p>
                    </div>

                    <div className="sec">
                        <div className="filter-row">
                            {filters.map(filter => (
                                <button
                                    key={filter}
                                    className={`f-btn ${activeFilter === filter ? 'on' : ''}`}
                                    onClick={() => handleFilter(filter)}
                                >
                                    {filter}
                                </button>
                            ))}
                        </div>

                        <div className="grid3">
                            {filteredPapers.map(paper => (
                                <div key={paper._id} className="card paper-card" onClick={() => navigate(`/white-papers/${paper.slug}`)}>
                                    {/* <div>
                                        <img src={paper.coverImage} alt="" />
                                    </div> */}
                                    <div className="card-image">
                                        <img
                                            src={paper.coverImage}
                                            alt={paper.title}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                                e.target.parentElement.innerHTML = placeholder;
                                            }}
                                        />
                                    </div>
                                    <div className='card-body'>
                                        <div className="card-meta mb-2">
                                            <span className="tag-wp">{paper.topic}</span>
                                            <span className="card-date">{paper.date} · {paper.readTime}</span>
                                        </div>
                                        <h3 className="card-title paper-title">{paper.title}</h3>
                                        <p className="card-excerpt">{paper.excerpt}</p>
                                        {/* <div className="paper-actions">
                                            <Button variant="secondary" onClick={(e) => { e.stopPropagation(); navigate(`/white-papers/${paper.slug}`); }}>Read online</Button>
                                        </div> */}
                                    </div>

                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default WhitePapersMain;
