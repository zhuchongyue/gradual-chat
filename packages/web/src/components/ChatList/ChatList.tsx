import React from 'react';
import { Avatar, ListItemAvatar, ListItem, List, ListItemText, Badge } from '@mui/material';
import ChatGroupAvatar from './ChatGroupAvatar';
import ChatListSearch from './ChatListSearch'
import './ChatList.scss'
import { curChatSelector, IChatItem } from '@/store/chat/chatSlice'
import { useAppSelector } from '@/store/hooks';
import moment from 'moment';
import { formatGMTTime } from '@/utils/util';

export default function ChatList(props: {
  chatList: Array<IChatItem>;
  onCurChatChange: (curChat: IChatItem) => void;
}) {

  const curChat = useAppSelector(curChatSelector);

  return (
    <div>
      <ChatListSearch />
      <List sx={{ bgcolor: '#1D1C21', color: 'white' }}>
        {
          props.chatList.map((info) => {

            const isGroup = info.type === 'Group'
            return (
              <div className={`chat-list-item ${info._id === curChat?._id ? 'chat-list-item-active' : ''}`} key={info._id}>
                <ListItem onClick={() => props.onCurChatChange(info)} secondaryAction={
                  <div style={{ marginTop: -18, color: '#7B798F', fontWeight: 600, fontSize: 12 }}>
                    {
                      formatGMTTime(info.message?.createdAt)
                    }</div>
                }>
                   
                  <ListItemAvatar>
                    {
                      // @ts-ignore
                      isGroup
                      // @ts-ignore
                      ?  <ChatGroupAvatar unread={info.unread || 0} avatars={info.member.members.map(m => m.avatar)} />
                       // @ts-ignore
                      : <Badge badgeContent={info.unread} color={'error'}><Avatar src={info.member.avatar as string}></Avatar></Badge>
                    }

                  </ListItemAvatar>
                  {/* @ts-ignore */}
                  <ListItemText primary={isGroup ? info.member.name : info.member.username} secondary={
                    <span style={{ display: 'inline-block', minHeight: '16px', color: '#7B798F' }}>
                      {info.message?.content || ' '}
                    </span>
                  } />
                </ListItem>
              </div>
            )
          })
        }
      </List>
      {/* <ChatGroupAvatar avatars={['ava1.jpeg', 'ava2.jpeg', 'ava3.jpeg', 'ava4.jpeg']} />
      <ChatGroupAvatar avatars={['ava1.jpeg', 'ava2.jpeg', 'ava3.jpeg', 'ava4.jpeg', 'ava1.jpeg', 'ava2.jpeg', 'ava3.jpeg', 'ava4.jpeg', 'ava1.jpeg', 'ava2.jpeg', 'ava3.jpeg', 'ava4.jpeg',]} /> */}
    </div>
  )
}