import React, { useState, useEffect } from 'react';
import api from 'src/service/api';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import { Badge, IconButton } from '@material-ui/core';
import NotificationModal from 'src/components/NotificationModal';

const CustomNotificationsIcon = () => {
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setInterval(() => {
      api.get('notificacao/tenho-notificacoes').then(({ data }) => setCount(data));
    }, 5000);
  }, []);

  return (
    <>
      <IconButton onClick={() => setOpen(true)} color="inherit">
        <Badge
          badgeContent={count}
          color="error"
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>
      <NotificationModal reload={count} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CustomNotificationsIcon;
