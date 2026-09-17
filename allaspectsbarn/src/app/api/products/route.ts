import { NextRequest, NextResponse } from "next/server";
import { getCatalogPage } from "@/lib/catalog";

const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=3600";

export function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const query = searchParams.get("q") || "";
  const page = Number(searchParams.get("page") || "1");
  const perPage = Number(searchParams.get("limit") || "30");

  const result = getCatalogPage({ query, page, perPage });

  return NextResponse.json(result, {
    headers: {
      "Cache-Control": CACHE_CONTROL,
    },
  });
}
