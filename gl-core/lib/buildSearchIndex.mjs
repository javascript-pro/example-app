// /Users/goldlabel/GitHub/example-app/gl-core/lib/buildSearchIndex.mjs
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const markdownDir = path.join(process.cwd(), 'public', 'markdown');

function readAllMarkdown(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];

  for (const f of files) {
    const filePath = path.join(dir, f.name);
    if (f.isDirectory()) {
      results = results.concat(readAllMarkdown(filePath));
    } else if (f.name.endsWith('.md')) {
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = matter(content);
      const slug = filePath
        .replace(markdownDir, '')
        .replace(/\.md$/, '')
        .replace(/^\/+/, '');
      results.push({
        slug,
        title: parsed.data.title || slug,
        description: parsed.data.description || '',
        image: parsed.data.image || '',
        tags: parsed.data.tags || [],
        content: parsed.content,
      });
    }
  }

  return results;
}

const index = readAllMarkdown(markdownDir);
fs.writeFileSync(
  path.join(process.cwd(), 'public', 'search-index.json'),
  JSON.stringify(index, null, 2),
);

console.log('✅ search-index.json built');
