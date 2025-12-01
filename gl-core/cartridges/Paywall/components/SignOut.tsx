// /Users/goldlabel/GitHub/core/gl-core/cartridges/Paywall/components/SignOut.tsx
'use client';

import * as React from 'react';
import {
  Box,
  Button,
  IconButton,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useDispatch, Icon } from '../../../../gl-core';
import { useUser, setPaywallKey, usePaywall, userSignout } from '../../Paywall';
// import { setDesignSystemKey } from '../../DesignSystem';

type TSignout = {
  mode?: 'icon' | 'button' | 'listitem';
};

export default function SignOut({ mode = 'icon' }: TSignout) {
  const dispatch = useDispatch();
  const user = useUser();
  const paywall = usePaywall();

  if (!user) return null;

  const handleSignOut = () => {
    dispatch(userSignout());
    dispatch(setPaywallKey('dialogOpen', false));
    // dispatch(setDesignSystemKey('dialogOpen', false));
  };

  if (mode === 'listitem') {
    return (
      <ListItemButton onClick={handleSignOut}>
        <ListItemIcon>
          <Icon icon="signout" color="primary" />
        </ListItemIcon>
        <ListItemText primary="Sign out" />
      </ListItemButton>
    );
  }

  if (mode === 'button') {
    return (
      <Button
        onClick={handleSignOut}
        color="primary"
        startIcon={<Icon icon="signout" />}
      >
        Sign out
      </Button>
    );
  }

  return (
    <IconButton onClick={handleSignOut} color="primary">
      <Icon icon="signout" />
    </IconButton>
  );
}
