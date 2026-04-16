import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
  title, 
  description, 
  canonical, 
  ogImage, 
  ogType = 'website',
  keywords = 'automação industrial, manutenção eletrônica, conserto de inversores, americana sp, indramat, bosch rexroth, reparo industrial'
}) => {
  const siteName = 'GCA Automação';
  const fullTitle = `${title} | ${siteName}`;
  const siteUrl = 'https://gcaautomacao.vercel.app'; // URL base do site

  return (
    <Helmet>
      {/* Tags Básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonical ? `${siteUrl}${canonical}` : siteUrl} />

      {/* Open Graph / Facebook / LinkedIn */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage || `${siteUrl}/og-image.jpg`} />
      <meta property="og:url" content={canonical ? `${siteUrl}${canonical}` : siteUrl} />
      <meta property="og:site_name" content={siteName} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage || `${siteUrl}/og-image.jpg`} />

      {/* Robots */}
      <meta name="robots" content="index, follow" />
      
      {/* Geo Tags para busca local (Americana-SP) */}
      <meta name="geo.region" content="BR-SP" />
      <meta name="geo.placename" content="Americana" />
      <meta name="geo.position" content="-22.7392;-47.3311" />
      <meta name="ICBM" content="-22.7392, -47.3311" />

      {/* JSON-LD Dados Estruturados (LocalBusiness) */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "name": "GCA Automação e Eletrônica Industrial",
          "image": `${siteUrl}/logo.png`,
          "@id": siteUrl,
          "url": siteUrl,
          "telephone": "+551930126360",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "Rua São Bento, Nº 44",
            "addressLocality": "Americana",
            "addressRegion": "SP",
            "postalCode": "13473-765",
            "addressCountry": "BR"
          },
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": -22.739228,
            "longitude": -47.331139
          },
          "openingHoursSpecification": {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday"
            ],
            "opens": "08:00",
            "closes": "18:00"
          },
          "sameAs": [
             "https://www.linkedin.com/company/gca-automacao-industrial"
          ]
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
