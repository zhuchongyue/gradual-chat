

import { useAppDispatch } from "@/store/hooks";
import { fetchServerChatList, fetchServerMsgList } from "@/store/chat/chatSlice";
import { store }from '@/store'
import { IChatItem } from "@/store/chat/chatSlice";
// 处理私信
export function privateMsg(data: {
  from: IChatItem['member'];
  to: IChatItem['member'];
})  {

  // const dispatch = useAppDispatch()
  const userId = store.getState().user.id
  store.dispatch(fetchServerChatList(userId))

  const curChatMember = store.getState().chat.curChat?.member._id
  const curChatTargetType = store.getState().chat.curChat?.type

  // 私聊的时候 当前的 curChatMember 要 === from._id 
  // 群聊的时候 当前的 curChatMember 要 === to._id (to是群聊id)
  if (
    (curChatTargetType === 'User' && data.from._id === curChatMember)
    || 
    (curChatTargetType === 'Group' && data.to._id === curChatMember)
    ) {
    store.dispatch(fetchServerMsgList({
      user: userId,
      member: curChatMember,
      targetType: curChatTargetType
    }))
  }

  // console.log('socketEvent privateMsg: ', data)
  // dispatch(fetchServerChatList(''))
  // 更新 chatlist
  // 更新 messageList
  return data.from
}