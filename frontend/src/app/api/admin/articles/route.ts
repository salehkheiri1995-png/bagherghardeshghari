import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { extractUserFromRequest } from "@/lib/auth";

// GET all articles (admin)
export async function GET(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    const category = url.searchParams.get("category");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { titleEn: { contains: search } },
      ];
    }

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        include: { author: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.article.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Admin get articles error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// POST create article (admin)
export async function POST(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { title, titleEn, content, contentEn, excerpt, excerptEn, category, tags, image } = body;

    if (!title || !titleEn) {
      return NextResponse.json({ success: false, error: "Title is required" }, { status: 400 });
    }

    const slug = titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const article = await prisma.article.create({
      data: {
        title, titleEn, slug, content: content || "", contentEn: contentEn || "",
        excerpt: excerpt || "", excerptEn: excerptEn || "",
        category: category || "TRAVEL_GUIDE",
        tags: JSON.stringify(tags || []),
        image: image || "",
        authorId: authUser.userId,
        isPublished: false,
      },
    });

    return NextResponse.json({ success: true, data: article, message: "Article created" }, { status: 201 });
  } catch (error) {
    console.error("Admin create article error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// PUT update article (admin)
export async function PUT(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { articleId, ...updateData } = body;

    if (!articleId) {
      return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
    }

    if (updateData.tags) updateData.tags = JSON.stringify(updateData.tags);
    if (updateData.titleEn) {
      updateData.slug = updateData.titleEn.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    }

    const article = await prisma.article.update({
      where: { id: articleId },
      data: updateData,
    });

    return NextResponse.json({ success: true, data: article, message: "Article updated" });
  } catch (error) {
    console.error("Admin update article error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

// DELETE article (admin)
export async function DELETE(request: Request) {
  try {
    const authUser = extractUserFromRequest(request);
    if (!authUser || (authUser.role !== "ADMIN" && authUser.role !== "SUPER_ADMIN")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const url = new URL(request.url);
    const articleId = url.searchParams.get("articleId");

    if (!articleId) {
      return NextResponse.json({ success: false, error: "Article ID is required" }, { status: 400 });
    }

    await prisma.article.delete({ where: { id: articleId } });

    return NextResponse.json({ success: true, message: "Article deleted" });
  } catch (error) {
    console.error("Admin delete article error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
