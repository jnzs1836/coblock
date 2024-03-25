import React from 'react';
import {Menu, Button, MenuItem, Typography, Avatar, styled} from '@mui/material';
import {useAuthUser, useSignOut} from 'react-auth-kit'
import { useNavigate } from 'react-router-dom';


interface ProfileCompProps {
    username: string;
    avatar: string;
    sx?: Record<string, any>;
}

const Root = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    '& > *': {
      margin: theme.spacing(1),
    },
  }));
  
  const StyledAvatar = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(4),
    height: theme.spacing(4),
  }));
  

export default function ProfileComp({sx}: ProfileCompProps) {
    
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      setAnchorEl(event.currentTarget);
    };
  
    const handleClose = () => {
      setAnchorEl(null);
    };
    const auth = useAuthUser()
    const signOut = useSignOut()
    let navigate = useNavigate();
    const username = auth()?.username as String;
    const avatar = username?.charAt(0).toUpperCase();
    return (
      <Root
        sx={{...sx}}
      >
        <Typography variant="body2">Welcome, {username}</Typography>
        
        <StyledAvatar alt={avatar} onClick={handleClick} >
            {avatar}
        </StyledAvatar>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
          <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={()=>{
            signOut();
            handleClose();
            navigate("/login");
          }}>Logout</MenuItem>
        </Menu>
      </Root>
    );
  
}