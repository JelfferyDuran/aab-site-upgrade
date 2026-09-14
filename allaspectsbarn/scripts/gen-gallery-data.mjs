import fs from "fs";
import path from "path";

const IMAGE_DIR = path.join(process.cwd(), "public/images");
const OUTPUT_PATH = path.join(process.cwd(), "src/data/gallery.json");

function getImageCategory(filename) {
  const num = parseInt(filename.replace("IMG_", "").replace(".jpg", ""));
  if (isNaN(num)) return undefined;
  
  if (num >= 1280 && num <= 1290) return "Life at the Barn";
  if (num >= 1291 && num <= 1300) return "Refinished & Ready";
  if (num >= 1301 && num <= 1310) return "Around the Property";
  if (num >= 1311 && num <= 1320) return "Seasons at the Barn";
  if (num >= 1321 && num <= 1330) return "Finds from the Shop";
  if (num >= 1331 && num <= 1340) return "Shop Moments";
  if (num >= 1341 && num <= 1350) return "Barn Inventory";
  if (num >= 1351 && num <= 1360) return "Antiques & Primitives";
  if (num >= 1361 && num <= 1370) return "Home Decor";
  if (num >= 1371 && num <= 1380) return "Details";
  if (num >= 1381 && num <= 1390) return "Vintage Finds";
  if (num >= 1391 && num <= 1400) return "Route 611";
  if (num >= 1401 && num <= 1437) return "More to Explore";
  return undefined;
}

function getAltText(filename, category) {
  const num = parseInt(filename.replace("IMG_", "").replace(".jpg", ""));
  const baseAlt = `All Aspects Barn photo ${num}`;
  if (category) return `${baseAlt} — ${category}`;
  return baseAlt;
}

const files = fs.readdirSync(IMAGE_DIR)
  .filter(f => f.endsWith(".jpg") || f.endsWith(".jpeg") || f.endsWith(".png"))
  .sort();

const images = files.map(f => {
  const category = getImageCategory(f);
  return {
    src: `/images/${f}`,
    alt: getAltText(f, category),
    category,
  };
});

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(images, null, 2));
console.log(`Generated ${images.length} gallery images`);
console.log(`Categories: ${[...new Set(images.map(i => i.category).filter(Boolean))].join(", ")}`);
