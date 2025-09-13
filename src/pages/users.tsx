import { useState, useEffect, useCallback } from 'react';

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
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { useBoolean } from 'minimal-shared/hooks';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { UserTableToolbar } from '../sections/user/user-table-toolbar';

import { authService, AdminUser, UserPaginationParams } from '../services/auth.service';

// ----------------------------------------------------------------------

export default function UsersPage() {

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [isOnlineFilter, setIsOnlineFilter] = useState('');
  const [isMockDataFilter, setIsMockDataFilter] = useState('');

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
      };

      const response = await authService.getUsers(params);
      
      if (response.success) {
        setUsers(response.data.data);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, search, isOnlineFilter, isMockDataFilter]);

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

  const renderTable = (
    <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
      <Scrollbar>
        <Table size="medium" sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Created</TableCell>
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
                          src={user.profilePhotoUrl}
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
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Typography>
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
      <Typography variant="h4" sx={{ mb: 5 }}>
        Users
      </Typography>

      <Card>
        <UserTableToolbar
          numSelected={selected.length}
          filterName={search}
          onFilterName={handleSearchChange}
          isOnlineFilter={isOnlineFilter}
          onIsOnlineFilterChange={handleIsOnlineFilterChange}
          isMockDataFilter={isMockDataFilter}
          onIsMockDataFilterChange={handleIsMockDataFilterChange}
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

    </Container>
  );
}

