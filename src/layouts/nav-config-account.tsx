import { Iconify } from 'src/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';

// ----------------------------------------------------------------------

export const _account: AccountPopoverProps['data'] = [  
  {
    label: 'Manage Account',
    href: '/admin/manage-account',
    icon: <Iconify width={22} icon="solar:shield-keyhole-bold-duotone" />,
  }  
];
