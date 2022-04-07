import React, { useCallback, useState } from 'react';
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
  LinearProgress
} from '@material-ui/core';
import Page from 'src/components/Page';
import api from 'src/service/api';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.dark,
    height: '100%',
    paddingBottom: theme.spacing(3),
    paddingTop: theme.spacing(3)
  }
}));

const ChangePassword = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialValues] = useState({
    password: ''
  });

  const changePass = useCallback((values) => {
    setLoading(true);
    const arrayUrl = window.location.href.split('/');
    const uuid = arrayUrl[arrayUrl.length - 1];
    api.post('usuarioacesso/alterar-senha', {
      novaSenha: values.password,
      chave: uuid
    })
      .then(() => navigate('/app/dashboard', { replace: true }))
      .catch(() => {
        setLoading(false);
      })

  }, [navigate]);

  if (loading) return <LinearProgress />;

  return (
    <Page
      className={classes.root}
      title="Alterar senha"
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
            onSubmit={changePass}
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
                    Alterar Senha
                  </Button>
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

export default ChangePassword;
