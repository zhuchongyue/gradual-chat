import React, { useEffect, useRef, useState } from 'react';
import './ChatInput.scss';
import { Button, TextareaAutosize } from '@mui/material';
import { IChatItem, IGroup, IMsgItem } from '@/store/chat/chatSlice';
import CancelIcon from '@mui/icons-material/Cancel';
import ChatMention from './ChatMention';
import { IUser } from '@/store/user/userSlice';

export default function ChatInput(props: {
  onSendMsg: (msg: string, refId?: string) => void;
  onInputFocus:  () => void;
  refMsg?: IMsgItem;
  onRefMsgCancel: (msg?: IMsgItem) => void;
  showRef: boolean;
  curChat?: IChatItem;
}) {

  const [msg, setMsg] = useState('')
  const textAreaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    console.log('textAreaRef.current?.focus: ', textAreaRef.current?.focus)
    props.showRef && textAreaRef.current?.focus()
  }, [props.showRef])

  const [at, setAt] = useState<{open: boolean; content: string; cache: string[]}>({
    open: false,
    content: '',
    cache: []
  })

  const openFlatAt = (content?: string) => {
    const cache = [...at.cache]
    setAt({
      open: true,
      content: content ? content : '',
      cache
    })
  }
  // 仅重置at flag信息
  const resetFlagAt = (username?: string) => {
    const cache = username ? [...at.cache, username] : [...at.cache]
    setAt({
      open: false,
      content: '',
      cache
    })
  }

  // 完全重置 at 相关计算，1、Enter 发送一次聊天，2. 切换当前聊天对象
  const resetAt = () => setAt({
    open: false,
    content: '',
    cache: []
  })

  const [inputIndex, setInputIndex] = useState(0)

  const handleSelectAtMember= (member: IUser) => {

    const username = member.username
    const newMsg = msg.substring(0, inputIndex) + `${username} ` + msg.substring(inputIndex + `@${at.content}`.length)
    // setMsg(msg.replace(`@${at.content}`, `@${username} `))
    setMsg(newMsg)
    resetFlagAt(username)

    textAreaRef.current?.focus()
  }

  // 聊天对象改变，恢复状态
  useEffect(() => {

    setMsg('')

    resetAt();
    setInputIndex(0);
  }, [props.curChat?._id])

  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {

    setInputIndex(textAreaRef.current?.selectionStart || 0)
    
    if (event.key === 'Enter') {
      if (!msg) return ''
      props.onSendMsg(msg, props.refMsg?._id)
      props.onRefMsgCancel()
      setMsg('')
      resetAt()
    } 
    else if (event.key === '@' && props.curChat?.type === 'Group') { // 群聊开启提醒
      openFlatAt()            
    } 
    else if (at.open){ //进入@文案提取
      debugger
      // 支持多次 @ ,去除已有的 @信息
      const tempMsg = at.cache.reduce((prev, username) => {
        return prev.replace(`@${username}`, '')
      }, msg);
      console.log('tempMsg: ', tempMsg)
      // 处理backup || delete 【删除了@】
      if(!/@/.test(tempMsg)) {
        resetFlagAt() 
      }

      if (event.key === ' ') { // 空格，退出@计算
        resetFlagAt() 
      }
      const matchAt = /@([^ ]*)/.exec(tempMsg);
      if (matchAt) {
        const cache = [...at.cache]
        setAt({ open: true, content: matchAt[1], cache })
      }
    }
  }

  return (
    <div className='chat-input'>
      
      <ChatMention 
        open={at.open}
        filter={at.content}
        onSelectedMember={handleSelectAtMember}
        members={props.curChat?.member?.members}
        >
      <TextareaAutosize
        ref={textAreaRef}
        minRows={3}
        placeholder="please input message."
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          outline: 'none',
          width: '100%',
          fontSize: 16,
          color: 'white',
          fontWeight: 500
        }}
        value={msg}
        // @ts-ignore
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          // @ts-ignore
          setMsg(event.target.value)
        }}
        // @ts-ignore  
        onKeyUp={handleKeyUp}

        onFocus={props.onInputFocus}
      />
      </ChatMention>
      {
        props.showRef && props.refMsg &&
        <div className='chat-input-ref'>
          <div className='chat-input-ref-content'>
            {props.refMsg.from.username}: {props.refMsg.content}
          </div>
          <CancelIcon onClick={() => props.onRefMsgCancel(props.refMsg)} sx={{ width: 26, height: 26, margin: '7px 0 0 10px', cursor: 'pointer' }} />
        </div>
      }
    </div>
  )
}