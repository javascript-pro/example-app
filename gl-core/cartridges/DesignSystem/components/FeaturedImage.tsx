// /Users/goldlabel/GitHub/example/gl-core/cartridges/DesignSystem/components/FeaturedImage.tsx
'use client';

import * as React from 'react';
import Image from 'next/image';
import { Box, Skeleton, Typography } from '@mui/material';
import { useIsMobile } from '../../../../gl-core';

type Props = {
  image?: string | null;
  title?: string | null;
  priority?: boolean;
  maxHeight?: number; // e.g. 315 or 420
};

export default function FeaturedImage({
  image,
  title = 'Featured image',
  priority = true,
  maxHeight,
}: Props) {
  const isMobile = useIsMobile();
  const [error, setError] = React.useState(false);

  if (!image) return null;

  return (
    <Box sx={{ width: '100%' }}>
      {!error ? (
        <Image
          priority={priority}
          src={image}
          alt={title || 'Goldlabel'}
          width={1200}
          height={630}
          style={{
            width: '100%',
            height: 'auto',
            maxHeight: isMobile ? 'none' : maxHeight || 315,
            objectFit: 'cover',
            borderRadius: 8,
          }}
          onError={() => setError(true)}
        />
      ) : (
        <Box>
          <Skeleton variant="rectangular" width="100%" height={315} />
          <Typography variant="body2" color="text.secondary" mt={1}>
            "{image}" not found.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
