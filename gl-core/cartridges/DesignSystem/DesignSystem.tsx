// core/gl-core/cartridges/DesignSystem/DesignSystem.tsx
'use client';
import * as React from 'react';
import { TTheme, IDesignSystem, TFeedback } from './types';
import { ThemeProvider, CssBaseline } from '@mui/material';
import {
  useDesignSystem,
  useMUITheme,
  setFeedback,
  setDesignSystemKey,
  SystemDialog,
  Feedback,
  PushButton,
  LoadingOverlay,
  Footer,
} from '../DesignSystem';
import { useDispatch, useSlice } from '../Uberedux';

export default function DesignSystem({
  theme,
  children = null,
}: IDesignSystem) {
  const newtheme = useMUITheme(theme as TTheme);
  const { feedbackTested } = useDesignSystem();
  const dispatch = useDispatch();
  const { version } = useSlice();
  React.useEffect(() => {
    if (!feedbackTested) {
      // const feedback: TFeedback = {
      //   severity: 'success',
      //   title: `v${version} booted OK`,
      // };
      // dispatch(setFeedback(feedback));
      dispatch(setDesignSystemKey('feedbackTested', true));
    }
  }, [dispatch, feedbackTested]);

  return (
    <ThemeProvider theme={newtheme}>
      <CssBaseline />
      <LoadingOverlay />
      <Feedback />
      <SystemDialog />
      {children}
      <PushButton />
      <Footer />
    </ThemeProvider>
  );
}
