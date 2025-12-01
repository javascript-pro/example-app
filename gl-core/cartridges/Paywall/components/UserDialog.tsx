// /Users/goldlabel/GitHub/example-app/gl-core/cartridges/Paywall/components/UserDialog.tsx
'use client';
import * as React from 'react';
import {
  Box,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { useDispatch, useIsMobile, Icon } from '../../../../gl-core';
import { 
  useDesignSystem,
  MenuSystem,
} from '../../DesignSystem';
import {
  useUser,
  setPaywallKey,
  usePaywall,
  SignIn,
  User,
  useIsUberUser,
} from '../../Paywall';

export default function UserDialog() {
  const dispatch = useDispatch();
  const isMobile = useIsMobile();
  const ds = useDesignSystem();
  const { fullScreen } = ds;
  const user = useUser();
  const paywall = usePaywall();
  const { userDialog } = paywall;
  const isUberUser = useIsUberUser();

  const handleClose = () => {
    dispatch(setPaywallKey('userDialog', false));
  };

  return (
    <>
      <Dialog
        fullWidth
        fullScreen={isMobile || fullScreen}
        open={Boolean(userDialog)}
        onClose={handleClose}
        maxWidth={'sm'}
      >
        <DialogContent>
          <Grid container spacing={1} sx={{ mb: 0 }}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{mt: 3}}>
                <MenuSystem />
              </Box>
              <User />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              
              {user ? null : <SignIn />}
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <IconButton color="primary" onClick={handleClose}>
            <Icon icon="close" />
          </IconButton>
        </DialogActions>
        {user && isUberUser && (
            <Accordion sx={{ mx: 2, background: 0, boxShadow: 0 }}>
              <AccordionSummary expandIcon={<Icon icon="up" color="primary" />}>
                User Data
              </AccordionSummary>
              <AccordionDetails>
                <pre style={{ fontSize: '10px', margin: 0 }}>
                  user: {JSON.stringify(user, null, 2)}
                </pre>
              </AccordionDetails>
            </Accordion>
        )}
      </Dialog>
    </>
  );
}
