import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  colors,
  makeStyles,
  CircularProgress
} from '@material-ui/core';
import MoneyIcon from '@material-ui/icons/LiveHelp';
import api from 'src/service/api';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatar: {
    backgroundColor: colors.blue[600],
    height: 56,
    width: 56
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1)
  }
}));

const TotalMacho = ({ className, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    api.get('animais/total-por-sexo').then(({ data }) => {
      setData(data);
      setLoading(false);
    })
  }, []);

  if (loading)
    return <CircularProgress />

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
              Machos
            </Typography>
            <Typography
              color="textPrimary"
              variant="h3"
            >
              {data.totalSolicitado}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.avatar}>
              <MoneyIcon />
            </Avatar>
          </Grid>
        </Grid>
        <Box
          mt={2}
          display="flex"
          alignItems="center"
        >
          <Typography
            className={classes.differenceValue}
            variant="body2"
          >
            {data.porcetagem}%
          </Typography>
          <Typography
            color="textSecondary"
            variant="caption"
          >
            dos animais
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

TotalMacho.propTypes = {
  className: PropTypes.string
};

export default TotalMacho;
