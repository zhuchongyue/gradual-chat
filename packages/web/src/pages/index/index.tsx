import React from 'react';
import './index.scss';

import type { MenuProps } from 'antd';
// import { Menu, Col, Row, List, Avatar, Input } from 'antd';
import Header from '@/components/Header/Header';
import Nav from '@/components/Nav/Nav';
// import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';

import ChatList from '@/components/ChatList/ChatList';
import ChatFrame from '@/components/ChatFrame/ChatFrame';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { changeCurChat, IChatItem } from '@/store/chat/chatSlice';
import { Outlet } from 'react-router-dom';

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps['items'] = [
  getItem('Engage', 'engage', null, [
    getItem('Forum', 'Forum', null),
    getItem('Chat', 'chat', null),
  ], 'group'),

  { type: 'divider' },

  getItem('People', 'people', null, [
    getItem('Members', 'members'),
    getItem('Contributors', 'contributors')
  ], 'group'),

  { type: 'divider' },
];

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

function IndexPage() {

  const chatList = useAppSelector(state => state.chat.chatList)
  const dispatch = useAppDispatch();

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  const chatCurChat = (curChat: IChatItem) => {
    dispatch(changeCurChat(curChat))
  }

  return (
    <>
    <Header />
    <div className='home'>
      <div>
        <Nav />
      </div>
      {/* <RouterProvider router={router} ></RouterProvider> */}
      <div className='main-container'>
        <Outlet />
      </div>
    </div>
    </>
      
  );
}

export default IndexPage;

