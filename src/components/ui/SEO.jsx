import React from 'react';
import { Helmet } from 'react-helmet-async';

const SITE_URL = 'https://gcaautomacaoeeletronica.com.br';
const SITE_NAME = 'GCA Automação Industrial';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const DEFAULT_KEYWORDS = [
  'automação industrial cuiabá',
  'montagem de painéis elétricos industriais mt',
  'manutenção de inversor de frequência cuiabá',
  'conserto de inversor danfoss mt',
  'venda de inversores weg mato grosso',
  'plataforma iot industrial teste grátis',
  'monitoramento de máquinas cuiabá',
  'assistência técnica weg várzea grande',
  'engenharia elétrica industrial cuiabá',
  'painéis elétricos industriais raio 700km cuiabá',
  'GCA automação mato grosso'
].join(', ');

const SEO = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = 'website',
  keywords,
  googleVerification,
  article = null,
  breadcrumbs = null,
}) => {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const pageUrl = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const imageUrl = ogImage || DEFAULT_IMAGE;
  const allKeywords = keywords ? `${keywords}, ${DEFAULT_KEYWORDS}` : DEFAULT_KEYWORDS;

  // Schema.org BreadcrumbList
  const breadcrumbSchema = breadcrumbs ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Início", "item": SITE_URL },
      ...breadcrumbs.map((b, i) => ({
        "@type": "ListItem",
        "position": i + 2,
        "name": b.name,
        "item": `${SITE_URL}${b.path}`
      }))
    ]
  } : null;

  // Schema.org Article (para posts de blog)
  const articleSchema = article ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": description,
    "image": imageUrl,
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": { "@type": "ImageObject", "url": `${SITE_URL}/logo.png` }
    },
    "datePublished": article.datePublished,
    "dateModified": article.dateModified || article.datePublished,
    "mainEntityOfPage": { "@type": "WebPage", "@id": pageUrl }
  } : null;

  return (
    <Helmet>
      {/* === BÁSICO === */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={SITE_NAME} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      {googleVerification && <meta name="google-site-verification" content={googleVerification} />}
      <link rel="canonical" href={pageUrl} />

      {/* === OPEN GRAPH (Facebook / LinkedIn / WhatsApp) === */}
      <meta property="og:locale" content="pt_BR" />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:secure_url" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${SITE_NAME} - ${title}`} />

      {/* === TWITTER CARDS === */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@gcaautomacao" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={`${SITE_NAME} - ${title}`} />

      {/* === GEO TAGS (Busca local) === */}
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="Americana, São Paulo, Brasil" />
      <meta name="geo.position" content="-22.7392;-47.3311" />
      <meta name="ICBM" content="-22.7392, -47.3311" />

      {/* === BING / MICROSOFT === */}
      <meta name="MSSmartTagsPreventParsing" content="true" />

      {/* === APPLE / iOS === */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />

      {/* === SCHEMA.ORG: BreadcrumbList === */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* === SCHEMA.ORG: Article (Blog) === */}
      {articleSchema && (
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;
