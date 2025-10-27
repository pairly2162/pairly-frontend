import { useRef, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { UserTableToolbar } from '../sections/user/user-table-toolbar';

import { authService } from '../services/auth.service';
import type { AdminUser, UserPaginationParams } from '../services/auth.service';

// ----------------------------------------------------------------------

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [isOnlineFilter, setIsOnlineFilter] = useState('');
  const [isMockDataFilter, setIsMockDataFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<AdminUser | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // Action Menu States
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  
  // Add User Dialog States
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    sexuality: 'straight',
    dateOfBirth: '',
    gender: 'male',
    interestedIn: [] as string[],
    interests: [] as string[],
    height: '',
  });
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);
  
  // Location/Place autocomplete states
  const [placeOptions, setPlaceOptions] = useState<any[]>([]);
  const [placeLoading, setPlaceLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [placeInputValue, setPlaceInputValue] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: UserPaginationParams = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
        search: search || undefined,
        isOnline: isOnlineFilter !== '' ? isOnlineFilter === 'true' : undefined,
        isMockData: isMockDataFilter !== '' ? isMockDataFilter === 'true' : undefined,
        gender: genderFilter || undefined,
        city: cityFilter || undefined,
      };

      const response = await authService.getUsers(params);
      
      if (response.success) {
        setUsers(response.data.data);
        setTotal(response.data.total);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, isOnlineFilter, isMockDataFilter, genderFilter, cityFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(0); // Reset to first page when searching
  };

  const handleIsOnlineFilterChange = (value: string) => {
    setIsOnlineFilter(value);
    setPage(0); // Reset to first page when filtering
  };

  const handleIsMockDataFilterChange = (value: string) => {
    setIsMockDataFilter(value);
    setPage(0); // Reset to first page when filtering
  };

  const handleGenderFilterChange = (value: string) => {
    setGenderFilter(value);
    setPage(0); // Reset to first page when filtering
  };

  const handleCityFilterChange = (value: string) => {
    setCityFilter(value);
    setPage(0); // Reset to first page when filtering
  };

  const handleDeleteClick = (user: AdminUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      setDeleteLoading(true);
      setError('');
      
      const response = await authService.deleteUser(userToDelete.id);
      
      if (response.success) {
        // Refresh the users list
        await fetchUsers();
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddUserClick = () => {
    setAddDialogOpen(true);
    setAddError('');
    setFormData({
      name: '',
      email: '',
      sexuality: 'straight',
      dateOfBirth: '',
      gender: 'male',
      interestedIn: [],
      interests: [],
      height: '',
    });
    setProfilePhotoFile(null);
    setPhotoFiles([]);
  };

  const handleAddUserCancel = () => {
    setAddDialogOpen(false);
    setFormData({
      name: '',
      email: '',
      sexuality: 'straight',
      dateOfBirth: '',
      gender: 'male',
      interestedIn: [],
      interests: [],
      height: '',
    });
    setProfilePhotoFile(null);
    setPhotoFiles([]);
    setAddError('');
    setSelectedPlace(null);
    setPlaceInputValue('');
    setPlaceOptions([]);
  };

  const handleFormChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setProfilePhotoFile(event.target.files[0]);
    }
  };

  const handlePhotosChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setPhotoFiles(Array.from(event.target.files));
    }
  };

  const handleAddUserConfirm = async () => {
    try {
      setAddLoading(true);
      setUploadProgress(true);
      setAddError('');

      // Validate required fields
      if (!formData.name || !formData.dateOfBirth || !formData.gender || !formData.sexuality || !formData.height) {
        setAddError('Please fill in all required fields');
        setAddLoading(false);
        setUploadProgress(false);
        return;
      }

      if (formData.interestedIn.length === 0) {
        setAddError('Please select at least one interested gender');
        setAddLoading(false);
        setUploadProgress(false);
        return;
      }

      // Validate height (required field)
      if (!formData.height || isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
        setAddError('Height must be a valid positive number');
        setAddLoading(false);
        setUploadProgress(false);
        return;
      }

      let profilePhotoUrl = '';
      let photoUrls: string[] = [];

      // Upload profile photo if selected
      if (profilePhotoFile) {
        const profileResponse = await authService.uploadFiles([profilePhotoFile]);
        if (profileResponse.success && profileResponse.data.length > 0) {
          profilePhotoUrl = profileResponse.data[0].url;
        }
      }

      // Upload multiple photos if selected
      if (photoFiles.length > 0) {
        const photosResponse = await authService.uploadFiles(photoFiles);
        if (photosResponse.success && photosResponse.data.length > 0) {
          photoUrls = photosResponse.data.map((file: any) => file.url);
        }
      }

      setUploadProgress(false);

      // Create user with uploaded file URLs
      const userData = {
        ...formData,
        height: formData.height ? Number(formData.height) : undefined,
        profilePhotoUrl: profilePhotoUrl || undefined,
        photoUrls: photoUrls.length > 0 ? photoUrls : undefined,
        placeId: selectedPlace?.placeId || undefined,
      };

      const response = await authService.createUser(userData);

      if (response.success) {
        await fetchUsers();
        setAddDialogOpen(false);
        handleAddUserCancel();
      } else {
        setAddError(response.message);
      }
    } catch (err: any) {
      setAddError(err.message);
    } finally {
      setAddLoading(false);
      setUploadProgress(false);
    }
  };

  const availableInterests = [
    'Art & Painting', 'Photography', 'Writing & Blogging', 'Books & Reading', 
    'Movies & Series', 'Music', 'Podcasts & Audiobooks', 'Theater & Acting',
    'Comedy & Stand-up', 'Fitness & Gym', 'Yoga & Meditation', 'Mindfulness',
    'Minimalism', 'Cooking & Baking', 'Foodie', 'Coffee & Cafes', 'Tea Lover',
    'Wine & Beer', 'Sports & Outdoor', 'Nature & Hiking', 'Gardening', 'Dancing',
    'Beach Lover', 'Mountains Lover', 'DIY & Crafts', 'Home Decor', 'Fashion & Style',
    'Collecting (e.g. stamps, coins)', 'Board Games & Puzzles', 'Nightlife & Clubs',
    'Gaming', 'Technology & Gadgets', 'Science & Space', 'Travel & Adventure',
    'Cars & Bikes', 'Volunteering & Social Work', 'Astrology & Spirituality',
    'Learning Languages', 'Startup & Entrepreneurship', 'Pets & Animals'
  ];

  // Fetch places with debounce
  const fetchPlaces = async (query: string) => {
    if (!query || query.length < 3) {
      setPlaceOptions([]);
      return;
    }

    try {
      setPlaceLoading(true);
      const response = await authService.getPlacesAutocomplete(query);
      if (response.success && response.data) {
        // The API returns data as an array directly, not nested in predictions
        setPlaceOptions(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      console.error('Error fetching places:', err);
    } finally {
      setPlaceLoading(false);
    }
  };

  const handlePlaceInputChange = (event: any, newInputValue: string) => {
    setPlaceInputValue(newInputValue);
    
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer
    debounceTimerRef.current = setTimeout(() => {
      fetchPlaces(newInputValue);
    }, 500);
  };

  const handlePlaceChange = (event: any, newValue: any) => {
    setSelectedPlace(newValue);
  };

  const handleActionMenuOpen = (event: React.MouseEvent<HTMLElement>, user: AdminUser) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedUser(user);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedUser(null);
  };

  const handleViewDetails = () => {
    if (selectedUser) {
      navigate(`/admin/user/${selectedUser.id}`);
    }
    handleActionMenuClose();
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      handleDeleteClick(selectedUser);
    }
    handleActionMenuClose();
  };

  const getPhotoUrl = (photoUrl: string) => {
    if (photoUrl.startsWith('/public/')) {
      const apiBaseUrl = import.meta.env.VITE_API_URL || 'https://api.pairly.fun';
      return `${apiBaseUrl}${photoUrl}`;
    }
    return photoUrl;
  };

  const renderTable = (
    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
      <Scrollbar>
        <Table size="medium" sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>City</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Mock Data</TableCell>
              <TableCell>Created</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: 'grey.300',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                      }}
                    >
                      {user.profilePhotoUrl ? (
                        <img
                          src={getPhotoUrl(user.profilePhotoUrl)}
                          alt={user.name}
                          style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                        />
                      ) : (
                        <Iconify icon="eva:checkmark-fill" width={24} />
                      )}
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" noWrap>
                        {user.name}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" noWrap>
                    {user.email}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" noWrap>
                    {user.formattedAddress || 'Not specified'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2" noWrap>
                    {user.city || 'Not specified'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not specified'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: user.isOnline ? 'success.main' : 'grey.400',
                      }}
                    />
                    <Typography variant="body2">
                      {user.isOnline ? 'Online' : 'Offline'}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {user.isSuperAdmin ? 'Super Admin' : 'User'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {user.isMockData ? 'Yes' : 'No'}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <Tooltip title="Actions">
                    <IconButton 
                      onClick={(e) => handleActionMenuOpen(e, user)}
                    >
                      <Iconify icon="custom:menu-duotone" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <Container maxWidth="xl">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
        <Typography variant="h4">
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<Iconify icon="solar:check-circle-bold" />}
          onClick={handleAddUserClick}
        >
          Add User
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={0}
          filterName={search}
          onFilterName={handleSearchChange}
          isOnlineFilter={isOnlineFilter}
          onIsOnlineFilterChange={handleIsOnlineFilterChange}
          isMockDataFilter={isMockDataFilter}
          onIsMockDataFilterChange={handleIsMockDataFilterChange}
          genderFilter={genderFilter}
          onGenderFilterChange={handleGenderFilterChange}
          cityFilter={cityFilter}
          onCityFilterChange={handleCityFilterChange}
        />

        <Box sx={{ p: 3 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {renderTable}

              <TablePagination
                page={page}
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[5, 10, 25]}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Box>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user &quot;{userToDelete?.name}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleteLoading}
          >
            {deleteLoading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addDialogOpen}
        onClose={handleAddUserCancel}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          {addError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {addError}
            </Alert>
          )}

          {uploadProgress && (
            <Alert severity="info" sx={{ mb: 2 }}>
              Uploading files, please wait...
            </Alert>
          )}

          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => handleFormChange('name', e.target.value)}
            />

            <TextField
              label="Email"
              fullWidth
              type="email"
              value={formData.email}
              onChange={(e) => handleFormChange('email', e.target.value)}
            />

            <TextField
              label="Date of Birth"
              fullWidth
              required
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleFormChange('dateOfBirth', e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Gender"
              fullWidth
              required
              select
              value={formData.gender}
              onChange={(e) => handleFormChange('gender', e.target.value)}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>

            <TextField
              label="Sexuality"
              fullWidth
              required
              select
              value={formData.sexuality}
              onChange={(e) => handleFormChange('sexuality', e.target.value)}
            >
              <MenuItem value="straight">Straight</MenuItem>
              <MenuItem value="gay">Gay</MenuItem>
              <MenuItem value="lesbian">Lesbian</MenuItem>
              <MenuItem value="bisexual">Bisexual</MenuItem>
            </TextField>

            <TextField
              label="Height (cm)"
              fullWidth
              required
              type="number"
              value={formData.height}
              onChange={(e) => handleFormChange('height', e.target.value)}
              inputProps={{
                min: 0,
                step: 0.1,
              }}
              helperText="Enter height in centimeters"
            />

            <FormControl fullWidth required>
              <InputLabel>Interested In</InputLabel>
              <Select
                multiple
                value={formData.interestedIn}
                onChange={(e) => handleFormChange('interestedIn', e.target.value)}
                input={<OutlinedInput label="Interested In" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Interests</InputLabel>
              <Select
                multiple
                value={formData.interests}
                onChange={(e) => handleFormChange('interests', e.target.value)}
                input={<OutlinedInput label="Interests" />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} size="small" />
                    ))}
                  </Box>
                )}
              >
                {availableInterests.map((interest) => (
                  <MenuItem key={interest} value={interest}>
                    {interest}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              fullWidth
              options={placeOptions}
              loading={placeLoading}
              value={selectedPlace}
              onChange={handlePlaceChange}
              inputValue={placeInputValue}
              onInputChange={handlePlaceInputChange}
              getOptionLabel={(option) => option.description || ''}
              isOptionEqualToValue={(option, value) => option.placeId === value.placeId}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Location (Google Places)"
                  placeholder="Search for a location..."
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {placeLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              renderOption={(props, option) => (
                <li {...props} key={option.placeId}>
                  <Box>
                    <Typography variant="body2">
                      {option.structuredFormatting?.main_text || option.description}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.structuredFormatting?.secondary_text || ''}
                    </Typography>
                  </Box>
                </li>
              )}
              noOptionsText={
                placeInputValue.length < 3
                  ? 'Type at least 3 characters...'
                  : 'No locations found'
              }
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Profile Photo (Single)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                {profilePhotoFile ? profilePhotoFile.name : 'Choose Profile Photo'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                />
              </Button>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Additional Photos (Multiple)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                fullWidth
              >
                {photoFiles.length > 0 ? `${photoFiles.length} files selected` : 'Choose Photos'}
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handlePhotosChange}
                />
              </Button>
              {photoFiles.length > 0 && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                  {photoFiles.map(f => f.name).join(', ')}
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddUserCancel} disabled={addLoading}>
            Cancel
          </Button>
          <Button 
            onClick={handleAddUserConfirm} 
            variant="contained"
            disabled={addLoading || uploadProgress}
          >
            {addLoading ? <CircularProgress size={24} /> : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Menu */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <Iconify icon="solar:eye-bold" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDeleteUser} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <Iconify icon="solar:trash-bin-trash-bold" sx={{ color: 'error.main' }} />
          </ListItemIcon>
          <ListItemText>Delete User</ListItemText>
        </MenuItem>
      </Menu>

    </Container>
  );
}

