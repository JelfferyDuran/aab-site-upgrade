import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();

async function readJson(relativePath) {
  const absolutePath = resolve(root, relativePath);
  const source = await readFile(absolutePath, "utf8");
  return JSON.parse(source);
}

function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exitCode = 1;
}

function warn(message) {
  console.warn(`WARN: ${message}`);
}

function assertArray(value, label) {
  if (!Array.isArray(value)) {
    fail(`${label} must be a JSON array.`);
    return false;
  }
  return true;
}

function normalizeRoute(route) {
  return String(route || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
}

const [products, pages, gallery, finds] = await Promise.all([
  readJson("src/data/products.json"),
  readJson("src/data/pages.json"),
  readJson("src/data/gallery.json"),
  readJson("src/data/finds.json"),
]);

if (!assertArray(products, "products.json")) process.exit();
if (!assertArray(pages, "pages.json")) process.exit();
if (!assertArray(gallery, "gallery.json")) process.exit();
if (!assertArray(finds, "finds.json")) process.exit();

const productSlugs = new Set();
let productsWithoutImages = 0;
let productsWithoutBodies = 0;
let productsWithoutRoutableSlugs = 0;
let duplicateProductSlugs = 0;

for (const [index, product] of products.entries()) {
  if (!product || typeof product !== "object") {
    fail(`products.json[${index}] is not an object.`);
    continue;
  }

  const title = String(product.title || "").trim();
  const slug = String(product.slug || "").trim();

  if (!title) fail(`products.json[${index}] is missing a title.`);

  if (!slug || slug === "undefined" || slug === "null") {
    productsWithoutRoutableSlugs += 1;
  } else if (productSlugs.has(slug)) {
    duplicateProductSlugs += 1;
  } else {
    productSlugs.add(slug);
  }

  if (!Array.isArray(product.images)) {
    fail(`Product ${slug || index} has a non-array images field.`);
  } else if (product.images.length === 0) {
    productsWithoutImages += 1;
  }

  if (!String(product.body || "").trim()) productsWithoutBodies += 1;
}

const pageRoutes = new Set();
for (const [index, page] of pages.entries()) {
  if (!page || typeof page !== "object") {
    fail(`pages.json[${index}] is not an object.`);
    continue;
  }

  const route = normalizeRoute(page.route);
  if (!route) {
    warn(`pages.json[${index}] has no route; it will not create a content route.`);
    continue;
  }

  if (pageRoutes.has(route)) {
    warn(`Duplicate content route in pages.json: ${route}`);
  } else {
    pageRoutes.add(route);
  }
}

for (const [label, collection] of [
  ["gallery.json", gallery],
  ["finds.json", finds],
]) {
  for (const [index, image] of collection.entries()) {
    if (!image || typeof image !== "object") {
      fail(`${label}[${index}] is not an object.`);
      continue;
    }
    if (!String(image.src || "").trim()) fail(`${label}[${index}] is missing src.`);
    if (!String(image.alt || "").trim()) warn(`${label}[${index}] is missing alt text.`);
  }
}

if (productsWithoutRoutableSlugs) {
  warn(`${productsWithoutRoutableSlugs} product rows do not have routable slugs and will be excluded from static product routes.`);
}
if (duplicateProductSlugs) warn(`${duplicateProductSlugs} duplicate product slugs were found in imported catalog data.`);
if (productsWithoutImages) warn(`${productsWithoutImages} products have no images.`);
if (productsWithoutBodies) warn(`${productsWithoutBodies} products have no body copy.`);

if (!process.exitCode) {
  console.log(
    `Content OK: ${products.length.toLocaleString()} products, ${productSlugs.size.toLocaleString()} unique product routes, ${pageRoutes.size.toLocaleString()} content routes, ${gallery.length.toLocaleString()} gallery images, ${finds.length.toLocaleString()} shop-floor images.`,
  );
}
