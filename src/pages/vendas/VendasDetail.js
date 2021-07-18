import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    makeStyles,
    Typography,
    Button,
    TextField,
    Grid
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

const VendasDetail = ({
    finalizar,
    total,
    setValorRecebido,
    valorRecebido,
    className,
    ...rest
}) => {
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

                            <Card>
                                <CardHeader
                                    title="Informações da venda"
                                />

                                <CardContent>
                                    <Grid
                                        container
                                        spacing={3}
                                    >

                                        <TextField
                                            fullWidth
                                            label="Valor Recebido pelo Cliente"
                                            name="valorRecebido"
                                            onChange={e => setValorRecebido(e.target.value)}
                                            type="number"
                                            value={valorRecebido}
                                            variant="outlined"
                                        />

                                    </Grid>
                                </CardContent>
                            </Card>
                            <Button
                                color="primary"
                                variant="contained"
                                onClick={finalizar}
                            > Vender </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

VendasDetail.propTypes = {
    className: PropTypes.string
};

export default VendasDetail;


