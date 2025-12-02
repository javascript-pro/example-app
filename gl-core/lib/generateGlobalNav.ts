// /Users/goldlabel/GitHub/example-app/gl-core/lib/generateGlobalNav.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

const MARKDOWN_ROOT = path.join(process.cwd(), 'public/markdown');
const OUTPUT_PATH = path.join(process.cwd(), 'public', 'globalNav.json');

type NavNode = {
  title: string;
  slug: string;
  order?: number;
  icon?: string;
  image?: string;
  type: 'folder' | 'file';
  tags?: string[];
  excerpt?: string;
  description?: string;
  newContent?: boolean;
  paywall?: boolean;
  children?: NavNode[];
};

/**
 * Extracts a short text summary from markdown content.
 */
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

/**
 * Parses comma-separated tags from frontmatter.
 */
function parseTags(rawTags?: string): string[] | undefined {
  if (!rawTags) return undefined;
  return rawTags
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Coerce frontmatter values to boolean.
 */
function parseBoolean(v: any): boolean | undefined {
  if (v === true) return true;
  if (typeof v === 'string') {
    const s = v.toLowerCase().trim();
    if (s === 'true' || s === 'yes' || s === '1') return true;
  }
  return undefined;
}

/**
 * Builds a normalized slug from an array of path segments.
 */
function createSlugFromSegments(segments: string[]): string {
  return '/' + segments.filter(Boolean).join('/').replace(/\/+/g, '/');
}

/**
 * Recursively walk the markdown directory tree and build navigation nodes.
 */
export async function getMarkdownPagesRecursively(
  dir: string,
  pathSegments: string[] = [],
): Promise<NavNode[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const fullIndexPath = path.join(dir, 'index.md');

  // Default folder node
  let folderNode: NavNode = {
    title: path.basename(dir),
    description: '',
    slug: createSlugFromSegments(pathSegments),
    order: 0,
    type: 'folder',
    children: [],
  };

  // Try to load metadata from index.md
  try {
    const rawIndex = await fs.readFile(fullIndexPath, 'utf-8');
    const { data, content } = matter(rawIndex);

    folderNode = {
      ...folderNode,
      title: data.title || folderNode.title,
      description: data.description || folderNode.description,
      order: data.order ?? folderNode.order,
      icon: data.icon,
      image: data.image,
      tags: parseTags(data.tags),
      excerpt: extractExcerpt(content),
      newContent: parseBoolean(data.newContent),
      paywall: parseBoolean(data.paywall),
    };
  } catch {
    // no index.md
  }

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      const nextSegments = [...pathSegments, entry.name];
      const childNodes = await getMarkdownPagesRecursively(
        fullPath,
        nextSegments,
      );
      folderNode.children!.push(...childNodes);
    }

    if (
      entry.isFile() &&
      entry.name.endsWith('.md') &&
      entry.name !== 'index.md'
    ) {
      const raw = await fs.readFile(fullPath, 'utf-8');
      const { data, content } = matter(raw);
      const baseName = entry.name.replace(/\.md$/, '');
      const fileSegments = [...pathSegments, baseName];

      folderNode.children!.push({
        title: data.title || baseName,
        slug: createSlugFromSegments(fileSegments),
        order: data.order ?? 0,
        icon: data.icon,
        image: data.image,
        type: 'file',
        tags: parseTags(data.tags),
        excerpt: extractExcerpt(content),
        newContent: parseBoolean(data.newContent),
      });
    }
  }

  // Sort folder children
  if (folderNode.children && folderNode.children.length > 0) {
    folderNode.children.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }

  // Skip empty folders with no index.md
  try {
    await fs.access(fullIndexPath);
  } catch {
    if (!folderNode.children?.length) return [];
  }

  return [folderNode];
}

/**
 * Generate the global navigation JSON file from markdown.
 */
export async function generateGlobalNav() {
  const tree = await getMarkdownPagesRecursively(MARKDOWN_ROOT, []);
  await fs.writeFile(OUTPUT_PATH, JSON.stringify(tree, null, 2));
  console.log(`✅ Generated /public/globalNav.json`);
}

// Run directly
if (process.argv[1] === __filename) {
  generateGlobalNav().catch((err) => {
    console.error('❌ Failed to generate globalNav.json', err);
    process.exit(1);
  });
}
