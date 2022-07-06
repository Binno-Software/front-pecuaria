import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import {
  Avatar,
  Card,
  CardContent,
  Grid,
  Typography,
  makeStyles,
  colors
} from '@material-ui/core';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import api from 'src/service/api';

const useStyles = makeStyles(() => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.indigo[600],
    height: 56,
    width: 56
  }
}));

const Cotacao = ({ className, ...rest }) => {
  const classes = useStyles();
  const [cotacao, setCotacao] = useState({})

  useEffect(() => {
    api.get('comercializacao/ultima').then(({ data }) => {
        setCotacao(data)
    })
  }, [])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <CardContent>
        <Grid
          container
          justify="space-between"
          spacing={3}
        >
          <Grid item>
            <Typography
              color="textSecondary"
              gutterBottom
              variant="h6"
            >
              Cotação do momento
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {cotacao?.valor}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <AttachMoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};


export default Cotacao;
