import React from 'react';
import { Avatar, Badge } from '@mui/material';
import './Nav.scss';
import { Link, NavLink, useMatch } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';
import { Divider } from 'antd';

export default function Nav() {

  const chatList = useAppSelector(state => state.chat.chatList);

  // const match = useMatch()
  return (
    <>
      <div className="nav">
        <div className="nav-group">
          Engage
        </div>
        <div className="nav-item">
          <img src={process.env.PUBLIC_URL + '/img/menu_forum.png'} />
          Forum
        </div>
        <div className="nav-item">
          <NavLink to='/chat' style={({ isActive }) =>
            isActive ? { color: '#04B17D' } : undefined
          }>
            <Badge badgeContent={chatList.reduce((prev, chat) => prev + (chat.unread || 0), 0) || 0} color={'error'}>
              <img src={process.env.PUBLIC_URL + '/img/menu_chat.svg'} />
            </Badge>
            Chat
          </NavLink>
        </div>
        <div className="nav-item">
          <img src={process.env.PUBLIC_URL + '/img/menu_matches.png'} />
          Matches
        </div>

        <div className='divider'></div>

        <div className="nav-group">
          People
        </div>
        <div className="nav-item">
          <NavLink to='/members' style={({ isActive }) =>
            isActive ? { color: '#04B17D' } : undefined
          }>
            <img src={process.env.PUBLIC_URL + '/img/menu_members.png'} />
            Members
          </NavLink>
        </div>
        <div className="nav-item">
          <img src={process.env.PUBLIC_URL + '/img/menu_contributors.png'} />
          Contributors
        </div>
      </div>
    </>
  )
}