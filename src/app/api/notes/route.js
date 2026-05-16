// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function GET(req) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const tag = searchParams.get("tag") || "";
//     const archived = searchParams.get("archived") === "true";

//     const where = {
//       // Match archived:false AND archived:null (pre-existing rows without the field set)
//       archived: archived ? true : { not: true },
//       ...(search && {
//         OR: [
//           { title: { contains: search, mode: "insensitive" } },
//           { content: { contains: search, mode: "insensitive" } },
//         ],
//       }),
//       ...(tag && { tags: { has: tag } }),
//     };

//     const notes = await prisma.note.findMany({
//       where,
//       orderBy: { updatedAt: "desc" },
//     });

//     return NextResponse.json(notes);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to fetch notes" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(req) {
//   try {
//     const body = await req.json();

//     const note = await prisma.note.create({
//       data: {
//         title: body.title || "Untitled Note",
//         content: body.content || "",
//         tags: [],
//         actionItems: [],
//       },
//     });

//     return NextResponse.json(note);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to create note" },
//       { status: 500 }
//     );
//   }
// }

// export async function PATCH(req) {
//   try {
//     const body = await req.json();
//     const { id, ...fields } = body;

//     if (!id) {
//       return NextResponse.json({ error: "Note id is required" }, { status: 400 });
//     }

//     // Only persist fields that were actually sent
//     const data = {};
//     if ("title" in fields) data.title = fields.title;
//     if ("content" in fields) data.content = fields.content;
//     if ("tags" in fields) data.tags = fields.tags;
//     if ("archived" in fields) data.archived = fields.archived;
//     if ("isPublic" in fields) data.isPublic = fields.isPublic;
//     if ("summary" in fields) data.summary = fields.summary;
//     if ("actionItems" in fields) data.actionItems = fields.actionItems;
//     if ("aiUsed" in fields) data.aiUsed = fields.aiUsed;
//     if ("suggestedTitle" in fields) data.suggestedTitle = fields.suggestedTitle;

//     // Always bump updatedAt on every save
//     data.updatedAt = new Date();

//     const note = await prisma.note.update({
//       where: { id },
//       data,
//     });

//     return NextResponse.json(note);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to update note" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(req) {
//   try {
//     const body = await req.json();

//     await prisma.note.delete({
//       where: { id: body.id },
//     });

//     return NextResponse.json({ message: "Note deleted" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Failed to delete note" },
//       { status: 500 }
//     );
//   }
// }








import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || "";
    const tag = searchParams.get("tag") || "";
    const archived =
      searchParams.get("archived") === "true";

    const where = {
      archived: archived ? true : { not: true },

      ...(search && {
        OR: [
          {
            title: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }),

      ...(tag && {
        tags: {
          has: tag,
        },
      }),
    };

    const notes = await prisma.note.findMany({
      where,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to fetch notes",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    const note = await prisma.note.create({
      data: {
        title:
          body.title || "Untitled Note",

        content:
          body.content || "",

        tags: [],

        actionItems: [],

        shareId:
          crypto.randomUUID(),

        isPublic: true,

        archived: false,

        aiUsed: false,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to create note",
      },
      {
        status: 500,
      }
    );
  }
}

export async function PATCH(req) {
  try {
    const body = await req.json();

    const { id, ...fields } = body;

    if (!id) {
      return NextResponse.json(
        {
          error: "Note id is required",
        },
        {
          status: 400,
        }
      );
    }

    const data = {};

    if ("title" in fields)
      data.title = fields.title;

    if ("content" in fields)
      data.content = fields.content;

    if ("tags" in fields)
      data.tags = fields.tags;

    if ("archived" in fields)
      data.archived = fields.archived;

    if ("isPublic" in fields)
      data.isPublic = fields.isPublic;

    if ("summary" in fields)
      data.summary = fields.summary;

    if ("actionItems" in fields)
      data.actionItems =
        fields.actionItems;

    if ("aiUsed" in fields)
      data.aiUsed = fields.aiUsed;

    if ("suggestedTitle" in fields)
      data.suggestedTitle =
        fields.suggestedTitle;

    if ("pinned" in fields)
      data.pinned = fields.pinned;

    data.updatedAt = new Date();

    const note = await prisma.note.update({
      where: {
        id,
      },

      data,
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to update note",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(req) {
  try {
    const body = await req.json();

    await prisma.note.delete({
      where: {
        id: body.id,
      },
    });

    return NextResponse.json({
      message: "Note deleted",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete note",
      },
      {
        status: 500,
      }
    );
  }
}









































































































































































// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { nanoid } from "nanoid";
// import { createClient } from "@supabase/supabase-js";

// function getSupabaseUser(req) {
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//   );
//   const token = req.headers.get("authorization")?.replace("Bearer ", "");
//   return { supabase, token };
// }

// async function getUserId(req) {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader) return null;
//   const token = authHeader.replace("Bearer ", "");
//   const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
//   );
//   const { data: { user } } = await supabase.auth.getUser(token);
//   return user?.id || null;
// }

// export async function GET(req) {
//   try {
//     const userId = await getUserId(req);
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const search = searchParams.get("search") || "";
//     const tag = searchParams.get("tag") || "";
//     const archived = searchParams.get("archived") === "true";

//     let where = { userId, archived };
//     if (tag) where.tags = { has: tag };
//     if (search) {
//       where.OR = [
//         { title: { contains: search, mode: "insensitive" } },
//         { content: { contains: search, mode: "insensitive" } },
//       ];
//     }

//     const notes = await prisma.note.findMany({
//       where,
//       orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
//     });

//     return NextResponse.json(notes);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   try {
//     const userId = await getUserId(req);
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const note = await prisma.note.create({
//       data: {
//         title: body.title || "Untitled Note",
//         content: body.content || "",
//         tags: body.tags || [],
//         actionItems: [],
//         userId,
//       },
//     });
//     return NextResponse.json(note, { status: 201 });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
//   }
// }

// export async function PATCH(req) {
//   try {
//     const userId = await getUserId(req);
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     const { id, ...updates } = body;
//     if (!id) return NextResponse.json({ error: "Note ID required" }, { status: 400 });

//     // Generate shareId if making public
//     if (updates.isPublic === true) {
//       const existing = await prisma.note.findUnique({ where: { id } });
//       if (existing && !existing.shareId) {
//         updates.shareId = nanoid(12);
//       }
//     }

//     const note = await prisma.note.update({
//       where: { id, userId },
//       data: { ...updates, updatedAt: new Date() },
//     });
//     return NextResponse.json(note);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
//   }
// }

// export async function DELETE(req) {
//   try {
//     const userId = await getUserId(req);
//     if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await req.json();
//     await prisma.note.delete({ where: { id: body.id, userId } });
//     return NextResponse.json({ message: "Note deleted" });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
//   }
// }