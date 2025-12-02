// /Users/goldlabel/GitHub/example-app/gl-core/lib/getPopupMenu.tsx
import fs from 'fs';
import path from 'path';

export type MenuItem = {
  title: string;
  slug: string;
  type: 'file' | 'folder';
  children?: MenuItem[];
};

export function getPopupMenu(): MenuItem[] {
  const filePath = path.join(process.cwd(), 'public/globalNav.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  const json = JSON.parse(raw);
  return json;
}
