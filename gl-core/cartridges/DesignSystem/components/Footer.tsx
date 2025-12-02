// /Users/goldlabel/GitHub/example-app/gl-core/cartridges/DesignSystem/components/Footer.tsx
'use client';
import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import { useIsMobile } from '../../../../gl-core';
import { Search } from '../../DesignSystem';

export type TFooter = {};

export default function Footer({}: TFooter) {
  const isMobile = useIsMobile();
  // if (isMobile) return null;
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          top: 'auto',
          bottom: 0,
        }}
      >
        <Toolbar>
          <Container>
            <Box
              sx={{
                flexGrow: 1,
              }}
            >
              <Grid container spacing={1}>
                
                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}
                >
                  <Box sx={{
                    mt: isMobile ? 2 : 0,
                    textAlign: isMobile ? 'center' : 'left'}}>
                    <Search />
                  </Box>
                </Grid>

                <Grid
                  size={{
                    xs: 12,
                    sm: 6,
                  }}>
                  <Box sx={{
                    mt: 1,
                    textAlign: isMobile ? 'center' : 'right'}}>
                    <Typography 
                      color='text.secondary'
                      variant="caption">
                      
                      Goldlabel Apps Ltd</Typography>
                    
                  </Box>
                </Grid>

              </Grid>
            </Box>
          </Container>
        </Toolbar>
      </AppBar>
    </>
  );
}
