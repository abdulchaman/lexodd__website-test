import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { IoClose, IoSearch } from 'react-icons/io5';
import { getPopularSearches, searchContent } from '../../services/api';
import './SearchModal.css';

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'case-studies', label: 'Case studies' },
  { id: 'white-papers', label: 'White papers' },
  { id: 'industries', label: 'Industries' },
  { id: 'jobs', label: 'Jobs' }
];

const RECENT_KEY = 'lexodd_recent_searches';

const readRecentSearches = () => {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_KEY) || '[]');
    return Array.isArray(value) ? value.slice(0, 6) : [];
  } catch {
    return [];
  }
};

const saveRecentSearch = (term) => {
  const cleaned = term.trim();
  if (!cleaned) return [];
  const next = [cleaned, ...readRecentSearches().filter((item) => item.toLowerCase() !== cleaned.toLowerCase())].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  return next;
};

export default function SearchModal({ open, onClose }) {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [results, setResults] = useState([]);
  const [popular, setPopular] = useState([]);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = query.trim();
  const visibleResults = useMemo(
    () => results.filter((result) => result.isVisible !== false),
    [results]
  );

  useEffect(() => {
    if (!open) return;

    setRecent(readRecentSearches());
    setActiveIndex(-1);
    requestAnimationFrame(() => inputRef.current?.focus());

    getPopularSearches()
      .then((response) => setPopular(response.data?.popular || []))
      .catch(() => setPopular([]));
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    if (!trimmedQuery) {
      setResults([]);
      setLoading(false);
      return undefined;
    }

    setLoading(true);
    const timer = window.setTimeout(() => {
      searchContent({ query: trimmedQuery, type: activeTab, limit: 8 })
        .then((response) => {
          setResults(response.data?.results || []);
          setActiveIndex(-1);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    }, 300);

    return () => window.clearTimeout(timer);
  }, [activeTab, open, trimmedQuery]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (!visibleResults.length) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveIndex((index) => (index + 1) % visibleResults.length);
      }

      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveIndex((index) => (index <= 0 ? visibleResults.length - 1 : index - 1));
      }

      if (event.key === 'Enter' && activeIndex >= 0) {
        event.preventDefault();
        openResult(visibleResults[activeIndex]);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, onClose, open, visibleResults]);

  if (!open) return null;

  const runSuggestion = (term) => {
    setQuery(term);
    setRecent(saveRecentSearch(term));
  };

  const openResult = (result) => {
    if (!result?.url || result.isVisible === false) return;
    setRecent(saveRecentSearch(trimmedQuery || result.title));
    onClose();
    navigate(result.url);
  };

  return (
    <div className="search-modal" role="dialog" aria-modal="true" aria-label="Search Lexodd">
      <button type="button" className="search-modal__backdrop" onClick={onClose} aria-label="Close search" />
      <div className="search-modal__panel">
        <div className="search-modal__bar">
          <IoSearch aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search insights, industries, and roles"
            aria-label="Search"
          />
          <button type="button" className="search-modal__close" onClick={onClose} aria-label="Close search">
            <IoClose aria-hidden="true" />
          </button>
        </div>

        <div className="search-modal__tabs" role="tablist" aria-label="Search categories">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={activeTab === tab.id ? 'is-active' : ''}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {!trimmedQuery && (
          <div className="search-modal__suggestions">
            {recent.length > 0 && (
              <section>
                <h3>Recent searches</h3>
                <div className="search-modal__chips">
                  {recent.map((term) => (
                    <button key={term} type="button" onClick={() => runSuggestion(term)}>{term}</button>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3>Popular searches</h3>
              <div className="search-modal__chips">
                {(popular.length ? popular : ['Case studies', 'Healthcare', 'Logistics', 'Open roles']).map((term) => (
                  <button key={term} type="button" onClick={() => runSuggestion(term)}>{term}</button>
                ))}
              </div>
            </section>
          </div>
        )}

        {trimmedQuery && (
          <div className="search-modal__results" role="listbox" aria-label="Search results">
            {loading && <p className="search-modal__empty">Searching...</p>}

            {!loading && visibleResults.map((result, index) => (
              <button
                key={`${result.type}-${result.id}`}
                type="button"
                className={`search-modal__result ${activeIndex === index ? 'is-active' : ''}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => openResult(result)}
                role="option"
                aria-selected={activeIndex === index}
              >
                <span className="search-modal__type">{result.typeLabel}</span>
                <span className="search-modal__title">{result.title}</span>
                {result.excerpt && <span className="search-modal__excerpt">{result.excerpt}</span>}
              </button>
            ))}

            {!loading && visibleResults.length === 0 && (
              <p className="search-modal__empty">No visible results found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
