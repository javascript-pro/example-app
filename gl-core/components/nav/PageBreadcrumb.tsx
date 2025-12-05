// /Users/goldlabel/GitHub/example-app/gl-core/components/nav/PageBreadcrumb.tsx
'use client';

import React, { Suspense } from 'react';
import NextLink from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Box, Link as MUILink, Typography } from '@mui/material';
import globalNav from '../../../public/globalNav.json';

/**
 * Recursively flatten globalNav into a dictionary of { [fullSlug]: title }
 */
function buildTitleMap(nav: any[], parentPath = ''): Record<string, string> {
  let map: Record<string, string> = {};
  for (const item of nav) {
    const fullPath = (parentPath + '/' + (item.slug || '')).replace(/\/+/g, '/');

    if (item.title) {
      map[fullPath] = item.title;
    }

    if (item.children && Array.isArray(item.children)) {
      const childMap = buildTitleMap(item.children, fullPath);
      map = { ...map, ...childMap };
    }
  }
  return map;
}

const titleMap = buildTitleMap(globalNav);

/**
 * Smart capitalisation helper
 */
function smartCapitalize(label: string): string {
  const knownAcronyms = [
    'AI','API','SEO','UI','UX','HTTP','HTTPS','TEFL','APIS','GDPR','NPM','CV',
    'JSON','SQL','CSS','HTML','JS','TS','NLP','ML','GPU','SSR','SSG'
  ];
  if (!label) return label;

  return label
    .split(/[\s\-_]+/)
    .map((word) => {
      if (knownAcronyms.includes(word.toUpperCase())) return word.toUpperCase();
      if (/[A-Z][a-z]/.test(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
}

/**
 * Hidden / tracking parameters we never show in breadcrumbs
 */
const HIDDEN_PARAMS = [
  'fbclid',
  'gclid',
  'msclkid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
];

function Params() {
  const searchParams = useSearchParams();
  if (!searchParams) return null;

  // Filter visible params
  const entries = Array.from(searchParams.entries()).filter(
    ([key]) => !HIDDEN_PARAMS.includes(key.toLowerCase())
  );

  if (entries.length === 0) return null;

  return (
    <Box component="span" sx={{ px: 1 }}>
      ?
      {entries.map(([key, value], index) => (
        <React.Fragment key={key}>
          {index !== 0 && <span>&</span>}
          <span className="px-1">
            <span className="animate-[highlight_1s_ease-in-out_1]">
              {key}
            </span>
            =
            <span className="animate-[highlight_1s_ease-in-out_1]">
              {value}
            </span>
          </span>
        </React.Fragment>
      ))}
    </Box>
  );
}

export function PageBreadcrumb({
  frontmatterTitle,
}: {
  frontmatterTitle?: string;
}) {
  const pathname = usePathname();
  const segments = pathname.replace(/\/$/, '').split('/').filter(Boolean);

  if (segments.length === 0) return <>&nbsp;</>;

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <NextLink href="/" passHref legacyBehavior>
        <MUILink underline="hover" color="primary" variant="caption">
          {smartCapitalize(titleMap['/'] || 'Home')}
        </MUILink>
      </NextLink>

      {segments.map((segment, index) => {
        const href = '/' + segments.slice(0, index + 1).join('/');
        const isLast = index === segments.length - 1;

        let label = titleMap[href];
        if (!label && isLast && frontmatterTitle) label = frontmatterTitle;
        if (!label) label = segment;

        const displayLabel = smartCapitalize(label);

        return (
          <React.Fragment key={href}>
            <Box sx={{ mx: 1 }}>/</Box>
            {isLast ? (
              <Typography variant="caption" sx={{ ml: 0.5 }}>
                {displayLabel}
              </Typography>
            ) : (
              <NextLink href={href} passHref legacyBehavior>
                <MUILink underline="hover" color="primary" variant="caption">
                  {displayLabel}
                </MUILink>
              </NextLink>
            )}
          </React.Fragment>
        );
      })}

      <Suspense>
        <Params />
      </Suspense>
    </Box>
  );
}
