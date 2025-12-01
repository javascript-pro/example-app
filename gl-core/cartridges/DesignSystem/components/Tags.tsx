// /Users/goldlabel/GitHub/example-app/gl-core/cartridges/DesignSystem/components/Tags.tsx
'use client';
import * as React from 'react';
import {
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from '@mui/material';
import { useDispatch, Icon } from '../../../../gl-core';
import { useDesignSystem, setDesignSystemKey } from '../../DesignSystem';
import { usePaywallContent } from '../../Uberedux';

export default function Tags() {
  const dispatch = useDispatch();
  const { tagsOpen } = useDesignSystem();
  const paywallContent = usePaywallContent();

  const toggleTagsOpen = () => {
    dispatch(setDesignSystemKey('tagsOpen', !tagsOpen));
  };

  return (
    <>
      {/* <IconButton color="secondary" onClick={toggleTagsOpen}>
        <Icon icon="tags" />
      </IconButton> */}

      <Dialog
        fullWidth
        open={tagsOpen}
        onClose={toggleTagsOpen}
        maxWidth={'sm'}
      >
        <DialogContent>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography variant="h6">Tags for this page</Typography>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography>Other pages with any of those tags</Typography>
            </Grid>
          </Grid>
        </DialogContent>

        <Accordion sx={{ mx: 2, background: 0, boxShadow: 0 }}>
          <AccordionSummary expandIcon={<Icon icon="up" color="primary" />}>
            paywallContent:
          </AccordionSummary>
          <AccordionDetails>
            <pre style={{ fontSize: '10px', margin: 0 }}>
              {JSON.stringify(paywallContent, null, 2)}
            </pre>
          </AccordionDetails>
        </Accordion>

        <DialogActions>
          <IconButton color="primary" onClick={toggleTagsOpen}>
            <Icon icon="close" />
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
