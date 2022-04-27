import React, { useCallback, useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PropTypes from 'prop-types';
import {
  Box,
  Card,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  makeStyles,
  Avatar
} from '@material-ui/core';
import showOnlySomeLetters from 'src/utils/ShowOnlySomeLetters';
import { ExternalLink } from 'react-feather';
import api from 'src/service/api';
import { toast } from 'react-toastify';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const Results = ({
  className, data, reload, page, limit, ...rest
}) => {
  const classes = useStyles();
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedIds;

    if (event.target.checked) {
      newSelectedIds = data.content.map((element) => element.id);
    } else {
      newSelectedIds = [];
    }

    setSelectedIds(newSelectedIds);
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedIds = [];

    if (selectedIndex === -1) {
      newSelectedIds = newSelectedIds.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelectedIds = newSelectedIds.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelectedIds = newSelectedIds.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1)
      );
    }

    setSelectedIds(newSelectedIds);
  };

  const handleLimitChange = (event) => {
    reload(event.target.value, page);
  };

  const handlePageChange = (_event, newPage) => {
    reload(limit, newPage);
  };

  const solicitarAlteracaoSenha = useCallback((el) => {
    if (el.jaSolicitado) {
      toast('Ja foi solicitado alteração de senha para esse usuario')
      return
    }

    api.post('usuarioacesso/solicitar-alteracao-senha', { login: el.login }).then(() => {
      toast('Pedido de alteração de senha enviado')
    })

    el.jaSolicitado = true
  }, [])

  return (
    <Card
      className={clsx(classes.root, className)}
      {...rest}
    >
      <PerfectScrollbar>
        <Box minWidth={1050}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedIds.length === data.content.length}
                    color="primary"
                    indeterminate={
                      selectedIds.length > 0
                      && selectedIds.length < data.content.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Email
                </TableCell>
                <TableCell>
                  Login
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.content.slice(0, limit).map((element) => (
                <TableRow
                  hover
                  key={element.id}
                  selected={selectedIds.indexOf(element.id) !== -1}
                // onClick={() => update(element)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.indexOf(element.id) !== -1}
                      onChange={(event) => handleSelectOne(event, element.id)}
                      value="true"
                    />
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Avatar
                        className={classes.avatar}
                        src={element.imagemUrl || '/static/images/avatars/logo.jpeg'}
                      >
                        {element.email}
                      </Avatar>
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {element.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box
                      alignItems="center"
                      display="flex"
                    >
                      <Typography
                        color="textPrimary"
                        variant="body1"
                      >
                        {showOnlySomeLetters(element.login, 25)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell padding="checkbox">
                    <ExternalLink onClick={() => solicitarAlteracaoSenha(element)} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component="div"
        count={data.totalElements}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[10, 25, 50]}
        labelRowsPerPage="Registros por pagina"
      />
    </Card>
  );
};

Results.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  reload: PropTypes.func,
  page: PropTypes.number,
  limit: PropTypes.number,
};

export default Results;
