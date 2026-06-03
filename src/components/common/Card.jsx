import React from 'react';
import './Card.css';
import { getImageAlt, getImagePlaceholder, getImageUrl } from '../../utils/imageHelper';
import { formatDisplayDate } from '../../utils/dateFormat';
import OptimizedImage from './OptimizedImage';
import { HoverCard } from './Animations';

const Card = ({ image, industry, industryTag, date, title, excerpt, onClick, variant = 'default' }) => {
  const getTagStyle = () => {
    if (industryTag === 'ind') return 'tag-ind';
    if (industryTag === 'wp') return 'tag-wp';
    return 'tag';
  };

  const renderImage = () => {
    if (!image) return null;

    const imageUrl = getImageUrl(image);
    const imageAlt = getImageAlt(image, 'Card image');
    const placeholder = getImagePlaceholder(image, 'Image');
    if (!imageUrl) return null;

    return (
      <div className="card-image">
        <OptimizedImage
          src={imageUrl}
          alt={imageAlt}
          width={420}
          height={240}
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 400px"
          fallbackContent={placeholder}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML = placeholder;
          }}
        />
      </div>
    );
  };

  if (variant === 'grid') {
    return (
      <HoverCard className="card card-grid motion-card" onClick={onClick}>
        <div>
          <div className="card-meta">
            {industry && <span className={getTagStyle()}>{industry}</span>}
            {date && <span className="card-date">{formatDisplayDate(date)}</span>}
          </div>
          <h3 className="card-title">{title}</h3>
          {excerpt && <p className="card-excerpt">{excerpt}</p>}
        </div>
        <div className="card-actions">
          <button className="btn-secondary">Read online</button>
          <button className="btn-primary">Download PDF</button>
        </div>
      </HoverCard>
    );
  }

  return (
    <HoverCard className="card motion-card" onClick={onClick}>
      {renderImage()}
      <div className='card-body'>
        <div className="card-meta">
          {industry && <span className={getTagStyle()}>{industry}</span>}
          {/* {date && <span className="card-date">{date}</span>} */}
        </div>
        <h3 className="card-title">{title}</h3>
        <p className="card-excerpt">{excerpt}</p>
        {/* <div className="card-arrow">Read case study →</div> */}
      </div>

    </HoverCard>
  );
};

export default Card;
