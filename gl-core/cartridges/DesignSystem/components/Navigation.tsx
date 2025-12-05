// /Users/goldlabel/GitHub/example-app/gl-core/cartridges/DesignSystem/components/Navigation.tsx
'use client';

import { NavItem } from '../types';
import globalNav from '../../../../public/globalNav.json';
import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
} from '@mui/material';

import { useIsMobile, useDispatch } from '../../../../gl-core';
import {
  Icon,
  setDesignSystemKey,
  useDesignSystem,
} from '../../../cartridges/DesignSystem';

// -------------------------------------------------------------
// helper functions
// -------------------------------------------------------------
function findNode(items: NavItem[], slug: string): NavItem | null {
  for (const item of items) {
    if (item.slug === slug) return item;
    if (item.children) {
      const found = findNode(item.children, slug);
      if (found) return found;
    }
  }
  return null;
}

function findParent(items: NavItem[], slug: string): NavItem | null {
  for (const item of items) {
    if (item.children?.some((c) => c.slug === slug)) return item;
    if (item.children) {
      const deeper = findParent(item.children, slug);
      if (deeper) return deeper;
    }
  }
  return null;
}

function findParentContents(items: NavItem[], slug: string): NavItem[] | null {
  for (const item of items) {
    if (item.children?.length) {
      const matchIndex = item.children.findIndex((c) => c.slug === slug);
      if (matchIndex !== -1) return item.children;
      const deeper = findParentContents(item.children, slug);
      if (deeper) return deeper;
    }
  }
  return null;
}

// -------------------------------------------------------------
// main component
// -------------------------------------------------------------
export default function Navigation() {
  const dispatch = useDispatch();
  const ds = useDesignSystem();
  const navOpen = ds.navOpen; // ← uses your DesignSystem store
  const pathname = usePathname();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleCloseDialog = () => {
    dispatch(setDesignSystemKey('dialog', null));
  };

  const currentNode = React.useMemo(
    () => findNode(globalNav as NavItem[], pathname),
    [pathname],
  );

  const getAncestors = React.useCallback((slug: string): NavItem[] => {
    const chain: NavItem[] = [];
    let parent = findParent(globalNav as NavItem[], slug);
    while (parent) {
      chain.unshift(parent);
      parent = findParent(globalNav as NavItem[], parent.slug);
    }
    return chain;
  }, []);

  const ancestors = React.useMemo(() => {
    if (!currentNode) return [];
    const chain = getAncestors(currentNode.slug);
    if (
      currentNode.slug === '/' ||
      currentNode.slug.endsWith('/index') ||
      (currentNode.children && currentNode.children.length > 0)
    ) {
      chain.push(currentNode);
    }
    return chain;
  }, [currentNode, getAncestors]);

  const isIndexPage = React.useMemo(() => {
    if (!currentNode) return false;
    return (
      currentNode.slug === '/' ||
      currentNode.slug.endsWith('/index') ||
      (currentNode.children && currentNode.children.length > 0)
    );
  }, [currentNode]);

  const siblings = React.useMemo(() => {
    if (!currentNode) return null;

    if (isIndexPage) {
      const contents = currentNode.children || [];
      return contents.length
        ? [...contents].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : null;
    } else {
      const parentContents = findParentContents(
        globalNav as NavItem[],
        pathname,
      );
      return parentContents
        ? [...parentContents].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        : null;
    }
  }, [currentNode, pathname, isIndexPage]);

  const parent = React.useMemo(() => {
    if (!currentNode) return null;
    return findParent(globalNav as NavItem[], currentNode.slug);
  }, [currentNode]);

  // -------------------------------------------------------------
  // Navigation list rendering function (used in both desktop + drawer)
  // -------------------------------------------------------------
  const renderNavList = (
    <Box sx={{ width: isMobile ? '80vw' : 'auto' }}>
      {ancestors.map((node) => (
        <ListItemButton
          key={node.slug}
          onClick={() => {
            handleCloseDialog();
            dispatch(setDesignSystemKey('navOpen', false));
            router.push(node.slug);
          }}
        >
          <ListItemIcon>
            <Icon icon={(node.icon as any) || 'up'} color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography noWrap variant="body2">
                {node.title}
              </Typography>
            }
          />
        </ListItemButton>
      ))}

      {(!siblings || siblings.length === 0) && parent && (
        <ListItemButton
          onClick={() => {
            handleCloseDialog();
            dispatch(setDesignSystemKey('navOpen', false));
            router.push(parent.slug);
          }}
        >
          <ListItemIcon>
            <Icon icon={(parent.icon as any) || 'up'} color="secondary" />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography noWrap variant="body2">
                {parent.title}
              </Typography>
            }
          />
        </ListItemButton>
      )}

      {siblings && siblings.length > 0 && (
        <List dense disablePadding>
          {siblings.map((item) => {
            const isCurrent = item.slug === pathname;
            return (
              <ListItemButton
                key={item.slug}
                disabled={isCurrent}
                onClick={() => {
                  handleCloseDialog();
                  dispatch(setDesignSystemKey('navOpen', false));
                  router.push(item.slug);
                }}
              >
                <ListItemIcon>
                  <Icon icon={item.icon as any} color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography noWrap variant="body2">
                      {item.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Box>
  );

  // -------------------------------------------------------------
  // Mobile + Desktop rendering
  // -------------------------------------------------------------
  if (!currentNode) return null;

  if (isMobile) {
    return (
      <>
        <IconButton
          sx={{ mr: -1, mt: 0.5 }}
          color="primary"
          onClick={() => dispatch(setDesignSystemKey('navOpen', true))}
        >
          <Icon icon="menu" />
        </IconButton>

        <Drawer
          anchor="right"
          open={navOpen}
          onClose={() => dispatch(setDesignSystemKey('navOpen', false))}
          ModalProps={{ keepMounted: true }}
        >
          <Box sx={{ mt: 2 }}>{renderNavList}</Box>
        </Drawer>
      </>
    );
  }

  // Desktop
  return <Box>{renderNavList}</Box>;
}
