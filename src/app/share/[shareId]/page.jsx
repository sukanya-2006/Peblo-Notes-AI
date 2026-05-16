import { prisma } from "@/lib/prisma";

export default async function SharedNotePage({
  params,
}) {
  const { shareId } = await params;

  const note = await prisma.note.findUnique({
    where: {
      shareId,
    },
  });

  if (!note) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Note not found
        </h1>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">
      <div className="max-w-4xl mx-auto bg-zinc-900 rounded-3xl p-10">
        <p className="text-sm text-zinc-400 mb-4">
          Shared Note
        </p>

        <h1 className="text-5xl font-bold mb-6">
          {note.title}
        </h1>

        <p className="text-zinc-300 whitespace-pre-wrap text-lg leading-8">
          {note.content}
        </p>
      </div>
    </main>
  );
}