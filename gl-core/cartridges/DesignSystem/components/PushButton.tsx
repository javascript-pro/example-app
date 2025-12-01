// /Users/goldlabel/GitHub/core/gl-core/cartridges/DesignSystem/components/PushButton.tsx
'use client';
import * as React from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { useDispatch, Icon } from '../../../../gl-core';
import { setPaywallKey, usePaywall } from '../../Paywall';

export default function PushButton() {
  const dispatch = useDispatch();
  const paywall = usePaywall();
  const { userDialog } = paywall || false;

  const toggleUserDialog = () => {
    dispatch(setPaywallKey('userDialog', !userDialog));
  };

  return (
    <Tooltip title="Account">
      <IconButton
        onClick={toggleUserDialog}
        color="primary"
        sx={{
          zIndex: (theme) => theme.zIndex.modal - 2,
          boxShadow: 0,
          position: 'fixed',
          bottom: 8,
          right: 8,
        }}
      >
        <Icon icon="paywall" />
      </IconButton>
    </Tooltip>
  );
}
