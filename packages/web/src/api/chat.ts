
import { IChatItem, IMsgItem } from "@/store/chat/chatSlice";
import request from "./request"
export async function newChat(info: {
  user: string;
  member: string;
}) {
  return request<IChatItem>('newChat', info)
}

export async function fetchChatList(userId?: string) {
  if (!userId) return Promise.resolve([])
  return request<Array<IChatItem>>('chatList', { user: userId })
}

// export interface IMsgItem {
//   _id: string;
//   content: string;
//   type: string;
//   createdAt: string; //  Date string
//   updatedAt: string; // Date string
//   targetType: 'User' | 'Group';
//   from: {
//     _id: string;
//     username: string;
//     avatar: string;
//   },
//   to: {
//     _id: string;
//     username: string;
//     avatar: string;
//   }
// }

export async function fetchMsgList({user, member, targetType }: {
  user?: string; // 当前用户
  member?: string; 
  targetType?: 'User' | 'Group'
}) {
  if (!user || !member) return Promise.resolve([])
  return request<Array<IMsgItem>>('messageList', { user, member, targetType })
}

// 阅读消息
export async function readMsg({ user, member, lastReadMessage }: {
  user?: string; // 用户id
  member?: string; // 聊天对象id  memberId or groupId
  lastReadMessage?: string; // 最后阅读消息id
}) {
  if (!user || !member || !lastReadMessage) return;
  return request('readMsg', {user, member, lastReadMessage })
}
