import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  makeStyles,
  LinearProgress,
  Container,
  FormHelperText,
  Typography,
} from '@material-ui/core';
import api from 'src/service/api';
import { toastSuccess } from 'src/utils/toast';
import * as Yup from 'yup';
import { Formik } from 'formik';

const useStyles = makeStyles(({
  root: {}
}));

const CadastroUsuario = ({ className, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  const submitForm = useCallback((values) => {
    api.post('usuarioacesso/criar-para-tenant-existente', {
      login: values.login,
      password: values.password,
      nome: values.nome,
      email: values.email,
    }).then(() => {
      toastSuccess('Usuario cadastrado com sucesso');
      setLoading(false);
    }).catch(() => setLoading(false));

    setLoading(true);
  }, []);

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <form
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Inserindo novo usuario"
          title="Usuario"
        />
        <Divider />
        <CardContent>
          <Container maxWidth="sm">
            <Formik
              initialValues={{
                login: '',
                password: '',
                nome: '',
                email: '',
              }}
              validationSchema={
                Yup.object().shape({
                  email: Yup.string().email('Precisa ser um email valido').max(255).required('Email é necessario'),
                  nome: Yup.string().max(255).required('Nome é necessario'),
                  login: Yup.string().max(255).required('Login é necessario'),
                  password: Yup.string().max(255).required('Senha é necessario'),
                })
              }
              onSubmit={submitForm}
            >
              {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                isValid,
                dirty,
                values
              }) => (
                <form onSubmit={handleSubmit}>
                  <Box mb={3}>
                    <Typography
                      color="textPrimary"
                      variant="h2"
                    >
                      Criar novo usuario
                    </Typography>
                    <Typography
                      color="textSecondary"
                      gutterBottom
                      variant="body2"
                    >
                      ...
                    </Typography>
                  </Box>
                  <TextField
                    error={Boolean(touched.nome && errors.nome)}
                    fullWidth
                    helperText={touched.nome && errors.nome}
                    label="Nome"
                    margin="normal"
                    name="nome"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.nome}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.email && errors.email)}
                    fullWidth
                    helperText={touched.email && errors.email}
                    label="Email"
                    margin="normal"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    value={values.email}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.login && errors.login)}
                    fullWidth
                    helperText={touched.login && errors.login}
                    label="Login"
                    margin="normal"
                    name="login"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="login"
                    value={values.login}
                    variant="outlined"
                  />
                  <TextField
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    helperText={touched.password && errors.password}
                    label="Senha"
                    margin="normal"
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="password"
                    value={values.password}
                    variant="outlined"
                  />

                  {Boolean(touched.policy && errors.policy) && (
                    <FormHelperText error>
                      {errors.policy}
                    </FormHelperText>
                  )}
                  <Box my={2}>
                    <Button
                      color="primary"
                      disabled={isSubmitting || !(dirty && isValid)}
                      fullWidth
                      size="large"
                      type="submit"
                      variant="contained"
                    >
                      Cadastrar
                    </Button>
                  </Box>
                </form>
              )}
            </Formik>
          </Container>
        </CardContent>
        <Divider />
      </Card>
    </form>
  );
};

CadastroUsuario.propTypes = {
  className: PropTypes.string
};

export default CadastroUsuario;
