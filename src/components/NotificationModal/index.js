import React, { useCallback, useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import AddIcon from '@material-ui/icons/Add';
import api from 'src/service/api';

export default function NotificationModal(props) {
  const [notification, setNotifications] = useState([]);
  const { onClose, open, count } = props;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleListItemClick = useCallback((value) => {
    api.put(`notificacao/marcar-como-lida/${value}`).then(() => {
      setNotifications(notification.filter(notify => notify.id !== value));
    })
  }, [notification]);

  const marcarTodasComoLida = useCallback(() => {
    api.post('notificacao/marcar-todos-como-lidas').then(() => {
      setNotifications([]);
      onClose();
    });
  }, [onClose]);

  useEffect(() => {
    api.get('notificacao').then(({ data }) => setNotifications(data))
  }, [count]);

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Notificações</DialogTitle>
      <List>
        {notification.map((element) => (
          <ListItem button onClick={() => handleListItemClick(element.id)} key={element.id}>
            <ListItemAvatar>
            </ListItemAvatar>
            <ListItemText primary={element.descricao} />
          </ListItem>
        ))}

        <ListItem autoFocus button onClick={marcarTodasComoLida}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Marcar todos como lida" />
        </ListItem>
      </List>
    </Dialog>
  );
}
