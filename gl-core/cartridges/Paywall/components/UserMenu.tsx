// /Users/goldlabel/GitHub/core/gl-core/cartridges/Paywall/components/UserMenu.tsx
'use client';
import * as React from 'react';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useDispatch, Icon } from '../../../../gl-core';
import { useUser, SignOut } from '../../Paywall';

export default function UserMenu() {
  const dispatch = useDispatch();
  const user = useUser();

  const uid = user?.uid;
  // const projectId = 'goldlabel-pr0'; // change here if needed

  const firebaseAuthUrl = uid
    ? `https://console.firebase.google.com/u/1/project/goldlabel-pr0/authentication/users`
    : null;

  return (
    <>
      <List dense disablePadding>
        {/* {firebaseAuthUrl && (
          <ListItemButton
            component="a"
            href={firebaseAuthUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ListItemIcon>
              <Icon icon="link" color="primary" />
            </ListItemIcon>
            <ListItemText primary={`Firebase Auth`} />
          </ListItemButton>
        )} */}

        <SignOut mode="listitem" />
      </List>
    </>
  );
}
