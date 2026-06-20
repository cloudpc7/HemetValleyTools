import React, { useEffect } from 'react';

/**
 * High-Performance Client-Side SEO Component for Hemet Valley Tools.
 * Dynamically updates document title, meta descriptions, keywords, Open Graph, Twitter Cards,
 * and handles secure insertion/cleanup of structured JSON-LD Schema markup on page changes.
 */
const SEO = ({ title, description, keywords, ogType = 'website', ogImage, schema }) => {
  useEffect(() => {
    // 1. Update document title
    if (title) {
      document.title = title;
    }

    // Helper to find or create a meta tag dynamically
    const updateMetaTag = (attrName, attrValue, contentValue) => {
      if (!contentValue) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', contentValue);
    };

    // 2. Update meta description
    updateMetaTag('name', 'description', description);

    // 3. Update meta keywords
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // 4. Update Open Graph Tags
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'og:url', window.location.href);
    
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
    } else {
      // Default fallback image path
      updateMetaTag('property', 'og:image', '/assets/hemet_valley_logo_clean-DamuFsws.png');
    }

    // 5. Update Twitter Card Tags
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    if (ogImage) {
      updateMetaTag('name', 'twitter:image', ogImage);
    } else {
      updateMetaTag('name', 'twitter:image', '/assets/hemet_valley_logo_clean-DamuFsws.png');
    }

    // 6. Manage JSON-LD Schema Script Tag
    let scriptEl = null;
    if (schema) {
      scriptEl = document.createElement('script');
      scriptEl.type = 'application/ld+json';
      scriptEl.id = 'json-ld-schema';
      scriptEl.text = JSON.stringify(schema);
      document.head.appendChild(scriptEl);
    }

    // Cleanup script and unneeded tags on unmount to prevent head bloat
    return () => {
      if (scriptEl && scriptEl.parentNode) {
        scriptEl.parentNode.removeChild(scriptEl);
      }
    };
  }, [title, description, keywords, ogType, ogImage, schema]);

  return null; // Side-effect only component
};

export default SEO;
