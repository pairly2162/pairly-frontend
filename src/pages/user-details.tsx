import { useRef, useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
// import Grid from '@mui/material/Grid';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import LinearProgress from '@mui/material/LinearProgress';

import { Iconify } from 'src/components/iconify';
import { authService } from '../services/auth.service';

// ----------------------------------------------------------------------

interface UserDetails {
  id: string;
  name: string;
  email: string;
  phoneNumber: string | null;
  bio: string | null;
  sexuality: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  interestedIn: string[];
  age: number | null;
  profilePhotoUrl: string | null;
  photoUrls: string[];
  interests: string[];
  height: number | null;
  drinkingHabits: string | null;
  smokingHabits: string | null;
  preferences: any;
  isVerified: boolean;
  isOnline: boolean;
  lastSeen: string | null;
  emailVerified: boolean;
  heightUnit: string | null;
  profileStep: number | null;
  jobTitle: string | null;
  education: string | null;
  relationshipGoal: string | null;
  showLastActivity: boolean;
  isSelfieVerified: boolean;
  isMockData: boolean;
  isDeleted: boolean;
  isSubscribe: boolean;
  isSuperAdmin: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  location: {
    id: string;
    placeId: string;
    formattedAddress: string;
    latitude: number;
    longitude: number;
    addressLine1: string;
    city: string | null;
    pinCode: string | null;
    addressJson: any;
  } | null;
}

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchUserDetails = useCallback(async () => {
    if (!id) {
      setError('User ID is required');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await authService.getUserDetails(id);
      
      if (response.success) {
        setUserDetails(response.data);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatHeight = (height: number | null, unit: string | null) => {
    if (!height) return 'Not specified';
    if (unit === 'feet_inches') {
      const feet = Math.floor(height / 12);
      const inches = height % 12;
      return `${feet}'${inches}"`;
    }
    return `${height} cm`;
  };

  const handleDeletePhoto = async (photoUrl: string) => {
    if (!id || !userDetails) return;
    
    try {
      setDeleteLoading(photoUrl);
      const response = await authService.deleteUserPhoto(id, photoUrl);
      
      if (response.success) {
        // Update local state by removing the deleted photo
        setUserDetails({
          ...userDetails,
          photoUrls: userDetails.photoUrls.filter(url => url !== photoUrl)
        });
        setSnackbar({ open: true, message: 'Photo deleted successfully', severity: 'success' });
      } else {
        setSnackbar({ open: true, message: response.message || 'Failed to delete photo', severity: 'error' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to delete photo', severity: 'error' });
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleAddPhotos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!id || !event.target.files) return;
    
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setUploadLoading(true);
      const response = await authService.addUserPhotos(id, files);
      
      if (response.success && userDetails) {
        // Update local state with new photos
        setUserDetails({
          ...userDetails,
          photoUrls: [...(userDetails.photoUrls || []), ...response.data.photoUrls]
        });
        setSnackbar({ open: true, message: 'Photos added successfully', severity: 'success' });
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        setSnackbar({ open: true, message: response.message || 'Failed to add photos', severity: 'error' });
      }
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Failed to add photos', severity: 'error' });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!userDetails) {
    return (
      <Container maxWidth="xl">
        <Alert severity="warning" sx={{ mt: 3 }}>
          User details not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<Iconify icon="solar:restart-bold" />}
            onClick={() => navigate('/admin/dashboard/users')}
            sx={{ mr: 2 }}
          >
            Back to Users
          </Button>
          <Typography variant="h4">
            User Details
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<Iconify icon="solar:check-circle-bold" />}
          onClick={() => navigate('/admin/users')}
        >
          Close
        </Button>
      </Box>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          {/* Profile Section */}
          <Box sx={{ flex: { xs: '1', md: '0 0 33.333%' } }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={userDetails.profilePhotoUrl || undefined}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            >
              {userDetails.name?.charAt(0).toUpperCase()}
            </Avatar>
            
            <Typography variant="h5" gutterBottom>
              {userDetails.name || 'No name'}
            </Typography>
            
            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
              <Chip
                label={userDetails.isOnline ? 'Online' : 'Offline'}
                color={userDetails.isOnline ? 'success' : 'default'}
                size="small"
              />
              {userDetails.isVerified && (
                <Chip
                  label="Verified"
                  color="primary"
                  size="small"
                  icon={<Iconify icon="solar:check-circle-bold" />}
                />
              )}
              {userDetails.isMockData && (
                <Chip
                  label="Mock Data"
                  color="secondary"
                  size="small"
                />
              )}
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Email:</strong> {userDetails.email || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Phone:</strong> {userDetails.phoneNumber || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Age:</strong> {userDetails.age || 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Gender:</strong> {userDetails.gender ? userDetails.gender.charAt(0).toUpperCase() + userDetails.gender.slice(1) : 'Not specified'}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <strong>Sexuality:</strong> {userDetails.sexuality ? userDetails.sexuality.charAt(0).toUpperCase() + userDetails.sexuality.slice(1) : 'Not specified'}
              </Typography>
            </Box>
          </Card>
        </Box>

        {/* Main Content */}
        <Box sx={{ flex: { xs: '1', md: '0 0 66.667%' } }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Basic Information */}
            <Box>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Basic Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Date of Birth:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {formatDate(userDetails.dateOfBirth)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Height:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {formatHeight(userDetails.height, userDetails.heightUnit)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Job Title:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.jobTitle || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Education:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.education || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Drinking Habits:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.drinkingHabits ? userDetails.drinkingHabits.charAt(0).toUpperCase() + userDetails.drinkingHabits.slice(1) : 'Not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Smoking Habits:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.smokingHabits ? userDetails.smokingHabits.charAt(0).toUpperCase() + userDetails.smokingHabits.slice(1) : 'Not specified'}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Bio:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.bio || 'Not specified'}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>

            {/* Location Information */}
            <Box>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Location Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {userDetails.location ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Address:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {userDetails.location.formattedAddress}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>City:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {userDetails.location.city || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Pin Code:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {userDetails.location.pinCode || 'Not specified'}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Latitude:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {userDetails.location.latitude}
                      </Typography>
                    </Box>
                    <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Longitude:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {userDetails.location.longitude}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No location information available
                  </Typography>
                )}
              </Card>
            </Box>

            {/* Photos */}
            <Box>
              <Card sx={{ p: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="h6">
                    Photos
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={<Iconify icon="solar:gallery-add-bold" />}
                    component="label"
                    disabled={uploadLoading}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAddPhotos}
                    />
                    Add Photos
                  </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {uploadLoading && (
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Uploading photos...
                    </Typography>
                  </Box>
                )}
                {userDetails.photoUrls && userDetails.photoUrls.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {userDetails.photoUrls.map((photoUrl, index) => (
                      <Box sx={{ flex: { xs: '1', sm: '0 0 50%', md: '0 0 33.333%' } }} key={index}>
                        <Paper
                          elevation={2}
                          sx={{
                            p: 1,
                            textAlign: 'center',
                            position: 'relative',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              transition: 'transform 0.2s',
                              '& .delete-button': {
                                opacity: 1,
                              },
                            },
                          }}
                        >
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 8,
                              right: 8,
                              zIndex: 1,
                              opacity: 0,
                              transition: 'opacity 0.2s',
                            }}
                            className="delete-button"
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleDeletePhoto(photoUrl)}
                              disabled={deleteLoading === photoUrl}
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                '&:hover': {
                                  bgcolor: 'error.main',
                                  color: 'white',
                                },
                              }}
                            >
                              {deleteLoading === photoUrl ? (
                                <CircularProgress size={20} />
                              ) : (
                                <Iconify icon="solar:trash-bin-minimalistic-bold" width={20} />
                              )}
                            </IconButton>
                          </Box>
                          <img
                            src={photoUrl}
                            alt={`Photo ${index + 1}`}
                            style={{
                              width: '100%',
                              height: '200px',
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        </Paper>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No additional photos available
                  </Typography>
                )}
              </Card>
            </Box>

            {/* Interests */}
            <Box>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Interests
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {userDetails.interests && userDetails.interests.length > 0 ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {userDetails.interests.map((interest, index) => (
                      <Chip
                        key={index}
                        label={interest}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No interests specified
                  </Typography>
                )}
              </Card>
            </Box>

            {/* Preferences */}
            <Box>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Preferences
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {userDetails.preferences ? (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {userDetails.preferences.ageRange && (
                      <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Age Range:</strong>
                        </Typography>
                        <Typography variant="body2">
                          {userDetails.preferences.ageRange.min} - {userDetails.preferences.ageRange.max} years
                        </Typography>
                      </Box>
                    )}
                    {userDetails.preferences.distance && (
                      <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                        <Typography variant="body2" color="text.secondary">
                          <strong>Distance:</strong>
                        </Typography>
                        <Typography variant="body2">
                          {userDetails.preferences.distance} km
                        </Typography>
                      </Box>
                    )}
                    <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Interested In:</strong>
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
                        {userDetails.interestedIn.map((gender, index) => (
                          <Chip
                            key={index}
                            label={gender.charAt(0).toUpperCase() + gender.slice(1)}
                            variant="outlined"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Relationship Goal:</strong>
                      </Typography>
                      <Typography variant="body2">
                        {userDetails.relationshipGoal || 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No preferences specified
                  </Typography>
                )}
              </Card>
            </Box>

            {/* Account Information */}
            <Box>
              <Card sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Account Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Profile Step:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.profileStep || 'Not specified'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Email Verified:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.emailVerified ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Selfie Verified:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.isSelfieVerified ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Show Last Activity:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.showLastActivity ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Is Subscribe:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.isSubscribe ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Is Super Admin:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {userDetails.isSuperAdmin ? 'Yes' : 'No'}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Created At:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {formatDateTime(userDetails.createdAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: { xs: '1', sm: '0 0 50%' } }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>Last Seen:</strong>
                    </Typography>
                    <Typography variant="body2">
                      {formatDateTime(userDetails.lastSeen)}
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </Box>
          </Box>
        </Box>
      </Box>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
