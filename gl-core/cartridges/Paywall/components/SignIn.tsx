// cartridges/Paywall/components/SignIn.tsx
'use client';
import * as React from 'react';
import { Box, Typography, CardContent, Button, Grid } from '@mui/material';
import {
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  GithubAuthProvider,
  TwitterAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import { Icon, useDispatch } from '../../../../gl-core';
import { setFeedback } from '../../DesignSystem';

export default function SignIn() {
  const dispatch = useDispatch();
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => onAuthStateChanged(auth, (u) => setUser(u)), []);
  if (user) return null;

  const handleGoogle = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (err) {
      dispatch(
        setFeedback({
          severity: 'error',
          title: 'Problem signing into Google',
          description: (err as Error).message,
        }),
      );
    }
  };

  const handleGithub = async () => {
    try {
      await signInWithPopup(auth, new GithubAuthProvider());
    } catch (err) {
      dispatch(
        setFeedback({
          severity: 'error',
          title: 'Problem signing into Github',
          description: (err as Error).message,
        }),
      );
    }
  };

  const handleTwitter = async () => {
    try {
      await signInWithPopup(auth, new TwitterAuthProvider());
    } catch (err) {
      dispatch(
        setFeedback({
          severity: 'error',
          title: 'Problem signing into Twitter',
          description: (err as Error).message,
        }),
      );
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid size={{ xs: 12 }}>
        <CardContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Auth required. Please sign in using one of the providers below. If
            you need access but can't use these options, let us know
          </Typography>

          <Button
            fullWidth
            variant="contained"
            onClick={handleGoogle}
            startIcon={<Icon icon="google" />}
            sx={{ py: 1.6 }}
          >
            Google
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleGithub}
            startIcon={<Icon icon="github" />}
            sx={{ py: 1.6, mt: 2 }}
          >
            GitHub
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleTwitter}
            startIcon={<Icon icon="twitter" />}
            sx={{ py: 1.6, mt: 2 }}
          >
            Twitter
          </Button>
        </CardContent>
      </Grid>
    </Grid>
  );
}
