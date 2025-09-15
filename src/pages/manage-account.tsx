import { useState, useEffect } from 'react';
import { 
  Alert, 
  Box, 
  Card, 
  CardContent, 
  Container, 
  FormControlLabel, 
  Snackbar, 
  Switch, 
  Tab, 
  Tabs, 
  TextField, 
  Typography 
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function ManageAccountPage() {
  const { admin } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [profileData, setProfileData] = useState({
    name: admin?.name || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [settings, setSettings] = useState({
    isMockDataEnabled: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  // Update profile data when admin data changes
  useEffect(() => {
    if (admin) {
      setProfileData({
        name: admin.name || '',
      });
    }
  }, [admin]);

  // Update settings when admin data changes
  useEffect(() => {
    if (admin) {
      setSettings({
        isMockDataEnabled: admin.isMockData || false,
      });
    }
  }, [admin]);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    setError('');
    setSuccess('');
  };

  const handleProfileChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingsChange = (field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    if (!admin?.id) {
      setError('Admin ID not found');
      showSnackbar('Admin ID not found', 'error');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authService.updateProfile(admin.id, profileData);
      
      if (response.success) {
        setSuccess('Profile updated successfully!');
        showSnackbar('Profile updated successfully!', 'success');
        // Update the admin context with new data
        // Note: In a real app, you might want to update the context or refetch admin data
      } else {
        setError(response.message || 'Failed to update profile');
        showSnackbar(response.message || 'Failed to update profile', 'error');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      showSnackbar(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!admin?.id) {
      setError('Admin ID not found');
      showSnackbar('Admin ID not found', 'error');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New password and confirm password do not match');
      showSnackbar('New password and confirm password do not match', 'error');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authService.changePassword(admin.id, passwordData);
      
      if (response.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setSuccess('Password changed successfully!');
        showSnackbar('Password changed successfully!', 'success');
      } else {
        setError(response.message || 'Failed to change password');
        showSnackbar(response.message || 'Failed to change password', 'error');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to change password');
      showSnackbar(err.message || 'Failed to change password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!admin?.id) {
      setError('Admin ID not found');
      showSnackbar('Admin ID not found', 'error');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await authService.updateSettings(admin.id, settings);
      
      if (response.success) {
        setSuccess('Settings updated successfully!');
        showSnackbar('Settings updated successfully!', 'success');
      } else {
        setError(response.message || 'Failed to update settings');
        showSnackbar(response.message || 'Failed to update settings', 'error');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
      showSnackbar(err.message || 'Failed to update settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
        <Box sx={{ py: 3 }}>
          <Typography variant="h4" gutterBottom>
            Manage Account
          </Typography>
          
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} aria-label="account management tabs">
                <Tab label="Profile" />
                <Tab label="Password" />
                <Tab label="Settings" />
              </Tabs>
            </Box>

            {/* Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Box sx={{ maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>
                  Update Profile Information
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                
                <TextField
                  fullWidth
                  label="Name"
                  value={profileData.name}
                  onChange={(e) => handleProfileChange('name', e.target.value)}
                  margin="normal"
                />
                
                <Box sx={{ mt: 3 }}>
                  <LoadingButton
                    variant="contained"
                    onClick={handleUpdateProfile}
                    loading={loading}
                  >
                    Update Profile
                  </LoadingButton>
                </Box>
              </Box>
            </TabPanel>

            {/* Password Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                
                <TextField
                  fullWidth
                  type="password"
                  label="Current Password"
                  value={passwordData.currentPassword}
                  onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  type="password"
                  label="New Password"
                  value={passwordData.newPassword}
                  onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                  margin="normal"
                />
                
                <TextField
                  fullWidth
                  type="password"
                  label="Confirm New Password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  margin="normal"
                />
                
                <Box sx={{ mt: 3 }}>
                  <LoadingButton
                    variant="contained"
                    onClick={handleChangePassword}
                    loading={loading}
                  >
                    Change Password
                  </LoadingButton>
                </Box>
              </Box>
            </TabPanel>

            {/* Settings Tab */}
            <TabPanel value={tabValue} index={2}>
              <Box sx={{ maxWidth: 600 }}>
                <Typography variant="h6" gutterBottom>
                  Account Settings
                </Typography>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
                
                {/* Mock Data Settings */}
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Mock Data Settings
                    </Typography>
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={settings.isMockDataEnabled}
                          onChange={(e) => handleSettingsChange('isMockDataEnabled', e.target.checked)}
                        />
                      }
                      label="Enable Mock Data"
                    />
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      When enabled, mock data will be included in discovery results for all users. This is a global setting that affects the entire application.
                    </Typography>
                  </CardContent>
                </Card>
                
                <Box sx={{ mt: 3 }}>
                  <LoadingButton
                    variant="contained"
                    onClick={handleUpdateSettings}
                    loading={loading}
                  >
                    Update Settings
                  </LoadingButton>
                </Box>
              </Box>
            </TabPanel>
          </Card>
        </Box>
        
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbarSeverity}
            sx={{ width: '100%' }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
  );
}
