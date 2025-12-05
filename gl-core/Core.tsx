// /Users/goldlabel/GitHub/example/gl-core/Core.tsx
'use client';

import configRaw from './config.json';
import { TCore, TConfig } from './types';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import {
  useMediaQuery,
  Box,
  IconButton,
  Container,
  Collapse,
  Grid,
  Typography,
  Tooltip,
} from '@mui/material';
import {
  PageBreadcrumb,
  useIsMobile,
  useVersionCheck,
  useDispatch,
  useSiblings,
  SharePopup,
  Icon,
} from '../gl-core';
import { Paywall, SigninGate, useUser } from './cartridges/Paywall';
import {
  DesignSystem,
  useDesignSystem,
  NewContent,
  toggleLoading,
  Tags,
  Navigation,
  RenderMarkdown,
} from './cartridges/DesignSystem';
import {
  useNewContent,
  fetchGlobalNav,
  useSearch,
} from './cartridges/Uberedux';

import FeaturedImage from './cartridges/DesignSystem/components/FeaturedImage';

const config = configRaw as TConfig;

export default function Core({ frontmatter, body = null }: TCore) {
  const dispatch = useDispatch();
  const newContent = useNewContent();
  const search = useSearch();

  const { noImage, image, icon, title, description, paywall, tags } =
    frontmatter ?? {};

  const [showWhatsNew, setShowWhatsNew] = React.useState(false);

  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const siblings = useSiblings();
  const pathname = usePathname();
  const { themeMode } = useDesignSystem();
  const isMobile = useIsMobile();
  const user = useUser();

  const fetchedNavRef = React.useRef(false);

  React.useEffect(() => {
    if (fetchedNavRef.current) return;
    fetchedNavRef.current = true;
    dispatch(fetchGlobalNav());
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(toggleLoading(false));
  }, [dispatch]);

  useVersionCheck();

  const effectiveThemeMode =
    themeMode === null ? (prefersDark ? 'dark' : 'light') : themeMode;

  const isAuthed = !!(user && user.uid);

  const mdSize = React.useMemo(() => {
    if (!newContent) return 6;
    const count = newContent.length;
    return count % 3 === 0 ? 4 : 6;
  }, [newContent]);

  return (
    <DesignSystem theme={config.themes[effectiveThemeMode]}>
      <Paywall />
      <Container id="core" sx={{ mt: 2 }}>
        <Box sx={{ minHeight: '100vh' }}>
          <Grid container spacing={isMobile ? 0 : 1}>
            <Grid size={{ xs: 1, md: 3 }}>
              <Box
                sx={{
                  overflow: 'hidden',
                  ml: isMobile ? -3 : 0,
                }}
              >
                <Navigation />
              </Box>
            </Grid>

            <Grid size={{ xs: 11, md: 9 }}>
              <Box sx={{ display: 'flex' }}>
                <Box sx={{ mr: 2, mt: 1.5 }}>
                  <Icon icon={icon as any} color="primary" />
                </Box>

                <Typography
                  variant="h1"
                  gutterBottom
                  color="primary"
                  sx={{
                    mt: 0.5,
                    fontSize: { xs: '1.6rem', md: '2rem' },
                  }}
                >
                  {title !== 'Home' ? title : 'Goldlabel Apps'}
                </Typography>
              </Box>

              <Typography
                variant="h2"
                gutterBottom
                sx={{
                  fontSize: { xs: '1.1rem', md: '1.25rem' },
                }}
              >
                {description}
              </Typography>

              {title !== 'Home' && pathname !== '/' && <PageBreadcrumb />}

              {/* Tags + New Toggle + Share */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ ml: -1 }}>
                  <Tags tags={tags}/>
                </Box>

                {newContent?.length > 0 && (
                  <Tooltip title="What's New" arrow>
                    <IconButton
                      color="secondary"
                      onClick={() => setShowWhatsNew((v) => !v)}
                    >
                      <Icon icon="news" />
                    </IconButton>
                  </Tooltip>
                )}

                <Box sx={{ mr: 1 }}>
                  <SharePopup />
                </Box>
              </Box>

              <Collapse in={showWhatsNew} unmountOnExit>
                <Grid container spacing={1} sx={{ mt: 1 }}>
                  {newContent?.map((item: any, i: number) => (
                    <Grid key={`page_${i}`} size={{ xs: 12, md: mdSize }}>
                      <NewContent slug={item.slug} />
                    </Grid>
                  ))}
                </Grid>
              </Collapse>

              <Box sx={{ mt: 2, mb: '80px' }}>
                {paywall === true && !isAuthed ? (
                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <Box sx={{ mt: 2 }}>
                        <FeaturedImage
                          image={!noImage ? image : null}
                          title={title}
                          maxHeight={420}
                        />
                      </Box>
                    </Grid>

                    <Grid size={{ xs: 12, md: 6 }}>
                      <SigninGate />
                    </Grid>
                  </Grid>
                ) : (
                  <>
                    <FeaturedImage
                      image={!noImage ? image : null}
                      title={title}
                      maxHeight={315}
                    />
                    <RenderMarkdown>{body}</RenderMarkdown>
                  </>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </DesignSystem>
  );
}
