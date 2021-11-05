import React, { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  makeStyles,
  LinearProgress
} from '@material-ui/core';
import api from 'src/service/api';
import { useAuth } from 'src/context/AuthContext';
import { toastSuccess } from 'src/utils/toast';

const useStyles = makeStyles(() => ({
  root: {}
}));

const ProfileDetails = ({ className, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const [values, setValues] = useState({});

  useEffect(() => {
    api.get('usuarioacesso', { params: { usuarioId: user.user.id } }).then(({ data }) => {
      setLoading(false);
      setValues({
        firstName: data.nome,
        lastName: data.sobrenome || '',
        email: data.email,
        phone: data.fone || '',
        login: data.login,
        password: undefined
      });
    });
  }, [user]);

  const atualizar = useCallback(() => {
    setLoading(true);

    api.put('usuarioacesso', {
      id: user.user.id,
      nome: values.firstName,
      email: values.email,
      sobrenome: values.lastName,
      numero: values.phone,
      login: values.login,
      password: values.password
    }).then(() => {
      toastSuccess('Cadastro atualizado, é necessario fazer o login novamente');
      logout();
    });
  }, [user, logout, values]);

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  if (loading) return <LinearProgress />;

  return (
    <form
      autoComplete="off"
      noValidate
      className={clsx(classes.root, className)}
      {...rest}
    >
      <Card>
        <CardHeader
          subheader="Suas informações podem ser editadas"
          title="Perfil"
        />
        <Divider />
        <CardContent>
          <Grid
            container
            spacing={3}
          >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                helperText="Please specify the first name"
                label="Nome"
                name="firstName"
                onChange={handleChange}
                required
                value={values.firstName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Sobrenome"
                name="lastName"
                onChange={handleChange}
                required
                value={values.lastName}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Email"
                name="email"
                onChange={handleChange}
                required
                value={values.email}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                onChange={handleChange}
                type="number"
                value={values.phone}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Login"
                name="login"
                onChange={handleChange}
                required
                value={values.login}
                variant="outlined"
              />
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Senha"
                name="password"
                onChange={handleChange}
                type="text"
                value={values.password}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider />
        <Box
          display="flex"
          justifyContent="flex-end"
          p={2}
        >
          <Button
            color="primary"
            variant="contained"
            onClick={atualizar}
          >
            Salvar
          </Button>
        </Box>
      </Card>
    </form>
  );
};

ProfileDetails.propTypes = {
  className: PropTypes.string
};

export default ProfileDetails;
