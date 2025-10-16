// ✅ generate-sitemap.js
import fs from "fs";
import path from "path";
import https from "https";

const BASE_URL = "https://robiulislam.org"; // ← তোমার ডোমেইন
const ROOT_FOLDER = "./"; // প্রজেক্ট রুট ফোল্ডার

let pages = [];

// Recursive function — সব HTML ফাইল খুঁজে বের করবে
function readFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      readFiles(filePath);
    } else if (file.endsWith(".html")) {
      const relativePath = filePath.replace("./", "");
      const urlPath =
        relativePath === "index.html"
          ? ""
          : relativePath.replace(".html", "");
      pages.push(`${BASE_URL}/${urlPath}`);
    }
  });
}

readFiles(ROOT_FOLDER);

// Sitemap XML তৈরি
const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (url) => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

fs.writeFileSync("sitemap.xml", sitemapContent);
console.log("✅ Sitemap generated successfully!");

// Google-এ অটো সাবমিট
const sitemapUrl = `${BASE_URL}/sitemap.xml`;
https.get(`https://www.google.com/ping?sitemap=${sitemapUrl}`, (res) => {
  console.log("📡 Sitemap submitted to Google!");
});
