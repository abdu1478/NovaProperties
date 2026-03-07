import { Helmet } from "react-helmet-async";
import { useMatches } from "react-router-dom";

interface RouteMeta {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  structuredData?: object;
  ogImage?: string;
  ogType?: string;
}

export function SeoHead() {
  const matches = useMatches();

  const meta = matches
    .slice()
    .reverse()
    .find((m) => (m.handle as RouteMeta)?.title)?.handle as
    | RouteMeta
    | undefined;

  if (!meta) return null;

  const siteUrl = import.meta.env.VITE_FRONTEND_URL;
  const defaultImage = `${siteUrl}/og-default.jpg`;
  const title = meta.title ?? "Nova Properties";
  const description = meta.description ?? "Luxury real estate in Addis Ababa.";
  const canonical = meta.canonical ?? siteUrl;
  const robots = meta.robots ?? "index, follow";
  const ogImage = meta.ogImage ?? defaultImage;
  const ogType = meta.ogType ?? "website";

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={canonical} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Nova Properties" />
      <meta property="og:locale" content="en_US" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {meta.structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(meta.structuredData)}
        </script>
      )}
    </Helmet>
  );
}
