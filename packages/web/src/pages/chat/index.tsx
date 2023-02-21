import React, { useEffect, useState } from 'react';
import './index.scss';

import type { MenuProps } from 'antd';
// import { Menu, Col, Row, List, Avatar, Input } from 'antd';
// import Header from '../../components/Header/Header';
import Nav from '@/components/Nav/Nav';
// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import ChatList from '@/components/ChatList/ChatList';
import ChatFrame from '@/components/ChatFrame/ChatFrame';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { changeCurChat, changeCurChatById, IChatItem, chatListSelector, fetchServerChatList } from '@/store/chat/chatSlice';
import { fetchChatList, readMsg } from '@/api';
import { useNavigate, useSearchParams } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number]

function ChatPage() {

  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchServerChatList(user))
  }, [])
  
  let [searchParams, setSearchParams] = useSearchParams();

  const chatId = searchParams.get('chatId')
  if (chatId) {
    dispatch(changeCurChatById(chatId))
  }

  const user = useAppSelector(state => state.user.id)
  const chatList = useAppSelector(chatListSelector)
  
  const chatCurChat = (curChat: IChatItem) => {

    // navigate(`?id=${curChat._id}`)
    setSearchParams({chatId: curChat._id })

    if (curChat.unread && curChat.unread > 0) {
      // 更新阅读消息  - 另外在输入框的焦点事件 和 发送事件有再次更新阅读消息的操作，应对停留在聊天界面的情况
      readMsg({ user, member: curChat.member._id, lastReadMessage: curChat.message._id })
      // 注意 改未读为0
      dispatch(changeCurChat(Object.assign({}, curChat, { unread: 0 })))
    } else {
      dispatch(changeCurChat(curChat))
    }
  }

  return (
    <>
      <ChatList onCurChatChange={chatCurChat} chatList={chatList} />
      <ChatFrame />
    </>
  );
}

export default ChatPage;
