import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import { DashboardContent } from 'src/layouts/dashboard';
import { authService } from 'src/services/auth.service';

import type { AdminUser, UserPaginationParams } from 'src/services/auth.service';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows } from '../utils';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

// Convert AdminUser to UserProps for compatibility
function convertAdminUserToUserProps(adminUser: AdminUser): UserProps {
  return {
    id: adminUser.id,
    name: adminUser.name,
    email: adminUser.email,
    gender: adminUser.gender,
    role: adminUser.isSuperAdmin ? 'Super Admin' : 'User',
    status: adminUser.isOnline ? 'online' : 'offline',
    company: 'Pairly',
    avatarUrl: adminUser.profilePhotoUrl || '',
    isVerified: !adminUser.isDeleted,
  };
}

export function UserView() {
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [isOnlineFilter, setIsOnlineFilter] = useState('');
  const [isMockDataFilter, setIsMockDataFilter] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const params: UserPaginationParams = {
        page: table.page + 1, // API uses 1-based pagination
        limit: table.rowsPerPage,
        search: filterName || undefined,
        isOnline: isOnlineFilter ? isOnlineFilter === 'true' : undefined,
        isMockData: isMockDataFilter ? isMockDataFilter === 'true' : undefined,
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
  }, [table.page, table.rowsPerPage, filterName, isOnlineFilter, isMockDataFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const notFound = !users.length && (!!filterName || !!isOnlineFilter || !!isMockDataFilter);

  return (
    <DashboardContent>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box>

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          isOnlineFilter={isOnlineFilter}
          onIsOnlineFilterChange={(value) => {
            setIsOnlineFilter(value);
            table.onResetPage();
          }}
          isMockDataFilter={isMockDataFilter}
          onIsMockDataFilterChange={(value) => {
            setIsMockDataFilter(value);
            table.onResetPage();
          }}
        />

        {error && (
          <Alert severity="error" sx={{ m: 2 }}>
            {error}
          </Alert>
        )}

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Name' },
                  { id: 'email', label: 'Email' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'isOnline', label: 'Status' },
                  { id: 'isMockData', label: 'Data Type' },
                  { id: 'isSuperAdmin', label: 'Admin', align: 'center' },
                  { id: 'createdAt', label: 'Created' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      row={convertAdminUserToUserProps(user)}
                      selected={table.selected.includes(user.id)}
                      onSelectRow={() => table.onSelectRow(user.id)}
                    />
                  ))
                )}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
