const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api\/?$/, '');
const assetBaseUrl = (import.meta.env.VITE_ASSETS_URL || apiBaseUrl).replace(/\/$/, '');

export const getImageUrl = (image) => {
  if (!image) return null;
  
  // If image is a string, use it directly
  if (typeof image === 'string') {
    if (/^https?:\/\//i.test(image) || image.startsWith('data:') || image.startsWith('blob:')) return image;
    if (!assetBaseUrl) return image;
    if (image.startsWith('/')) return `${assetBaseUrl}${image}`;
    return `${assetBaseUrl}/${image}`;
  }
  
  // If image is an object with url property
  if (image.url) {
    if (/^https?:\/\//i.test(image.url) || image.url.startsWith('data:') || image.url.startsWith('blob:')) return image.url;
    if (!assetBaseUrl) return image.url;
    if (image.url.startsWith('/')) return `${assetBaseUrl}${image.url}`;
    return `${assetBaseUrl}/${image.url}`;
  }
  
  return null;
};

export const getImageAlt = (image, fallback = '') => {
  if (!image || typeof image === 'string') return fallback;
  return image.alt || fallback;
};

export const getImagePlaceholder = (image, fallback = '') => {
  if (!image || typeof image === 'string') return fallback;
  return image.placeholder || fallback;
};
