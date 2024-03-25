import React from 'react';
import {Link, styled} from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { BrowserRouter as Router, Link as RouterLink } from "react-router-dom";
import ProfileComp from './profile-comp';


const StyledAppBar = styled(AppBar)`
  background-color: #fff;
  box-shadow: none;
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

const StyledTypography = styled(Typography)`
  flex-grow: 1;
  font-family: 'Dancing Script', cursive;
  font-size: 2rem;
`;

const StyledButton = styled(Button)`
  margin: ${({ theme }) => theme.spacing(1, 1.5)};
  font-family: 'Open Sans', sans-serif;
  font-weight: 600;
  font-size: 1rem;
`;

interface NavigationBarProps {}

const NavigationBar: React.FC<NavigationBarProps> = () => {
  return (
    <StyledAppBar position="static" color="default" elevation={0}>
      <Toolbar>
        <StyledTypography variant="h1" color="textPrimary">
         Block World 
        </StyledTypography>
        <nav>
          {/* <Link
            component={RouterLink} 
            to="/creator"
            variant="body2"
            sx={{
              marginRight: 5,
            }}
            >
              Creator

            </Link>

            <Link
              component={RouterLink} 
              to="/collaboration"
              variant="body2">
                Chat
            </Link> */}
          
          {/* <StyledButton color="primary" variant="outlined">
            Home
          </StyledButton>
          <StyledButton color="primary" variant="outlined">
            About
          </StyledButton>
          <StyledButton color="primary" variant="outlined">
            Services
          </StyledButton>
          <StyledButton color="primary" variant="outlined">
            Contact
          </StyledButton> */}
          
        </nav>
        <ProfileComp
            sx={{
              marginLeft: 5,
            }}
            username="John Doe"
            avatar="JD"
          />
        
      </Toolbar>
      
    </StyledAppBar>
  );
};

export default NavigationBar;