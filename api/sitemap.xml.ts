import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const SITE_URL = "https://nova-properties-rho.vercel.app";

const staticRoutes = [
  { url: "/", priority: "1.0", changefreq: "daily" },
  { url: "/properties/listings", priority: "0.9", changefreq: "daily" },
  { url: "/agents", priority: "0.8", changefreq: "weekly" },
  { url: "/about", priority: "0.7", changefreq: "monthly" },
  { url: "/contact", priority: "0.7", changefreq: "monthly" },
  { url: "/privacy-policy", priority: "0.3", changefreq: "yearly" },
  { url: "/terms-of-service", priority: "0.3", changefreq: "yearly" },
];

function buildUrl(
  path: string,
  priority: string,
  changefreq: string,
  lastmod?: string,
) {
  return `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${lastmod ?? new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`.trim();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL!,

      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );

    const { data: properties } = await supabase
      .from("properties")
      .select("_id, updatedAt")
      .eq("published", true);

    const { data: agents } = await supabase
      .from("agents")
      .select("_id, updatedAt");

    const staticEntries = staticRoutes.map(({ url, priority, changefreq }) =>
      buildUrl(url, priority, changefreq),
    );

    const propertyEntries = (properties ?? []).map((p) =>
      buildUrl(
        `/properties/${p._id}`,
        "0.8",
        "weekly",
        p.updatedAt
          ? new Date(p.updatedAt).toISOString().split("T")[0]
          : undefined,
      ),
    );

    const agentEntries = (agents ?? []).map((a) =>
      buildUrl(
        `/agents/${a._id}`,
        "0.6",
        "monthly",
        a.updatedAt
          ? new Date(a.updatedAt).toISOString().split("T")[0]
          : undefined,
      ),
    );

    const allEntries = [
      ...staticEntries,
      ...propertyEntries,
      ...agentEntries,
    ].join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allEntries}
</urlset>`;

    res.setHeader("Content-Type", "application/xml");

    res.setHeader(
      "Cache-Control",
      "s-maxage=3600, stale-while-revalidate=86400",
    );
    res.status(200).send(xml);
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    res.status(500).send("Failed to generate sitemap");
  }
}
