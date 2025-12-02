// /Users/goldlabel/GitHub/example-app/gl-core/lib/generateSitemap.ts
import fs from 'fs/promises';
import path from 'path';

const MARKDOWN_ROOT = path.join(process.cwd(), 'public/markdown');
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'sitemap.xml');
const BASE_URL = 'https://goldlabel.pro';

// Always accumulate path segments as an array
async function getAllMarkdownSlugs(
  dir: string,
  segments: string[] = [],
): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  const slugs: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Push the folder name as a new segment
      const nextSegments = [...segments, entry.name];
      const childSlugs = await getAllMarkdownSlugs(fullPath, nextSegments);
      slugs.push(...childSlugs);
    }

    if (entry.isFile() && entry.name.endsWith('.md')) {
      if (entry.name === 'index.md') {
        // Folder index: use the path so far, or "/" for the root
        const slug = segments.length === 0 ? '/' : '/' + segments.join('/');
        slugs.push(slug);
      } else {
        // File: add file name (without extension) as a segment
        const baseName = entry.name.replace(/\.md$/, '');
        const slug = '/' + [...segments, baseName].join('/');
        slugs.push(slug);
      }
    }
  }

  return slugs;
}

function generateSitemapXml(slugs: string[]): string {
  const urls = slugs
    .map((slug) => {
      const fullUrl = BASE_URL + slug; // No new URL() needed; always absolute
      return `
  <url>
    <loc>${fullUrl}</loc>
  </url>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export async function generateSitemap() {
  const slugs = await getAllMarkdownSlugs(MARKDOWN_ROOT);
  const xml = generateSitemapXml(slugs);
  await fs.writeFile(OUTPUT_PATH, xml);
  console.log(`✅ Generated Sitemap at /sitemap.xml`);
}
