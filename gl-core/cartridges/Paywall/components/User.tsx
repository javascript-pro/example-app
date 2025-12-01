// /Users/goldlabel/GitHub/core/gl-core/cartridges/Paywall/components/User.tsx
'use client';
import * as React from 'react';
import { IconButton, CardHeader, Box, Avatar, Chip } from '@mui/material';
import {
  useUser,
  useIsUberUser,
  setPaywallKey,
  usePaywall,
} from '../../Paywall';
import { Icon } from '../../DesignSystem';
import { useDispatch } from '../../Uberedux';
import { useIsMobile } from '../../../../gl-core';

export default function User() {
  const user = useUser();
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const isUberUser = useIsUberUser();
  const paywall = usePaywall();
  const { dialog } = paywall;

  const toggleDialogOpen = () => {
    dispatch(setPaywallKey('dialog', !dialog));
  };

  if (!user) {
    return null;
    // return (
    //   <Box sx={{ px: 2 }}>
    //     <IconButton onClick={toggleDialogOpen} sx={{ ml: -1 }} color="primary">
    //       <Icon icon="paywall" />
    //     </IconButton>
    //   </Box>
    // );
  }

  const provider = user.providerData?.[0] ?? null;
  if (!isMobile) {
    return (
      <CardHeader
        avatar={
          <>
            <IconButton onClick={toggleDialogOpen} sx={{ ml: -2 }}>
              <Avatar src={user.photoURL || provider?.photoURL || undefined} />
            </IconButton>
            {isUberUser && (
              <Chip label="Uber User" size="small" color="primary" />
            )}
          </>
        }
        // title={user.displayName || provider?.displayName || 'Unknown user'}
        // subheader={user.email || provider?.email}
      />
    );
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
      {/* <IconButton onClick={toggleDialogOpen} sx={{ ml: -1 }}> */}
        <Avatar
          src={user.photoURL || provider?.photoURL || undefined}
          sx={{ width: 24, height: 24 }}
        />
      {/* </IconButton> */}
    </Box>
  );
}
