import React, { useEffect, useState } from 'react';
import { useAuth } from 'src/context/AuthContext';
//import { Widget } from 'binno-web-widget';
//import './style-mock.css'

function ChatWidget() {
    const [visible, setVisible] = useState(true)
    const { user } = useAuth();

    useEffect(() => {
        if (!user.jaTemFazendas) {
            return
        }

        setVisible(false)
    }, [setVisible, user])

    if (!visible) {
        return <></>
    }

    return <></>
}

export default ChatWidget;
