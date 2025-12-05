// core/gl-core/Core.tsx
'use client';

import configRaw from './config.json';
import { TCore, TConfig } from './types';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import {
  useMediaQuery,
  Box,
  IconButton,
  Container,
  Collapse,
  Grid,
  Skeleton,
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

const config = configRaw as TConfig;

export default function Core({ frontmatter, body = null }: TCore) {
  const dispatch = useDispatch();
  const newContent = useNewContent();
  const search = useSearch();

  const { noImage, image, icon, title, description, paywall } =
    frontmatter ?? {};
  const [imageError, setImageError] = React.useState(false);
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
    <>
      <DesignSystem theme={config.themes[effectiveThemeMode]}>
        <Paywall />
        <Container id="core" sx={{ mt: 2 }}>
          <Box sx={{ minHeight: '100vh' }}>
            {/* <pre>search: {JSON.stringify(search, null, 2)}</pre> */}

            <Grid container spacing={isMobile ? 0 : 1}>
              {/* LEFT COLUMN */}
              <Grid size={{ xs: 1, md: 3 }}>
                <Box
                  sx={{
                    overflow: 'hidden',
                    ml: isMobile ? -3 : 0,
                    mt: 0,
                  }}
                >
                  <Navigation />
                </Box>
              </Grid>

              {/* RIGHT COLUMN */}
              <Grid size={{ xs: 11, md: 9 }}>
                {/* Title + Icon */}
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

                <Box sx={{}}>
                  <Typography
                    variant="h2"
                    gutterBottom
                    sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' } }}
                  >
                    {description}
                  </Typography>
                </Box>

                {title !== 'Home' && pathname !== '/' && <PageBreadcrumb />}

                {/* Description + Share + NEW TOGGLE */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ ml: -1 }}>
                    <Tags />
                  </Box>

                  {newContent && newContent.length > 0 && (
                    <Box>
                      <Tooltip title="What's New" arrow>
                        <IconButton
                          color="secondary"
                          onClick={() => setShowWhatsNew((v) => !v)}
                        >
                          <Icon icon={'news'} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  )}

                  <Box sx={{ mr: 1 }}>
                    <SharePopup />
                  </Box>
                </Box>

                {/* WHAT'S NEW — COLLAPSE */}
                <Box sx={{}}>
                  <Collapse in={showWhatsNew} unmountOnExit>
                    <Grid container spacing={1}>
                      {newContent?.map((item: any, i: number) => (
                        <Grid key={`page_${i}`} size={{ xs: 12, md: mdSize }}>
                          <NewContent slug={item.slug} />
                        </Grid>
                      ))}
                    </Grid>
                  </Collapse>
                </Box>

                {/* CONTENT AREA */}
                <Box sx={{ mt: 2, mb: isMobile ? 3 : '175px' }}>
                  {paywall === true && !isAuthed ? (
                    <Grid
                      container
                      spacing={2}
                      sx={{ alignItems: 'flex-start' }}
                    >
                      {/* Right: Image */}
                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={{ mt: 2 }}>
                          {!noImage && image && (
                            <Box>
                              {!imageError ? (
                                <Image
                                  priority
                                  src={image}
                                  alt={title || 'Featured image'}
                                  width={1200}
                                  height={630}
                                  style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: isMobile ? 'none' : '420px',
                                    objectFit: 'cover',
                                    borderRadius: 8,
                                  }}
                                  onError={() => setImageError(true)}
                                />
                              ) : (
                                <Skeleton
                                  variant="rectangular"
                                  width="100%"
                                  height={315}
                                />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <SigninGate />
                      </Grid>
                    </Grid>
                  ) : (
                    <>
                      {!noImage && image && (
                        <Box>
                          {!imageError ? (
                            <Image
                              priority
                              src={image}
                              alt={title || 'Featured image'}
                              width={1200}
                              height={630}
                              style={{
                                borderRadius: 8,
                                width: '100%',
                                height: 'auto',
                                maxHeight: isMobile ? 'none' : '315px',
                                objectFit: 'cover',
                              }}
                              onError={() => setImageError(true)}
                            />
                          ) : (
                            <Box>
                              <Skeleton
                                variant="rectangular"
                                width="100%"
                                height={315}
                              />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                mt={1}
                              >
                                "{image}" not found.
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}

                      <RenderMarkdown>{body}</RenderMarkdown>
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </DesignSystem>
    </>
  );
}
