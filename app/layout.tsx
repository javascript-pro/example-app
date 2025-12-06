// core/app/layout.tsx
import * as React from 'react';
import path from 'path';
import fs from 'fs/promises';
import './style.css';
import { UbereduxProvider } from '../gl-core/cartridges/Uberedux';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navPath = path.join(process.cwd(), 'public/globalNav.json');
  let globalNav = null;
  try {
    const navRaw = await fs.readFile(navPath, 'utf-8');
    globalNav = JSON.parse(navRaw);
  } catch (err) {
    console.error('Failed to load globalNav.json:', err);
  }

  let shortcutIcon = '/svg/favicon.svg';
  let appleTouchIcon = '/png/favicon.png';

  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#001321" />
        <link rel="icon" href={shortcutIcon} />
        <link rel="shortcut icon" href={shortcutIcon} type="image/x-icon" />
        <link rel="apple-touch-icon" sizes="180x180" href={appleTouchIcon} />
      </head>
      <body>
        <UbereduxProvider>{children}</UbereduxProvider>
      </body>
    </html>
  );
}
