import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 pt-24">
      <div className="text-center max-w-xl">
        <p
          className="text-6xl mb-2 text-indigo-600"
          style={{ fontFamily: "var(--font-dancing)" }}
        >
          Well, hay there!
        </p>
        <h1
          className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          We couldn&apos;t find that page
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you&apos;re looking for may have been moved, sold, or never
          existed. Let us point you back to the good stuff.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-full transition-all"
          >
            Back Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold rounded-full transition-all"
          >
            Browse the Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
