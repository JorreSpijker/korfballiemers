import type { MetadataRoute } from "next";
import { getAllNewsPosts, getAllSpeelsteden } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, steden] = await Promise.all([getAllNewsPosts(), getAllSpeelsteden()]);
  const latestNews = posts[0]?.frontmatter.date ? new Date(posts[0].frontmatter.date) : undefined;

  return [
    { url: SITE_URL, lastModified: latestNews, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/wk-korfbal-2027`, changeFrequency: "monthly", priority: 0.9 },
    ...steden.map((stad) => ({
      url: `${SITE_URL}/wk-korfbal-2027/${stad.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${SITE_URL}/nieuws`, lastModified: latestNews, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((post) => ({
      url: `${SITE_URL}/nieuws/${post.slug}`,
      lastModified: post.frontmatter.date ? new Date(post.frontmatter.date) : undefined,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/vrijwilliger-worden`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/sponsor-worden`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
