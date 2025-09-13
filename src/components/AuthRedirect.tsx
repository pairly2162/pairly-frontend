import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import { varAlpha } from 'minimal-shared/utils';

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const AuthRedirect: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return renderFallback();
  }
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Navigate to="/admin/sign-in" replace />;
};
