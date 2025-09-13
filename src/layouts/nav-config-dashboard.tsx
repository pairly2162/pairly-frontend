import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Users',
    path: '/admin/dashboard/users',
    icon: icon('ic-user'),
  },
  {
    title: 'User Profile',
    path: '/admin/dashboard/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Product',
    path: '/admin/dashboard/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Blog',
    path: '/admin/dashboard/blog',
    icon: icon('ic-blog'),
  },
];
