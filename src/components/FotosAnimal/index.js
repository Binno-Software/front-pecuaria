import React, { useState, useCallback } from 'react';
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
  Grid,
  makeStyles
} from '@material-ui/core';
import api from 'src/service/api';
import { toastSuccess, toastError } from 'src/utils/toast';
import UploadButton from 'src/components/UploadButton';

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 200,
    width: 200
  }
}));

const FotosAnimal = ({
  className, animalRef, addImagem, removerImagem, setLoadingImage, ...rest
}) => {
  const classes = useStyles();
  const [imagens, setImagens] = useState([]);

  const uploadFunction = (file) => {
    setLoadingImage(true);
    const form = new FormData();
    form.append('file', file);
    api.post('file/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
      .then((response) => {
        toastSuccess('Imagem Enviada com sucesso');
        addImagem(response.data);
        console.log(response);
        setLoadingImage(false);
      })
      .catch((response) => {
        toastError('Falha no envio da imagem');
        console.log(response);
      });
  };

  const onImageChange = useCallback((event) => {
    if (event.target.files && event.target.files[0]) {
      const img = event.target.files[0];
      setImagens([URL.createObjectURL(img), ...imagens]);
      uploadFunction(img);
    }
  }, [imagens]);

  const remove = useCallback((image) => {
    setImagens(imagens.filter((img) => img !== image));
    removerImagem(image);
  }, [imagens]);

  return (
    <Box sx={{ width: '100%' }}>
      <UploadButton name="myImage" onChange={onImageChange} />

      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {imagens.map((image) => (
          <Grid item xs={3}>
            <Card
              className={clsx(classes.root, className)}
              style={{ margin: 20 }}
              {...rest}
            >
              <CardContent>
                <Box
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                >
                  <Avatar
                    variant="square"
                    className={classes.avatar}
                    src={image}
                  />
                </Box>
              </CardContent>
              <Divider />
              <CardActions>
                <Button
                  color="danger"
                  fullWidth
                  variant="text"
                  onClick={() => remove(image)}
                >
                  Remove
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

FotosAnimal.propTypes = {
  className: PropTypes.string,
  animalRef: PropTypes.string,
  addImagem: PropTypes.func,
  removerImagem: PropTypes.func,
  setLoadingImage: PropTypes.func
};

export default FotosAnimal;
