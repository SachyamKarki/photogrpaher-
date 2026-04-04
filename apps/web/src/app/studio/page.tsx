export default function StudioPage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-heading mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Sanity Studio
          </h1>
          <p className="mt-4 text-zinc-600">
          The Studio runs as a separate app.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6">
          <p className="text-sm text-zinc-700">
            Start it from the repo root:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-xl bg-zinc-900 p-4 text-sm text-zinc-50">
            <code>npm run dev:studio</code>
          </pre>
          <p className="mt-4 text-sm text-zinc-700">
            Then open:
            <a
              className="ml-2 font-medium text-zinc-900 underline underline-offset-4"
              href="http://localhost:3333"
              target="_blank"
              rel="noreferrer"
            >
              http://localhost:3333
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
