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
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import { useDispatch, useIsMobile, Icon } from '../../../../gl-core';
import { useDesignSystem, MenuSystem } from '../../DesignSystem';
import {
  useUser,
  setPaywallKey,
  usePaywall,
  useTing,
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
  const ting = useTing();
  const paywall = usePaywall();
  const { userDialog } = paywall;
  const isUberUser = useIsUberUser();

  const countryCode = ting?.country_code?.toLowerCase();
  const flagSrc = countryCode ? `/svg/flags/${countryCode}.svg` : null;

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
          <Grid container spacing={2} sx={{ mb: 1 }}>
            {user && isUberUser && (
              <Grid size={{ xs: 12 }}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<Icon icon="down" color="secondary" />}
                  >
                    Uber User Only
                  </AccordionSummary>
                  <AccordionDetails>
                    <pre style={{ fontSize: '10px', margin: 0 }}>
                      ting: {JSON.stringify(ting, null, 2)}
                    </pre>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            )}

            {/* User or SignIn */}
            <Grid size={{ xs: 12, md: 6 }}>
              

              {user ? <User /> : <SignIn />}

              <Box sx={{ mt: 2 }}>
                <MenuSystem />
              </Box>

              {ting && (
                <Box sx={{ mt: 2, mx: 1 }}>
                  {/* Location */}
                  <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                    Location
                  </Typography>
                  <Typography variant="body2">
                    {ting.city || 'Unknown'}, {ting.state_prov || ''}{' '}
                    {ting.country_name || ''}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Technical */}
                  <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                    Device
                  </Typography>
                  <Typography variant="body2">
                    {ting.browser} on {ting.os}
                  </Typography>
                  <Typography variant="body2">
                    RAM: {ting.deviceMemory} GB • Cores:{' '}
                    {ting.hardwareConcurrency}
                  </Typography>
                  <Typography variant="body2">
                    Platform: {ting.platform}
                  </Typography>

                  <Divider sx={{ my: 1.5 }} />

                  {/* Network */}
                  <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                    Network
                  </Typography>
                  <Typography variant="body2">IP: {ting.ip}</Typography>
                  <Typography variant="body2">{ting.isp}</Typography>
                  <Typography variant="body2">{ting.organization}</Typography>
                </Box>
              )}
            </Grid>

            {/* MenuSystem */}
            <Grid size={{ xs: 12, md: 6 }}>
              {/* Flag */}
              <Box sx={{ mx: 2, mt: 1 }}>
                {flagSrc && (
                  <Avatar
                    src={flagSrc}
                    alt={ting?.country_name}
                    sx={{ width: 48, height: 48 }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <IconButton color="primary" onClick={handleClose}>
            <Icon icon="close" />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
