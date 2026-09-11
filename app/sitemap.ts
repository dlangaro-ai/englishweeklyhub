import type { MetadataRoute } from "next";

const siteUrl = "https://tedank5.vercel.app";
const totalWeeks = 40;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/resources`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/completed`, changeFrequency: "weekly", priority: 0.5 },
  ];

  const weekRoutes: MetadataRoute.Sitemap = Array.from(
    { length: totalWeeks },
    (_, i) => ({
      url: `${siteUrl}/week/${i + 1}`,
      changeFrequency: "monthly",
      priority: 0.7,
    })
  );

  return [...staticRoutes, ...weekRoutes];
}
