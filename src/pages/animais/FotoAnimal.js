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
  Container,
  Grid,
  makeStyles
} from '@material-ui/core';
import api from 'src/service/api'
import { toastSuccess, toastError } from 'src/utils/toast'

const useStyles = makeStyles(() => ({
  root: {},
  avatar: {
    height: 100,
    width: 100
  }
}))

const AnimalFoto = ({ className, animalRef, ...rest }) => {
  const classes = useStyles();
  const [imagens, setImagens] = useState([])

  const onImageChange = useCallback(event => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImagens([URL.createObjectURL(img), ...imagens])
      uploadFunction(img)
    }
  }, [imagens])

  const remove = useCallback((image) => {
    setImagens(imagens.filter(img => img !== image))
  }, [imagens])

  const uploadFunction = (file) => {
    const form = new FormData()
    form.append('file', file)
    api.post('file/upload', form, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(function (response) {
        toastSuccess('Imagem Enviada com sucesso')
        console.log(response);
      })
      .catch(function (response) {
        toastError('Falha no envio da imagem')
        console.log(response);
      })
  }

  return (
    <Container maxWidth="lg">
      <Grid
        container
        spacing={3}
      >
        <Grid
          item
          lg={4}
          md={6}
          xs={12}
        >
          <input type="file" name="myImage" onChange={onImageChange} />
          {imagens.map(image => (<Card
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
          </Card>))}

        </Grid>
      </Grid>
    </Container>
  );
};

AnimalFoto.propTypes = {
  className: PropTypes.string
};

export default AnimalFoto;
