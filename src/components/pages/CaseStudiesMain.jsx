import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import Card from '../common/Card';
import Button from '../common/Button';
import api, { getCaseStudies } from '../../services/api';
import MetaTags from '../common/MetaTags';
import { CaseStudiesListingSkeleton } from '../common/Skeletons';
import { FadeUp, StaggerGrid, TextReveal } from '../common/Animations';

const getListFromResponse = (payload, keys = []) => {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];

    for (const key of ['data', ...keys]) {
        if (Array.isArray(payload[key])) return payload[key];
    }

    if (payload.data && typeof payload.data === 'object') {
        return getListFromResponse(payload.data, keys);
    }

    return [];
};

const normalizeCaseStudy = (study = {}) => ({
    ...study,
    _id: study._id || study.id || study.slug || study.title,
    slug: study.slug || study.id || '',
    title: study.title || study.heroDetail?.title || '',
    excerpt: study.excerpt || study.heroDetail?.lead || '',
    industry: String(study.industry || '').trim(),
    industryTag: String(study.industryTag || study.heroDetail?.industry || study.industry || '').trim(),
    image: study.image || study.coverImage || study.images?.featureImage || {}
});

const normalizeCaseStudies = (payload) => getListFromResponse(payload, ['caseStudies', 'items', 'results'])
    .filter(study => study && study.isVisible !== false)
    .map(normalizeCaseStudy);

const CaseStudiesMain = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState('All');
    const [caseStudies, setCaseStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [seo, setSeo] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        const fetchPageSEO = async () => {
            try {
                const response = await api.get('/pages/case-studies/seo');
                setSeo(response.data.data || response.data);
            } catch (error) {
                console.error('Error fetching case studies SEO:', error);
            }
        };

        const fetchCaseStudies = async () => {
            try {
                const response = await getCaseStudies();
                const studies = normalizeCaseStudies(response.data);
                setCaseStudies(studies);
            } catch (error) {
                console.error('Error fetching case studies:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCaseStudies();
        fetchPageSEO();
    }, []);

    const filters = useMemo(() => {
        const industryMap = new Map();

        caseStudies.forEach((study) => {
            const value = String(study.industry || '').trim();
            if (!value || industryMap.has(value)) return;

            industryMap.set(value, String(study.industryTag || value).trim());
        });

        return [
            { value: 'All', label: 'All' },
            ...Array.from(industryMap, ([value, label]) => ({ value, label }))
        ];
    }, [caseStudies]);

    const filteredStudies = useMemo(() => {
        if (activeFilter === 'All') return caseStudies;
        return caseStudies.filter(study => study.industry === activeFilter);
    }, [activeFilter, caseStudies]);

    const handleFilter = (filter) => {
        setActiveFilter(filter);
        setVisibleCount(6);
    };

    if (loading) {
        return <CaseStudiesListingSkeleton />;
    }

    const visibleStudies = filteredStudies.slice(0, visibleCount);
    const hasMoreStudies = filteredStudies.length > visibleCount;

    return (
        <>
            <MetaTags
                title={seo?.metaTitle || 'Case Studies'}
                description={seo?.metaDescription || 'Real-world operational transformations'}
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
                        <div className="ey">Our work</div>
                        <TextReveal as="h1" text="Case Studies" />
                        <p className="lead mt">Real solutions to real operational challenges</p>
                    </FadeUp>

                    <div className="sec">
                        {caseStudies.length > 0 && (
                            <FadeUp className="filter-row">
                                {filters.map(filter => (
                                    <button
                                        key={filter.value}
                                        className={`f-btn ${activeFilter === filter.value ? 'on' : ''}`}
                                        onClick={() => handleFilter(filter.value)}
                                    >
                                        {filter.label}
                                    </button>
                                ))}
                            </FadeUp>
                        )}

                        {filteredStudies.length > 0 ? (
                            <>
                                <StaggerGrid key={activeFilter} className="grid3">
                                    {visibleStudies.map(study => (
                                        <Card key={study._id} {...study} onClick={() => navigate(`/case-studies/${study.slug}`)} />
                                    ))}
                                </StaggerGrid>
                                {hasMoreStudies && (
                                    <div className="btn-row" style={{ justifyContent: 'center', marginTop: 32 }}>
                                        <Button variant="secondary" onClick={() => setVisibleCount((count) => count + 6)}>
                                            Load more
                                        </Button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="empty-state">
                                <div className="empty-icon">CS</div>
                                <h3>No case studies yet</h3>
                                <p>Check back soon for our latest work.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default CaseStudiesMain;
