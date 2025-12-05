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
  const { userDialog } = paywall || {};
  const isUberUser = useIsUberUser();

  const handleClose = () => {
    dispatch(setPaywallKey('userDialog', false));
  };

  // --- Defensive extractions ---
  const countryCode = ting?.country_code?.toLowerCase() || null;
  const flagSrc = countryCode ? `/svg/flags/${countryCode}.svg` : null;

  const city = ting?.city || 'Unknown';
  const state = ting?.state_prov || '';
  const country = ting?.country_name || '';

  const browser = ting?.browser || 'Unknown browser';
  const os = ting?.os || 'Unknown OS';

  const deviceMemory = ting?.deviceMemory ?? null;
  const hardwareConcurrency = ting?.hardwareConcurrency ?? null;
  const platform = ting?.platform || 'Unknown platform';

  const ip = ting?.ip || 'Unknown IP';
  const isp = ting?.isp || '';
  const org = ting?.organization || '';

  return (
    <Dialog
      fullWidth
      fullScreen={isMobile || fullScreen}
      open={Boolean(userDialog)}
      onClose={handleClose}
      maxWidth="sm"
    >
      <DialogContent>
        <Grid container spacing={2} sx={{ mb: 1 }}>

          {/* Uber User Debug */}
          {user && isUberUser && (
            <Grid size={{ xs: 12 }}>
              <Accordion>
                <AccordionSummary expandIcon={<Icon icon="down" color="secondary" />}>
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

          {/* User + Menu */}
          <Grid size={{ xs: 12, md: 6 }}>
            {user ? <User /> : <SignIn />}
            <Box sx={{ mt: 2 }}>
              <MenuSystem />
            </Box>
          </Grid>

          {/* Location + Device Info */}
          <Grid size={{ xs: 12, md: 6 }}>

            {/* Location */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                Location
              </Typography>

              <Box sx={{ display: 'flex', mt: 1 }}>
                {flagSrc && (
                  <Avatar
                    sx={{ mr: 1 }}
                    src={flagSrc}
                    alt={country}
                  />
                )}
                <Typography variant="body2">
                  {city}, {state}
                  <br />
                  {country}
                </Typography>
              </Box>
            </Box>

            {/* Network */}
            {ting && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                  Network
                </Typography>

                <Typography variant="body2">IP: {ip}</Typography>
                {isp && <Typography variant="body2">{isp}</Typography>}
                {org && <Typography variant="body2">{org}</Typography>}
              </Box>
            )}

            {/* Device */}
            {ting && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ opacity: 0.7 }}>
                  Device
                </Typography>

                <Typography variant="body2">
                  {browser} on {os}
                </Typography>

                {(deviceMemory || hardwareConcurrency) && (
                  <Typography variant="body2">
                    {deviceMemory && <>RAM: {deviceMemory} GB</>}
                    {deviceMemory && hardwareConcurrency && ' • '}
                    {hardwareConcurrency && <>Cores: {hardwareConcurrency}</>}
                  </Typography>
                )}

                <Typography variant="body2">
                  Platform: {platform}
                </Typography>
              </Box>
            )}

          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <IconButton color="primary" onClick={handleClose}>
          <Icon icon="close" />
        </IconButton>
      </DialogActions>
    </Dialog>
  );
}
