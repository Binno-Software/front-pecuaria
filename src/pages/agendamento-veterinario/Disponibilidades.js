import React, { useState, useEffect, useCallback } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import clsx from 'clsx';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    makeStyles,
    LinearProgress,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    colors,
    Chip
} from '@material-ui/core';
import api from 'src/service/api';

const useStyles = makeStyles(() => ({
    root: {},
    redColor: {
        backgroundColor: colors.red[400],
    },
    greenColor: {
        backgroundColor: colors.green[600],
    },
}));

const Disponibilidade = ({
    dataPesquisa, className, ...rest
}) => {
    const classes = useStyles();
    const [loading, setLoading] = useState(true);
    const [diaPesquisa, setDiaPesquisa] = useState(1);
    const [diasDisponiveis, setDiasDisponiveis] = useState([])
    const [periodos] = useState([
        {
            key: 'MANHA',
            label: 'Manhã'
        },
        {
            key: 'TARDE',
            label: 'Tarde'
        },
        {
            key: 'NOTURNO',
            label: 'Noite'
        }
    ])

    useEffect(() => {
        api.get('agendamento-veterinario/disponibilidade', {
            params:
            {
                'dias': diaPesquisa,
                'data': dataPesquisa,
                'exibir-dias-indisponiveis': true
            }
        }).then(({ data }) => {

            setLoading(false)
            const dias = []
            const manhas = data.filter(item => item.periodoDia === periodos[0].key)
            const tardes = data.filter(item => item.periodoDia === periodos[1].key)
            const noites = data.filter(item => item.periodoDia === periodos[2].key)

            for (let i = 0; i < diaPesquisa; i++) {
                dias.push({
                    manha: {
                        disponivel: manhas[i].disponivel,
                        diaNumero: manhas[i].diaNumero,
                        mesNumero: manhas[i].mesNumero
                    },
                    tarde: {
                        disponivel: tardes[i].disponivel,
                        diaNumero: tardes[i].diaNumero,
                        mesNumero: tardes[i].mesNumero
                    },
                    noite: {
                        disponivel: noites[i].disponivel,
                        diaNumero: noites[i].diaNumero,
                        mesNumero: noites[i].mesNumero
                    }
                })
            }

            setDiasDisponiveis(dias)
        })
    }, [diaPesquisa, dataPesquisa, periodos])

    const changeDiasPesquisa = useCallback((valor) => {
        setDiaPesquisa(valor)
    }, [])

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Card
            className={clsx(classes.root, className)}
            {...rest}
        >
            <Card>
                <CardHeader title="Proximos " />
                <CardContent>
                    <Button
                        color="primary"
                        variant={diaPesquisa === 1 ? 'contained' : 'outlined'}
                        onClick={() => changeDiasPesquisa(1)}
                    >
                        1 Dia
                    </Button>
                    <Button
                        color="primary"
                        variant={diaPesquisa === 3 ? 'contained' : 'outlined'}
                        onClick={() => changeDiasPesquisa(3)}
                    >
                        3 Dias
                    </Button>
                    <Button
                        color="secondary"
                        variant={diaPesquisa === 6 ? 'contained' : 'outlined'}
                        onClick={() => changeDiasPesquisa(6)}
                    >
                        6 Dias
                    </Button>
                </CardContent>
            </Card>
            <Divider />
            <PerfectScrollbar>
                <Box minWidth={800}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {periodos.map(p => (
                                    <TableCell key={p.key}>
                                        {p.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {diasDisponiveis.map((dia) => (
                                <TableRow
                                    hover
                                >
                                    <TableCell>
                                        {`${dia.manha.diaNumero}/${dia.manha.mesNumero}`}
                                        <Chip
                                            className={dia.manha.disponivel ? classes.greenColor : classes.redColor}
                                            label={dia.manha.disponivel ? 'Disponivel' : 'Ocupado'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {`${dia.tarde.diaNumero}/${dia.tarde.mesNumero}`}
                                        <Chip
                                            className={dia.tarde.disponivel ? classes.greenColor : classes.redColor}
                                            label={dia.tarde.disponivel ? 'Disponivel' : 'Ocupado'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {`${dia.noite.diaNumero}/${dia.noite.mesNumero}`}
                                        <Chip
                                            className={dia.noite.disponivel ? classes.greenColor : classes.redColor}
                                            label={dia.noite.disponivel ? 'Disponivel' : 'Ocupado'}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </PerfectScrollbar>
            <Box
                display="flex"
                justifyContent="flex-end"
                p={2}
            >
            </Box>
        </Card>
    )
}

export default Disponibilidade;