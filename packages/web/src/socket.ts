
import io from 'socket.io-client'
import * as socketEventHandler from '@/socketEvent'
import { TOKEN_KEY, USER_ID_KEY, USER_KEY } from '@/store/user/userSlice'

const socket = io('ws://localhost:3001', {
  auth: (cb) => {
    cb({ 
      token: localStorage.getItem(TOKEN_KEY),
      username: localStorage.getItem(USER_KEY),
      id: localStorage.getItem(USER_ID_KEY)
    })
  }
})

socket.on('connect', async() => {

})

socket.on('disconnect', () => {

})

socket.onAny((event: string, data: any, ...args) => {
  // @ts-ignore
  socketEventHandler[event](data)
})

export function reconnectAfterAuth(userInfo: {
    token: string;
    username: string;
    id: string;
  }) {
  // @ts-ignore
  socket.auth.token = userInfo.token
  // @ts-ignore
  socket.auth.username = userInfo.username
  // @ts-ignore
  socket.auth.id = userInfo.id
  socket.disconnect().connect()
}

export default socket;