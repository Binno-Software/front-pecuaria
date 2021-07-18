import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Box,
    Card,
    CardContent,
    makeStyles,
    Typography,
    Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {},
    importButton: {
        marginRight: theme.spacing(1)
    },
    exportButton: {
        marginRight: theme.spacing(1)
    },
    box: {
        flexDirection: 'column',
        justifyContent: 'space-between'
    }
}));

const ComprasDetail = ({ finalizarCompra, total, className, ...rest }) => {
    const classes = useStyles();

    return (
        <div
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Box mt={3}>
                <Card>
                    <CardContent>
                        <Box>
                            <Typography
                                align="left"
                                color="textPrimary"
                                gutterBottom
                                variant="h4"
                            > total R$: {total}
                            </Typography>

                            <Button
                                color="primary"
                                variant="contained"
                                onClick={finalizarCompra}
                            > Fazer compra </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

ComprasDetail.propTypes = {
    className: PropTypes.string
};

export default ComprasDetail;
