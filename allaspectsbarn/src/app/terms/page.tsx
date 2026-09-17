export const metadata = {
  title: "Terms of Service",
  description: "Terms of service for visiting and using allaspectsbarn.com.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col pt-16 lg:pt-20">
      {/* Hero */}
      <section className="relative py-20 bg-gradient-to-br from-indigo-900 via-indigo-800 to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-5xl sm:text-6xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Terms of Service
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 aab-band-warm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="aab-card-warm rounded-2xl shadow-md p-8">
            <p className="text-gray-700 mb-4">
              These Terms of Service govern your use of allaspectsbarn.com. Please
              read them carefully.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Use of the site
            </h2>
            <p className="text-gray-700 mb-4">
              The site and its content are provided &quot;as is&quot; and &quot;as
              available.&quot; We do not guarantee that the site will always be
              available, uninterrupted, or error-free, and we do not warrant the
              accuracy or completeness of any content.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Events, classes, and products
            </h2>
            <p className="text-gray-700 mb-4">
              Event bookings, classes, and product availability are subject to change.
              Any arrangement is subject to our confirmation and policies in effect at
              the time.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Intellectual property
            </h2>
            <p className="text-gray-700 mb-4">
              All content on this site (text, images, logos, designs) is the property
              of All Aspects at the Barn or its licensors and may not be reproduced
              without our permission.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              External links
            </h2>
            <p className="text-gray-700 mb-4">
              Links to third-party sites are provided for convenience and do not imply
              endorsement or affiliation.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Changes
            </h2>
            <p className="text-gray-700 mb-4">
              We may update these terms from time to time. Changes are effective when
              posted on this page.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">
              Contact
            </h2>
            <p className="text-gray-700 mb-4">
              Questions? Contact us at{" "}
              <a
                href="mailto:allaspectsrecycled@gmail.com"
                className="text-indigo-600 hover:underline"
              >
                allaspectsrecycled@gmail.com
              </a>{" "}
              or call (570) 583-2305.
            </p>

            <p className="text-gray-500 text-sm mt-8">
              Last updated when first published.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
