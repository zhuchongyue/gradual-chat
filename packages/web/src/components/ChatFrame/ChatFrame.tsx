import React, { useEffect, useRef, useState } from 'react';

import ChatFrameHead from './ChatFrameHead';
import MessageList from '../MessageList/MessageList';
import ChatInput from '../ChatInput/ChatInput';
import './ChatFrame.scss'
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { curChatSelector, curMsgListSelector, fetchServerMsgList, addNewMsg, IMsgItem, changeCurChat } from '@/store/chat/chatSlice';
import { userIdSelector } from '@/store/user/userSlice';
import { createGroup, fetchMsgList, readMsg, sendMsg } from '@/api';
import GroupDialog from './GroupDialog'

export default function ChatFrame() {

  const flagRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  

  const curChat = useAppSelector(curChatSelector);
  const userId = useAppSelector(userIdSelector);
  const msgList = useAppSelector(curMsgListSelector);

  const [refMsg, setRefMsg] = useState<IMsgItem | undefined>(undefined);
  const [showRef, setShowRef] = useState<boolean>(false);

  const [openGroupDialog, setOpenGroupDialog] = useState<boolean>(false);

  // apply新建群组
  const onApplyNewGroup = () => {
    setOpenGroupDialog(true)
  }

  const handleCancelNewGroup = () => {
    setOpenGroupDialog(false)
  }

  const onCreateGroup = async (ids: string[], groupName: string) => {
    const group = await createGroup({
      name: groupName,
      ids,
      creator: userId!
    })

    if (group._id) {
      setOpenGroupDialog(false)
    }
  } 

  // const [msgList, setMsgList] = useState<Array<IMsgItem>>([])
  // 处理引用消息
  const handleMsgRef = (msg: IMsgItem) => {
    setShowRef(true)
    setRefMsg(msg)
  }

  // 取消引用消息
  const handleRefMsgCancel = (msg?: IMsgItem) => {
    setShowRef(false)
    setRefMsg(undefined)
  }

  useEffect(() => {
    dispatch(fetchServerMsgList({
      user: userId,
      member: curChat?.member._id,
      targetType: curChat?.type
    }))
    // fetchMsgList({ user: userId, member: curChat?.member._id})
    // .then(res => {
    //   console.log('fetchMsgList: ', res)
    //   setMsgList(res)
    // })
  }, [userId, curChat?._id])

  useEffect(() => {
    handleRefMsgCancel()
  }, [curChat?._id])

  useEffect(() => {
    console.log('msgList change........')
    flagRef.current?.scrollIntoView()
  }, [msgList])

  const handleSendMsg = async (content: string, refId?: string) => {

    if (curChat?.type ==='User') {
      const successMsg = await sendMsg({
        from: userId!,
        to: curChat!.member._id,
        targetType: 'User',
        type: 'text',
        content,
        refId
      })
  
      dispatch(addNewMsg(successMsg))
    } else { // 群聊
      const successMsg = await sendMsg({
        from: userId!,
        to: curChat!.member._id,
        targetType: 'Group',
        type: 'text',
        content,
        refId
      })

      dispatch(addNewMsg(successMsg))
    }
    
  }

  const handleInputFocus = () => {
    console.log('handleInputFocus: ', curChat?.unread)
    if (curChat?.unread && curChat?.unread > 0) {
       // 更新阅读消息  -
      readMsg({ user: userId, member: curChat?.member._id, lastReadMessage: curChat?.message._id })
      // 注意 改未读为0
      dispatch(changeCurChat(Object.assign({}, curChat, { unread: 0 })))
    }
  }

  return (
    <div className='chat-frame' >
      <GroupDialog initUserId={[curChat?.member?._id, userId]} 
        open={openGroupDialog} 
        onCreateGroup={onCreateGroup}
        onCancelNewGroup={handleCancelNewGroup}
        />
      <ChatFrameHead 
        onApplyNewGroup={onApplyNewGroup}
        // @ts-ignore
        label={(curChat?.type ==='Group' ? curChat.member.name : curChat?.member.username) || ''} 
        // @ts-ignore
        type={curChat?.type} 
        // count={curChat?.member.members?.length || 0}
        members={curChat?.member.members}
        />
      <div style={{height: 600, overflowY: 'scroll'}}>
        {
          userId && 
          <MessageList onMsgRef={handleMsgRef} messageList={msgList} userId={userId}/>
        }
        <div ref={flagRef} className='chat-frame-list-flag'></div>
      </div>
      <ChatInput 
        onInputFocus={handleInputFocus}
        onSendMsg={handleSendMsg}
        onRefMsgCancel={handleRefMsgCancel}
        refMsg={refMsg}
        showRef={showRef}
        curChat={curChat}
      />
    </div>
  )
}