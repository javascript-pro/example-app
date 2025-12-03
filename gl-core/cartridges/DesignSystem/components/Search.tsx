// /Users/goldlabel/GitHub/example-app/gl-core/cartridges/DesignSystem/components/Search.tsx
'use client';
import { TSearch, TFlatItem } from '../types';
import globalNav from '../../../../public/globalNav.json';
import { useRouter } from 'next/navigation';
import React, {
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import {
  styled,
  alpha,
  InputBase,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  ClickAwayListener,
} from '@mui/material';
import { useDispatch, routeTo } from '../../../../gl-core';
import { Icon } from '../../../cartridges/DesignSystem';

const SearchWrapper = styled(Box)(() => ({
  position: 'relative',
  display: 'inline-block',
}));

const SearchField = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor:
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.1)
      : alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor:
      theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.15)
        : alpha(theme.palette.common.white, 0.18),
  },
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '16ch',
    '&:focus': {
      width: '24ch',
    },
  },
}));

function flattenNav(nav: any[], acc: TFlatItem[] = []) {
  for (const item of nav) {
    acc.push({
      title: item.title,
      slug: item.slug,
      description: item.description || '',
    });
    if (item.children) flattenNav(item.children, acc);
  }
  return acc;
}

export default function Search({ onTrigger = () => {} }: TSearch) {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const dispatch = useDispatch();
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const flatItems = useMemo(() => flattenNav(globalNav), []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return flatItems.filter(
      ({ title, description }) =>
        title.toLowerCase().includes(q) ||
        description?.toLowerCase().includes(q),
    );
  }, [query, flatItems]);

  useEffect(() => {
    setOpen(results.length > 0);
    setHighlightIndex(results.length > 0 ? 0 : -1);
  }, [results]);

  const handleClickAway = (e: MouseEvent | TouchEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setOpen(false);
      setHighlightIndex(-1);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!open || results.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) => (prev + 1) % results.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev <= 0 ? results.length - 1 : prev - 1,
        );
      } else if (e.key === 'Enter' && highlightIndex >= 0) {
        e.preventDefault();
        dispatch(routeTo(results[highlightIndex].slug, router));
        setQuery('');
        setOpen(false);
        setHighlightIndex(-1);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        setHighlightIndex(-1);
      }
    },
    [results, highlightIndex, open, dispatch, router],
  );

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <SearchWrapper ref={wrapperRef}>
        <SearchField>
          <SearchIconWrapper>
            <Icon icon="search" color="secondary" />
          </SearchIconWrapper>
          <StyledInputBase
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onTrigger(e);
            }}
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            onKeyDown={handleKeyDown}
          />
        </SearchField>

        {open && (
          <Paper
            elevation={6}
            sx={{
              position: 'absolute',
              bottom: '100%', // popup ABOVE
              left: 0,
              mb: 0.5, // spacing above input
              zIndex: 1300,
              width: '100%',
              maxHeight: 300,
              overflowY: 'auto',
            }}
          >
            <List dense disablePadding>
              {results.map((item, i) => (
                <ListItemButton
                  key={`search_result_${i}`}
                  selected={i === highlightIndex}
                  onMouseEnter={() => setHighlightIndex(i)}
                  onClick={() => {
                    dispatch(routeTo(item.slug, router));
                    setQuery('');
                    setOpen(false);
                    setHighlightIndex(-1);
                  }}
                  sx={{
                    bgcolor:
                      i === highlightIndex
                        ? (theme) => alpha(theme.palette.primary.main, 0.15)
                        : 'transparent',
                    '&:hover': {
                      bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemText
                    primary={item.title}
                    secondary={item.description}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        )}
      </SearchWrapper>
    </ClickAwayListener>
  );
}
