import React, { useEffect } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography,
  makeStyles
} from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Home as HomeIcon,
  User as UsersIcon,
  Heart as HeartIcon,
} from 'react-feather';
import { useAuth } from 'src/context/AuthContext';
import { GiCow } from 'react-icons/gi';
import NavItem from './NavItem';

const user = {
  avatar: '/static/images/avatars/logo.jpeg',
  jobTitle: 'Bem vindo',
  name: 'Nilton'
};

const items = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard'
  },
  {
    href: '/app/fazendas',
    icon: HomeIcon,
    title: 'Fazendas'
  },
  {
    href: '/app/funcionarios',
    icon: UsersIcon,
    title: 'Funcionarios'
  },
  {
    href: '/app/animais',
    icon: GiCow,
    title: 'Animais'
  },
  {
    href: '/app/medicamentos',
    icon: HeartIcon,
    title: 'Medicamentos'
  },
  // {
  //   href: '/app/orcamento',
  //   icon: File,
  //   title: 'Orçamento'
  // },
  // {
  //   href: '/app/vendas',
  //   icon: DollarSign,
  //   title: 'Vendas'
  // },
  // {
  //   href: '/app/titulos-a-receber',
  //   icon: CreditCard,
  //   title: 'A Receber'
  // },
  // {
  //   href: '/app/relatorios',
  //   icon: FilePlus,
  //   title: 'Relatórios'
  // },
];

const useStyles = makeStyles(() => ({
  mobileDrawer: {
    width: 256
  },
  desktopDrawer: {
    width: 256,
    top: 64,
    height: 'calc(100% - 64px)'
  },
  avatar: {
    cursor: 'pointer',
    width: 64,
    height: 64
  }
}));

const NavBar = ({ onMobileClose, openMobile }) => {
  const classes = useStyles();
  const location = useLocation();
  const { user: userReal } = useAuth();

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const content = (
    <Box
      height="100%"
      display="flex"
      flexDirection="column"
    >
      <Box
        alignItems="center"
        display="flex"
        flexDirection="column"
        p={2}
      >
        <Avatar
          className={classes.avatar}
          component={RouterLink}
          src={user.avatar}
          to="/app/account"
        />
        <Typography
          className={classes.name}
          color="textPrimary"
          variant="h5"
        >
          Bem vindo
          {' '}
          {userReal.user.username}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        />
      </Box>
      <Divider />
      <Box p={2}>
        <List>
          {items.map((item) => (
            <NavItem
              href={item.href}
              key={item.title}
              title={item.title}
              icon={item.icon}
            />
          ))}
        </List>
      </Box>
      <Box flexGrow={1} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor="left"
          classes={{ paper: classes.mobileDrawer }}
          onClose={onMobileClose}
          open={openMobile}
          variant="temporary"
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden mdDown>
        <Drawer
          anchor="left"
          classes={{ paper: classes.desktopDrawer }}
          open
          variant="persistent"
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

NavBar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

NavBar.defaultProps = {
  onMobileClose: () => {},
  openMobile: false
};

export default NavBar;
