export const metadata = {
  title: "Privacy Policy | All Aspects Barn",
  description: "All Aspects at the Barn privacy policy: what information we collect and how we use it.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-5xl sm:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Privacy Policy
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md p-8">
            <p className="text-gray-700 mb-4">
              All Aspects at the Barn (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) respects
              your privacy. This policy explains what we collect when you visit
              allaspectsbarn.com and how we use it.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Information you provide
            </h2>
            <p className="text-gray-700 mb-4">
              We do not sell, trade, or rent your personal information. We collect
              only what you give us directly &mdash; your name, email address, phone
              number, and message &mdash; when you contact us. We use this solely to
              respond to your inquiry.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Technical information
            </h2>
            <p className="text-gray-700 mb-4">
              This site is hosted on Vercel. Like most websites, servers may log
              standard technical details (such as your IP address, browser, and
              device) for performance and security. This information is not used to
              identify you personally.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Links to other sites
            </h2>
            <p className="text-gray-700 mb-4">
              Our site may link to third-party services (such as social media). We
              are not responsible for the privacy practices of those services.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Contact us
            </h2>
            <p className="text-gray-700 mb-4">
              Have a question about this policy or your information? Contact us at{" "}
              <a
                href="mailto:allaspectsrecycled@gmail.com"
                className="text-indigo-600 hover:underline"
              >
                allaspectsrecycled@gmail.com
              </a>{" "}
              or call (570) 583-2305.
            </p>

            <p className="text-gray-500 text-sm mt-8">
              This policy was last updated when first published. We may revise it as
              our site changes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
