"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-stone-50 text-stone-900 flex items-center justify-center px-6">
        <main className="max-w-lg text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-700">
            All Aspects at the Barn
          </p>
          <h1 className="mt-4 text-4xl font-bold">Something went wrong</h1>
          <p className="mt-4 text-stone-600">
            The page hit an unexpected error. You can retry without losing your place.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/30"
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
