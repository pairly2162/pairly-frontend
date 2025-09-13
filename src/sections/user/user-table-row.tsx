import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type UserProps = {
  id: string;
  name: string;
  email: string;
  gender: string | null;
  role: string;
  status: string;
  company: string;
  avatarUrl: string;
  isVerified: boolean;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function UserTableRow({ row, selected, onSelectRow }: UserTableRowProps) {

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar alt={row.name} src={row.avatarUrl} />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>{row.email}</TableCell>

        <TableCell>
          <Label color={row.gender === 'male' ? 'info' : row.gender === 'female' ? 'secondary' : 'default'}>
            {row.gender ? row.gender.charAt(0).toUpperCase() + row.gender.slice(1) : 'Not specified'}
          </Label>
        </TableCell>

        <TableCell>
          <Label color={row.status === 'online' ? 'success' : 'default'}>
            {row.status}
          </Label>
        </TableCell>

        <TableCell>
          <Label color={row.role === 'Super Admin' ? 'warning' : 'info'}>
            {row.role}
          </Label>
        </TableCell>

        <TableCell align="center">
          {row.isVerified ? (
            <Iconify width={22} icon="solar:check-circle-bold" sx={{ color: 'success.main' }} />
          ) : (
            '-'
          )}
        </TableCell>

        <TableCell>
          {new Date().toLocaleDateString()}
        </TableCell>
      </TableRow>


    </>
  );
}
