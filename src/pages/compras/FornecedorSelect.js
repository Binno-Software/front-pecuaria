import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    makeStyles
} from '@material-ui/core';
import api from 'src/service/api';

const useStyles = makeStyles(() => ({
    root: {}
}));

const FornecedorSelect = ({ add, className, ...rest }) => {
    const classes = useStyles();
    const [fornecedores, setFornecedores] = useState([]);
    const [values, setValues] = useState({
        fornecedorSelecionado: undefined
    });

    const handleChange = (event) => {
        setValues({
            ...values,
            [event.target.name]: event.target.value
        });
        add(event.target.value)
    };

    useEffect(() => {
        api.get('fornecedor').then(response => {
            setFornecedores(response.data)
            if (response.data.length > 1) {
                add(response.data[0].id)
            }
        })
    }, [add])

    return (
        <form
            autoComplete="off"
            noValidate
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Card>
                <CardHeader
                    title="Fornecedor"
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
                                name="fornecedorSelecionado"
                                onChange={handleChange}
                                required
                                select
                                SelectProps={{ native: true }}
                                value={values.fornecedorSelecionado}
                                variant="outlined"
                            >
                                {fornecedores.map((fornecedor) => (
                                    <option
                                        key={fornecedor.id}
                                        value={fornecedor.id}
                                    >
                                        {fornecedor.nome}
                                    </option>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </form>
    );
};

FornecedorSelect.propTypes = {
    className: PropTypes.string
};

export default FornecedorSelect;
