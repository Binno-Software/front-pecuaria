import React, { useCallback, useState } from 'react';
import {
    Card,
    CardHeader
} from '@material-ui/core';
import ComprasDetail from './ComprasDetail';
import ItemList from './Itemlist';
import api from 'src/service/api';
import { useNavigate } from 'react-router-dom';
import { toastSuccess } from 'src/utils/toast';
import FornecedorSelect from './FornecedorSelect';

const CadastroCompra = () => {
    const [total, setTotal] = useState(0)
    const [items, setItems] = useState([])
    const [fornecedor, setFornecedor] = useState(undefined)
    const navigate = useNavigate()

    const atualizarCompra = items => {
        const total = items.reduce((sum, item) => sum + (item.quantidade * item.valorUnitario), 0)
        setItems(items)
        setTotal(total)
    }

    const finalizarCompra = useCallback(() => {
        api.post('compra', {
            itens: items,
            fornecedor
        }).then(() => {
            toastSuccess('compra cadastrada')
            navigate('../compras', { replace: true })
        })
    }, [items, navigate, fornecedor])

    const addFornecedor = useCallback((id) => {
        setFornecedor(id)
    }, [])

    return (
        <Card>
            <CardHeader
                subheader="Cadastro compra" />
                <ComprasDetail total={total} finalizarCompra={finalizarCompra}/>
                <FornecedorSelect add={addFornecedor} />
                <ItemList atualizarCompra={atualizarCompra} />
        </Card>
    )
}

export default CadastroCompra