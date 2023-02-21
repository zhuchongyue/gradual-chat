import { fetchChatList, fetchMsgList } from "@/api";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";
import { IUser } from "../user/userSlice";


export interface IGroup {
  name: string; // 群聊
  members: IUser[];
  _id: string;
  creator: string;
}

// 最近聊天历史
export interface IChatItem {
  _id: string;
  unread?: number;
  updateAt: string; // Date string
  user: string; // 当前user id
  type: 'User' | 'Group';
  member: IUser & IGroup; // 私聊 或 群聊
  //  {     // 私聊
  //   username: string;
  //   _id: string;
  //   avatar: string;
  // } & {
  //   name: string; // 群聊
  //   members: string[];
  //   _id: string;
  //   creator: string;
  // },
  message: {
    content: string;
    createdAt: string; // Date string
    targetType: 'User' | 'Group'; // 私聊 群聊
    _id: string;
  }
}

// 消息对象type
export interface IMsgItem {
  _id: string;
  content: string;
  type: string;
  createdAt: string; //  Date string
  updatedAt: string; // Date string
  targetType: 'User' | 'Group';
  from: {
    _id: string;
    username: string;
    avatar: string;
  },
  to: {
    _id: string;
    username: string;
    avatar: string;
  },
  ref?: {
    content: string;
    from: {
      _id: string;
      username: string;
      avatar: string;
    }
    targetType: "User" | 'Group';
    type: string;
    __v: 0
    _id: string;
  }
}


// 最近聊天列表
// export interface IChatHistory {
//   id: string;
//   name: string; // username 或者 groupname
//   avatars: string | string[]; // 头像，私聊为对方头像，群聊为成员头像列表
//   lastMsgTime: string; // 最新消息的时间
//   lastMsgContent: string; // 最新消息内容
//   unreadCount?: number; // 未读消息数量
//   isGroup: boolean; // 是否群聊
// }

export interface ChatState {
  chatList: Array<IChatItem>;
  curChat?: IChatItem;
  curMsgList: IMsgItem[];
}

const initialState: ChatState = {
  chatList: [
    // {
    //   _id: '123',
    //   updateAt: new Date().toString(),
    //   user: '63f02cad1deb6833ad2cb23a',
    //   member: {
    //     username: 'admin',
    //     _id: '63f02cad1deb6833ad2cb23a',
    //     avatar: process.env.PUBLIC_URL + '/img/a1.svg',
    //   },
    //   message: {
    //     content: "What is the progress on that work?",
    //     createdAt: new Date().toString(), // Date string
    //     targetType: 'User', // | 'Group'; // 私聊 群聊
    //     _id: '1'
    //   }
    // },
  ],
  curChat: undefined,
  curMsgList: []
}

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 初始化最近聊天列表
    initChatList: (state, action: PayloadAction<Array<IChatItem>>) => {
      state.chatList = action.payload
    },
    // 加入新的聊天
    addNewChat: (state, action: PayloadAction<IChatItem>) => {
      state.chatList.unshift(action.payload)
    },
    // 选择当前聊天
    changeCurChat: (state, action: PayloadAction<IChatItem>) => {
      state.curChat = action.payload
      // 改变list里面的对应项目（因为unread可能变化了）
      const index = state.chatList.findIndex(chat => chat._id === action.payload._id);
      state.chatList[index] = action.payload
    },
    changeCurChatById: (state, action: PayloadAction<string>) => {
      const index = state.chatList.findIndex(chat => chat._id === action.payload);
      state.curChat = state.chatList[index]
    },
    
    addNewMsg: (state, action: PayloadAction<IMsgItem>) => {
      if (action.payload.to._id === state.curChat?.member._id) {
        state.curMsgList.push(action.payload)
      }
    }
  },
  // ref: https://cn.redux.js.org/tutorials/essentials/part-5-async-logic#%E4%BD%BF%E7%94%A8-createasyncthunk-%E8%AF%B7%E6%B1%82%E6%95%B0%E6%8D%AE
  extraReducers(buidler) {
    buidler
      .addCase(fetchServerChatList.pending, (state, action) => {
      })
      .addCase(fetchServerChatList.fulfilled, (state, action) => {
        state.chatList = action.payload
        if (!state.curChat) {
          state.curChat = state.chatList[0]
        } else {
          const index = action.payload.findIndex(chat => chat._id === state.curChat?._id)
          state.curChat = state.chatList[index];
        }
      })
      .addCase(fetchServerChatList.rejected, (state, action) => {
      })
      .addCase(fetchServerMsgList.fulfilled, (state, action) => {
        state.curMsgList = action.payload
      })
  }
})

export const { initChatList, addNewChat, changeCurChat, changeCurChatById, addNewMsg } = chatSlice.actions

// 获取最近聊天列表
export const fetchServerChatList = createAsyncThunk('chat/fetchServerChatList', async (userId?: string) => {
  if (!userId) return []
  return await fetchChatList(userId)
})

// 获取当前聊天的消息列表
export const fetchServerMsgList = createAsyncThunk('chat/fetchServerMsgList', async (param: { 
  user?: string;
  member?: string;
  targetType?: 'User' | 'Group'
}) => {
  const { user, member, targetType } = param
  return await fetchMsgList({ user, member, targetType })
})

/** selectors */
export const chatListSelector = (state: RootState) => state.chat.chatList
export const curChatSelector = (state: RootState) => state.chat.curChat
export const curMsgListSelector = (state: RootState) => state.chat.curMsgList

export default chatSlice.reducer


