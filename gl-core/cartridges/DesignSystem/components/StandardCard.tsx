// /Users/goldlabel/GitHub/core/gl-core/cartridges/Theme/components/StandardCard.tsx
'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Collapse,
  Button,
  IconButton,
  CardActions,
  Typography,
} from '@mui/material';

import {
  Icon,
  routeTo,
  useContent,
  useDispatch,
  useIsMobile,
} from '../../../../gl-core';

export function StandardCard({
  slug,
  thumbnails,
}: {
  slug: string;
  thumbnails?: boolean;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const content = useContent(slug);
  const [expanded, setExpanded] = React.useState(false);
  const isMobile = useIsMobile();

  function stripShortcodes(str: string | undefined) {
    if (!str) return '';
    return str.replace(/\[[^\]]*\]/g, '').trim();
  }

  if (!content) return null;

  const { title, description, image, icon } = content;

  return (
    <Card
      sx={{
        width: '100%',
        cursor: 'pointer',
        borderRadius: 3,
        overflow: 'hidden',
      }}
      variant="outlined"
      onClick={() => dispatch(routeTo(slug, router))}
    >
      <CardHeader
        avatar={<Icon icon={icon as any} color="secondary" />}

        title={
          <Typography
            variant="h6"
            noWrap
            sx={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {title}
          </Typography>
        }
        action={
          <IconButton
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
            edge="end"
            sx={{ mr: 1 }}
          >
            {expanded ? <Icon icon="up" /> : <Icon icon="down" />}
          </IconButton>
        }
        sx={{
          alignItems: 'center',
          '.MuiCardHeader-content': {
            minWidth: 0,
          },
        }}
      />

      {/* Desktop-only thumbnail when collapsed */}
      {thumbnails && image && !expanded && !isMobile && (
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            width: '100%',
            height: 180,
            objectFit: 'cover',
            borderRadius: 0,
          }}
        />
      )}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* On mobile, show the image only inside the expanded section */}
          {image && (
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{ borderRadius: 2, mb: 1, objectFit: 'cover' }}
            />
          )}

          <Typography variant="body1" sx={{}}>
            {description}
          </Typography>
        </CardContent>

        <CardActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={(e) => {
              e.stopPropagation();
              dispatch(routeTo(slug, router));
            }}
          >
            Read more
          </Button>
        </CardActions>
      </Collapse>
    </Card>
  );
}

export default StandardCard;
