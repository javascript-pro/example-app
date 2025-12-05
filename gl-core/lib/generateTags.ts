// /lib/generateTags.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const MARKDOWN_ROOT = path.join(process.cwd(), 'public/markdown');
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'tags.json');

type PageMeta = {
  title: string;
  slug: string;
  excerpt?: string;
  icon?: string;
  image?: string;
  description?: string;
  paywall?: boolean;
  newContent?: boolean;
  tags?: string[];
};

function extractExcerpt(content: string): string {
  return content
    .replace(/<!--.*?-->/gs, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/`{1,3}.*?`{1,3}/gs, '')
    .replace(/[#>*_`-]/g, '')
    .trim()
    .slice(0, 200);
}

function parseTags(rawTags?: string): string[] | undefined {
  if (!rawTags) return undefined;
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseBoolean(v: any): boolean | undefined {
  if (v === true) return true;
  if (typeof v === 'string') {
    const s = v.toLowerCase().trim();
    if (['true', 'yes', '1'].includes(s)) return true;
  }
  return undefined;
}

function createSlugFromSegments(segments: string[]): string {
  return '/' + segments.filter(Boolean).join('/').replace(/\/+/g, '/');
}

/**
 * Recursively scan markdown and return all pages with metadata.
 */
export async function getAllMarkdownPages(
  dir: string,
  segments: string[] = [],
  results: PageMeta[] = [],
): Promise<PageMeta[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  // Parse index.md as a page
  const indexPath = path.join(dir, 'index.md');
  try {
    const raw = await fs.readFile(indexPath, 'utf8');
    const { data, content } = matter(raw);

    results.push({
      title: data.title || segments[segments.length - 1] || 'Untitled',
      slug: createSlugFromSegments(segments),
      excerpt: extractExcerpt(content),
      icon: data.icon,
      image: data.image,
      description: data.description,
      newContent: parseBoolean(data.newContent),
      paywall: parseBoolean(data.paywall),
      tags: parseTags(data.tags),
    });
  } catch {
    // no index.md here
  }

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await getAllMarkdownPages(full, [...segments, entry.name], results);
    }

    if (
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      entry.name !== 'index.md'
    ) {
      const raw = await fs.readFile(full, 'utf8');
      const { data, content } = matter(raw);
      const base = entry.name.replace(/\.md$/, '');
      const pageSegments = [...segments, base];

      results.push({
        title: data.title || base,
        slug: createSlugFromSegments(pageSegments),
        excerpt: extractExcerpt(content),
        icon: data.icon,
        image: data.image,
        description: data.description,
        newContent: parseBoolean(data.newContent),
        paywall: parseBoolean(data.paywall),
        tags: parseTags(data.tags),
      });
    }
  }

  return results;
}

/**
 * Build an object describing tag relationships across all markdown pages.
 */
export async function generateTags() {
  const pages = await getAllMarkdownPages(MARKDOWN_ROOT);

  const tagMap: Record<
    string,
    {
      count: number;
      pages: PageMeta[];
    }
  > = {};

  for (const page of pages) {
    if (!page.tags) continue;

    for (const tag of page.tags) {
      if (!tagMap[tag]) {
        tagMap[tag] = {
          count: 0,
          pages: [],
        };
      }
      tagMap[tag].pages.push(page);
      tagMap[tag].count++;
    }
  }

  await fs.writeFile(OUTPUT_PATH, JSON.stringify(tagMap, null, 2));
  console.log(`✅ Generated tags.json`);
}

// Allow direct execution
if (process.argv[1] === __filename) {
  generateTags().catch((err) => {
    console.error('❌ Failed to generate tags.json', err);
    process.exit(1);
  });
}
