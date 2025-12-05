// /Users/goldlabel/GitHub/example/gl-core/cartridges/DesignSystem/components/Tags.tsx
'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Box,
  Chip,
  Collapse,
  IconButton,
} from '@mui/material';
import { useDispatch, Icon } from '../../../../gl-core';
import { useDesignSystem, setDesignSystemKey } from '../../DesignSystem';

type TagsProps = {
  tags?: string | string[];
};

export default function Tags({ tags }: TagsProps) {
  const dispatch = useDispatch();
  const { tagsOpen } = useDesignSystem();

  // No tags → render nothing
  if (!tags) return null;

  // Normalise frontmatter (comma-separated string → array)
  const tagList = Array.isArray(tags)
    ? tags
    : tags.split(',').map((t) => t.trim()).filter(Boolean);

  if (tagList.length === 0) return null;

  const toggleTagsOpen = () => {
    dispatch(setDesignSystemKey('tagsOpen', !tagsOpen));
  };

  return (
    <Box>
      <IconButton color="secondary" onClick={toggleTagsOpen}>
        <Icon icon="tags" />
      </IconButton>
      <Collapse in={tagsOpen} unmountOnExit>
        <Box sx={{ mt: 1 }}>
          {tagList.map((tag: any, i: number) => (
              <Chip
                key={`tag_${i}`}
                sx={{m:0.25}}
                label={tag}
                // component={Link}
                // href={`/tag/${tag}`}
                clickable
                color="primary"
                variant="outlined"
                size="small"
              />
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}
