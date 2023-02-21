import { IUser } from "@/store/user/userSlice";
import request from "./request";

export async function loginByToken(token: string) {
  const user = await request('loginByToken', {
    token
  })
  return user
}

export async function login(username: string, password: string) {
  const user = await request<{ username: string; avatar: string; token: string; id: string;}>(
    'login', 
  {
    username,
    password,
  })

  return user
}

export async function sendMsg(info: {
  from: string;
  to: string;
  type: string; 
  content: string;
  targetType: 'User' | 'Group';
  refId?: string; // 引用消息id
}) {
  return request('sendMsg', info)
}

export async function fetchMembers() {
  return request<Array<IUser>>('fetchMembers')
}