import {
  NextRequest,
  NextResponse,
} from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/core/database/supabase-admin";
import { buildKnowledgeGraph } from "@/core/knowledge-graph/builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 90;

const QuerySchema = z.object({
  businessId: z.string().uuid(),
});

export async function GET(
  request: NextRequest,
) {
  try {
    const { businessId } =
      QuerySchema.parse({
        businessId:
          request.nextUrl.searchParams.get(
            "businessId",
          ),
      });

    const supabase =
      getSupabaseAdmin();

    const [
      businessResult,
      nodesResult,
      edgesResult,
      snapshotResult,
    ] = await Promise.all([
      supabase
        .from("businesses")
        .select(
          "id, name, sector, city, primary_goal",
        )
        .eq("id", businessId)
        .single(),

      supabase
        .from("knowledge_nodes")
        .select("*")
        .eq("business_id", businessId)
        .order("node_type")
        .order("label"),

      supabase
        .from("knowledge_edges")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at"),

      supabase
        .from("knowledge_graph_snapshots")
        .select("*")
        .eq("business_id", businessId)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle(),
    ]);

    const error =
      businessResult.error ||
      nodesResult.error ||
      edgesResult.error ||
      snapshotResult.error;

    if (error) {
      throw new Error(
        error.message,
      );
    }

    return NextResponse.json({
      status: "completed",

      business:
        businessResult.data,

      snapshot:
        snapshotResult.data,

      nodes:
        nodesResult.data ?? [],

      edges:
        edgesResult.data ?? [],
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Business ID non valido.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function POST(
  request: NextRequest,
) {
  try {
    const body =
      QuerySchema.parse(
        await request.json(),
      );

    const result =
      await buildKnowledgeGraph(
        body.businessId,
      );

    return NextResponse.json(
      {
        status: "completed",
        result,
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error(
      "Knowledge Graph build error:",
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          status: "failed",
          error:
            "Business ID non valido.",
        },
        {
          status: 400,
        },
      );
    }

    return NextResponse.json(
      {
        status: "failed",
        error:
          error instanceof Error
            ? error.message
            : "Errore sconosciuto.",
      },
      {
        status: 500,
      },
    );
  }
}
