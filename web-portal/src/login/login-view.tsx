import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  createStyles,
  makeStyles,
  TextField,
  Theme,
  Typography,
  styled
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSignIn } from 'react-auth-kit'
import LoginErrorAlert from './login-error-alert';
import backgroundImage from './background-image.jpg';
import LoginSuccessAlert from './login-success-alert';
import LoginLoadingProgress from './login-loading-progress';

const MyContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  height: '100vh',
  minWidth: '480px',
}));

const MyForm = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(3),
  border: `1px solid ${theme.palette.primary.main}`,
  borderRadius: theme.spacing(1),
  '& > *': {
    marginBottom: theme.spacing(2),
  },
}));


enum LoginStatus {
  PENDING = "pending",
  SUCCESS = "success",
  ERROR = "error",
  LOADING = "loading",
}

const LoginPageWrapper = styled(Box)({
  paddingTop: '3rem',
  backgroundImage: `url(${backgroundImage})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

function LoginView(): JSX.Element {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loginStatus, setLoginStatus] = useState<LoginStatus>(LoginStatus.PENDING);

  const signIn = useSignIn();

  const navigate = useNavigate()

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    setLoginStatus(LoginStatus.LOADING);

    fetch("/api/login/", {
      method: "POST",
      // headers: {
      //     "Content-Type": "multipart/form-data",
      //     },
      body: formData
    })
      .then((res) => {
        return res.json()
      }
      )

      // Call authentication API to validate credentials
      // If authentication succeeds, redirect to the user's dashboard
      .then((res) => {
        if (res.token && signIn(
          {
            token: res.token,
            expiresIn: res.expiresIn,
            tokenType: "Token",
            authState: {
              username: res.username,
            },
          }
        )) {
          // setLoginStatus(LoginStatus.SUCCESS);
          navigate('/prompt-table');
          // Redirect or do-something
        } else {
          setLoginStatus(LoginStatus.ERROR);
          // alert("The username or password you entered is incorrect. Please try again.")
          //Throw error
        }

      })
      .catch((err) => {
        setLoginStatus(LoginStatus.ERROR);
      });



    // Call authentication API to validate credentials
    // If authentication succeeds, redirect to the user's dashboard
  }

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };


  return (

    <LoginPageWrapper>
      <MyContainer>
        <MyForm
          sx={{
            width: '100%',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            opacity: '0.9',
            display: "flex",
            alignItems: "stretch",
          }}
          onSubmit={handleSubmit}>
          <Typography variant="h5"
            sx={{ marginBottom: 2 }}
          >
            Minecraft Collaboration Login

          </Typography>
          <TextField
            label="Username"
            type="username"
            value={username}
            onChange={handleEmailChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            fullWidth
            required
            sx={{ marginBottom: 2 }}
          />

          {loginStatus === LoginStatus.LOADING && <LoginLoadingProgress />}

          {loginStatus === LoginStatus.SUCCESS && <LoginSuccessAlert
          />}

          {loginStatus === LoginStatus.ERROR && <LoginErrorAlert
            open={loginStatus === LoginStatus.ERROR}
            onClose={() => setLoginStatus(LoginStatus.PENDING)}
          />}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Log in
          </Button>
        </MyForm>
      </MyContainer>
    </LoginPageWrapper >
  );
}

export default LoginView;
