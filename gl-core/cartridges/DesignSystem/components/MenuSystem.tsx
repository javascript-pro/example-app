// /Users/goldlabel/GitHub/core/gl-core/cartridges/DesignSystem/components/MenuSystem.tsx
'use client';
import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useDispatch, Icon, reset } from '../../../../gl-core';
import { useDesignSystem, setDesignSystemKey } from '../../DesignSystem';
import { useUser, SignOut, setPaywallKey } from '../../Paywall';

export default function MenuSystem() {
  const dispatch = useDispatch();
  // const router = useRouter();
  const user = useUser();
  const ds = useDesignSystem();
  const { themeMode } = ds;

  const handleToggle = () => {
    const newMode = themeMode === 'dark' ? 'light' : 'dark';
    dispatch(setDesignSystemKey('themeMode', newMode));
    dispatch(setPaywallKey('userDialog', false));
  };

  return (
    <>
      <List dense disablePadding>
        <ListItemButton
          onClick={() => {
            dispatch(setPaywallKey('userDialog', false));
            dispatch(reset());
          }}
        >
          <ListItemIcon>
            <Icon icon="home" color="primary" />
          </ListItemIcon>
          <ListItemText primary="Reset" />
        </ListItemButton>

        <ListItemButton
          onClick={() => {
            handleToggle();
          }}
        >
          <ListItemIcon>
            <Icon
              color="primary"
              icon={themeMode === 'dark' ? 'lightmode' : ('darkmode' as any)}
            />
          </ListItemIcon>
          <ListItemText
            primary={themeMode === 'dark' ? 'Light mode' : 'Dark mode'}
          />
        </ListItemButton>

        {user && <SignOut mode="listitem" />}
      </List>
    </>
  );
}
