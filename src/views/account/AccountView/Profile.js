import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import { useAuth } from 'src/context/AuthContext';
import api from 'src/service/api';
import { toastSuccess, toastError } from 'src/utils/toast';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}));

const Profile = ({ className, ...rest }) => {
  const classes = useStyles();
  const { user: userReal, atualizarDadosUsuarioLocal } = useAuth();

  const atualizarFoto = useCallback((event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const form = new FormData();
      form.append('file', file);
      api.post('file/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
        .then(({ data: imgUrl }) => {
          toastSuccess('Imagem Enviada com sucesso, vamos atualizar seu perfil agora');
          api.put('usuarioacesso', {
            id: userReal.user.id,
            alterarSomenteAImagem: true,
            imagemPerfilUrl: imgUrl
          }).then(() => {
            toastSuccess('Perfil atualizado');
            const userCopia = userReal;
            userCopia.user.imagePerfilUrl = imgUrl;
            atualizarDadosUsuarioLocal(userCopia);
          })
        })
        .catch(() => {
          toastError('Falha no envio da imagem');
        });
    }
  }, [userReal, atualizarDadosUsuarioLocal]);

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Box
          alignItems="center"
          display="flex"
          flexDirection="column"
        >
          <Avatar
            className={classes.avatar}
            src={userReal.user.imagePerfilUrl || '/static/images/avatars/logo.jpeg'}
          />
          <Typography
            color="textPrimary"
            gutterBottom
            variant="h3"
          >
            {userReal.user.login}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <div className="App">
          <label htmlFor="upload-photo">
            <input
              style={{ display: 'none' }}
              id="upload-photo"
              name="upload-photo"
              type="file"
              onChange={atualizarFoto}
            />
            <Button color="primary" fullWidth variant="text" component="span">
              Alterar foto
            </Button>
          </label>
        </div>
      </CardActions>
    </Card>
  );
};

Profile.propTypes = {
  className: PropTypes.string
};

export default Profile;
