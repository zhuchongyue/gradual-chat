
import React from 'react';
import { IMsgItem } from '@/store/chat/chatSlice'
import MessageItem from './MessageItem';
import './MessageList.scss';

export default function MessageList(props: {
  // messageList: Array<{
  //   id: number,
  //   avatar: string;
  //   uname: string;
  //   timestamp: string;
  //   content: string;
  // }>;

  userId: string;
  messageList: Array<IMsgItem>;
  onMsgRef: (msg: IMsgItem) => void;
}) {
  return (
    <div className='msg-list'>
      {
        props.messageList?.map(msg => <MessageItem onMsgRef={props.onMsgRef} userId={props.userId} msg={msg} key={msg._id} />)
      }
    </div>
  )
}