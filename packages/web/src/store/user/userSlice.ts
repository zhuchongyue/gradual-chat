
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

export interface IUser {
  id: string;
  _id: string;
  username: string;
  avatar: string;
  bio: string;
  status: number;
}

export interface UserState {
  id?: string;
  username?: string;
  token?: string;
  avatar?: string;
  members: Array<IUser>
}

export const TOKEN_KEY = 'chat_token'
export const USER_KEY = 'chat_user'
export const USER_ID_KEY = 'chat_user_id'
export const USER_AVA_KEY = 'chat_user_avatar'

const initialState: UserState = {
  id: localStorage.getItem(USER_ID_KEY) || undefined,
  username: localStorage.getItem(USER_KEY) || undefined,
  token: localStorage.getItem(TOKEN_KEY) || undefined,
  avatar: localStorage.getItem(USER_AVA_KEY) || undefined,
  // 社区成员
  members: []
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string>) => {
      state.id = action.payload
      localStorage.setItem(USER_ID_KEY, action.payload)
    },
    setMembers: (state, action: PayloadAction<Array<IUser>>) => {
      state.members = action.payload
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload
      localStorage.setItem(USER_KEY, action.payload)
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      localStorage.setItem(TOKEN_KEY, action.payload)
    },
    setAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload
      localStorage.setItem(USER_AVA_KEY, action.payload)
    },
    loginOut: (state) => {
      localStorage.removeItem(USER_ID_KEY)
      localStorage.removeItem(USER_KEY)
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(USER_AVA_KEY)
      state = {
        id: undefined,
        username:  undefined,
        token: undefined,
        avatar: '',
        // 社区成员
        members: []
      }
    }
  }
})

export const { setToken, setUserId, setUsername, setMembers, setAvatar, loginOut } = userSlice.actions

export const userIdSelector = (state: RootState) => state.user.id
export const userNameSelector = (state: RootState) => state.user.username
export const membersSelector = (state: RootState) => state.user.members

export default userSlice.reducer