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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material';
import { useDispatch, Icon } from '../../../../gl-core';
import { useUser, setPaywallKey, usePaywall, userSignout } from '../../Paywall';

type TSignout = {
  mode?: 'icon' | 'button' | 'listitem';
};

export default function SignOut({ mode = 'icon' }: TSignout) {
  const dispatch = useDispatch();
  const user = useUser();
  const paywall = usePaywall();

  const [open, setOpen] = React.useState(false);

  if (!user) return null;

  const triggerOpen = () => setOpen(true);
  const triggerClose = () => setOpen(false);

  const handleConfirm = () => {
    dispatch(userSignout());
    dispatch(setPaywallKey('dialogOpen', false));
    setOpen(false);
  };

  //
  // — Render triggers —
  //

  if (mode === 'listitem') {
    return (
      <>
        <ListItemButton onClick={triggerOpen}>
          <ListItemIcon>
            <Icon icon="signout" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Sign out" />
        </ListItemButton>

        <ConfirmDialog
          open={open}
          onCancel={triggerClose}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  if (mode === 'button') {
    return (
      <>
        <Button
          onClick={triggerOpen}
          color="primary"
          startIcon={<Icon icon="signout" />}
        >
          Sign out
        </Button>

        <ConfirmDialog
          open={open}
          onCancel={triggerClose}
          onConfirm={handleConfirm}
        />
      </>
    );
  }

  return (
    <>
      <IconButton onClick={triggerOpen} color="primary">
        <Icon icon="signout" />
      </IconButton>

      <ConfirmDialog
        open={open}
        onCancel={triggerClose}
        onConfirm={handleConfirm}
      />
    </>
  );
}

//
// — Extracted inline dialog (keeps SignOut clean) —
//

function ConfirmDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
      <DialogTitle>Sign out?</DialogTitle>

      <DialogContent>
        <Typography variant="body2">
          Are you sure you want to sign out?
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          color="secondary"
          variant='contained'
          onClick={onConfirm}
          endIcon={<Icon icon="signout" />}
        >
          Sign out
        </Button>
      </DialogActions>
    </Dialog>
  );
}
