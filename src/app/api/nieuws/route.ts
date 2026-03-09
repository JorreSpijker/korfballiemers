import { NextResponse } from "next/server";
import { getAllNewsPosts } from "@/lib/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitParam = Number(searchParams.get("limit") ?? "6");
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 24)
    : 6;

  const posts = await getAllNewsPosts();
  const news = posts.slice(0, limit).map((post) => ({
    slug: post.slug,
    title: post.frontmatter.title ?? post.slug,
    excerpt: post.frontmatter.excerpt ?? "",
    date: post.frontmatter.date ?? "",
  }));

  return NextResponse.json({ news });
}
