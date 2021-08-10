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
import GenderManIcon from 'src/icons/gender/mars.png';
import GenderWomanIcon from 'src/icons/gender/femenine.png';
import api from 'src/service/api';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%'
  },
  avatarIsFemea: {
    backgroundColor: colors.pink[600],
    height: 56,
    width: 56
  },
  avatarIsMacho: {
    backgroundColor: colors.blue[600],
    height: 56,
    width: 56
  },
  avatarImage: {
    height: '35px',
    filter: 'invert(1)'
  },
  differenceIcon: {
    color: colors.red[900]
  },
  differenceValue: {
    color: colors.green[900],
    marginRight: theme.spacing(1),
    fontSize: 'bold'
  }
}));

const CardTotalizadorBySexo = ({ className, isFemea, ...rest }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({});

  useEffect(() => {
    if (isFemea) {
      api.get('animais/total-por-sexo?femea=true').then((response) => {
        setData(response.data);
        setLoading(false);
      });
    } else {
      api.get('animais/total-por-sexo').then((response) => {
        setData(response.data);
        setLoading(false);
      });
    }
  }, [isFemea]);

  return (
    <>
      {loading ? (<CircularProgress />) : (
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
                  { isFemea ? 'Fêmeas' : 'Machos'}
                </Typography>
                <Typography
                  color="textPrimary"
                  variant="h3"
                >
                  {data.totalSolicitado}
                </Typography>
              </Grid>
              <Grid item>
                <Avatar className={(isFemea ? classes.avatarIsFemea : classes.avatarIsMacho)}>
                  { isFemea
                    ? (<img src={GenderWomanIcon} className={classes.avatarImage} alt="gender woman" />)
                    : (<img src={GenderManIcon} className={classes.avatarImage} alt="gender man" />)}
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
                {data.porcetagem}
                %
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
      )}
    </>
  );
};

CardTotalizadorBySexo.propTypes = {
  className: PropTypes.string,
  isFemea: PropTypes.bool
};

export default CardTotalizadorBySexo;
