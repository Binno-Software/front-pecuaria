import React, { useEffect, useState } from 'react';
import { Widget, addResponseMessage } from 'react-chat-widget';
import { useAuth } from 'src/context/AuthContext';
//import { Widget } from 'binno-web-widget';
//import './style-mock.css'

import 'react-chat-widget/lib/styles.css';

function ChatWidget() {
    const [visible, setVisible] = useState(true)
    const { user } = useAuth();

    const handleNewUserMessage = (newMessage) => {
        console.log(`New message incoming! ${newMessage}`);
    };

    useEffect(() => {
        if (!user.jaTemFazendas) {
            addResponseMessage('Olá bem vindo ao seu sistema de gerenciamento')
            addResponseMessage('Para liberar as demais funcionalidades primeiro você precisa cadastrar uma fazenda')
            addResponseMessage('Clique no menu Fazendas para começar')
            return
        }

        setVisible(false)
    }, [setVisible, user])

    if (!visible) {
        return <></>
    }

    return (
        <Widget title="Bem vindo"
            subtitle="..."
            profileAvatar="https://st.depositphotos.com/1001599/2480/v/950/depositphotos_24805337-stock-illustration-cute-robot.jpg"
            badge={1}
            handleNewUserMessage={handleNewUserMessage}
        />
    );
}

export default ChatWidget;
