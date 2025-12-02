'use client';
// /Users/goldlabel/GitHub/core/gl-core/cartridges/DesignSystem/components/Feedback.tsx
import * as React from 'react';
import { TAuthForm } from '../../../../gl-core/types';
import { Snackbar, Alert, IconButton } from '@mui/material';
import { useDispatch, Icon } from '../../../../gl-core';
import { useFeedback, setFeedback } from '../../DesignSystem';

export default function Feedback({}: TAuthForm) {
  const feedback = useFeedback();
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (feedback && !feedback.hidden) {
      const timer = setTimeout(() => {
        dispatch(setFeedback(null));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback, dispatch]);

  if (!feedback || feedback.hidden) return null;

  const { title, description, severity } = feedback;

  const handleClose = () => {
    dispatch(setFeedback(null));
  };

  return (
    <Snackbar
      open
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
      onClose={handleClose}
    >
      <Alert
        variant='filled'
        severity={severity}
        sx={{ minWidth: 250 }}
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={handleClose}
          >
            <Icon icon="close" />
          </IconButton>
        }
      >
        <strong>{title}</strong>
        <br />
        {description}
      </Alert>
    </Snackbar>
  );
}
