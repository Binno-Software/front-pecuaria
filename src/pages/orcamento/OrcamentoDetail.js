import React from 'react';
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

const OrcamentoDetail = ({
    finalizar,
    total,
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

                            <Button
                                color="primary"
                                variant="contained"
                                onClick={finalizar}
                            > Orçar </Button>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </div>
    );
};

export default OrcamentoDetail;


