import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDir = join(process.cwd(), "content");
const pagesDir = join(contentDir, "pages");
const newsDir = join(contentDir, "nieuws");
const clubsDir = join(contentDir, "clubs");

export interface PageFrontmatter {
  title?: string;
  excerpt?: string;
}

export interface NewsPostFrontmatter extends PageFrontmatter {
  date?: string;
}

export interface ClubFrontmatter extends PageFrontmatter {
  id?: string;
  name?: string;
  city?: string;
  address?: string;
  website?: string;
  logo?: string;
}

export interface PageContent {
  slug: string;
  frontmatter: PageFrontmatter;
  content: string;
}

export interface NewsPost extends PageContent {
  frontmatter: NewsPostFrontmatter;
}

export interface Club extends PageContent {
  frontmatter: ClubFrontmatter;
}

async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}

export async function getPageContent(slug: string): Promise<PageContent | null> {
  const filePath = join(pagesDir, `${slug}.md`);
  if (!existsSync(filePath)) return null;

  const fileContents = readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);
  const htmlContent = await markdownToHtml(content);

  return {
    slug,
    frontmatter: data as PageFrontmatter,
    content: htmlContent,
  };
}

export async function getAllNewsPosts(): Promise<NewsPost[]> {
  if (!existsSync(newsDir)) return [];

  const files = readdirSync(newsDir)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();

  const posts: NewsPost[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = join(newsDir, file);
    const fileContents = readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const htmlContent = await markdownToHtml(content);
    posts.push({
      slug,
      frontmatter: data as NewsPostFrontmatter,
      content: htmlContent,
    });
  }

  return posts.sort((a, b) => {
    const dateA = String(a.frontmatter.date ?? "");
    const dateB = String(b.frontmatter.date ?? "");
    return dateB.localeCompare(dateA);
  });
}

export async function getAllClubs(): Promise<Club[]> {
  if (!existsSync(clubsDir)) return [];

  const files = readdirSync(clubsDir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const clubs: Club[] = [];
  for (const file of files) {
    const slug = file.replace(/\.md$/, "");
    const filePath = join(clubsDir, file);
    const fileContents = readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);
    const htmlContent = await markdownToHtml(content);
    clubs.push({
      slug,
      frontmatter: data as ClubFrontmatter,
      content: htmlContent,
    });
  }

  return clubs;
}

export async function getClubBySlug(slug: string): Promise<Club | null> {
  const clubs = await getAllClubs();
  return clubs.find((c) => c.slug === slug) ?? null;
}

export async function getNewsPostBySlug(slug: string): Promise<NewsPost | null> {
  const posts = await getAllNewsPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}
