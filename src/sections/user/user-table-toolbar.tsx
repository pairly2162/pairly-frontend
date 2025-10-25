import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isOnlineFilter: string;
  onIsOnlineFilterChange: (value: string) => void;
  isMockDataFilter: string;
  onIsMockDataFilterChange: (value: string) => void;
  genderFilter: string;
  onGenderFilterChange: (value: string) => void;
  cityFilter: string;
  onCityFilterChange: (value: string) => void;
};

export function UserTableToolbar({ 
  numSelected, 
  filterName, 
  onFilterName, 
  isOnlineFilter, 
  onIsOnlineFilterChange, 
  isMockDataFilter, 
  onIsMockDataFilterChange,
  genderFilter,
  onGenderFilterChange,
  cityFilter,
  onCityFilterChange
}: UserTableToolbarProps) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flex: 1 }}>
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search user, email, or city..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
          
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={isOnlineFilter}
              onChange={(e) => onIsOnlineFilterChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="true">Online</MenuItem>
              <MenuItem value="false">Offline</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={isMockDataFilter}
              onChange={(e) => onIsMockDataFilterChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Data</MenuItem>
              <MenuItem value="true">Mock Data</MenuItem>
              <MenuItem value="false">Real Data</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={genderFilter}
              onChange={(e) => onGenderFilterChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Gender</MenuItem>
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={cityFilter}
              onChange={(e) => onCityFilterChange(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">All Cities</MenuItem>
              <MenuItem value="Mumbai">Mumbai</MenuItem>
              <MenuItem value="Delhi">Delhi</MenuItem>
              <MenuItem value="Bangalore">Bangalore</MenuItem>
              <MenuItem value="Chennai">Chennai</MenuItem>
              <MenuItem value="Kolkata">Kolkata</MenuItem>
              <MenuItem value="Hyderabad">Hyderabad</MenuItem>
              <MenuItem value="Pune">Pune</MenuItem>
              <MenuItem value="Ahmedabad">Ahmedabad</MenuItem>
              <MenuItem value="Jaipur">Jaipur</MenuItem>
              <MenuItem value="Surat">Surat</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
