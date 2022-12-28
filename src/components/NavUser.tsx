import {Avatar, Box, IconButton, Menu, MenuItem, Tooltip} from '@mui/material';
import {Link, useNavigate} from 'react-router-dom';
import {Cog6ToothIcon, ArrowLeftOnRectangleIcon, UserIcon} from '@heroicons/react/24/outline';
import React from 'react';
import ChangePassword from './ChangePasswordModal';

function NavUser({handleCloseUserMenu, handleOpenUserMenu, anchorElUser}: any) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = React.useState(false);

  const ChangePasswordFn = () => {
    setShowModal(true);
  };

  const LogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('user');

    navigate('/login');
  };
  return (
    <Box sx={{flexGrow: 0}}>
      <ChangePassword showModal={showModal} setShowModal={setShowModal} />

      <Tooltip title='Open settings'>
        <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
          <Avatar alt='Sharp' src='' />
        </IconButton>
      </Tooltip>
      <Menu
        sx={{mt: '45px'}}
        id='menu-appbar'
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorElUser)}
        onClose={handleCloseUserMenu}
      >
        <MenuItem>
          <Cog6ToothIcon className='mr-1 h-5 w-5' />
          <p onClick={ChangePasswordFn}>Change Password</p>
        </MenuItem>
        <MenuItem>
          <ArrowLeftOnRectangleIcon className='mr-1 h-5 w-5' />
          <p onClick={() => LogOut()}>LogOut</p>
        </MenuItem>
      </Menu>
    </Box>
  );
}

export default React.memo(NavUser);
