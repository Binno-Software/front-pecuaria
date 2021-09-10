import React, { useState } from 'react';
import clsx from 'clsx';
import PerfectScrollbar from 'react-perfect-scrollbar';
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
} from '@material-ui/core';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {},
  avatar: {
    marginRight: theme.spacing(2)
  }
}));

const GridAnimais = ({
  className, addAnimal, data, reload, page, limit, ...rest
}) => {
  const classes = useStyles();
  const registros = data.content;
  const [selectedIds, setSelectedIds] = useState([]);

  const handleSelectAll = (event) => {
    let newSelectedIds;

    if (event.target.checked) {
      newSelectedIds = registros.map((element) => element.id);
      addAnimal(registros);
    } else {
      newSelectedIds = [];
      addAnimal([]);
    }

    setSelectedIds(newSelectedIds);
  };

  const handleSelectOne = (event, element) => {
    const id = element.id;
    const selectedIndex = selectedIds.indexOf(id);
    let newSelectedIds = [];
    addAnimal(element);

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

  const handlePageChange = (_, newPage) => {
    reload(limit, newPage);
  };

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
                    checked={selectedIds.length === registros.length}
                    color="primary"
                    indeterminate={
                      selectedIds.length > 0
                      && selectedIds.length < registros.length
                    }
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>
                  Numeração
                </TableCell>
                <TableCell>
                  Apelido
                </TableCell>
                <TableCell>
                  Fazenda
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {registros.slice(0, limit).map((element) => (
                <TableRow
                  hover
                  key={element.id}
                  selected={selectedIds.indexOf(element.id) !== -1}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedIds.indexOf(element.id) !== -1}
                      onChange={(event) => handleSelectOne(event, element)}
                      value="true"
                    />
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
                        {element.numero}
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
                        {element.apelido}
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
                        {element.fazenda.nome}
                      </Typography>
                    </Box>
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

GridAnimais.propTypes = {
  className: PropTypes.string,
  data: PropTypes.object,
  reload: PropTypes.func,
  page: PropTypes.number,
  limit: PropTypes.number,
};

export default GridAnimais;
