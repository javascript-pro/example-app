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

  if (!content) return null;

  const { title, description, image, icon } = content;

  // Shared image height for consistency
  const MEDIA_HEIGHT = 200;

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

      {/* Thumbnail when collapsed */}
      {thumbnails && image && !expanded && !isMobile && (
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            width: '100%',
            height: MEDIA_HEIGHT,
            objectFit: 'cover',
            borderRadius: 0,
          }}
        />
      )}

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          {/* Expanded image — same height as thumbnail */}
          {image && (
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{
                borderRadius: 2,
                mb: 1,
                width: '100%',
                height: MEDIA_HEIGHT,
                objectFit: 'cover',
              }}
            />
          )}

          <Typography variant="body1">
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
