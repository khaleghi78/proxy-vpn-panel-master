import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import {styled} from '@mui/material/styles';
import * as React from 'react';
import {Route, Routes} from 'react-router-dom';
import peoxypic from '../assets/proxy.png';
import {Divider, Drawer, Toolbar} from '@mui/material';
import {ProxyList} from '../pages';
import {DashboardRoutes} from '../routes/AppRoute';
import ProtectedRoute from '../routes/ProtectedRoute';
import DashboardList from './DashboardList';
import NavUser from './NavUser';

const drawerWidth = 240;

const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{
  open?: boolean;
}>(({theme, open}) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{display: 'flex'}}>
      <CssBaseline />
      <AppBar
        sx={{
          backgroundColor: 'white',
        }}
        position='fixed'
        open={open}
      >
        <Toolbar className='flex items-center justify-between'>
          <p className='text-black'></p>

          <div className='flex items-center'>
            <div className='mx-2 flex flex-col font-Inter'>
              <p className='text-sm font-medium text-black'>Welcome</p>
            </div>
            <NavUser
              anchorElUser={anchorElUser}
              handleCloseUserMenu={handleCloseUserMenu}
              handleOpenUserMenu={handleOpenUserMenu}
            />
          </div>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: '#111627',
          },
        }}
        variant='persistent'
        anchor='left'
        open={open}
      >
        <DrawerHeader className='flex justify-between'>
          <p className='text-sm font-semibold text-gray-500'>Mysterium Proxy</p>
        </DrawerHeader>
        <div className='flex items-center justify-center'>
          <img src={peoxypic} className=' h-32 w-32' alt='' />
        </div>
        <Divider className='mt-2 text-dashboard-hover' />
        <DashboardList />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route index element={<ProxyList />} />
            {DashboardRoutes.map((route) => (
              <Route key={route.path} path={route.path} element={route.component} />
            ))}
          </Route>
        </Routes>
      </Main>
    </Box>
  );
}

export default React.memo(Dashboard);
