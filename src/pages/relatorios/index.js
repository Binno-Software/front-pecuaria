import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
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
import api, { baseURL } from 'src/service/api';

const useStyles = makeStyles(() => ({
    root: {}
}));

const SelecaoRelatorio = ({ className, ...rest }) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [values, setValues] = useState({
        tipos: [],
        tipoSelecionado: '',
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1
    });
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const years = [2021, 2022, 2023]

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
    };

    useEffect(() => {
        api.get('relatorios').then(response => {
            setValues({
                year: new Date().getFullYear(),
                month: new Date().getMonth() + 1,
                tipoSelecionado: '',
                tipos: response.data
            })
            setLoading(false)
        })
    }, [])

    const gerar = useCallback(() => {
        let url
        if (values.tipoSelecionado === 'VENDAS_AGRUPADO_POR_CLIENTE') {
            url = `${baseURL}/relatorios/clientes-agrupados`
        } else {
            url = `${baseURL}/relatorios/vendas-mensais?mes=${values.month}&ano=${values.year}`
        }

        var win = window.open(url, '_blank');
        win.focus();
    }, [values])

    if (loading) 
        return <LinearProgress  />

    return (
        <form
            autoComplete="off"
            noValidate
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Card>
                <CardHeader
                    title="Seleção de relátorios"
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
                                name="tipoSelecionado"
                                onChange={handleChange}
                                required
                                select
                                SelectProps={{ native: true }}
                                value={values.tipoSelecionado}
                                variant="outlined"
                            >
                                {values.tipos.map((tipo) => (
                                    <option
                                        key={tipo}
                                        value={tipo}
                                    >
                                        {tipo}
                                    </option>
                                ))}
                            </TextField>

                        </Grid>
                        {values.tipoSelecionado !== 'VENDAS_AGRUPADO_POR_CLIENTE' && (
                            <Grid
                            item
                            md={6}
                            xs={12}
                        >
                            <TextField
                                name="month"
                                onChange={handleChange}
                                required
                                select
                                SelectProps={{ native: true }}
                                value={values.month}
                                variant="outlined"
                            >
                                {months.map((m) => (
                                    <option
                                        key={m}
                                        value={m}
                                    >
                                        {m}
                                    </option>
                                ))}
                            </TextField>
                            <TextField
                                name="year"
                                onChange={handleChange}
                                required
                                select
                                SelectProps={{ native: true }}
                                value={values.year}
                                variant="outlined"
                            >
                                {years.map((y) => (
                                    <option
                                        key={y}
                                        value={y}
                                    >
                                        {y}
                                    </option>
                                ))}
                            </TextField>

                        </Grid>
                        )}
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
                        onClick={gerar}
                    >
                        Gerar
                    </Button>
                </Box>
            </Card>
        </form>
    );
};

export default SelecaoRelatorio;
