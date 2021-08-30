import React, { useCallback, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { Formik } from 'formik';
import {
  Box,
  Button,
  Container,
  Link,
  TextField,
  Typography,
  makeStyles,
  LinearProgress,
  Checkbox,
  Grid
} from '@material-ui/core';
import Page from 'src/components/Page';
import { useAuth } from 'src/context/AuthContext';
import GoogleIcon from 'src/icons/Google';
import FacebookIcon from 'src/icons/Facebook';
import { STORAGE_LOGIN, STORAGE_PASSWORD } from 'src/constants';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const LoginView = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();
  const [loading, setLoading] = useState(false);
  const [isSaveLogin, setIsSaveLogin] = useState(true);
  const [initialValues, setInitialValues] = useState({
    login: '',
    password: ''
  });

  const doLogin = useCallback((values) => {
    setLoading(true);

    if (isSaveLogin) {
      window.localStorage.setItem(STORAGE_LOGIN, values.login);
      window.localStorage.setItem(STORAGE_PASSWORD, values.password);
    }

    login(values).then(() => {
      navigate('/app/dashboard', { replace: true });
    });
  }, [isSaveLogin, login, navigate]);

  const changeSaveCredentials = useCallback(() => {
    setIsSaveLogin(!isSaveLogin);
    if (isSaveLogin) {
      window.localStorage.clear();
    }
  }, [isSaveLogin]);

  useEffect(() => {
    const login = window.localStorage.getItem(STORAGE_LOGIN);
    if (login) {
      const password = window.localStorage.getItem(STORAGE_PASSWORD);
      setInitialValues({
        login,
        password
      });
    }
  }, []);

  if (loading) return <LinearProgress />;

  return (
    <Page
      className={classes.root}
      title="Login"
    >
      <Box
        display="flex"
        flexDirection="column"
        height="100%"
        justifyContent="center"
      >
        <Container maxWidth="sm">
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={Yup.object().shape({
              password: Yup.string().max(255).required('Senha é obrigatoria')
            })}
            onSubmit={doLogin}
          >
            {({
              errors,
              handleBlur,
              handleChange,
              handleSubmit,
              isSubmitting,
              touched,
              values
            }) => (
              <form onSubmit={handleSubmit}>
                <Box mb={3}>
                  <Typography
                    color="textPrimary"
                    variant="h2"
                  >
                    Login
                  </Typography>
                </Box>
                <Grid
                  container
                  spacing={3}
                >
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      color="primary"
                      fullWidth
                      startIcon={<FacebookIcon />}
                      onClick={loginWithFacebook}
                      size="large"
                      variant="contained"
                    >
                      Login com Facebook
                    </Button>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    md={6}
                  >
                    <Button
                      fullWidth
                      startIcon={<GoogleIcon />}
                      onClick={loginWithGoogle}
                      size="large"
                      variant="contained"
                    >
                      Login com Google
                    </Button>
                  </Grid>
                </Grid>
                <TextField
                  error={Boolean(touched.login && errors.login)}
                  fullWidth
                  helperText={touched.login && errors.login}
                  label="Login"
                  margin="normal"
                  name="login"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="normal"
                  value={values.login}
                  variant="outlined"
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label="Password"
                  margin="normal"
                  name="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type="password"
                  value={values.password}
                  variant="outlined"
                />
                <Box my={2}>
                  <Button
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    Login
                  </Button>
                </Box>
                <Box
                  alignItems="center"
                  display="flex"
                  ml={-1}
                >
                  <Checkbox
                    checked={isSaveLogin}
                    onChange={changeSaveCredentials}
                  />
                  <Typography
                    color="textSecondary"
                    variant="body1"
                  >
                    Lembrar minha conta
                    {' '}
                  </Typography>
                </Box>
                <Typography
                  color="textSecondary"
                  variant="body1"
                >
                  Ainda não tem uma conta?
                  {' '}
                  <Link
                    component={RouterLink}
                    to="/register"
                    variant="h6"
                  >
                    Cadastre-se
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </Page>
  );
};

export default LoginView;
