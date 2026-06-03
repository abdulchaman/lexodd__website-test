import React, { useMemo, useState } from 'react';

const absoluteUrlPattern = /^(https?:|data:|blob:)/i;
const toWebp = (src, webpSrc) => {
  if (webpSrc) return webpSrc;
  if (!src || !/\.webp($|\?)/i.test(src)) return null;
  return src;
};

const buildSrcSet = (src) => {
  if (!src || src.endsWith('.svg') || src.startsWith('data:') || src.startsWith('blob:')) return undefined;
  return [640, 960, 1280, 1920]
    .map((width) => `${src}${src.includes('?') ? '&' : '?'}w=${width} ${width}w`)
    .join(', ');
};

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 768px) 100vw, 50vw',
  loading = 'lazy',
  fetchPriority,
  decoding = 'async',
  objectFit = 'cover',
  fallbackContent = null,
  webpSrc,
  onError,
  ...props
}) => {
  const [failed, setFailed] = useState(false);
  const safeWebpSrc = useMemo(() => toWebp(src, webpSrc), [src, webpSrc]);
  const numericWidth = Number(width) || 1200;
  const numericHeight = Number(height) || 675;
  const aspectRatio = `${numericWidth} / ${numericHeight}`;

  if (!src || failed) {
    return fallbackContent || null;
  }

  const image = (
    <img
      src={src}
      srcSet={buildSrcSet(src)}
      sizes={sizes}
      alt={alt || ''}
      width={numericWidth}
      height={numericHeight}
      loading={loading}
      decoding={decoding}
      fetchPriority={fetchPriority}
      className={className}
      // style={{ aspectRatio, objectFit, ...props.style }}
      onError={(event) => {
        setFailed(true);
        if (onError) onError(event);
      }}
      {...props}
    />
  );

  if (!safeWebpSrc || safeWebpSrc === src) return image;

  return (
    <picture>
      <source srcSet={buildSrcSet(safeWebpSrc) || safeWebpSrc} sizes={sizes} type="image/webp" />
      {image}
    </picture>
  );
};

export default OptimizedImage;
