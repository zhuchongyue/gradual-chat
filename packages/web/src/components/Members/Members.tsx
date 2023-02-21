import React, { useState } from 'react';
import { Avatar, ListItemAvatar, ListItem, List, ListItemText, Badge } from '@mui/material';
// import ChatGroupAvatar from './ChatGroupAvatar';
// import ChatListSearch from './ChatListSearch'
import './Members.scss'
import { curChatSelector } from '@/store/chat/chatSlice'
import { useAppSelector } from '@/store/hooks';
import { IUser } from '@/store/user/userSlice';


export default function Members(props: {
  activeIndex: number;
  memberList: Array<IUser>;
  onSelectedMemberChange: (index: number, curMem: IUser) => void;
}) {

  const curChat = useAppSelector(curChatSelector);
  const user = useAppSelector(state => state.user.id)

  return (
    <div>
      {/* <ChatListSearch /> */}
      <List sx={{ bgcolor: '#1D1C21', color: 'white' }}>
        {
          props.memberList.map((info, index) => {
            return (
              <div className={`mem-list-item ${props.activeIndex === index ? 'mem-list-item-active' : ''}`} key={info.username}>
                <ListItem onClick={() => props.onSelectedMemberChange(index, info)}
                secondaryAction={
                  info._id === user &&
                  <div style={{ marginTop: -20 }}>{'[Yourself]'}</div>
                }
                >
                  <ListItemAvatar>
                    {
                      <Badge badgeContent={0} color={'error'}>
                        <Avatar src={info.avatar}></Avatar>
                      </Badge>
                    }
                  </ListItemAvatar>
                  <ListItemText primary={info.username} secondary={
                    <span style={{ color: '#7B798F' }}>
                      {info.bio || 'I am a community member'}
                    </span>
                  } />
                </ListItem>
              </div>
            )
          })
        }
      </List>
    </div>
  )
}