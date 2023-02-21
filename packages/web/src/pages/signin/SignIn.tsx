import * as React from 'react';

import { 
  Avatar, Button, CssBaseline, TextField, FormControlLabel, Checkbox,
  Link, Grid, Box, Typography, Container
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { login } from '@/api'
import { useAppDispatch } from '@/store/hooks';
import { setToken, setUsername, setUserId, setAvatar } from '@/store/user/userSlice';
import { reconnectAfterAuth } from '@/socket'

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="http://gradual.com/">
      http://gradual.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function SignInPage() {

  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

     login(data.get('username') as string, data.get('password') as string)
     .then(res => {
      debugger
      // 重连 带上认证信息
      reconnectAfterAuth(res)
      dispatch(setToken(res.token))
      dispatch(setUsername(res.username))
      dispatch(setUserId(res.id))
      dispatch(setAvatar(res.avatar))
      navigate('/chat')
     })
  };

  return (
    // <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="UserName"
              name="username"
              autoComplete="username"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                {/* <Link href="#" variant="body2">
                  Forgot password?
                </Link> */}
              </Grid>
              <Grid item>
                <RouterLink to="/signup">
                <Link  variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
                </RouterLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    // </ThemeProvider>
  );
}